import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { settingsQuery } from "@/sanity/lib/queries";

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
    const settings = await client.fetch(settingsQuery);

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
                        <p className="text-gray-500 text-lg font-light max-w-md leading-relaxed mb-12">
                            We are currently accepting new projects for the upcoming season. Reach out to discuss your vision.
                        </p>

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
                        <form className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Name</label>
                                <input className="w-full bg-transparent border-b border-gray-300 pb-2 focus:border-century-green focus:outline-none transition-colors" type="text" placeholder="Your Name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Email</label>
                                <input className="w-full bg-transparent border-b border-gray-300 pb-2 focus:border-century-green focus:outline-none transition-colors" type="email" placeholder="email@address.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Vision</label>
                                <textarea className="w-full bg-transparent border-b border-gray-300 pb-2 focus:border-century-green focus:outline-none transition-colors" rows={4} placeholder="Tell us about your project..."></textarea>
                            </div>
                            <button className="w-full py-4 bg-black text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-century-green transition-colors duration-500">
                                Send Message
                            </button>
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
