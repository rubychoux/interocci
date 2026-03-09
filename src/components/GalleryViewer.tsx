import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Link } from 'react-router-dom';
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
    const onKeyDown = (e: KeyboardEvent) => { keys.current[e.code] = true; };
    const onKeyUp   = (e: KeyboardEvent) => { keys.current[e.code] = false; };
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
    const dir = new THREE.Vector3();
    if (keys.current['KeyW'] || keys.current['ArrowUp'])    dir.z -= 1;
    if (keys.current['KeyS'] || keys.current['ArrowDown'])  dir.z += 1;
    if (keys.current['KeyA'] || keys.current['ArrowLeft'])  dir.x -= 1;
    if (keys.current['KeyD'] || keys.current['ArrowRight']) dir.x += 1;

    if (dir.length() > 0) {
      dir.normalize();
      dir.applyEuler(new THREE.Euler(0, yaw.current, 0, 'YXZ'));
      dir.multiplyScalar(speed);
      const next = camera.position.clone().add(dir);
      next.x = Math.max(-6.5, Math.min(6.5, next.x));
      next.z = Math.max(-8, Math.min(7, next.z));
      next.y = 1.7;
      camera.position.copy(next);
    }

    camera.quaternion.setFromEuler(new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ'));
  });

  return null;
}

// ---- Texture drift (Van Gogh animation) ----
function TextureDrift({ texture }: { texture: THREE.Texture }) {
  useFrame(() => {
    texture.offset.x = (texture.offset.x + 0.0003) % 1;
  });
  return null;
}

// ---- Bench ----
function Bench({ position }: { position: [number, number, number] }) {
  const wood = '#5c3d1e';
  return (
    <group position={position}>
      <mesh><boxGeometry args={[4, 0.1, 0.4]} /><meshStandardMaterial color={wood} roughness={0.8} /></mesh>
      <mesh position={[-1.7, -0.25, 0]}><boxGeometry args={[0.1, 0.4, 0.3]} /><meshStandardMaterial color={wood} roughness={0.8} /></mesh>
      <mesh position={[ 1.7, -0.25, 0]}><boxGeometry args={[0.1, 0.4, 0.3]} /><meshStandardMaterial color={wood} roughness={0.8} /></mesh>
    </group>
  );
}

// ---- Artwork Panel ----
function ArtworkPanel({
  artwork,
  position,
  rotation,
  onSelect,
  panelScale = 1,
}: {
  artwork: Artwork;
  position: [number, number, number];
  rotation: [number, number, number];
  onSelect: (a: Artwork) => void;
  panelScale?: number;
}) {
  const frameRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const tex = getArtTexture(artwork.imageUrl);

  useFrame(() => {
    if (frameRef.current) {
      const mat = frameRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, hovered ? 0.35 : 0.08, 0.08);
    }
  });

  return (
    <group position={position} rotation={rotation} scale={[panelScale, panelScale, panelScale]}>
      {/* Frame backing */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[3.2, 4.0]} />
        <meshStandardMaterial color="#0a0a10" />
      </mesh>

      {/* Gold frame */}
      <mesh ref={frameRef}>
        <planeGeometry args={[3.2, 4.0]} />
        <meshStandardMaterial color="#d4a853" emissive="#d4a853" emissiveIntensity={0.08} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Artwork canvas */}
      <mesh
        position={[0, 0, 0.01]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={() => onSelect(artwork)}
      >
        <planeGeometry args={[3.0, 3.8]} />
        <meshStandardMaterial
          map={tex}
          emissiveMap={tex}
          emissiveIntensity={0.6}
          roughness={0.8}
          color="#ffffff"
        />
      </mesh>

      {/* Label plate */}
      <mesh position={[0, -2.25, 0.01]}>
        <boxGeometry args={[0.8, 0.25, 0.02]} />
        <meshStandardMaterial color="#f0eeea" roughness={0.4} />
      </mesh>
      <Html position={[0, -2.25, 0.08]} center distanceFactor={6}>
        <div style={{ fontFamily: "'Space Mono', monospace", textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ color: '#111', fontSize: '9px', marginBottom: '1px', maxWidth: '160px', fontWeight: 'bold' }}>
            {artwork.title}
          </div>
          <div style={{ color: '#555', fontSize: '7px' }}>
            {artwork.medium} · {artwork.year}
          </div>
        </div>
      </Html>

      {hovered && (
        <Html position={[0, 2.3, 0.1]} center>
          <div className="controls-hint px-3 py-1 text-xs" style={{ color: 'var(--purple-bright)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
            Click to view
          </div>
        </Html>
      )}
    </group>
  );
}

// ---- Room constants ----
const CEIL = 7;

interface StyleConfig {
  wall: string; trim: string; floor: string; ceiling: string;
  light: string; fog: string; featureWall: string; frame: string;
}

const ROOM_STYLES: Record<string, StyleConfig> = {
  abstract:   { wall: '#12121e', trim: '#1c1c28', floor: '#0e0e18', ceiling: '#0a0a14', light: '#fff5e0', fog: '#08080f', featureWall: '#16162a', frame: '#2a2a3e' },
  minimalist: { wall: '#1a1a1a', trim: '#252525', floor: '#111111', ceiling: '#0d0d0d', light: '#e8f0ff', fog: '#0a0a0a', featureWall: '#222222', frame: '#333333' },
  surreal:    { wall: '#0d0820', trim: '#1a0f30', floor: '#080614', ceiling: '#06040f', light: '#cc88ff', fog: '#1a0a2e', featureWall: '#1a0d30', frame: '#2a1548' },
  digital:    { wall: '#071420', trim: '#0e1f30', floor: '#050e18', ceiling: '#040c14', light: '#00aaff', fog: '#050a12', featureWall: '#0d1e30', frame: '#172a40' },
  immersive:  { wall: '#12121e', trim: '#1c1c28', floor: '#0e0e18', ceiling: '#0a0a14', light: '#fff5e0', fog: '#08080f', featureWall: '#16162a', frame: '#2a2a3e' },
  classical:  { wall: '#1a1510', trim: '#2a201a', floor: '#12100a', ceiling: '#0e0c08', light: '#ffe4b5', fog: '#0e0a06', featureWall: '#241c14', frame: '#382c20' },
};
const DEFAULT_STYLE: StyleConfig = ROOM_STYLES.abstract;

type Placement = {
  pos: [number, number, number];
  rot: [number, number, number];
};

const ALL_PLACEMENTS: Placement[] = [
  { pos: [-4.5, 3.2, -5],  rot: [0,  Math.PI / 2, 0] },
  { pos: [0,    3.2, -7.8], rot: [0,  0,           0] },
  { pos: [4.5,  3.2, -5],  rot: [0, -Math.PI / 2, 0] },
  { pos: [-4.5, 3.2,  1],  rot: [0,  Math.PI / 2, 0] },
  { pos: [4.5,  3.2,  1],  rot: [0, -Math.PI / 2, 0] },
  { pos: [0,    3.2, -1],  rot: [0,  0,           0] },
];

// The 2 accent placements used in immersive mode
const ACCENT_PLACEMENTS = [ALL_PLACEMENTS[0], ALL_PLACEMENTS[2]];

// ---- Gallery Room ----
function GalleryRoom({
  artworks,
  onSelectArtwork,
  immersive,
  styleConfig,
}: {
  artworks: Artwork[];
  onSelectArtwork: (a: Artwork) => void;
  immersive: boolean;
  styleConfig: StyleConfig;
}) {
  // Build projection texture (cloned so we can mutate wrapS/repeat independently)
  const projTexture = useMemo(() => {
    if (!immersive || artworks.length === 0) return null;
    const base = getArtTexture(artworks[0].imageUrl);
    const tex = base.clone();
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.5, 2);
    tex.needsUpdate = true;
    return tex;
  }, [immersive, artworks]);

  const placements = immersive ? ACCENT_PLACEMENTS : ALL_PLACEMENTS;
  const panelCount = Math.min(artworks.length, placements.length);

  const sc = styleConfig;

  // Shared immersive material props
  const projMat = projTexture
    ? { map: projTexture, emissiveMap: projTexture, emissiveIntensity: 0.3, color: '#ffffff', roughness: 0.9 }
    : { color: sc.wall, roughness: 0.9 };

  return (
    <group>
      {/* Animate texture drift when immersive */}
      {projTexture && <TextureDrift texture={projTexture} />}

      {/* ── LIGHTS ── */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <hemisphereLight args={['#ffffff', '#8866ff', 0.5]} />

      {/* 6 ceiling point lights — corners + two centre */}
      <pointLight position={[-6, 6.5, -7]} intensity={3.0} color={sc.light} distance={15} decay={1.5} />
      <pointLight position={[ 6, 6.5, -7]} intensity={3.0} color={sc.light} distance={15} decay={1.5} />
      <pointLight position={[-6, 6.5,  7]} intensity={3.0} color={sc.light} distance={15} decay={1.5} />
      <pointLight position={[ 6, 6.5,  7]} intensity={3.0} color={sc.light} distance={15} decay={1.5} />
      <pointLight position={[ 0, 6.5, -3]} intensity={3.0} color={sc.light} distance={15} decay={1.5} />
      <pointLight position={[ 0, 6.5,  3]} intensity={3.0} color={sc.light} distance={15} decay={1.5} />

      {/* ── FLOOR ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 18]} />
        {immersive && projTexture
          ? <meshStandardMaterial map={projTexture} emissiveMap={projTexture} emissiveIntensity={0.3} color="#ffffff" roughness={0.15} metalness={0.4} />
          : <meshStandardMaterial color={sc.floor} roughness={0.15} metalness={0.4} />
        }
      </mesh>

      {/* ── CEILING ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, CEIL, 0]}>
        <planeGeometry args={[16, 18]} />
        {immersive && projTexture
          ? <meshStandardMaterial map={projTexture} emissiveMap={projTexture} emissiveIntensity={0.3} color="#ffffff" roughness={0.9} />
          : <meshStandardMaterial color={sc.ceiling} roughness={0.9} />
        }
      </mesh>

      {/* ── WALLS ── */}
      {/* Back */}
      <mesh position={[0, CEIL / 2, -8]}>
        <planeGeometry args={[16, CEIL]} />
        <meshStandardMaterial {...projMat} />
      </mesh>
      {/* Front */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, CEIL / 2, 7.5]}>
        <planeGeometry args={[16, CEIL]} />
        <meshStandardMaterial {...projMat} />
      </mesh>
      {/* Left */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-7, CEIL / 2, 0]}>
        <planeGeometry args={[18, CEIL]} />
        <meshStandardMaterial {...projMat} />
      </mesh>
      {/* Right */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[7, CEIL / 2, 0]}>
        <planeGeometry args={[18, CEIL]} />
        <meshStandardMaterial {...projMat} />
      </mesh>

      {/* ── FEATURE WALL (back centre, standard mode only) ── */}
      {!immersive && (
        <>
          <mesh position={[0, 3.25, -7.98]}>
            <planeGeometry args={[5.5, 5.5]} />
            <meshStandardMaterial color={sc.featureWall} roughness={0.8} />
          </mesh>
          <mesh position={[0,     6.03, -7.97]}><boxGeometry args={[5.7, 0.06, 0.04]} /><meshStandardMaterial color={sc.frame} metalness={0.4} roughness={0.4} /></mesh>
          <mesh position={[0,     0.47, -7.97]}><boxGeometry args={[5.7, 0.06, 0.04]} /><meshStandardMaterial color={sc.frame} metalness={0.4} roughness={0.4} /></mesh>
          <mesh position={[-2.78, 3.25, -7.97]}><boxGeometry args={[0.06, 5.62, 0.04]} /><meshStandardMaterial color={sc.frame} metalness={0.4} roughness={0.4} /></mesh>
          <mesh position={[ 2.78, 3.25, -7.97]}><boxGeometry args={[0.06, 5.62, 0.04]} /><meshStandardMaterial color={sc.frame} metalness={0.4} roughness={0.4} /></mesh>
        </>
      )}

      {/* ── BASEBOARD TRIM ── */}
      <mesh position={[0, 0.4, -7.925]}><boxGeometry args={[14, 0.8, 0.15]} /><meshStandardMaterial color={sc.trim} roughness={0.7} /></mesh>
      <mesh position={[0, 0.4,  7.425]}><boxGeometry args={[14, 0.8, 0.15]} /><meshStandardMaterial color={sc.trim} roughness={0.7} /></mesh>
      <mesh position={[-6.925, 0.4, 0]}><boxGeometry args={[0.15, 0.8, 15.5]} /><meshStandardMaterial color={sc.trim} roughness={0.7} /></mesh>
      <mesh position={[ 6.925, 0.4, 0]}><boxGeometry args={[0.15, 0.8, 15.5]} /><meshStandardMaterial color={sc.trim} roughness={0.7} /></mesh>

      {/* ── CEILING COVING ── */}
      <mesh position={[0, CEIL - 0.35, -7.925]}><boxGeometry args={[14, 0.3, 0.15]} /><meshStandardMaterial color={sc.trim} roughness={0.7} /></mesh>
      <mesh position={[0, CEIL - 0.35,  7.425]}><boxGeometry args={[14, 0.3, 0.15]} /><meshStandardMaterial color={sc.trim} roughness={0.7} /></mesh>
      <mesh position={[-6.925, CEIL - 0.35, 0]}><boxGeometry args={[0.15, 0.3, 15.5]} /><meshStandardMaterial color={sc.trim} roughness={0.7} /></mesh>
      <mesh position={[ 6.925, CEIL - 0.35, 0]}><boxGeometry args={[0.15, 0.3, 15.5]} /><meshStandardMaterial color={sc.trim} roughness={0.7} /></mesh>

      {/* ── BENCHES ── */}
      <Bench position={[0, 0.45,  2]} />
      <Bench position={[0, 0.45, -3]} />

      {/* ── ARTWORKS ── */}
      {artworks.slice(0, panelCount).map((artwork, i) => (
        <ArtworkPanel
          key={artwork.id}
          artwork={artwork}
          position={placements[i].pos}
          rotation={placements[i].rot}
          onSelect={onSelectArtwork}
          panelScale={immersive ? 0.65 : 1}
        />
      ))}
    </group>
  );
}

// ---- Artwork Modal ----
function ArtworkModal({ artwork, onClose }: { artwork: Artwork; onClose: () => void }) {
  const artColors: Record<string, string> = {
    'abstract-purple': '#6b21a8',
    'abstract-blue':   '#2563eb',
    'abstract-indigo': '#4338ca',
    'brutalist-blue':  '#1e40af',
    'geometric-dark':  '#4c1d95',
    'mythology-red':   '#dc2626',
    'mythology-dark':  '#92400e',
    'ai-portrait':     '#7c3aed',
    'glitch-art':      '#be185d',
    'data-viz':        '#4338ca',
    'textile-green':   '#16a34a',
    'night-city':      '#1e3a5f',
    'golden-light':    '#d97706',
  };
  const bg = artColors[artwork.imageUrl] || '#2d1f4e';

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
        <button onClick={onClose} className="absolute top-4 right-4 btn-ghost text-xs px-2 py-1 rounded-sm">
          ✕ CLOSE
        </button>
        <div className="w-full h-48 rounded-sm mb-6" style={{ background: bg, boxShadow: `0 0 40px ${bg}40` }} />
        <div className="space-y-3">
          <h2 className="font-display text-3xl" style={{ color: 'var(--text-primary)' }}>{artwork.title}</h2>
          <div className="flex items-center gap-3">
            <span className="tag">{artwork.medium}</span>
            <span className="tag">{artwork.year}</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{artwork.description}</p>
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
export default function GalleryViewer({
  gallery,
  immersive = false,
  onToggleImmersive,
  roomStyle,
}: {
  gallery: Gallery;
  immersive?: boolean;
  onToggleImmersive?: () => void;
  roomStyle?: string;
}) {
  const styleConfig = ROOM_STYLES[roomStyle ?? ''] ?? DEFAULT_STYLE;
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
        <fog attach="fog" args={[styleConfig.fog, 14, 28]} />
        <CameraController />
        <GalleryRoom
          artworks={gallery.artworks}
          onSelectArtwork={setSelectedArtwork}
          immersive={immersive}
          styleConfig={styleConfig}
        />
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
          <Link to={`/artist/${gallery.artist.id}`} className="nav-link" style={{ color: 'var(--purple-bright)' }}>
            {gallery.artist.name}
          </Link>
          {' · '}{gallery.artworks.length} works
        </p>
      </div>

      {/* Artwork count */}
      <div className="absolute top-4 right-4 controls-hint px-3 py-2 rounded-sm">
        <p className="text-xs" style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          {gallery.artworks.length} WORKS
        </p>
      </div>

      {/* Immersive mode toggle — bottom right */}
      {onToggleImmersive && (
        <div className="absolute bottom-6 right-6">
          <button
            onClick={onToggleImmersive}
            className={`text-xs px-4 py-2 rounded-sm ${immersive ? 'btn-primary' : 'btn-ghost'}`}
          >
            ◈ {immersive ? 'EXIT IMMERSIVE' : 'IMMERSIVE MODE'}
          </button>
        </div>
      )}

      {selectedArtwork && (
        <ArtworkModal artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
      )}
    </div>
  );
}
