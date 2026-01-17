"use client";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative z-10 max-w-5xl mx-auto"
            >
                <motion.span
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 1 }}
                    className="inline-block mb-6 text-sm md:text-base font-medium tracking-[0.3em] text-cyan-400/80 uppercase"
                >
                    Complexity, Cleared
                </motion.span>

                <h1 className="text-5xl md:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    The Organic <br className="hidden md:block" />
                    Infrastructure.
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="text-lg md:text-2xl text-slate-300/80 max-w-2xl mx-auto font-light leading-relaxed"
                >
                    Transform your data streams into a fluid architecture.
                    Cloudly redefines the digital ecosystem.
                </motion.p>
            </motion.div>
        </section>

    )
}
