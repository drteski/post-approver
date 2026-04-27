'use client';

import { use, useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { H1 } from '@/components/Typography';
import Image from 'next/image';
import { Field } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

type Post = {
	id: number,
	title: string | null,
	lead: string | null,
	text: string | null,
	img: string | null,
	alias: string | null,
	approved: boolean | null,
	createdAt: string,
	updatedAt: string,
	notes: string[] | null,
}

const PreviewPage = ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = use(params);
	const router = useRouter();

	const [post, setPost] = useState<Post | null>(null);
	const [noteText, setNoteText] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get(`/api/posts/${id}`, {
					headers: { authorization: `Bearer ${process.env.NEXT_PUBLIC_SECRET}` }
				});
				const data: Post = res.data;
				setPost(data);
				if (data.notes) {
					setNoteText(data.notes.join('\n'));
				}
			} catch (err) {
				console.error('Błąd pobierania posta:', err);
			}
		})();
	}, [id]);

	const saveUpdate = async (approved: boolean) => {
		setLoading(true);
		try {
			const notesArray = noteText.split('\n').filter(line => line.trim() !== '');

			await axios.post(`/api/posts/${id}`, {
				...post,
				approved,
				notes: notesArray
			}, {
				headers: { authorization: `Bearer ${process.env.NEXT_PUBLIC_SECRET}` }
			});

			router.push('/');
			router.refresh();
		} catch (err) {
			console.error('Błąd zapisu:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col gap-4 p-4 min-h-screen lg:h-screen lg:overflow-hidden bg-neutral-50/50">
			<div
				className="flex justify-between items-center bg-white lg:bg-transparent">
				<div
					className={`text-xs md:text-sm font-medium ${post?.approved === true ? 'text-green-800 bg-green-200 border-green-800' : post?.approved === false ? 'text-red-800 bg-red-200 border-red-800' : 'text-neutral-800 bg-neutral-200 border-neutral-800'} px-3 py-1 rounded-full border`}>
					<span>{post?.approved === true ? 'Zatwierdzony' : post?.approved === false ? 'Odrzucony' : 'Oczekujący'}</span>
				</div>
				<Button variant="outline" asChild size="sm">
					<Link href="/">Wróć</Link>
				</Button>
			</div>

			{post ? (
				<div className="flex flex-col-reverse lg:grid lg:grid-cols-[350px_1fr] gap-6 h-full min-h-0">
					<div className="flex flex-col gap-4 h-auto lg:h-full min-h-0">
						<div
							className="border border-neutral-200 rounded-xl p-4 bg-white shadow-md lg:shadow-sm flex flex-col flex-1 min-h-0">
							<Label className="mb-2 font-semibold text-neutral-700">Uwagi</Label>
							<Field className="flex-1 min-h-0">
								<Textarea
									value={noteText}
									onChange={(e) => setNoteText(e.target.value)}
									placeholder="Wpisz uwagi..."
									className="min-h-[150px] lg:h-full lg:min-h-0 resize-none overflow-y-auto bg-neutral-50 focus-visible:ring-1 border-neutral-200"
								/>
							</Field>
						</div>
						<div className="grid grid-cols-2 gap-3 lg:bottom-0">
							<Button
								variant="destructive"
								className="h-14 lg:h-12 font-bold cursor-pointer"
								disabled={loading}
								onClick={() => saveUpdate(false)}
							>
								Odrzuć
							</Button>
							<Button
								className="bg-green-700 hover:bg-green-600 h-14 lg:h-12 font-bold cursor-pointer"
								disabled={loading}
								onClick={() => saveUpdate(true)}
							>
								Zatwierdź
							</Button>
						</div>
					</div>
					<div
						className="border border-neutral-200 rounded-xl bg-neutral-50 overflow-y-auto h-auto lg:h-full shadow-inner">
						<div
							className="p-4 md:p-8 lg:p-12 max-w-3xl mx-auto flex flex-col gap-6 bg-white min-h-full shadow-sm">
							<H1 className="text-2xl md:text-4xl break-words leading-tight">{post.title || ''}</H1>

							{post.img && (
								<div
									className="relative w-full aspect-video md:aspect-[2.5/1] rounded-xl overflow-hidden border border-neutral-100 shadow-sm">
									<Image
										alt=""
										src={post.img}
										fill
										className="object-cover"
									/>
								</div>
							)}
							<div
								className="prose prose-sm md:prose-neutral max-w-none text-neutral-800 leading-loose pb-10"
								dangerouslySetInnerHTML={{ __html: post.lead ?? '' }}
							/>

							<div
								className="prose prose-sm md:prose-neutral max-w-none text-neutral-800 leading-loose pb-10"
								dangerouslySetInnerHTML={{ __html: post.text ?? '' }}
							/>
						</div>
					</div>
				</div>
			) : (

				<Skeleton
					className="flex-1 flex items-center justify-center rounded-xl">Ładowanie...</Skeleton>
			)}
		</div>
	);
};

export default PreviewPage;