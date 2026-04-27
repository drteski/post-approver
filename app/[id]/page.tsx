'use client';

import { Field } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChangeEvent, FormEvent, use, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { H1 } from '@/components/Typography';
import { useRouter } from 'next/navigation';
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
}

const EditPostPage = ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = use(params);
	const router = useRouter();
	const [post, setPost] = useState<Post | null>(null);
	const [file, setFile] = useState<File | null>(null);

	const [title, setTitle] = useState('');
	const [lead, setLead] = useState('');
	const [text, setText] = useState('');
	const [alias, setAlias] = useState('');

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');

	const fileRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get(`/api/posts/${id}`, {
					headers: { authorization: `Bearer ${process.env.NEXT_PUBLIC_SECRET}` }
				});
				const data: Post = res.data;

				setPost(data);
				setTitle(data.title ?? '');
				setLead(data.lead ?? '');
				setText(data.text ?? '');
				setAlias(data.alias ?? '');
			} catch (err) {
				console.error('Błąd ładowania:', err);
			}
		})();
	}, [id]);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};

	const handleSave = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');

		const formData = new FormData();

		if (file) {
			formData.append('file', file);
		}

		formData.append('post', JSON.stringify({
			...post,
			title,
			lead,
			text,
			alias,
			approved: null
		}));

		try {
			const res = await axios.post(`/api/posts/${id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					authorization: `Bearer ${process.env.NEXT_PUBLIC_SECRET}`
				}
			});

			if (res.data.code === 200) {
				setMessage(res.data.message);
				setFile(null);
				if (fileRef.current) fileRef.current.value = '';
				router.push('/');
				router.refresh();
			} else {
				setMessage('Błąd: ' + res.data.message);
			}
		} catch (err) {
			setMessage('Wystąpił błąd podczas przesyłania.');
		} finally {
			setLoading(false);
			setTimeout(() => setMessage(''), 2000);
		}
	};

	return (
		<div className="p-4 flex flex-col gap-4 min-h-screen lg:h-screen lg:overflow-hidden bg-neutral-50/50">

			<div className="flex justify-between items-center pr-0 lg:pr-4">
				<H1 className="text-xl md:text-2xl">Edytuj post</H1>
				<Button variant="outline" asChild size="sm">
					<Link href="/">Wróć</Link>
				</Button>
			</div>
			{post ? (<div className="flex flex-col lg:grid lg:grid-cols-[400px_1fr] gap-4 h-full min-h-0">
				<div
					className="border border-neutral-200 rounded-xl p-4 bg-white shadow-sm lg:overflow-hidden h-fit lg:h-full">

					<form onSubmit={handleSave}
						className="flex flex-col lg:grid lg:grid-cols-1 lg:grid-rows-[auto_1fr_2fr_auto_auto] lg:h-full gap-4">

						<div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4">
							<Field>
								<Label htmlFor="title">Tytuł</Label>
								<Input value={title} id="title" onChange={(e) => setTitle(e.target.value)} />
							</Field>
							<Field>
								<Label htmlFor="alias">Sklep</Label>
								<Input value={alias} id="alias" onChange={(e) => setAlias(e.target.value)} />
							</Field>
						</div>

						<Field className="flex flex-col lg:h-full min-h-0">
							<Label htmlFor="lead">Wstęp</Label>
							<Textarea
								value={lead}
								id="lead"
								onChange={(e) => setLead(e.target.value)}
								className="flex-1 min-h-[150px] lg:min-h-0 resize-none overflow-y-auto"
							/>
						</Field>

						<Field className="flex flex-col lg:h-full min-h-0">
							<Label htmlFor="text">Treść</Label>
							<Textarea
								value={text}
								id="text"
								onChange={(e) => setText(e.target.value)}
								className="flex-1 min-h-[250px] lg:min-h-0 resize-none overflow-y-auto"
							/>
						</Field>

						<Field>
							<Label htmlFor="picture">Zdjęcie</Label>
							<Input
								id="picture"
								type="file"
								accept="image/*"
								ref={fileRef}
								className="cursor-pointer"
								onChange={handleFileChange}
							/>
						</Field>

						<Button type="submit" disabled={loading} className="w-full mt-2 lg:mt-0 cursor-pointer">
							{loading ? 'Wysyłanie...' : message || 'Zapisz zmiany'}
						</Button>
					</form>
				</div>
				<div className="border border-neutral-200 rounded-xl bg-neutral-50 overflow-y-auto lg:h-full">
					<div className="p-4 md:p-8 max-w-3xl mx-auto flex flex-col gap-6 bg-white min-h-full shadow-sm">
						{post && (
							<>
								<H1 className="text-2xl md:text-3xl break-words">{title || 'Brak tytułu'}</H1>

								{(file || post.img) && (
									<div
										className="relative w-full aspect-video md:aspect-[2.5/1] rounded-lg overflow-hidden border border-neutral-200">
										<Image
											alt="Podgląd"
											src={file ? URL.createObjectURL(file) : (post.img ?? '')}
											fill
											className="object-cover"
										/>
									</div>
								)}

								<div
									className="prose prose-sm md:prose-neutral max-w-none text-neutral-800 leading-loose pb-10"
									dangerouslySetInnerHTML={{ __html: lead || '' }}
								/>

								<div
									className="prose prose-sm md:prose-neutral max-w-none text-neutral-800 leading-loose pb-10"
									dangerouslySetInnerHTML={{ __html: text || '' }}
								/>
							</>
						)}
					</div>
				</div>
			</div>) : (
				<Skeleton
					className="flex items-center justify-center rounded-xl h-40 lg:h-full">Ładowanie...</Skeleton>)}

		</div>
	);
};

export default EditPostPage;