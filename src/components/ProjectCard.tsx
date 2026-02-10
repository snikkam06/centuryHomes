'use client';

import Image from "next/image";
import * as motion from "framer-motion/client";
import { urlFor } from "@/sanity/lib/image";

import { Bed, Bath, Ruler } from "lucide-react";

interface ProjectCardProps {
    project: any; // Using any to match existing loose typing
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    const isPriority = index < 3;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isPriority ? { opacity: 1, y: 0 } : undefined}
            whileInView={!isPriority ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className={`group flex flex-col ${index % 2 === 1 ? 'md:mt-24' : ''}`}
        >
            {/* Image Container - Natural Aspect Ratio */}
            <div className="relative w-full overflow-hidden bg-gray-100 mb-8">
                {project.mainImage && (
                    <Image
                        src={urlFor(project.mainImage).width(800).url()}
                        alt={`Lot ${project.lotNumber} - ${project.address}`}
                        width={800}
                        height={1000}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                        priority={index < 4}
                    />
                )}

                {/* Status Overlay */}
                {project.status && project.status !== 'available' && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
                        {project.status}
                    </div>
                )}
            </div>

            {/* Meta Data */}
            <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono tracking-widest text-century-green uppercase">
                    {project.lotNumber}
                </span>
                <h2 className="font-heading text-3xl font-bold leading-tight group-hover:underline decoration-1 underline-offset-4">
                    {project.address}
                </h2>
                <div className="flex gap-6 mt-2 text-xs text-gray-400 font-medium tracking-wide border-t border-gray-100 pt-4 w-full">
                    <span className="flex items-center gap-2">
                        <Bed className="w-4 h-4" />
                        {project.bedrooms}
                    </span>
                    <span className="flex items-center gap-2">
                        <Bath className="w-4 h-4" />
                        {project.bathrooms}
                    </span>
                    <span className="flex items-center gap-2">
                        <Ruler className="w-4 h-4" />
                        {project.sqFt?.toLocaleString()} SQ. FT.
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
