"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Clouds, ScrollControls, useScroll, Scroll, Text, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

import CloudSignage from "./CloudSignage";
import LazyCloud from "./LazyCloud";

type ThemeProp = {
    theme: "dark" | "light" | "pink";
    aboveSoftwareText?: string;
    layersBuildingText?: string;
}

// 3D Text Component
function Title3D({ theme, aboveSoftwareText }: ThemeProp) {
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
                CLOUDLY
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
                SOFTWARE
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
                {aboveSoftwareText}
            </Text>
        </group>
    )
}

function CameraRig() {
    const { camera } = useThree();
    const scroll = useScroll();

    useFrame((state, delta) => {
        // Scroll Logic: 0 to 1
        const s = scroll.range(0, 1);

        // -- Phase 1: Move to Signage (0% - 35%) --
        // Start: Z=8, End: Z=-14 (Just before signage at -15)
        // We map 0-0.35 scroll to this movement.
        let targetZ = 8;
        let targetRotX = 0;
        let targetY = 0;

        if (s < 0.35) {
            // Normalizing s to 0-1 for this phase
            const phaseS = s / 0.35;
            targetZ = THREE.MathUtils.lerp(8, -13, phaseS);
            targetRotX = 0;
            targetY = 0;
        }

        // -- Phase 2: Pause & Rotate Up (35% - 55%) --
        // Hold Z at -13. Rotate X to 45 degrees (PI/4).
        else if (s < 0.55) {
            targetZ = -13;
            const phaseS = (s - 0.35) / 0.20; // Normalize 0-1
            targetRotX = THREE.MathUtils.lerp(0, Math.PI / 4, phaseS); // 0 to 45 deg
            targetY = 0;
        }

        // -- Phase 3: Resume Movement Upward (55% - 100%) --
        // Move Z (-13 to -40) and Y (0 to 20) to follow gaze
        else {
            const phaseS = (s - 0.55) / 0.45; // Normalize
            targetZ = THREE.MathUtils.lerp(-13, -40, phaseS);
            targetRotX = Math.PI / 4; // Stay looked up
            targetY = THREE.MathUtils.lerp(0, 15, phaseS); // Move UP
        }

        // Apply smooth interpolation
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.1);
        camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotX, 0.1);

        // Reset X position (always centered)
        camera.position.x = 0;
    });

    return null;
}

function CloudScene({ theme, aboveSoftwareText, layersBuildingText }: ThemeProp) {
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
            <Title3D theme={theme} aboveSoftwareText={aboveSoftwareText} />

            {/* Cloud Signage - Visible "Just before looking down" */}
            <CloudSignage
                text={layersBuildingText || "Layers keep building."}
                position={[0, 0, -15]} // Moved further away (-10 -> -15)
                rotation={[0, 0, 0]}
            />

            <pointLight
                ref={lightRef}
                intensity={50}
                distance={6}
                decay={2}
                color={lightColor}
            />

            <Clouds>
                {/* Main "Entry" Cloud */}
                <LazyCloud
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
                <LazyCloud
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
                <LazyCloud
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

                {/* Signage Area Clouds (Moved FURTHER BACK to avoid collision with Signage at -15) */}
                <LazyCloud
                    seed={10}
                    bounds={[10, 6, 4]}
                    volume={20}
                    color={resolvedCloudColor}
                    fade={100}
                    opacity={isDark ? 0.8 : 1.0}
                    position={[0, 0, -19]} // Moved from -15 to -19 (Behind Signage)
                    growth={isDark ? 5 : 9}
                    speed={0.1}
                />
                <LazyCloud
                    seed={11}
                    bounds={[15, 6, 4]}
                    volume={15}
                    color={isDark ? "#93c5fd" : "#ffffff"}
                    fade={80}
                    opacity={isDark ? 0.5 : 0.9}
                    position={[-8, 2, -22]} // Moved from -18 to -22
                    growth={isDark ? 4 : 7}
                    speed={0.1}
                />
                <LazyCloud
                    seed={12}
                    bounds={[15, 6, 4]}
                    volume={15}
                    color={isDark ? "#93c5fd" : "#ffffff"}
                    fade={80}
                    opacity={isDark ? 0.5 : 0.9}
                    position={[8, -2, -22]} // Moved from -18 to -22
                    growth={isDark ? 4 : 7}
                    speed={0.1}
                />

                {/* Further Back Clouds (For depth) */}
                <LazyCloud
                    seed={20}
                    bounds={[20, 8, 4]}
                    volume={25}
                    color={resolvedCloudColor}
                    fade={100}
                    opacity={isDark ? 0.7 : 0.9}
                    position={[0, 2, -22]}
                    growth={isDark ? 6 : 10}
                    speed={0.08}
                />

                {/* "Abyss" Clouds */}
                <LazyCloud
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
                <LazyCloud
                    seed={44}
                    bounds={[20, 5, 20]}
                    volume={30}
                    color={theme === 'dark' ? "#0c4a6e" : (theme === 'pink' ? "#db2777" : "#0284c7")}
                    fade={100}
                    opacity={1}
                    position={[0, -15, -20]} // Abyss extended back
                    growth={isDark ? 10 : 14}
                    speed={0.05}
                />

                {/* Sky High Clouds (Phase 3 - Visible when looking up) */}
                <LazyCloud
                    seed={55}
                    bounds={[12, 6, 6]}
                    volume={25}
                    color={resolvedCloudColor}
                    fade={80}
                    opacity={0.8}
                    position={[0, 15, -25]} // High up (Y=15) and forward
                    growth={8}
                    speed={0.12}
                    renderDistance={40} // Visible from far
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
    const { t } = useLanguage();

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
                    <CloudScene theme={theme} aboveSoftwareText={t('above_software')} layersBuildingText={t('layers_building')} />
                </ScrollControls>
                <Environment preset="city" />

            </Canvas>
        </div>
    );
}

