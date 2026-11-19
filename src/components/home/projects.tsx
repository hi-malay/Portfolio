"use client";

import { useRef, useState } from "react";

import type { Project } from "@/data/projects";

import { ArrowUpRight, Close, FileText } from "./icons";

const Lines = ({ n }: { n: number }) => (
	<span className="paper-lines">
		{Array.from({ length: n }, (_, i) => (
			<span key={i} />
		))}
	</span>
);

export default function Projects({ projects }: { projects: Project[] }) {
	const dialog = useRef<HTMLDialogElement>(null);
	const [open, setOpen] = useState<Project | null>(null);
	const close = () => dialog.current?.close();

	return (
		<>
			<div className="folders">
				{projects.map((p) => (
					<button
						aria-haspopup="dialog"
						className="folder"
						key={p.title}
						onClick={() => {
							setOpen(p);
							dialog.current?.showModal();
						}}
						type="button"
					>
						<span className="sr-only">{`${p.title}, ${p.kicker}. ${p.cta}`}</span>
						<span aria-hidden="true" className="folder-scene">
							<span className="folder-back" />
							<span className="paper paper-1">
								<FileText />
								<Lines n={3} />
							</span>
							<span className="paper paper-2">
								<span className="paper-preview">
									<small>{p.kicker}</small>
									<strong>{p.title}</strong>
									<Lines n={2} />
								</span>
							</span>
							<span className="paper paper-3">
								<FileText size={18} />
								<Lines n={4} />
							</span>
							<span className="folder-front">
								<span className="folder-title">{p.title}</span>
								<span className="folder-arrow">
									<ArrowUpRight />
								</span>
							</span>
						</span>
						<span aria-hidden="true" className="folder-caption">
							<span>{p.kicker}</span>
							<span className="folder-caption-action">
								{p.cta}
								<ArrowUpRight size={15} />
							</span>
						</span>
					</button>
				))}
			</div>

			<dialog aria-label={open?.title ?? "Project"} className="drawer" onClick={(e) => e.target === e.currentTarget && close()} onClose={() => setOpen(null)} ref={dialog}>
				{open ? (
					<div className="drawer-body project-body">
						<button className="drawer-close" onClick={close} type="button">
							<span>close</span>
							<span className="drawer-close-dot">
								<Close />
							</span>
						</button>
						<p className="kicker">{open.kicker}</p>
						<h3 className="project-title">{open.title}</h3>
						<p className="project-desc">{open.description}</p>
						<ul className="chips">
							{open.stack.map((s, i) => (
								<li className={i % 4 === 0 ? "chip chip-dark" : "chip"} key={s}>
									{s}
								</li>
							))}
						</ul>
						<div className="project-links">
							{open.links.map((l) => (
								<a className="btn-dark" href={l.href} key={l.href} rel="noreferrer" target="_blank">
									{l.label}
									<ArrowUpRight />
								</a>
							))}
						</div>
					</div>
				) : null}
			</dialog>
		</>
	);
}
