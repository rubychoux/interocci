import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Gallery, Artwork } from '../types';
import { getArtTexture } from '../utils/artTextures';

// ---- Movement Controller ----
function CameraController() {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const yaw = useRef(0);
  const pitch = useRef(0);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      keys.current[e.code] = down;
    };
    const onKeyDown = (e: KeyboardEvent) => onKey(e, true);
    const onKeyUp = (e: KeyboardEvent) => onKey(e, false);

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging.current = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      yaw.current -= dx * 0.003;
      pitch.current -= dy * 0.003;
      pitch.current = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, pitch.current));
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);

    // Set initial camera position
    camera.position.set(0, 1.7, 6);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [camera]);

  useFrame((_, delta) => {
    const speed = 4 * delta;
    const direction = new THREE.Vector3();

    // Forward/back
    if (keys.current['KeyW'] || keys.current['ArrowUp']) direction.z -= 1;
    if (keys.current['KeyS'] || keys.current['ArrowDown']) direction.z += 1;
    // Strafe
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) direction.x -= 1;
    if (keys.current['KeyD'] || keys.current['ArrowRight']) direction.x += 1;

    if (direction.length() > 0) {
      direction.normalize();
      const euler = new THREE.Euler(0, yaw.current, 0, 'YXZ');
      direction.applyEuler(euler);
      direction.multiplyScalar(speed);

      const next = camera.position.clone().add(direction);
      // Clamp to room bounds
      next.x = Math.max(-6.5, Math.min(6.5, next.x));
      next.z = Math.max(-8, Math.min(7, next.z));
      next.y = 1.7; // Lock height
      camera.position.copy(next);
    }

    // Apply yaw + pitch
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ'));
    camera.quaternion.copy(quaternion);
  });

  return null;
}

// ---- Artwork Panel ----
function ArtworkPanel({
  artwork,
  position,
  rotation,
  onSelect,
}: {
  artwork: Artwork;
  position: [number, number, number];
  rotation: [number, number, number];
  onSelect: (a: Artwork) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      const targetEmissive = hovered ? 0.4 : 0.1;
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.08);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Artwork canvas */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={() => onSelect(artwork)}
      >
        <planeGeometry args={[2.4, 3.0]} />
        <meshStandardMaterial
          map={getArtTexture(artwork.imageUrl)}
          roughness={0.4}
        />
      </mesh>

      {/* Gold frame */}
      <mesh>
        <planeGeometry args={[2.6, 3.2]} />
        <meshStandardMaterial
          color="#d4a853"
          emissive="#d4a853"
          emissiveIntensity={hovered ? 0.3 : 0.1}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
      {/* Frame backing to push it behind */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[2.6, 3.2]} />
        <meshStandardMaterial color="#0a0a10" />
      </mesh>

      {/* Title label */}
      <Html position={[0, -1.4, 0.02]} center distanceFactor={6}>
        <div style={{ fontFamily: "'Space Mono', monospace", textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ color: '#f0eef8', fontSize: '11px', marginBottom: '3px', maxWidth: '180px' }}>
            {artwork.title}
          </div>
          <div style={{ color: '#9b93b8', fontSize: '9px' }}>
            {artwork.medium} · {artwork.year}
          </div>
        </div>
      </Html>

      {/* Hover tooltip */}
      {hovered && (
        <Html position={[0, 1.8, 0.1]} center>
          <div className="controls-hint px-3 py-1 text-xs" style={{ color: 'var(--purple-bright)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
            Click to view
          </div>
        </Html>
      )}
    </group>
  );
}

// ---- Room Geometry ----
function GalleryRoom({ artworks, onSelectArtwork }: { artworks: Artwork[]; onSelectArtwork: (a: Artwork) => void }) {
  const wallColor = '#0d0d14';
  const floorColor = '#0a0a0f';

  // Spotlight refs
  const lights = [
    { pos: [-4, 4.8, -4] as [number,number,number], target: [-4, 2, -6] as [number,number,number] },
    { pos: [0, 4.8, -4] as [number,number,number], target: [0, 2, -6] as [number,number,number] },
    { pos: [4, 4.8, -4] as [number,number,number], target: [4, 2, -6] as [number,number,number] },
    { pos: [-4, 4.8, 4] as [number,number,number], target: [-4, 2, 6] as [number,number,number] },
    { pos: [4, 4.8, 4] as [number,number,number], target: [4, 2, 6] as [number,number,number] },
  ];

  // Place up to 6 artworks on walls
  const artworkPlacements = [
    { pos: [-4.5, 2.5, -5] as [number,number,number], rot: [0, Math.PI / 2, 0] as [number,number,number] },
    { pos: [0, 2.5, -7.8] as [number,number,number], rot: [0, 0, 0] as [number,number,number] },
    { pos: [4.5, 2.5, -5] as [number,number,number], rot: [0, -Math.PI / 2, 0] as [number,number,number] },
    { pos: [-4.5, 2.5, 1] as [number,number,number], rot: [0, Math.PI / 2, 0] as [number,number,number] },
    { pos: [4.5, 2.5, 1] as [number,number,number], rot: [0, -Math.PI / 2, 0] as [number,number,number] },
    { pos: [0, 2.5, -1] as [number,number,number], rot: [0, 0, 0] as [number,number,number] },
  ];

  return (
    <group>
      {/* Ambient */}
      <ambientLight intensity={0.08} color="#1a0a30" />

      {/* Ceiling lights */}
      {lights.map((l, i) => (
        <pointLight key={i} position={l.pos} intensity={1.2} color="#c4b0f0" distance={8} decay={2} />
      ))}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[16, 18]} />
        <meshStandardMaterial color={floorColor} roughness={0.05} metalness={0.8} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.5, 0]}>
        <planeGeometry args={[16, 18]} />
        <meshStandardMaterial color="#080810" roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2.75, -8]}>
        <planeGeometry args={[16, 5.5]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>

      {/* Front wall */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, 2.75, 7.5]}>
        <planeGeometry args={[16, 5.5]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>

      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-7, 2.75, 0]}>
        <planeGeometry args={[18, 5.5]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>

      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[7, 2.75, 0]}>
        <planeGeometry args={[18, 5.5]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>

      {/* Floor grid lines effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[16, 18, 16, 18]} />
        <meshBasicMaterial color="#2d1f4e" wireframe transparent opacity={0.15} />
      </mesh>

      {/* Ceiling accent strip */}
      <mesh position={[0, 5.4, 0]}>
        <planeGeometry args={[14, 0.1]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.6} />
      </mesh>

      {/* Baseboard glow */}
      <mesh position={[0, 0.05, -7.9]}>
        <planeGeometry args={[14, 0.1]} />
        <meshStandardMaterial color="#5b3fa0" emissive="#5b3fa0" emissiveIntensity={0.5} />
      </mesh>

      {/* Artworks */}
      {artworks.slice(0, 6).map((artwork, i) => {
        const placement = artworkPlacements[i];
        return (
          <ArtworkPanel
            key={artwork.id}
            artwork={artwork}
            position={placement.pos}
            rotation={placement.rot}
            onSelect={onSelectArtwork}
          />
        );
      })}
    </group>
  );
}

// ---- Artwork Modal ----
function ArtworkModal({ artwork, onClose }: { artwork: Artwork; onClose: () => void }) {
  const gradColors: Record<string, string> = {
    'linear-gradient(135deg, #1a0535 0%, #6b21a8 50%, #0f0520 100%)': '#6b21a8',
    'linear-gradient(135deg, #0f172a 0%, #7c3aed 30%, #be185d 100%)': '#7c3aed',
    'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #1e3a5f 100%)': '#4338ca',
    'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #0f2040 100%)': '#2563eb',
    'linear-gradient(135deg, #3b0764 0%, #dc2626 50%, #1c0030 100%)': '#dc2626',
    'linear-gradient(135deg, #2e1065 0%, #7c3aed 40%, #db2777 100%)': '#7c3aed',
    'linear-gradient(135deg, #052e16 0%, #16a34a 50%, #14532d 100%)': '#16a34a',
    'linear-gradient(135deg, #1c0f00 0%, #92400e 50%, #451a03 100%)': '#92400e',
  };
  const bg = gradColors[artwork.imageUrl] || '#2d1f4e';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(5,5,7,0.85)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full mx-4 p-8 rounded-sm animate-fade-in-up"
        style={{
          background: 'linear-gradient(135deg, rgba(18,18,26,0.98), rgba(10,10,16,0.98))',
          border: '1px solid rgba(139,92,246,0.3)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 40px rgba(139,92,246,0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 btn-ghost text-xs px-2 py-1 rounded-sm"
        >
          ✕ CLOSE
        </button>

        {/* Artwork preview */}
        <div
          className="w-full h-48 rounded-sm mb-6"
          style={{ background: bg, boxShadow: `0 0 40px ${bg}40` }}
        />

        <div className="space-y-3">
          <h2 className="font-display text-3xl" style={{ color: 'var(--text-primary)' }}>
            {artwork.title}
          </h2>
          <div className="flex items-center gap-3">
            <span className="tag">{artwork.medium}</span>
            <span className="tag">{artwork.year}</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {artwork.description}
          </p>
          <div className="pt-2">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              by {artwork.artist.name} · {artwork.artist.handle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Main Export ----
export default function GalleryViewer({ gallery }: { gallery: Gallery }) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full" style={{ background: '#050507' }}>
      <Canvas
        camera={{ position: [0, 1.7, 6], fov: 75 }}
        gl={{ antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <fog attach="fog" args={['#050507', 12, 22]} />
        <CameraController />
        <GalleryRoom artworks={gallery.artworks} onSelectArtwork={setSelectedArtwork} />
      </Canvas>

      {/* Controls hint */}
      {showControls && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 controls-hint px-6 py-3 rounded-sm animate-fade-in text-center">
          <p className="text-xs mb-1" style={{ color: 'var(--purple-bright)', letterSpacing: '0.15em' }}>
            NAVIGATE THE GALLERY
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            WASD or ↑↓←→ to move · Drag to look · Click artwork to view
          </p>
        </div>
      )}

      {/* Gallery info overlay */}
      <div className="absolute top-4 left-4 controls-hint px-4 py-3 rounded-sm">
        <p className="font-display text-lg" style={{ color: 'var(--text-primary)' }}>{gallery.title}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          {gallery.artist.name} · {gallery.artworks.length} works
        </p>
      </div>

      {/* Artwork count */}
      <div className="absolute top-4 right-4 controls-hint px-3 py-2 rounded-sm">
        <p className="text-xs" style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          {gallery.artworks.length} WORKS
        </p>
      </div>

      {selectedArtwork && (
        <ArtworkModal artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
      )}
    </div>
  );
}
