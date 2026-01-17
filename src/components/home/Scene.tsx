"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Clouds, Cloud } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

function CloudModel() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        // Simple scroll mapping
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

        // Animate nicely
        const targetRotation = progress * (Math.PI / 2); // 90 degrees
        const targetX = progress * 4; // Move right

        if (groupRef.current) {
            groupRef.current.rotation.y += (targetRotation - groupRef.current.rotation.y) * 0.1;
            groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Reverting to default texture to avoid load error */}
            <Clouds>
                <Cloud
                    seed={10}
                    bounds={[20, 5, 5]}
                    volume={30}
                    color="#93c5fd"
                    fade={100}
                    opacity={0.8}
                    position={[0, 0, -10]}
                    growth={4}
                    speed={0.1}
                />
                <Cloud
                    seed={20}
                    bounds={[20, 5, 5]}
                    volume={30}
                    color="#e0f2fe"
                    fade={100}
                    opacity={0.8}
                    position={[5, 2, -15]}
                    growth={4}
                    speed={0.1}
                />
            </Clouds>

            {/* Increased light intensity */}
            <ambientLight intensity={2.0} color="#ffffff" />
            <pointLight position={[10, 10, 10]} intensity={10} color="#22d3ee" distance={50} decay={2} />
            <spotLight position={[-10, 20, 10]} angle={0.5} penumbra={1} intensity={10} color="#ffffff" />
        </group>
    );
}

export default function Scene() {
    return (
        <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
                {/* Removed fog momentarily to test visibility */}
                <CloudModel />
            </Canvas>
        </div>
    );
}
