"use client";

import { useState } from "react";

import { ArrowUpRight, Copy } from "./icons";

export function CopyEmail({ email }: { email: string }) {
	const [status, setStatus] = useState("");

	return (
		<>
			<button
				aria-label="Copy email address"
				className="copy-btn"
				onClick={() =>
					navigator.clipboard.writeText(email).then(
						() => setStatus("Email copied"),
						() => setStatus("Couldn't copy, select it instead"),
					)
				}
				type="button"
			>
				<Copy />
			</button>
			<span aria-live="polite" className="copy-status" role="status">
				{status}
			</span>
		</>
	);
}

// No backend: the form just opens the visitor's mail client with a pre-filled draft.
export function ContactForm({ email }: { email: string }) {
	return (
		<form
			className="contact-form"
			onSubmit={(e) => {
				e.preventDefault();
				const f = new FormData(e.currentTarget);
				const name = String(f.get("name"));
				const body = `${f.get("message")}\n\n— ${name} (${f.get("email")})`;
				window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Hello from ${name}`)}&body=${encodeURIComponent(body)}`;
			}}
		>
			<label className="field">
				<span>Your name</span>
				<input autoComplete="name" name="name" placeholder="What should I call you?" required />
			</label>
			<label className="field">
				<span>Email address</span>
				<input autoComplete="email" name="email" placeholder="you@company.com" required type="email" />
			</label>
			<label className="field field-wide">
				<span>What do you have in mind?</span>
				<textarea name="message" placeholder="A little about your opportunity or project..." required rows={5} />
			</label>
			<button className="btn-dark btn-lg" type="submit">
				Create email draft
				<ArrowUpRight size={20} />
			</button>
		</form>
	);
}
