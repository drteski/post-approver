import { NextResponse } from 'next/server';
import { FileUpload } from '@/lib/fileUpload';
import prisma from '@/lib/db';

type FileUploadData = {
	code: number;
	message: string;
	img: string
};

export async function POST(request: NextResponse) {
	const authHeader = request.headers.get('authorization');
	if (!authHeader || authHeader !== 'Bearer ' + process.env.NEXT_PUBLIC_SECRET) {
		return new Response('Brak autoryzacji', { status: 401 });
	}


	const formData = await request.formData();
	const file = formData.get('file') as File;
	const postJson = formData.get('post') as string;
	const { title, lead, text, alias } = JSON.parse(postJson);

	const { code, message, img }: FileUploadData = await FileUpload(file) ?? {
		code: 500,
		message: 'Nieoczekiwany błąd',
		img: ''
	};

	if (code === 400) {
		return new Response(message, { status: 400 });
	}
	const post = await prisma.post.create({
		data: {
			title,
			lead,
			text,
			notes: [],
			img,
			alias
		}
	});
	return NextResponse.json({ code: 200, message: 'Post dodany', post });

}
