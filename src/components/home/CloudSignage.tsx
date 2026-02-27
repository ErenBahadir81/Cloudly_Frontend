"use client";

import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

interface CloudSignageProps {
    text: string;
    position: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
    /**
     * Minimum camera Z position for rendering
     * Component will be visible when cameraZ < minZ
     */
    minZ: number;
    /**
     * Maximum camera Z position for rendering
     * Component will be visible when cameraZ > maxZ
     */
    maxZ: number;
}

export default function CloudSignage({ text, position, rotation = [0, 0, 0], scale = 1, minZ, maxZ }: CloudSignageProps) {
    const { camera } = useThree();
    const { theme } = useTheme();
    const groupRef = useRef<THREE.Group>(null);

    const isDark = theme === 'dark';
    const textColor = isDark ? "#ffffff" : "#0f172a";

    useFrame(() => {
        if (!groupRef.current) return;

        // Get camera Z position
        const cameraZ = camera.position.z;

        // Manual render cycle control - visible when camera Z is between maxZ and minZ
        const shouldBeVisible = cameraZ < minZ && cameraZ > maxZ;

        // Simple visibility toggle - maximum performance
        groupRef.current.visible = shouldBeVisible;
    });

    return (
        <group ref={groupRef} position={position} rotation={rotation} scale={scale || 1}>
            <Text
                position={[0, 0, 0]}
                fontSize={0.35}
                color={textColor}
                font="/fonts/Orbitron-Black.ttf"
                anchorX="center"
                anchorY="middle"
                maxWidth={4.5}
                textAlign="center"
                letterSpacing={0.02}
                outlineColor={isDark ? "#3b82f6" : "#2563eb"}
                outlineWidth={0.008}
            >
                {text}
            </Text>
        </group>
    );
}
