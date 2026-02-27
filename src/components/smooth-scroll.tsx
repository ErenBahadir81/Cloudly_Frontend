"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.08,               // More responsive than 0.05, still smooth
                duration: 1.0,            // Snappier feel (was 1.2)
                smoothWheel: true,        // Smooth wheel scrolling
                wheelMultiplier: 1.0,     // Standard scroll speed
                touchMultiplier: 2.0,     // Touch scroll speed
                infinite: false,          // No infinite scroll
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))  // Custom easing for natural deceleration
            }}
        >
            {children as any}
        </ReactLenis>
    );
}
