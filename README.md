# InterOcci

**Immersive 3D Virtual Art Gallery Platform**

> Walk through gallery spaces. Discover artists worldwide. Experience art beyond the flat grid.

🔗 **[Live Demo](https://interocci.vercel.app)** · [GitHub](https://github.com/rubychoux/interocci)

---

## Overview

InterOcci is a web-based immersive art gallery platform built with React, TypeScript, and React Three Fiber. Artists exhibit their work in walkable 3D spaces — no VR headset required. Visitors navigate gallery rooms in first-person, view artwork details, and discover creators from around the world.

The project originated from research with 100+ visual artists across Asia, Europe, and North America who found existing platforms like ArtStation and Instagram too limiting. InterOcci bridges the gap between physical art exhibitions and flat online grid galleries.

---

## Tech Stack

| | |
|---|---|
| **Framework** | React 19 + TypeScript (strict mode) |
| **Build** | Vite |
| **3D Engine** | React Three Fiber + Three.js |
| **Styling** | Tailwind CSS + CSS custom properties |
| **Routing** | React Router DOM v6 |
| **Deployment** | Vercel |

---

## Features

### 🚶 Walkable 3D Gallery Viewer
First-person navigation through fully realized gallery rooms using WASD / arrow keys and click-to-drag mouse look. Each gallery style (abstract, minimalist, surreal, digital, classical) renders a distinct room with unique lighting, wall colors, and atmosphere. Click any artwork to open a detail modal.

### 🎨 Procedural Artwork Textures
All artwork is rendered via the Canvas 2D API — each piece is procedurally generated from a named style key (`abstract-purple`, `glitch-art`, `night-city`, etc.) and cached as a `THREE.CanvasTexture`. No external image dependencies for artwork content.

### 🔍 Explore + Filter
Searchable, filterable gallery grid with real-time results. Filter by style (Abstract, Minimalist, Digital, Immersive, Surreal, Classical) and sort by Trending, Most Viewed, Most Liked, or Newest.

### ♡ Like & Collections
Like galleries from any card or from inside the gallery viewer. Liked IDs persist via `localStorage`. Full collection viewable at `/liked`.

### 👤 Artist Profiles
Every artist has a dedicated profile page at `/artist/:id` showing their full gallery, aggregate stats, and follower count.

### ◈ Immersive Mode
Toggle a Van Gogh-style projection mode that wraps the gallery's artwork across all surfaces — walls, floor, and ceiling — with a slow animated texture drift.

---

## Architecture Highlights

**Custom WASD Camera Controller**
```tsx
// useFrame-based movement with yaw/pitch mouse look,
// collision bounds, and locked camera height
function CameraController() {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const yaw = useRef(0);

  useFrame((_, delta) => {
    const direction = new THREE.Vector3();
    if (keys.current['KeyW']) direction.z -= 1;
    // normalize, apply euler rotation, clamp to room bounds
    camera.quaternion.setFromEuler(
      new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ')
    );
  });
}
```

**Procedural Canvas Texture System**
```tsx
// Each artwork style generates a unique Canvas 2D texture,
// cached in a Map to avoid redundant redraws
export function getArtTexture(imageUrl: string): THREE.Texture {
  if (cache.has(imageUrl)) return cache.get(imageUrl)!;
  const canvas = document.createElement('canvas');
  // draw procedural art based on style key
  const texture = new THREE.CanvasTexture(canvas);
  cache.set(imageUrl, texture);
  return texture;
}
```

**Likes with localStorage Persistence**
```tsx
// Custom hook — no external state library needed
export function useLikes() {
  const [likedIds, setLikedIds] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('interocci_likes') ?? '[]')
  );
  const toggleLike = (id: string) => { /* update state + localStorage */ };
  return { likedIds, toggleLike, isLiked: (id: string) => likedIds.includes(id) };
}
```

---

## Getting Started
```bash
git clone https://github.com/rubychoux/interocci.git
cd interocci
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Gallery Controls

| Action | Input |
|---|---|
| Move | `W A S D` or `↑ ↓ ← →` |
| Look around | Click + drag |
| View artwork | Click any painting |
| Close modal | Click outside or `✕` |

---

## Project Structure
```
src/
├── components/
│   ├── Nav.tsx              # Fixed nav with scroll state + auth modals
│   ├── HeroScene.tsx        # Three.js landing hero (particles, floating frames)
│   ├── GalleryViewer.tsx    # Full 3D walkthrough gallery with WASD
│   └── AuthModal.tsx        # Sign in / Create gallery modal
├── pages/
│   ├── LandingPage.tsx      # Hero + featured galleries + feature blocks
│   ├── ExplorePage.tsx      # Search / filter / sort gallery grid
│   ├── GalleryPage.tsx      # 3D viewer wrapper
│   ├── ArtistPage.tsx       # Artist profile with gallery grid
│   ├── LikedPage.tsx        # User's saved galleries
│   └── AboutPage.tsx        # Platform story + founder
├── hooks/
│   └── useLikes.ts          # localStorage-backed like state
├── utils/
│   └── artTextures.ts       # Procedural Canvas 2D texture generators
├── data/
│   └── galleries.ts         # Mock gallery + artist data (12 galleries)
└── types/
    └── index.ts             # TypeScript interfaces
```

---

## Design System

Dark cinematic aesthetic — deep blacks, purple gradients, warm gold frames, dramatic per-artwork spotlights.

| Role | Value |
|---|---|
| Background | `#050507` |
| Surface | `#12121a` |
| Purple glow | `#8b5cf6` |
| Purple bright | `#a78bfa` |
| Gold accent | `#d4a853` |
| Text primary | `#f0eef8` |
| Text muted | `#4a4460` |

**Typography:** Cormorant Garamond (display headings) + Space Mono (UI / body)

---

## Deployment

Connected to Vercel via GitHub — every push to `main` autodeploys.
```bash
vercel --prod
```

`vercel.json` includes a catch-all rewrite for client-side routing:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

## Roadmap

- [ ] Supabase auth (real sign up / sign in)
- [ ] Artist gallery builder with drag-and-drop artwork upload
- [ ] Multiplayer presence (avatars in shared gallery rooms)
- [ ] AI-generated gallery spaces from 2D artwork uploads
- [ ] Mobile touch controls for gallery navigation

---

*Built by [Ruby Choux Kim](https://linkedin.com/in/rubychoux) · Georgia Tech CS '25 (Intelligence & Media)*