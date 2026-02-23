import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { settingsQuery } from "@/sanity/lib/queries";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const settings = await client.fetch(settingsQuery);

  return (
    <main className="min-h-screen bg-white text-century-black font-sans selection:bg-century-green selection:text-white flex flex-col">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
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
            <Link href="/" className="text-black">Home</Link>
            <Link href="/projects" className="hover:text-black transition-colors">Projects</Link>
            <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
          </div>
        </div>
      </nav>



      {/* Hero Section */}
      <section className="flex-grow flex flex-col justify-center pt-48 pb-20 px-8 md:px-16 relative">
        <div className="w-full relative z-10">
          {/* Headline + Logo row */}
          <div className="mb-16 md:mb-24 md:grid md:grid-cols-[55%_1px_1fr] md:items-center md:gap-8">
            <div>
              <h1 className="font-heading text-[10vw] md:text-[7rem] font-bold leading-[0.85] tracking-tighter text-century-black block">
                Just <br />
                <span className="italic font-light text-gray-400">Right.</span>
              </h1>
            </div>
            {/* Vertical Divider */}
            <div className="hidden md:block self-stretch bg-gray-200"></div>
            <div className="hidden md:flex items-center justify-center">
              <Image
                src="/logo-stacked.png"
                alt="Century Homes Logo"
                width={500}
                height={500}
                className="object-contain w-full max-w-[500px]"
              />
            </div>
          </div>

          {/* Content Grid - Simplified for better alignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end max-w-5xl">
            <div>
            </div>

            <div className="flex md:justify-start">
              <Link href="/projects" className="group flex items-center gap-4 text-sm font-bold tracking-[0.2em] uppercase text-century-black hover:text-century-green transition-colors">
                View Homes
                <span className="w-16 h-[1px] bg-black group-hover:bg-century-green transition-colors"></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statement Section */}
      <section className="py-40 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <h2 className="font-heading text-4xl md:text-6xl mb-12 leading-tight text-century-black">
              &quot;We don&apos;t just build structures. <br /> We curate spatial experiences.&quot;
            </h2>
            <Link href="/contact" className="inline-flex items-center justify-center px-12 py-6 bg-century-green text-white text-sm font-bold tracking-[0.2em] uppercase hover:bg-black transition-all duration-300 shadow-xl shadow-century-green/20">
              Let's Talk
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest text-gray-400 font-medium">
          <span>© {new Date().getFullYear()} Century Homes</span>
          <div className="flex gap-8">
            <Link href="/projects" className="hover:text-century-green transition-colors">Projects</Link>
            <Link href="/contact" className="hover:text-century-green transition-colors">Contact</Link>
            <Link href="#" className="hover:text-century-green transition-colors">Instagram</Link>
          </div>
          <span>Designed & Built.</span>
        </div>
      </footer>

    </main>
  );
}
