import * as THREE from 'three';

const cache = new Map<string, THREE.Texture>();

function make(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 640;
  return [c, c.getContext('2d')!];
}

const generators: Record<string, () => THREE.Texture> = {
  'abstract-purple': () => {
    const [c, ctx] = make();
    const W = c.width, H = c.height;
    ctx.fillStyle = '#0f0520';
    ctx.fillRect(0, 0, W, H);
    const glows: [number, number, string][] = [
      [W * 0.3, H * 0.35, '#6b21a8'],
      [W * 0.72, H * 0.6, '#7c3aed'],
      [W * 0.5, H * 0.15, '#4c1d95'],
    ];
    glows.forEach(([x, y, col]) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, W * 0.55);
      g.addColorStop(0, col + 'bb');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });
    ctx.strokeStyle = 'rgba(196,176,240,0.25)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 10; i++) {
      const t = i / 10;
      ctx.beginPath();
      ctx.moveTo(t * W, H * 0.5 + Math.sin(i) * H * 0.3);
      ctx.bezierCurveTo(
        (t + 0.05) * W, H * 0.2,
        (t + 0.08) * W, H * 0.8,
        (t + 0.1) * W, H * 0.5,
      );
      ctx.stroke();
    }
    return new THREE.CanvasTexture(c);
  },

  'abstract-blue': () => {
    const [c, ctx] = make();
    const W = c.width, H = c.height;
    ctx.fillStyle = '#020b1a';
    ctx.fillRect(0, 0, W, H);
    const glows: [number, number, string][] = [
      [W * 0.5, H * 0.5, '#2563eb'],
      [W * 0.2, H * 0.3, '#0ea5e9'],
      [W * 0.8, H * 0.7, '#1d4ed8'],
    ];
    glows.forEach(([x, y, col]) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, W * 0.5);
      g.addColorStop(0, col + 'aa');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });
    ctx.strokeStyle = 'rgba(147,197,253,0.2)';
    ctx.lineWidth = 1;
    for (let j = 0; j < 12; j++) {
      const y0 = (j / 12) * H;
      ctx.beginPath();
      ctx.moveTo(0, y0);
      for (let x = 0; x <= W; x += 4) {
        ctx.lineTo(x, y0 + Math.sin(x * 0.02 + j) * 20);
      }
      ctx.stroke();
    }
    return new THREE.CanvasTexture(c);
  },

  'abstract-indigo': () => {
    const [c, ctx] = make();
    const W = c.width, H = c.height;
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, W, H);
    const tris: [number, number][][] = [
      [[0, H * 0.9], [W * 0.6, 0], [W, H * 0.4]],
      [[W * 0.2, 0], [W, H * 0.3], [W * 0.5, H]],
      [[0, H * 0.5], [W * 0.8, H], [W * 0.4, 0]],
    ];
    const tColors = ['rgba(99,102,241,0.3)', 'rgba(67,56,202,0.25)', 'rgba(79,70,229,0.2)'];
    tris.forEach((tri, i) => {
      ctx.beginPath();
      ctx.moveTo(tri[0][0], tri[0][1]);
      tri.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.closePath();
      ctx.fillStyle = tColors[i];
      ctx.fill();
    });
    const g = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.4);
    g.addColorStop(0, 'rgba(129,140,248,0.15)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    return new THREE.CanvasTexture(c);
  },

  'brutalist-blue': () => {
    const [c, ctx] = make();
    const W = c.width, H = c.height;
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(37,99,235,0.3)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 32) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 32) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    const blocks: [number, number, number, number][] = [
      [64, 80, 192, 256], [288, 48, 160, 192], [96, 384, 128, 192],
      [320, 300, 128, 256], [0, 200, 80, 160],
    ];
    blocks.forEach(([x, y, w, h]) => {
      ctx.fillStyle = 'rgba(30,58,95,0.6)';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = 'rgba(37,99,235,0.5)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, w, h);
    });
    const g = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, W * 0.45);
    g.addColorStop(0, 'rgba(37,99,235,0.2)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    return new THREE.CanvasTexture(c);
  },

  'geometric-dark': () => {
    const [c, ctx] = make();
    const W = c.width, H = c.height;
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, W, H);
    const circles: [number, number, number][] = [
      [W * 0.3, H * 0.3, 160], [W * 0.65, H * 0.55, 200], [W * 0.45, H * 0.75, 140],
    ];
    circles.forEach(([x, y, r]) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(91,63,160,0.15)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });
    ctx.strokeStyle = 'rgba(100,80,160,0.2)';
    ctx.lineWidth = 1;
    const triPts: [number, number, number, number, number, number][] = [
      [W * 0.2, H * 0.1, W * 0.8, H * 0.1, W * 0.5, H * 0.6],
      [W * 0.1, H * 0.9, W * 0.9, H * 0.9, W * 0.5, H * 0.3],
    ];
    triPts.forEach(([x1, y1, x2, y2, x3, y3]) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3);
      ctx.closePath(); ctx.stroke();
    });
    return new THREE.CanvasTexture(c);
  },

  'mythology-red': () => {
    const [c, ctx] = make();
    const W = c.width, H = c.height;
    ctx.fillStyle = '#1c0010';
    ctx.fillRect(0, 0, W, H);
    const glows: [number, number, string][] = [
      [W * 0.4, H * 0.35, '#dc2626'],
      [W * 0.6, H * 0.65, '#991b1b'],
      [W * 0.25, H * 0.7, '#7f1d1d'],
    ];
    glows.forEach(([x, y, col]) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, W * 0.45);
      g.addColorStop(0, col + '99');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });
    ctx.strokeStyle = 'rgba(220,38,38,0.3)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      const y0 = H * (0.2 + i * 0.15);
      ctx.beginPath();
      ctx.moveTo(0, y0);
      ctx.quadraticCurveTo(W * 0.5, y0 - H * 0.1, W, y0 + H * 0.05);
      ctx.stroke();
    }
    return new THREE.CanvasTexture(c);
  },

  'mythology-dark': () => {
    const [c, ctx] = make();
    const W = c.width, H = c.height;
    ctx.fillStyle = '#180c00';
    ctx.fillRect(0, 0, W, H);
    const g1 = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, W * 0.5);
    g1.addColorStop(0, 'rgba(146,64,14,0.4)');
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(30,10,0,0.7)';
    ctx.beginPath();
    ctx.ellipse(W * 0.5, H * 0.48, W * 0.18, H * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(180,100,20,0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(W * 0.5 + Math.cos(angle) * 40, H * 0.48 + Math.sin(angle) * 50);
      ctx.lineTo(W * 0.5 + Math.cos(angle) * W * 0.4, H * 0.48 + Math.sin(angle) * H * 0.4);
      ctx.stroke();
    }
    return new THREE.CanvasTexture(c);
  },

  'ai-portrait': () => {
    const [c, ctx] = make();
    const W = c.width, H = c.height;
    ctx.fillStyle = '#120822';
    ctx.fillRect(0, 0, W, H);
    const g = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, W * 0.38);
    g.addColorStop(0, 'rgba(124,58,237,0.5)');
    g.addColorStop(0.5, 'rgba(219,39,119,0.2)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // Pixel noise patches suggesting latent space
    const noiseColors = ['rgba(124,58,237,0.08)', 'rgba(219,39,119,0.06)', 'rgba(99,102,241,0.07)'];
    for (let i = 0; i < 240; i++) {
      const px = Math.floor((Math.sin(i * 7.3) * 0.5 + 0.5) * (W / 8)) * 8;
      const py = Math.floor((Math.cos(i * 5.1) * 0.5 + 0.5) * (H / 8)) * 8;
      ctx.fillStyle = noiseColors[i % noiseColors.length];
      ctx.fillRect(px, py, 7, 7);
    }
    ctx.strokeStyle = 'rgba(196,136,255,0.08)';
    ctx.lineWidth = 1;
    for (let y = 0; y < H; y += 4) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    return new THREE.CanvasTexture(c);
  },

  'glitch-art': () => {
    const [c, ctx] = make();
    const W = c.width, H = c.height;
    ctx.fillStyle = '#08080f';
    ctx.fillRect(0, 0, W, H);
    const sliceColors = [
      '#7c3aed55', '#2563eb55', '#dc262655', '#05996955',
      '#d9770655', '#be185d55', '#0891b255', '#4338ca55',
    ];
    // Draw horizontal slices with deterministic offsets
    let y = 0;
    let si = 0;
    while (y < H) {
      const sliceH = 8 + (si * 17 % 48);
      const offset = ((si * 23 % 60) - 30);
      ctx.fillStyle = sliceColors[si % sliceColors.length];
      ctx.fillRect(offset, y, W, Math.min(sliceH, H - y));
      y += sliceH + 2;
      si++;
    }
    // Occasional bright slice
    for (let i = 0; i < 6; i++) {
      const by = (i * H / 6) + (i * 31 % 30);
      ctx.fillStyle = sliceColors[i % sliceColors.length].replace('55', 'cc');
      ctx.fillRect(0, by, W, 2);
    }
    // Grid overlay
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 16) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let gy = 0; gy < H; gy += 16) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }
    return new THREE.CanvasTexture(c);
  },

  'data-viz': () => {
    const [c, ctx] = make();
    const W = c.width, H = c.height;
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, W, H);
    // Deterministic node positions using sine/cosine
    const nodes = Array.from({ length: 22 }, (_, i) => ({
      x: W * (0.1 + 0.8 * (Math.sin(i * 2.4) * 0.5 + 0.5)),
      y: H * (0.1 + 0.8 * (Math.cos(i * 1.7) * 0.5 + 0.5)),
      r: 3 + (i % 5),
    }));
    // Edges
    ctx.strokeStyle = 'rgba(99,102,241,0.2)';
    ctx.lineWidth = 0.8;
    nodes.forEach((n, i) => {
      nodes.slice(i + 1, i + 4).forEach(m => {
        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
      });
    });
    // Nodes with glow
    nodes.forEach(n => {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
      g.addColorStop(0, 'rgba(129,140,248,0.6)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(n.x - n.r * 4, n.y - n.r * 4, n.r * 8, n.r * 8);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = '#818cf8';
      ctx.fill();
    });
    return new THREE.CanvasTexture(c);
  },

  'textile-green': () => {
    const [c, ctx] = make();
    const W = c.width, H = c.height;
    ctx.fillStyle = '#052e16';
    ctx.fillRect(0, 0, W, H);
    const stripeColors = ['#16a34a99', '#15803d99', '#16653499', '#4ade8066', '#86efac44'];
    const sw = 16;
    // Diagonal stripes in one direction
    for (let i = -H; i < W + H; i += sw * 2) {
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = stripeColors[Math.abs(Math.floor(i / (sw * 2))) % stripeColors.length];
      ctx.fillRect(i - W, -H, sw, H * 3);
      ctx.restore();
    }
    // Diagonal stripes in other direction (weave)
    for (let i = -H; i < W + H; i += sw * 2) {
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(-Math.PI / 4);
      ctx.fillStyle = stripeColors[(Math.abs(Math.floor(i / (sw * 2))) + 2) % stripeColors.length];
      ctx.fillRect(i - W, -H, sw, H * 3);
      ctx.restore();
    }
    // Center glow
    const g = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.4);
    g.addColorStop(0, 'rgba(74,222,128,0.1)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    return new THREE.CanvasTexture(c);
  },

  'night-city': () => {
    const [c, ctx] = make();
    const W = c.width, H = c.height;
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#020614');
    sky.addColorStop(1, '#0a1628');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);
    // Subtle moon glow
    const moonG = ctx.createRadialGradient(W * 0.75, H * 0.12, 0, W * 0.75, H * 0.12, 70);
    moonG.addColorStop(0, 'rgba(200,210,255,0.35)');
    moonG.addColorStop(1, 'transparent');
    ctx.fillStyle = moonG;
    ctx.fillRect(0, 0, W, H);
    // Building silhouettes
    const buildings: [number, number, number, number][] = [
      [0, H * 0.48, 75, H * 0.52],
      [65, H * 0.35, 65, H * 0.65],
      [120, H * 0.5, 85, H * 0.5],
      [195, H * 0.28, 75, H * 0.72],
      [258, H * 0.42, 55, H * 0.58],
      [302, H * 0.22, 105, H * 0.78],
      [394, H * 0.38, 62, H * 0.62],
      [444, H * 0.46, 70, H * 0.54],
    ];
    buildings.forEach(([bx, by, bw, bh]) => {
      ctx.fillStyle = '#050918';
      ctx.fillRect(bx, by, bw, bh);
      // Windows with deterministic seeding
      for (let wy = by + 10; wy < H - 10; wy += 15) {
        for (let wx = bx + 6; wx < bx + bw - 6; wx += 13) {
          const seed = (wx * 31 + wy * 17) % 100;
          if (seed > 40) {
            const r = 200 + (seed % 35);
            const g2 = 150 + (seed % 55);
            const b = 60 + (seed % 45);
            ctx.fillStyle = `rgba(${r},${g2},${b},${0.5 + (seed % 40) / 100})`;
            ctx.fillRect(wx, wy, 7, 8);
          }
        }
      }
    });
    return new THREE.CanvasTexture(c);
  },

  'golden-light': () => {
    const [c, ctx] = make();
    const W = c.width, H = c.height;
    ctx.fillStyle = '#1a0800';
    ctx.fillRect(0, 0, W, H);
    const core = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.52);
    core.addColorStop(0, 'rgba(253,224,71,0.9)');
    core.addColorStop(0.12, 'rgba(251,191,36,0.6)');
    core.addColorStop(0.35, 'rgba(217,119,6,0.3)');
    core.addColorStop(1, 'transparent');
    ctx.fillStyle = core;
    ctx.fillRect(0, 0, W, H);
    // Sunburst rays
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      ctx.strokeStyle = `rgba(253,224,71,${i % 3 === 0 ? 0.2 : 0.1})`;
      ctx.lineWidth = i % 3 === 0 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(W * 0.5 + Math.cos(angle) * 28, H * 0.5 + Math.sin(angle) * 28);
      ctx.lineTo(W * 0.5 + Math.cos(angle) * W * 0.75, H * 0.5 + Math.sin(angle) * H * 0.75);
      ctx.stroke();
    }
    // Warm outer glow
    const outer = ctx.createRadialGradient(W * 0.5, H * 0.5, W * 0.3, W * 0.5, H * 0.5, W * 0.7);
    outer.addColorStop(0, 'transparent');
    outer.addColorStop(1, 'rgba(146,64,14,0.3)');
    ctx.fillStyle = outer;
    ctx.fillRect(0, 0, W, H);
    return new THREE.CanvasTexture(c);
  },
};

export function getArtTexture(imageUrl: string): THREE.Texture {
  if (!cache.has(imageUrl)) {
    const gen = generators[imageUrl];
    if (gen) {
      cache.set(imageUrl, gen());
    } else {
      const [c, ctx] = make();
      ctx.fillStyle = '#2d1f4e';
      ctx.fillRect(0, 0, c.width, c.height);
      cache.set(imageUrl, new THREE.CanvasTexture(c));
    }
  }
  return cache.get(imageUrl)!;
}
