"use client";

import { Text, RoundedBox, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

interface CloudSignageProps {
    text: string;
    position: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
}

export default function CloudSignage({ text, position, rotation = [0, 0, 0], scale = 1 }: CloudSignageProps) {
    const groupRef = useRef<THREE.Group>(null);
    const textMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
    const { camera } = useThree();
    const { theme } = useTheme();

    const isDark = theme === 'dark';
    const textColor = isDark ? "#ffffff" : "#0f172a";

    useFrame(() => {
        if (!groupRef.current) return;

        // Calculate distance to camera
        const worldPos = new THREE.Vector3();
        groupRef.current.getWorldPosition(worldPos);
        const distance = camera.position.distanceTo(worldPos);

        // Visibility / Fade Logic
        // Fade in when closer than 15 units (start seeing it)
        // Fully visible at 8 units
        // Fade out when very close (passed it)
        let opacity = 0;
        if (distance < 15 && distance > 1.0) {
            opacity = Math.min(1, (15 - distance) / 5);
            if (distance < 4) {
                opacity = Math.min(opacity, (distance - 1.5) / 2.5);
            }
        }
        opacity = Math.max(0, Math.min(1, opacity));

        // Apply visibility to group to save performance when far
        groupRef.current.visible = opacity > 0.01;

        // Apply opacity to text manually
        if (textMaterialRef.current) {
            textMaterialRef.current.opacity = opacity;
        }

        // Ensure scale is constant (no popping animation)
        groupRef.current.scale.setScalar(scale || 1);
    });

    return (
        <group ref={groupRef} position={position} rotation={rotation} scale={scale || 1}>
            {/* Premium Glass (Standard Material to Fix Render Bug) */}
            <RoundedBox args={[4, 2.5, 0.2]} radius={0.2} smoothness={4} renderOrder={1}>
                {/* 
                    Using MeshStandardMaterial instead of Physical to avoid transmission overhead
                    that causes cloud rendering bugs.
                    High metalness + Environment map creates the glass look.
                */}
                <meshStandardMaterial
                    color="#ffffff"
                    roughness={0.1}
                    metalness={0.9}
                    transparent={true}
                    opacity={0.15}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                    envMapIntensity={1.5} // Boost reflections manually
                />
            </RoundedBox>

            {/* Floating Text */}
            <Text
                position={[0, 0, 0.15]} // Floating in front
                fontSize={0.25}
                color={textColor}
                anchorX="center"
                anchorY="middle"
                maxWidth={3.5}
                textAlign="center"
            >
                {text}
                <meshBasicMaterial ref={textMaterialRef} color={textColor} transparent opacity={1} />
            </Text>
        </group>
    );
}
