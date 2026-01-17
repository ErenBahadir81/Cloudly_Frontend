"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Clouds, Cloud, ScrollControls, useScroll, Scroll, Text } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

type ThemeProp = {
    theme: "dark" | "light" | "pink";
}

// 3D Text Component
function Title3D({ theme }: ThemeProp) {
    const { viewport } = useThree();
    const isDark = theme === 'dark';

    // Responsive scaling
    const scale = Math.max(0.5, Math.min(1, viewport.width / 8));

    // Theme Colors
    const mainColor = isDark ? "white" : "#0f172a"; // White vs Slate-950
    const subColor = isDark ? "#cbd5e1" : "#64748b"; // Slate-300 vs Slate-500
    const emissiveColor = isDark ? "white" : "black";
    const emissiveInt = isDark ? 0.5 : 0;

    return (
        <group position={[0, 0, 2]} scale={[scale, scale, scale]}>
            <Text
                fontSize={0.8}
                color={mainColor}
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.1}
                maxWidth={viewport.width / scale * 0.9}
                textAlign="center"
            >
                COMPLEXITY,
                <meshStandardMaterial toneMapped={false} color={mainColor} emissive={emissiveColor} emissiveIntensity={emissiveInt} />
            </Text>
            <Text
                fontSize={0.8}
                color={mainColor}
                position={[0, -1, 0]}
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.1}
                maxWidth={viewport.width / scale * 0.9}
                textAlign="center"
            >
                CLEARED.
                <meshStandardMaterial toneMapped={false} color={mainColor} emissive={emissiveColor} emissiveIntensity={emissiveInt} />
            </Text>
            <Text
                fontSize={0.2}
                color={subColor}
                position={[0, -2, 0]}
                anchorX="center"
                letterSpacing={0.2}
                maxWidth={viewport.width / scale * 0.8}
                textAlign="center"
            >
                THE ORGANIC INFRASTRUCTURE
            </Text>
        </group>
    )
}

function CameraRig() {
    const { camera } = useThree();
    const scroll = useScroll();

    useFrame((state, delta) => {
        const zPos = 8 - scroll.range(0, 1 / 3) * 10;
        const xRot = -scroll.range(1 / 2, 1 / 3) * (Math.PI / 6);

        camera.position.z = THREE.MathUtils.lerp(camera.position.z, zPos, 0.1);
        camera.position.x = 0;
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, scroll.range(1 / 2, 1 / 3) * -2, 0.1);
        camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, xRot, 0.1);
    });

    return null;
}

function CloudScene({ theme }: ThemeProp) {
    const mainCloudRef = useRef<THREE.Group>(null);
    const lightRef = useRef<THREE.PointLight>(null);
    const isDark = theme === 'dark';

    // Theme Colors
    const resolvedCloudColor = isDark ? "#e0f2fe" : "#ffffff";
    const lightColor = isDark ? "#3b82f6" : "#ffffff";
    const ambientInt = isDark ? 1.5 : 2.5;

    useFrame((state) => {
        if (lightRef.current) {
            const { x, y } = state.pointer;
            const { width, height } = state.viewport;
            const depthRatio = 1.25;

            lightRef.current.position.x = (x * width / 2) * depthRatio;
            lightRef.current.position.y = (y * height / 2) * depthRatio;
            lightRef.current.position.z = -2;
        }
    });

    return (
        <group>
            <Title3D theme={theme} />

            <pointLight
                ref={lightRef}
                intensity={50}
                distance={6}
                decay={2}
                color={lightColor}
            />

            <Clouds>
                {/* Main "Entry" Cloud */}
                <Cloud
                    ref={mainCloudRef}
                    seed={1}
                    bounds={[10, 6, 4]}
                    volume={20}
                    color={resolvedCloudColor}
                    fade={100}
                    opacity={isDark ? 0.8 : 1.0}
                    position={[0, 0, -2]}
                    growth={isDark ? 5 : 9}
                    speed={0.1}
                />

                {/* Secondary surrounding clouds */}
                <Cloud
                    seed={2}
                    bounds={[15, 6, 4]}
                    volume={15}
                    color={isDark ? "#93c5fd" : "#ffffff"}
                    fade={80}
                    opacity={isDark ? 0.5 : 0.9}
                    position={[-8, 2, -5]}
                    growth={isDark ? 4 : 7}
                    speed={0.1}
                />
                <Cloud
                    seed={3}
                    bounds={[15, 6, 4]}
                    volume={15}
                    color={isDark ? "#93c5fd" : "#ffffff"}
                    fade={80}
                    opacity={isDark ? 0.5 : 0.9}
                    position={[8, -2, -5]}
                    growth={isDark ? 4 : 7}
                    speed={0.1}
                />

                {/* "Abyss" Clouds */}
                <Cloud
                    seed={4}
                    bounds={[20, 5, 20]}
                    volume={30}
                    color={theme === 'dark' ? "#0c4a6e" : (theme === 'pink' ? "#db2777" : "#0284c7")} // Sky-600 vs Pink-600
                    fade={100}
                    opacity={1}
                    position={[0, -15, -5]} // Far below
                    growth={isDark ? 10 : 14}
                    speed={0.05}
                />
            </Clouds>

            <ambientLight intensity={ambientInt} color="#ffffff" />
            <pointLight position={[10, 10, 5]} intensity={5} color={lightColor} />
            <spotLight position={[0, 10, 0]} intensity={5} color="#ffffff" penumbra={1} angle={1} />
        </group>
    )
}

export default function Experience() {
    const { theme } = useTheme();

    // Background Color Logic
    // Dark: #020617
    // Light: #0274b3 (Sky-660)
    // Pink: #db2777 (Pink-600)

    let fogColor = '#020617';
    if (theme === 'light') fogColor = '#0274b3';
    if (theme === 'pink') fogColor = '#db2777';

    return (
        <div className="h-screen w-full transition-colors duration-700 ease-in-out" style={{ backgroundColor: fogColor }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 75 }} gl={{ antialias: true }}>
                <fog attach="fog" args={[fogColor, 5, 60]} />

                <ScrollControls pages={4} damping={0.2}>
                    <CameraRig />
                    <CloudScene theme={theme} />
                </ScrollControls>

            </Canvas>
        </div>
    );
}

