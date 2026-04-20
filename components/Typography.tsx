import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function H1({ children, className }: { className?: string, children: ReactNode }) {
	return (
		<h1 className={cn(className, 'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance')}>
			{children}
		</h1>
	);
}

export function H2({ children, className }: { className?: string, children: ReactNode }) {
	return (
		<h2 className={cn(className, 'scroll-m-20 py-2 text-3xl font-semibold tracking-tight')}>
			{children}
		</h2>
	);
}

export function H3({ children, className }: { className?: string, children: ReactNode }) {
	return (
		<h3 className={cn(className, 'scroll-m-20 text-2xl font-semibold tracking-tight')}>
			{children}
		</h3>
	);
}

export function H4({ children, className }: { className?: string, children: ReactNode }) {
	return (
		<h4 className={cn(className, 'scroll-m-20 text-xl font-semibold tracking-tight')}>
			{children}
		</h4>
	);
}

export function P({ children, className }: { className?: string, children: ReactNode }) {
	return (
		<p className={cn(className, 'leading-7 [&:not(:first-child)]:mt-6')}>
			{children}
		</p>
	);
}

export function Blockquote({ children, className, quotes }: {
	className?: string,
	children: ReactNode,
	quotes?: boolean
}) {
	return (
		<blockquote className={cn(className, 'mt-6 border-l-2 pl-6 italic')}>
			{quotes ? (<>&quot;{children}&quot;</>) : (<>{children}</>)}

		</blockquote>
	);
}

export function List({ items, className }: { className?: string, items?: [string | never] }) {
	return (
		<ul className={cn(className, 'my-6 ml-6 list-disc [&>li]:mt-2')}>
			{(items || []).map((item, index) => (
					<li key={index}>{item}</li>
				)
			)}
		</ul>
	);
}

export function InlineCode({ children, className }: { className?: string, children: ReactNode }) {
	return (
		<code
			className={cn(className, 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold')}>
			{children}
		</code>
	);
}

export function Lead({ children, className }: { className?: string, children: ReactNode }) {
	return (
		<p className={cn(className, 'text-xl text-muted-foreground')}>
			{children}
		</p>
	);
}

export function Large({ children, className }: { className?: string, children: ReactNode }) {
	return <div className={cn(className, 'text-lg font-semibold')}>{children}</div>;
}

export function Small({ children, className }: { className?: string, children: ReactNode }) {
	return (
		<small className={cn(className, 'text-sm leading-none font-medium')}>{children}</small>
	);
}

export function Muted({ children, className }: { className?: string, children: ReactNode }) {
	return (
		<p className={cn(className, 'text-sm text-muted-foreground')}>{children}</p>
	);
}
