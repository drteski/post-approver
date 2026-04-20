import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextResponse) {

	const authHeader = request.headers.get('authorization');
	if (!authHeader || authHeader !== 'Bearer ' + process.env.NEXT_PUBLIC_SECRET) {
		return new Response('Brak autoryzacji', { status: 401 });
	}
	const posts = await prisma.post.findMany({
		orderBy: {
			id: 'desc'
		}
	});
	return NextResponse.json([...posts]);
}
