'use client';

import { Field } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { H1 } from '@/components/Typography';

type FormErrors = {
	title?: boolean;
	lead?: boolean;
	text?: boolean;
	alias?: boolean;
	file?: boolean;
};

const NewPostPage = () => {
	const [file, setFile] = useState<File | null>(null);
	const [title, setTitle] = useState('');
	const [lead, setLead] = useState('');
	const [text, setText] = useState('');
	const [alias, setAlias] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [errors, setErrors] = useState<FormErrors>({});

	const fileRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
			setErrors(prev => ({ ...prev, file: false }));
		}
	};

	const handleSave = async (e: FormEvent) => {
		e.preventDefault();

		const newErrors: FormErrors = {};
		if (!title) newErrors.title = true;
		if (!alias) newErrors.alias = true;
		if (!lead) newErrors.lead = true;
		if (!text) newErrors.text = true;
		if (!file) newErrors.file = true;

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			setMessage('Uzupełnij brakujące dane.');
			setTimeout(() => setMessage(''), 3000);
			return;
		}

		setLoading(true);
		setMessage('');
		setErrors({});

		const formData = new FormData();
		formData.append('file', file!);
		formData.append('post', JSON.stringify({ title, lead, text, alias }));

		try {
			const res = await axios.post('/api/posts/new', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					authorization: `Bearer ${process.env.NEXT_PUBLIC_SECRET}`
				}
			});

			if (res.data.code === 200) {
				setMessage('Post został zapisany!');
				setFile(null);
				setTitle('');
				setLead('');
				setText('');
				setAlias('');
				if (fileRef.current) fileRef.current.value = '';
			} else {
				setMessage('Błąd: ' + res.data.message);
			}
		} catch (err) {
			setMessage('Wystąpił błąd podczas przesyłania.');
		} finally {
			setLoading(false);
			setTimeout(() => setMessage(''), 3000);
		}
	};
	const clearError = (field: keyof FormErrors) => {
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: false }));
		}
	};

	return (
		<div className="p-4 flex flex-col gap-4 min-h-screen lg:h-screen lg:overflow-hidden bg-neutral-50/50">
			<div className="flex justify-between items-center pr-0 md:pr-4">
				<H1 className="text-xl md:text-2xl">Dodaj nowy post</H1>
				<Button variant="outline" asChild size="sm">
					<Link href="/">Wróć</Link>
				</Button>
			</div>
			<div className="flex flex-col lg:grid lg:grid-cols-[400px_1fr] gap-4 h-full min-h-0">
				<div className="border border-neutral-200 rounded-xl p-4 bg-white shadow-sm shrink-0 overflow-y-auto">
					<form
						onSubmit={handleSave}
						className="flex flex-col lg:grid lg:grid-cols-1 lg:grid-rows-[auto_1fr_2fr_auto_auto] lg:h-full gap-4"
					>
						<div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4">
							<Field>
								<Label htmlFor="title" className={errors.title ? 'text-red-500' : ''}>Tytuł</Label>
								<Input
									value={title}
									id="title"
									className={errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}
									onChange={(e) => {
										setTitle(e.target.value);
										clearError('title');
									}}
									placeholder={errors.title ? 'To pole jest wymagane!' : 'Tytuł posta...'}
								/>
							</Field>
							<Field>
								<Label htmlFor="alias" className={errors.alias ? 'text-red-500' : ''}>Sklep</Label>
								<Input
									value={alias}
									id="alias"
									className={errors.alias ? 'border-red-500 focus-visible:ring-red-500' : ''}
									onChange={(e) => {
										setAlias(e.target.value);
										clearError('alias');
									}}
									placeholder="Rea / Toolight"
								/>
							</Field>
						</div>

						<Field className="flex flex-col lg:h-full min-h-0">
							<Label htmlFor="lead" className={errors.lead ? 'text-red-500' : ''}>Wstęp</Label>
							<Textarea
								value={lead}
								id="lead"
								onChange={(e) => {
									setLead(e.target.value);
									clearError('lead');
								}}
								className={`flex-1 min-h-[120px] lg:min-h-0 resize-none overflow-y-auto ${errors.lead ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
								placeholder="Krótki wstęp (lead)..."
							/>
						</Field>

						<Field className="flex flex-col lg:h-full min-h-0">
							<Label htmlFor="text" className={errors.text ? 'text-red-500' : ''}>Treść</Label>
							<Textarea
								value={text}
								id="text"
								onChange={(e) => {
									setText(e.target.value);
									clearError('text');
								}}
								className={`flex-1 min-h-[200px] lg:min-h-0 resize-none overflow-y-auto ${errors.text ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
								placeholder="Pełna treść artykułu..."
							/>
						</Field>

						<Field>
							<Label htmlFor="picture" className={errors.file ? 'text-red-500' : ''}>Zdjęcie</Label>
							<Input
								id="picture"
								type="file"
								accept="image/*"
								ref={fileRef}
								className={`cursor-pointer file:text-xs file:md:text-sm ${errors.file ? 'border-red-500' : ''}`}
								onChange={handleFileChange}
							/>
							{errors.file &&
								<p className="text-[10px] text-red-500 mt-1 uppercase font-bold">Brak zdjęcia!</p>}
						</Field>

						<Button
							type="submit"
							disabled={loading}
							variant="default"
							className="w-full mt-2 lg:mt-0"
						>
							{loading ? 'Wysyłanie...' : message || 'Wgraj na serwer'}
						</Button>
					</form>
				</div>
				<div className="border border-neutral-200 rounded-xl bg-neutral-50 overflow-y-auto lg:h-full">
					<div className="p-4 md:p-8 max-w-3xl mx-auto flex flex-col gap-6 bg-white min-h-full shadow-sm">
						<H1 className="break-words text-lg md:text-3xl">{title || 'Podgląd tytułu'}</H1>
						{file ? (
							<div
								className="relative w-full aspect-video md:aspect-[2.5/1] rounded-lg overflow-hidden border border-neutral-200">
								<Image alt="Podgląd" src={URL.createObjectURL(file)} fill className="object-cover" />
							</div>
						) : (
							<div
								className={`w-full aspect-video md:aspect-[2.5/1] rounded-lg flex items-center justify-center text-sm border border-dashed bg-neutral-100 text-neutral-400 border-neutral-300`}>
								Zdjęcie
							</div>
						)}
						<div className="prose prose-sm md:prose-neutral max-w-none text-neutral-800 leading-loose pb-10"
							dangerouslySetInnerHTML={{ __html: lead || 'Podgląd wstępu...' }} />
						<div className="prose prose-sm md:prose-neutral max-w-none text-neutral-800 leading-loose pb-10"
							dangerouslySetInnerHTML={{ __html: text || 'Podgląd pełnej treści posta...' }} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewPostPage;