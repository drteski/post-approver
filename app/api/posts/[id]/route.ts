import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { FileUpload } from '@/lib/fileUpload';

type FileUploadData = {
	code: number;
	message: string;
	img: string
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const authHeader = request.headers.get('authorization');
	if (!authHeader || authHeader !== 'Bearer ' + process.env.NEXT_PUBLIC_SECRET) {
		return new Response('Brak autoryzacji', { status: 401 });
	}
	const post = await prisma.post.findFirst({ where: { id: Number(id) } });
	return NextResponse.json(post);
}


export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const authHeader = request.headers.get('authorization');
	if (!authHeader || authHeader !== 'Bearer ' + process.env.NEXT_PUBLIC_SECRET) {
		return new Response('Brak autoryzacji', { status: 401 });
	}

	let postData;
	let file: File | null = null;

	const contentType = request.headers.get('content-type') || '';

	if (contentType.includes('multipart/form-data')) {
		const formData = await request.formData();
		file = formData.get('file') as File | null;

		const postJson = formData.get('post') as string;
		postData = JSON.parse(postJson);
	} else {
		postData = await request.json();
	}

	const { title, lead, text, alias, img, notes, approved } = postData;

	let newFile = { code: 200, message: 'Plik nie dodany używam starego', img } as FileUploadData;

	if (file) {
		newFile = await FileUpload(file) ?? {
			code: 500,
			message: 'Nieoczekiwany błąd',
			img: ''
		};
	}

	if (newFile.code === 400 || newFile.code === 500) {
		return new Response(newFile.message, { status: newFile.code });
	}

	const post = await prisma.post.update({
			where: { id: Number(id) },
			data: {
				img: newFile.img,
				alias,
				notes,
				approved,
				lead,
				text,
				title
			}
		}
	);

	return NextResponse.json({ message: 'Post zaktualizowany', post, code: 200 });
}


export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const authHeader = request.headers.get('authorization');

	if (!authHeader || authHeader !== 'Bearer ' + process.env.NEXT_PUBLIC_SECRET) {
		return new Response('Brak autoryzacji', { status: 401 });
	}

	console.log(id);
	const post = await prisma.post.delete({
			where: { id: Number(id) }
		}
	);
	return NextResponse.json({ message: 'Post usunięty', post });

}
