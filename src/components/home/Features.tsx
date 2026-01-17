"use client";
import { motion } from "framer-motion";

const features = [
    {
        title: "Adaptive Flow",
        description: "Your infrastructure shouldn't be static. Cloudly adapts to traffic spikes like a living organism.",
    },
    {
        title: "Crystal Clear Security",
        description: "Transparency where you need it, iron-clad walls where you don't. Security that breathes and adapts.",
    },
    {
        title: "Ethereal Speed",
        description: "Optimized at the edge. Content delivery that feels like it was always there, waiting for you.",
    }
]

export default function Features() {
    return (
        <section className="relative py-32 px-4 z-10 w-full">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2, duration: 0.8 }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 hover:bg-white/10 transition-colors duration-500 group shadow-lg shadow-black/20"
                    >
                        <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-cyan-500/20">
                            <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">{f.title}</h3>
                        <p className="text-slate-400 leading-relaxed text-sm md:text-base">{f.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
