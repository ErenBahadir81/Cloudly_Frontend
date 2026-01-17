"use client";

import Experience from "./Experience";
import SafeHtmlOverlay from "./SafeHtmlOverlay";
import { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function LandingPage() {
    const { theme } = useTheme();

    let bgColor = '#020617';
    if (theme === 'light') bgColor = '#0274b3';
    if (theme === 'pink') bgColor = '#db2777';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main
            className="w-full h-screen relative transition-colors duration-700 ease-in-out"
            style={{
                backgroundColor: bgColor
            }}
        >
            <Experience />

            {/* Placed outside the Canvas to avoid Root Errors */}
            <div className="absolute inset-0 pointer-events-none z-50">
                <SafeHtmlOverlay />
            </div>
        </main>
    )
}
