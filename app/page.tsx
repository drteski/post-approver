'use client';
import { H1 } from '@/components/Typography';
import { DataTable } from '@/components/DataTable/DataTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

type Person = {
	img: string
	id: number
	title: string
	alias: string
	approved: boolean
	createdAt: string
	updatedAt: string
}
export default function Home() {
	const [posts, setPosts] = useState<Person[]>([]);
	useEffect(() => {
		(async () => {
			await axios.get<Person[]>('/api/posts', { headers: { authorization: `Bearer ${process.env.NEXT_PUBLIC_SECRET}` } }).then(res => setPosts(res.data));
		})();
	}, []);

	return (
		<div className="h-screen md:p-4 grid grid-cols-1 grid-rows-[auto_1fr] gap-4">
			<div className="flex pt-4 px-4 md:p-0 justify-between items-center">
				<H1>Posty</H1>
				<Button asChild><Link href="/new">Dodaj nowy</Link></Button>
			</div>
			{posts.length === 0 ? (<div className="flex items-center justify-center h-full">Brak postów</div>) :
				<DataTable data={posts} />}
		</div>
	);
}
