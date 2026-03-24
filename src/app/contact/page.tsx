'use client';

import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { settingsQuery } from "@/sanity/lib/queries";
import { useState, useEffect } from "react";
import { CONTACT_FORM_MIN_FILL_MS } from "@/lib/contact-form";

// export const dynamic = 'force-dynamic'; // Not needed for client components

type ContactSettings = {
    contactEmail?: string;
    phoneNumber?: string;
};

export default function ContactPage() {
    const [settings, setSettings] = useState<ContactSettings | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [company, setCompany] = useState('');
    const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
    const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        client.fetch(settingsQuery).then(setSettings);
    }, []);

    useEffect(() => {
        setIsReadyToSubmit(false);

        const timeoutId = window.setTimeout(() => {
            setIsReadyToSubmit(true);
        }, CONTACT_FORM_MIN_FILL_MS);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [formStartedAt]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isReadyToSubmit) {
            setStatus('error');
            setErrorMessage('Please take a moment to fill out the form before sending.');
            return;
        }

        setStatus('loading');
        setErrorMessage(null);

        try {
            const res = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    company,
                    formStartedAt,
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.error || 'Failed to send');
            }

            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setCompany('');
            setFormStartedAt(Date.now());
        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : 'Something went wrong. Please try again.',
            );
        }
    };

    return (
        <main className="min-h-screen bg-white text-century-black font-sans selection:bg-century-green selection:text-white flex flex-col justify-between">
            {/* Minimal Navigation (Reused) */}
            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
                <div className="w-full px-8 md:px-16 h-24 flex items-center justify-between">
                    <Link href="/">
                        <Image
                            src="/logo-horizontal.png"
                            alt="Century Homes"
                            width={280}
                            height={80}
                            className="object-contain"
                            priority
                        />
                    </Link>
                    <div className="hidden md:flex gap-12 font-medium text-xs tracking-[0.2em] uppercase z-10 text-gray-500">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <Link href="/projects" className="hover:text-black transition-colors">Projects</Link>
                        <Link href="/contact" className="text-black">Contact</Link>
                    </div>
                </div>
            </nav>

            <div className="pt-40 container mx-auto px-8 flex-grow flex flex-col justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    <div>
                        <h1 className="font-heading text-6xl md:text-[5rem] leading-[0.9] tracking-tighter mb-12">
                            Start the <br /> Conversation.
                        </h1>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Email</h3>
                                <a href={`mailto:${settings?.contactEmail}`} className="text-2xl font-heading hover:text-century-green transition-colors">
                                    {settings?.contactEmail || "hello@centuryhomes.com"}
                                </a>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Phone</h3>
                                <a href={`tel:${settings?.phoneNumber}`} className="text-2xl font-heading hover:text-century-green transition-colors">
                                    {settings?.phoneNumber || "(555) 123-4567"}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-century-gray/20 p-12">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                                <label htmlFor="company">Company</label>
                                <input
                                    id="company"
                                    type="text"
                                    name="company"
                                    tabIndex={-1}
                                    autoComplete="organization"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Name</label>
                                <input
                                    id="name"
                                    className="w-full bg-transparent border-b border-gray-300 pb-2 focus:border-century-green focus:outline-none transition-colors"
                                    type="text"
                                    placeholder="Your Name"
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Email</label>
                                <input
                                    id="email"
                                    className="w-full bg-transparent border-b border-gray-300 pb-2 focus:border-century-green focus:outline-none transition-colors"
                                    type="email"
                                    placeholder="email@address.com"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Vision</label>
                                <textarea
                                    id="message"
                                    className="w-full bg-transparent border-b border-gray-300 pb-2 focus:border-century-green focus:outline-none transition-colors"
                                    rows={4}
                                    placeholder="Tell us about your project..."
                                    autoComplete="off"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'loading' || !isReadyToSubmit}
                                className="w-full py-4 bg-black text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-century-green transition-colors duration-500 disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent' : 'Send Message'}
                            </button>
                            {!isReadyToSubmit && (
                                <p className="text-xs text-gray-500">
                                    Please take a moment to fill out the form before sending.
                                </p>
                            )}
                            {status === 'error' && (
                                <p className="text-red-500 text-xs">
                                    {errorMessage || 'Something went wrong. Please try again.'}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            <footer className="w-full py-8 border-t border-gray-100 mt-20">
                <div className="container mx-auto px-8 flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-400">
                    <span>© {new Date().getFullYear()} Century Homes</span>
                    <span>Designed & Built.</span>
                </div>
            </footer>
        </main>
    );
}
