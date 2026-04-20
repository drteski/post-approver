import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { FileUpload } from '@/lib/fileUpload';

type FileUploadData = {
	code: number;
	message: string;
	img: string
};

export async function GET(request: NextResponse, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const authHeader = request.headers.get('authorization');
	if (!authHeader || authHeader !== 'Bearer ' + process.env.NEXT_PUBLIC_SECRET) {
		return new Response('Brak autoryzacji', { status: 401 });
	}
	const post = await prisma.post.findFirst({ where: { id: Number(id) } });
	return NextResponse.json(post);
}


export async function POST(request: NextResponse, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const authHeader = request.headers.get('authorization');
	if (!authHeader || authHeader !== 'Bearer ' + process.env.NEXT_PUBLIC_SECRET) {
		return new Response('Brak autoryzacji', { status: 401 });
	}

	const formData = await request.formData();
	const file = formData.get('file') as File;
	const postJson = formData.get('post') as string;
	const { title, lead, text, alias, img, notes, approved } = JSON.parse(postJson);
	let newFile = { code: 200, message: 'Plik nie dodany używam starego', img } as FileUploadData;
	if (file)
		newFile = await FileUpload(file) ?? {
			code: 500,
			message: 'Nieoczekiwany błąd',
			img: ''
		};
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


export async function DELETE(request: NextResponse, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const authHeader = request.headers.get('authorization');

	if (!authHeader || authHeader !== 'Bearer ' + process.env.NEXT_PUBLIC_SECRET) {
		return new Response('Brak autoryzacji', { status: 401 });
	}


	const post = await prisma.post.delete({
			where: { id: Number(id) }
		}
	);
	return NextResponse.json({ message: 'Post usunięty', post });

}