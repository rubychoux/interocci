import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingFrame({ position, rotation, color, scale = 1 }: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[1.4, 1.8, 0.06]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>
      {/* Frame border */}
      <mesh position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[1.5, 1.9, 0.02]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#a78bfa"
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0.9}
          wireframe={false}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
}

function OrbitalRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0, -2]}>
      <torusGeometry args={[3.5, 0.015, 16, 100]} />
      <meshStandardMaterial
        color="#8b5cf6"
        emissive="#8b5cf6"
        emissiveIntensity={0.8}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;

      // Purple to blue gradient
      const t = Math.random();
      colors[i * 3] = 0.3 + t * 0.4;      // R
      colors[i * 3 + 1] = 0.1 + t * 0.2;  // G
      colors[i * 3 + 2] = 0.6 + t * 0.4;  // B
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

function GlowSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      sphereRef.current.rotation.z = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <Float speed={0.8} floatIntensity={0.5}>
      <mesh ref={sphereRef} position={[0, 0, -4]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <MeshDistortMaterial
          color="#2d1f4e"
          emissive="#5b3fa0"
          emissiveIntensity={0.4}
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[4, 4, 4]} intensity={1.5} color="#a78bfa" />
      <pointLight position={[-4, -2, 2]} intensity={0.8} color="#7c3aed" />
      <pointLight position={[0, -4, 0]} intensity={0.5} color="#d4a853" />
      <spotLight position={[0, 8, 4]} intensity={1} color="#8b5cf6" angle={0.4} penumbra={0.8} />

      <ParticleField />
      <GlowSphere />
      <OrbitalRing />

      <FloatingFrame
        position={[-2.2, 0.4, 0]}
        rotation={[0.05, 0.2, -0.05]}
        color="#1a0a30"
        scale={0.9}
      />
      <FloatingFrame
        position={[0, 0.2, -1]}
        rotation={[-0.03, 0, 0.02]}
        color="#0a1628"
        scale={1.1}
      />
      <FloatingFrame
        position={[2.2, -0.2, 0.3]}
        rotation={[0.04, -0.15, 0.03]}
        color="#1a0a1a"
        scale={0.85}
      />
    </Canvas>
  );
}
