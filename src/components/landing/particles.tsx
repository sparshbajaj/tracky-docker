'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface ParticlesProps {
	count?: number
	mouse: React.MutableRefObject<{ x: number; y: number }>
}

export function Particles({ count = 5000, mouse }: ParticlesProps) {
	const ref = useRef<THREE.Points>(null)
	const { viewport } = useThree()

	// Generate initial particle positions in a sphere
	const [positions, colors, scales] = useMemo(() => {
		const positions = new Float32Array(count * 3)
		const colors = new Float32Array(count * 3)
		const scales = new Float32Array(count)

		// Fitness/Health color palette
		const colorPalette = [
			new THREE.Color('#22c55e'), // Green
			new THREE.Color('#16a34a'), // Dark green
			new THREE.Color('#4ade80'), // Light green
			new THREE.Color('#86efac'), // Pale green
			new THREE.Color('#10b981'), // Emerald
			new THREE.Color('#34d399') // Teal
		]

		for (let i = 0; i < count; i++) {
			// Spherical distribution
			const theta = Math.random() * Math.PI * 2
			const phi = Math.acos(2 * Math.random() - 1)
			const radius = 3 + Math.random() * 4

			positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
			positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
			positions[i * 3 + 2] = radius * Math.cos(phi)

			// Random color from palette
			const color =
				colorPalette[Math.floor(Math.random() * colorPalette.length)]!
			colors[i * 3] = color.r
			colors[i * 3 + 1] = color.g
			colors[i * 3 + 2] = color.b

			scales[i] = Math.random()
		}

		return [positions, colors, scales]
	}, [count])

	// Store original positions for animation
	const originalPositions = useMemo(() => positions.slice(), [positions])

	useFrame(state => {
		if (!ref.current) return

		const time = state.clock.getElapsedTime()
		const geometry = ref.current.geometry
		const positionAttribute = geometry.getAttribute('position')
		const positions = positionAttribute.array as Float32Array

		// Mouse influence
		const mouseX = (mouse.current.x * viewport.width) / 2
		const mouseY = (mouse.current.y * viewport.height) / 2

		for (let i = 0; i < count; i++) {
			const i3 = i * 3

			// Get original position
			const ox = originalPositions[i3] ?? 0
			const oy = originalPositions[i3 + 1] ?? 0
			const oz = originalPositions[i3 + 2] ?? 0

			// Wave animation
			const wave = Math.sin(time * 0.5 + ox * 0.5) * 0.3
			const wave2 = Math.cos(time * 0.3 + oy * 0.5) * 0.2

			// Mouse repulsion effect
			const dx = (positions[i3] ?? 0) - mouseX
			const dy = (positions[i3 + 1] ?? 0) - mouseY
			const dist = Math.sqrt(dx * dx + dy * dy)
			const maxDist = 2
			const repulsion = dist < maxDist ? (maxDist - dist) / maxDist : 0

			// Apply transformations
			positions[i3] = ox + wave + (dx / dist || 0) * repulsion * 0.5
			positions[i3 + 1] = oy + wave2 + (dy / dist || 0) * repulsion * 0.5
			positions[i3 + 2] = oz + Math.sin(time * 0.4 + i * 0.001) * 0.2
		}

		positionAttribute.needsUpdate = true

		// Slow rotation
		ref.current.rotation.y = time * 0.05
		ref.current.rotation.x = Math.sin(time * 0.1) * 0.1
	})

	return (
		<Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
			<PointMaterial
				transparent
				vertexColors
				size={0.05}
				sizeAttenuation={true}
				depthWrite={false}
				blending={THREE.AdditiveBlending}
			/>
		</Points>
	)
}

// Floating geometric shapes
export function FloatingShapes() {
	const groupRef = useRef<THREE.Group>(null)

	useFrame(state => {
		if (!groupRef.current) return
		const time = state.clock.getElapsedTime()

		groupRef.current.children.forEach((child, i) => {
			child.position.y = Math.sin(time * 0.5 + i * 2) * 0.5
			child.rotation.x = time * 0.2 + i
			child.rotation.y = time * 0.3 + i
		})
	})

	return (
		<group ref={groupRef}>
			{/* Floating torus */}
			<mesh position={[-4, 2, -3]}>
				<torusGeometry args={[0.5, 0.2, 16, 32]} />
				<meshStandardMaterial
					color='#22c55e'
					emissive='#22c55e'
					emissiveIntensity={0.3}
					transparent
					opacity={0.7}
					wireframe
				/>
			</mesh>

			{/* Floating icosahedron */}
			<mesh position={[4, -1, -2]}>
				<icosahedronGeometry args={[0.6, 0]} />
				<meshStandardMaterial
					color='#4ade80'
					emissive='#4ade80'
					emissiveIntensity={0.3}
					transparent
					opacity={0.6}
					wireframe
				/>
			</mesh>

			{/* Floating octahedron */}
			<mesh position={[3, 2.5, -4]}>
				<octahedronGeometry args={[0.4, 0]} />
				<meshStandardMaterial
					color='#10b981'
					emissive='#10b981'
					emissiveIntensity={0.4}
					transparent
					opacity={0.7}
					wireframe
				/>
			</mesh>

			{/* Small spheres */}
			{[...Array(6)].map((_, i) => (
				<mesh
					key={i}
					position={[
						Math.sin((i / 6) * Math.PI * 2) * 5,
						Math.cos((i / 6) * Math.PI * 2) * 2,
						-3 + Math.random() * 2
					]}
				>
					<sphereGeometry args={[0.15, 16, 16]} />
					<meshStandardMaterial
						color='#86efac'
						emissive='#86efac'
						emissiveIntensity={0.5}
						transparent
						opacity={0.8}
					/>
				</mesh>
			))}
		</group>
	)
}

// Glowing ring effect
export function GlowRing() {
	const ringRef = useRef<THREE.Mesh>(null)

	useFrame(state => {
		if (!ringRef.current) return
		const time = state.clock.getElapsedTime()
		ringRef.current.rotation.z = time * 0.2
		ringRef.current.rotation.x = Math.sin(time * 0.3) * 0.3
	})

	return (
		<mesh ref={ringRef} position={[0, 0, -5]}>
			<torusGeometry args={[3, 0.02, 16, 100]} />
			<meshStandardMaterial
				color='#22c55e'
				emissive='#22c55e'
				emissiveIntensity={1}
				transparent
				opacity={0.6}
			/>
		</mesh>
	)
}
