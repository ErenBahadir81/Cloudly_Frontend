"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Clouds, Cloud, ScrollControls, useScroll, Scroll, Text } from "@react-three/drei";
import { useState } from "react";
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
        const s = scroll.range(0, 1); // 0 = top, 1 = bottom

        // SIMPLE Z-AXIS ONLY MOVEMENT
        // Start at Z=8, end at Z=-50
        const targetZ = THREE.MathUtils.lerp(8, -50, s);

        // Smooth interpolation
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);

        // Keep camera at origin for X and Y
        camera.position.x = 0;
        camera.position.y = 0;

        // No rotation - always look straight ahead
        camera.rotation.x = 0;
        camera.rotation.y = 0;
        camera.rotation.z = 0;
    });

    return null;
}

// Debug Overlay - Shows camera Z position
function CameraDebugger({ onUpdate }: { onUpdate: (z: number) => void }) {
    const { camera } = useThree();

    useFrame(() => {
        onUpdate(camera.position.z);
    });

    return null;
}

function CloudScene({ theme, aboveSoftwareText, layersBuildingText }: ThemeProp) {
    const mainCloudRef = useRef<THREE.Group>(null);
    const lightRef = useRef<THREE.PointLight>(null);
    const isDark = theme === 'dark';

    // ============================================
    // RENDER CYCLE CONFIGURATION
    // ============================================
    // Easily adjust when each component should be visible

    // 1. Entry Cluster - First cloud group
    const ENTRY_CLUSTER_MIN_Z = 10;    // Upper bound
    const ENTRY_CLUSTER_MAX_Z = -7;   // Lower bound
    const ENTRY_CLUSTER_CENTER_Z = -3; // Center position for clouds
    // Visible when: -7 < cameraZ < 10

    // 2. Signage Cluster - Second cloud group
    const SIGNAGE_CLUSTER_MIN_Z = -6;  // Upper bound
    const SIGNAGE_CLUSTER_MAX_Z = -40;  // Lower bound
    const SIGNAGE_CLUSTER_CENTER_Z = -30; // Center position for clouds
    // Visible when: -30 < cameraZ < -7

    // Cloud Signage (Tabela)
    const SIGNAGE_MIN_Z = -6;          // Upper bound
    const SIGNAGE_MAX_Z = -30;          // Lower bound
    const SIGNAGE_POSITION_Z = -25;     // Signage Z position
    // Visible when: -30 < cameraZ < -7

    // ============================================

    // Theme Colors
    const resolvedCloudColor = "#ffffff";
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

            {/* Cloud Signage - Tabela */}
            <CloudSignage
                text={layersBuildingText || "Layers keep building."}
                position={[0, 0, SIGNAGE_POSITION_Z]}
                rotation={[0, 0, 0]}
                minZ={SIGNAGE_MIN_Z}
                maxZ={SIGNAGE_MAX_Z}
            />

            <pointLight
                ref={lightRef}
                intensity={50}
                distance={6}
                decay={2}
                color={lightColor}
            />

            {/* 1. ENTRY CLUSTER - Static Clouds */}
            <LazyCloud minZ={ENTRY_CLUSTER_MIN_Z} maxZ={ENTRY_CLUSTER_MAX_Z}>
                <Clouds>
                    <Cloud
                        ref={mainCloudRef}
                        seed={1}
                        bounds={[8, 5, 4]}
                        volume={20}
                        color={resolvedCloudColor}
                        fade={80}
                        opacity={1.0}
                        position={[0, 0, ENTRY_CLUSTER_CENTER_Z]}
                        growth={6.7}
                        speed={0.15}
                    />
                    <Cloud
                        seed={2}
                        bounds={[8, 5, 4]}
                        volume={20}
                        color={resolvedCloudColor}
                        fade={80}
                        opacity={1.0}
                        position={[-8, 2, ENTRY_CLUSTER_CENTER_Z - 2]}
                        growth={6.7}
                        speed={0.15}
                    />
                    <Cloud
                        seed={3}
                        bounds={[8, 5, 4]}
                        volume={20}
                        color={resolvedCloudColor}
                        fade={80}
                        opacity={1.0}
                        position={[8, -2, ENTRY_CLUSTER_CENTER_Z - 2]}
                        growth={6.7}
                        speed={0.15}
                    />
                    <Cloud
                        seed={4}
                        bounds={[8, 5, 4]}
                        volume={20}
                        color={resolvedCloudColor}
                        fade={80}
                        opacity={1.0}
                        position={[0, 0, ENTRY_CLUSTER_CENTER_Z - 4]}
                        growth={6.7}
                        speed={0.15}
                    />
                </Clouds>
            </LazyCloud>

            {/* 2. SIGNAGE CLUSTER - Static Clouds */}
            <LazyCloud minZ={SIGNAGE_CLUSTER_MIN_Z} maxZ={SIGNAGE_CLUSTER_MAX_Z}>
                <Clouds>
                    <Cloud
                        seed={10}
                        bounds={[8, 5, 4]}
                        volume={20}
                        color={resolvedCloudColor}
                        fade={80}
                        opacity={1.0}
                        position={[0, 0, SIGNAGE_CLUSTER_CENTER_Z + 2]}
                        growth={6.7}
                        speed={0.15}
                    />
                    <Cloud
                        seed={11}
                        bounds={[8, 5, 4]}
                        volume={20}
                        color={resolvedCloudColor}
                        fade={80}
                        opacity={1.0}
                        position={[-8, 2, SIGNAGE_CLUSTER_CENTER_Z]}
                        growth={6.7}
                        speed={0.15}
                    />
                    <Cloud
                        seed={12}
                        bounds={[8, 5, 4]}
                        volume={20}
                        color={resolvedCloudColor}
                        fade={80}
                        opacity={1.0}
                        position={[8, -2, SIGNAGE_CLUSTER_CENTER_Z]}
                        growth={6.7}
                        speed={0.15}
                    />
                    <Cloud
                        seed={13}
                        bounds={[8, 5, 4]}
                        volume={20}
                        color={resolvedCloudColor}
                        fade={80}
                        opacity={1.0}
                        position={[0, 0, SIGNAGE_CLUSTER_CENTER_Z - 2]}
                        growth={6.7}
                        speed={0.15}
                    />
                </Clouds>
            </LazyCloud>

            <ambientLight intensity={ambientInt} color="#ffffff" />
            <pointLight position={[10, 10, 5]} intensity={5} color={lightColor} />
            <spotLight position={[0, 10, 0]} intensity={5} color="#ffffff" penumbra={1} angle={1} />
        </group>
    )
}

// FPS Tracker Component
function FPSTracker({ onUpdate }: { onUpdate: (fps: number) => void }) {
    const fpsRef = useRef(0);
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());

    useFrame(() => {
        frameCountRef.current++;
        const currentTime = performance.now();
        const elapsed = currentTime - lastTimeRef.current;

        // Update FPS every 500ms
        if (elapsed >= 500) {
            const fps = Math.round((frameCountRef.current / elapsed) * 1000);
            fpsRef.current = fps;
            onUpdate(fps);
            frameCountRef.current = 0;
            lastTimeRef.current = currentTime;
        }
    });

    return null;
}

export default function Experience() {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [cameraZ, setCameraZ] = useState(8);
    const [fps, setFps] = useState(60);

    // Background Color Logic
    // Dark: #020617
    // Light: #0274b3 (Sky-660)
    // Pink: #db2777 (Pink-600)

    let fogColor = '#020617';
    if (theme === 'light') fogColor = '#0274b3';
    if (theme === 'pink') fogColor = '#db2777';

    // Fixed DPR for consistent performance (no dynamic changes that cause stuttering)
    const dpr = 0.9;  // Reduced for maximum performance (~+5 more FPS)

    // FPS color based on performance
    const getFpsColor = (fps: number) => {
        if (fps >= 55) return '#00ff00'; // Green - Good
        if (fps >= 30) return '#ffff00'; // Yellow - OK
        return '#ff0000'; // Red - Bad
    };

    return (
        <div className="h-screen w-full transition-colors duration-700 ease-in-out" style={{ backgroundColor: fogColor }}>
            {/* Debug Overlay */}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: '#00ff00',
                padding: '10px 15px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '14px',
                fontWeight: 'bold',
                zIndex: 9999,
                pointerEvents: 'none',
                border: '2px solid #00ff00',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
            }}>
                <div>Camera Z: {cameraZ.toFixed(2)}</div>
                <div style={{ color: getFpsColor(fps) }}>
                    FPS: {fps}
                </div>
            </div>

            <Canvas
                dpr={dpr}
                camera={{ position: [0, 0, 8], fov: 75 }}
                gl={{
                    antialias: false,          // Disabled for better performance (~+5 FPS)
                    powerPreference: "high-performance",
                    alpha: true,               // Need transparency for background color to show
                }}
                frameloop="always"             // Always render (not 'demand')
            >
                <fog attach="fog" args={[fogColor, 5, 60]} />

                <ScrollControls pages={4} damping={0.1}>  {/* Reduced from 0.2 for more responsive camera */}
                    <CameraRig />
                    <CameraDebugger onUpdate={setCameraZ} />
                    <FPSTracker onUpdate={setFps} />
                    <CloudScene theme={theme} aboveSoftwareText={t('above_software')} layersBuildingText={t('layers_building')} />
                </ScrollControls>
                {/* Environment removed for better performance (~+8 FPS) */}

            </Canvas>
        </div>
    );
}

