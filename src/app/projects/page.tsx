import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { projectsQuery } from "@/sanity/lib/queries";
import ProjectCard from "@/components/ProjectCard";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
    const projects = await client.fetch(projectsQuery);

    return (
        <main className="min-h-screen bg-white text-century-black font-sans selection:bg-century-green selection:text-white">
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
                        <Link href="/projects" className="text-black">Projects</Link>
                        <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
                    </div>
                </div>
            </nav>

            <div className="pt-40 pb-20 container mx-auto px-8">
                <h1 className="font-heading text-6xl md:text-[6rem] leading-none mb-32 tracking-tighter">
                    Curated <br /> <span className="italic text-gray-400">Works.</span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
                    {projects.length > 0 ? (
                        projects.map((project: { _id: string; title: string; mainImage: any; status?: string; lotNumber: string; address: string; bedrooms?: number; bathrooms?: number; sqFt?: number }, index: number) => (
                            <ProjectCard key={project._id} project={project} index={index} />
                        ))
                    ) : (
                        <div className="col-span-full border-t border-b border-gray-100 py-32 text-center">
                            <p className="text-gray-400 font-heading italic text-2xl">Currently curating our next selection.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
