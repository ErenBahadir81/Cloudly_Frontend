"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface LazyCloudProps {
    children: React.ReactNode;
    /**
     * Minimum camera Z position for rendering (e.g., 5)
     * Component will be visible when cameraZ < minZ
     */
    minZ: number;
    /**
     * Maximum camera Z position for rendering (e.g., -7)
     * Component will be visible when cameraZ > maxZ
     */
    maxZ: number;
}

/**
 * LazyCloud Component - Optimized for 60fps
 * 
 * Renders children only when camera Z position is within the specified range.
 * - Visible when: maxZ < cameraZ < minZ
 * - Example: minZ=5, maxZ=-7 → visible when -7 < cameraZ < 5
 * 
 * Performance optimizations:
 * - Uses simple visibility toggle (no fade animation)
 * - No React state updates (avoids re-renders)
 * - No material traversal (avoids expensive scene graph walk)
 * - Leverages Three.js built-in frustum culling
 * 
 * @param minZ - Upper bound of camera Z for rendering
 * @param maxZ - Lower bound of camera Z for rendering
 * @param children - React nodes to render
 */
export default function LazyCloud({ children, minZ, maxZ }: LazyCloudProps) {
    const { camera } = useThree();
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (!groupRef.current) return;

        // Get camera Z position
        const cameraZ = camera.position.z;

        // Manual render cycle control
        // Visible when camera Z is between maxZ and minZ
        const shouldBeVisible = cameraZ < minZ && cameraZ > maxZ;

        // Simple visibility toggle - maximum performance
        // Three.js will automatically skip invisible objects in render loop
        groupRef.current.visible = shouldBeVisible;
    });

    return <group ref={groupRef}>{children}</group>;
}
