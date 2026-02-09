"use client";

import { Cloud } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, ComponentProps } from "react";
import * as THREE from "three";

// Manual prop definition to avoid complex extraction issues
type CloudProps = ComponentProps<typeof Cloud>;

interface LazyCloudProps extends CloudProps {
    renderDistance?: number;
}

export default function LazyCloud({
    renderDistance = 25,
    ...props
}: LazyCloudProps) {
    const groupRef = useRef<THREE.Group>(null);
    const { camera } = useThree();

    useFrame(() => {
        if (!groupRef.current) return;

        // Calculate distance to camera
        const worldPos = new THREE.Vector3();
        groupRef.current.getWorldPosition(worldPos);
        const distance = camera.position.distanceTo(worldPos);

        // Visibility Logic
        // 1. Distance Check: Must be within renderDistance
        // 2. Direction Check: Must be in front of camera (or slightly behind allowed for volume)

        // Culling behind: if camera.z < worldPos.z - 4 (moving towards -Z), we passed it.
        const isPassed = camera.position.z < (worldPos.z - 4);

        // Culling far: distance check
        const isWithinRange = distance < renderDistance;

        // Combine
        const isVisible = isWithinRange && !isPassed;

        // Apply
        if (groupRef.current) {
            groupRef.current.visible = isVisible;
        }
    });

    return (
        <group ref={groupRef} visible={false}>
            <Cloud {...props} />
        </group>
    );
}
