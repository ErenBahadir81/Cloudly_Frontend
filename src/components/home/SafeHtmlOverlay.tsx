"use client";

import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, Cloud, Menu, ArrowRight } from "lucide-react";

function SpotlightNav() {
    const { theme, toggleTheme, setTheme } = useTheme();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Long Press Logic
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handlePressStart = () => {
        timerRef.current = setTimeout(() => {
            setTheme('pink');
        }, 10000); // 10 seconds
    };

    const handlePressEnd = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    // Styles
    let navContainerStyle = "bg-slate-950/50 border-white/10 shadow-black/20"; // Dark Default
    if (theme === 'light') navContainerStyle = "bg-white/50 border-white/40 shadow-slate-200/50";
    if (theme === 'pink') navContainerStyle = "bg-white/50 border-pink-300/50 shadow-pink-200/50";

    const isDark = theme === 'dark';
    const textColor = isDark ? "text-slate-100" : "text-slate-700";

    let logoColor = "text-sky-400";
    if (theme === 'light') logoColor = "text-sky-600";
    if (theme === 'pink') logoColor = "text-pink-600";

    let logoBg = "bg-white/5";
    if (theme === 'light') logoBg = "bg-sky-50";
    if (theme === 'pink') logoBg = "bg-pink-50";

    let radialColor = 'rgba(255, 255, 255, 0.08)';
    if (theme === 'light') radialColor = 'rgba(14, 165, 233, 0.15)';
    if (theme === 'pink') radialColor = 'rgba(236, 72, 153, 0.15)';

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onMouseMove={handleMouseMove}
            className={`fixed top-6 left-1/2 -translate-x-1/2  w-[90%] max-w-5xl rounded-full border backdrop-blur-md px-6 py-3 flex justify-between items-center z-50 pointer-events-auto group shadow-2xl transition-all duration-500 ${navContainerStyle}`}
        >
            {/* Spotlight Overlay */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            500px circle at ${mouseX}px ${mouseY}px,
                            ${radialColor},
                            transparent 80%
                        )
                    `,
                }}
            />

            {/* Left: Logo */}
            <div className={`flex items-center gap-3 relative z-10 cursor-pointer`}>
                <div className={`p-2 rounded-full ${logoBg} transition-colors duration-500`}>
                    <Cloud className={`w-5 h-5 ${logoColor}`} strokeWidth={2.5} />
                </div>
                <span className={`font-bold tracking-tight text-sm md:text-base ${textColor} transition-colors duration-500`}>
                    CLOUDLY
                </span>
            </div>

            {/* Middle: Desktop Nav (Hidden on Mobile) */}
            <div className={`hidden md:flex items-center gap-8 ${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm font-medium relative z-10`}>
                {['Features', 'Solutions', 'Docs', 'Pricing'].map((item) => (
                    <a key={item} href="#" className={`hover:${textColor} transition-colors duration-300`}>
                        {item}
                    </a>
                ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 relative z-10">
                {/* Theme Toggle - Long Press for Pink */}
                <button
                    onMouseDown={handlePressStart}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={handlePressEnd}
                    onTouchStart={handlePressStart}
                    onTouchEnd={handlePressEnd}
                    onClick={toggleTheme}
                    className={`p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${isDark ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-slate-200/50 text-slate-600'}`}
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Primary CTA */}
                <button className={`group flex items-center gap-2 pl-5 pr-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${isDark ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* Mobile Menu */}
                <button className={`md:hidden p-2 rounded-full ${isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'}`}>
                    <Menu className="w-5 h-5" />
                </button>
            </div>
        </motion.nav>
    )
}

export default function SafeHtmlOverlay() {
    const { scrollYProgress } = useScroll();

    // Map scroll progress (0 to 1) to Opacity and Scale
    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.2]);
    const filter = useTransform(scrollYProgress, [0, 0.3], ["blur(0px)", "blur(10px)"]);
    const y = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

    return (
        <div suppressHydrationWarning className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">

            {/* Fixed Header with Spotlight Effect */}
            <SpotlightNav />

            {/* 1. HERO SECTION */}
            <motion.div
                style={{ opacity, scale, filter, y }}
                className="absolute top-0 left-0 w-full h-screen flex flex-col items-center justify-center p-4 pointer-events-none"
            >
            </motion.div>
        </div>
    );
}
