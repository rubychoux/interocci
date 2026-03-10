import { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { GalleryStyle } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ArtworkDraft {
  id: string;
  imageFile: File | null;
  imagePreview: string;
  imageUrl: string; // uploaded URL
  title: string;
  medium: string;
  year: string;
  description: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STYLES: GalleryStyle[] = ['abstract', 'minimalist', 'digital', 'immersive', 'surreal', 'classical'];

function newArtwork(): ArtworkDraft {
  return { id: crypto.randomUUID(), imageFile: null, imagePreview: '', imageUrl: '', title: '', medium: '', year: '', description: '' };
}

// ─── Step indicator ──────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  const steps = ['Gallery Info', 'Artworks', 'Review'];
  return (
    <div className="flex items-center gap-3 mb-10">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = step === n;
        const done = step > n;
        return (
          <div key={label} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: active ? 'var(--purple-bright)' : done ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.1)',
                  color: active ? '#000' : done ? 'var(--purple-bright)' : 'var(--text-muted)',
                  border: `1px solid ${active || done ? 'var(--purple-bright)' : 'rgba(139,92,246,0.2)'}`,
                }}
              >
                {done ? '✓' : n}
              </div>
              <span
                className="text-xs tracking-widest hidden sm:block"
                style={{ color: active ? 'var(--purple-bright)' : done ? 'var(--text-secondary)' : 'var(--text-muted)' }}
              >
                {label.toUpperCase()}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-8 h-px" style={{ background: 'rgba(139,92,246,0.2)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Image drop zone ─────────────────────────────────────────────────────────

function ImageDropZone({
  preview,
  onFile,
  compact = false,
}: {
  preview: string;
  onFile: (file: File) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handle = useCallback((file: File) => {
    if (!file.type.match(/image\/(jpeg|png|webp)/)) return;
    onFile(file);
  }, [onFile]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handle(file);
  };

  if (preview) {
    return (
      <div
        className="relative rounded-sm overflow-hidden cursor-pointer group"
        style={{ height: compact ? '120px' : '180px' }}
        onClick={() => inputRef.current?.click()}
      >
        <img src={preview} alt="" className="w-full h-full object-cover" />
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(5,5,7,0.7)' }}
        >
          <span className="text-xs tracking-widest" style={{ color: 'var(--purple-bright)' }}>CHANGE IMAGE</span>
        </div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); }} />
      </div>
    );
  }

  return (
    <div
      className="rounded-sm flex flex-col items-center justify-center cursor-pointer transition-all duration-200"
      style={{
        height: compact ? '120px' : '180px',
        border: `2px dashed ${dragging ? 'var(--purple-bright)' : 'rgba(139,92,246,0.25)'}`,
        background: dragging ? 'rgba(139,92,246,0.07)' : 'transparent',
      }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <div className="font-display text-2xl mb-2" style={{ color: 'var(--text-muted)' }}>+</div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Drop image or click to browse</p>
      <p className="text-xs mt-1" style={{ color: 'rgba(139,92,246,0.4)' }}>JPG · PNG · WEBP</p>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); }} />
    </div>
  );
}

// ─── Step 1 ──────────────────────────────────────────────────────────────────

interface Step1Data {
  title: string;
  description: string;
  style: GalleryStyle | '';
  tags: string[];
  coverFile: File | null;
  coverPreview: string;
}

function Step1({
  data,
  onChange,
  onNext,
}: {
  data: Step1Data;
  onChange: (d: Step1Data) => void;
  onNext: () => void;
}) {
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !data.tags.includes(t) && data.tags.length < 8) {
      onChange({ ...data, tags: [...data.tags, t] });
    }
    setTagInput('');
  };

  const canNext = data.title.trim().length > 0 && data.style !== '';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-xs tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          GALLERY TITLE <span style={{ color: 'var(--purple-bright)' }}>*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Chromatic Reverie"
          className="w-full px-4 py-2.5 rounded-sm"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          maxLength={80}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          DESCRIPTION
        </label>
        <textarea
          placeholder="What is this gallery about?"
          className="w-full px-4 py-2.5 rounded-sm resize-none"
          rows={3}
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value.slice(0, 300) })}
        />
        <p className="text-xs mt-1 text-right" style={{ color: data.description.length >= 280 ? 'var(--purple-bright)' : 'var(--text-muted)' }}>
          {data.description.length} / 300
        </p>
      </div>

      {/* Style */}
      <div>
        <label className="block text-xs tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
          STYLE <span style={{ color: 'var(--purple-bright)' }}>*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {STYLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ ...data, style: s })}
              className="py-2 px-3 rounded-sm text-xs tracking-widest transition-all duration-150"
              style={{
                background: data.style === s ? 'rgba(91,63,160,0.4)' : 'transparent',
                border: `1px solid ${data.style === s ? 'rgba(139,92,246,0.6)' : 'rgba(139,92,246,0.15)'}`,
                color: data.style === s ? 'var(--purple-bright)' : 'var(--text-muted)',
              }}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          TAGS
        </label>
        <div className="flex gap-2 flex-wrap mb-2">
          {data.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs"
              style={{ background: 'rgba(91,63,160,0.2)', border: '1px solid rgba(139,92,246,0.3)', color: 'var(--purple-bright)' }}
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange({ ...data, tags: data.tags.filter((t) => t !== tag) })}
                style={{ color: 'var(--text-muted)', lineHeight: 1 }}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a tag…"
            className="flex-1 px-4 py-2 rounded-sm text-xs"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          />
          <button type="button" className="btn-ghost text-xs px-3 py-2 rounded-sm" onClick={addTag}>
            ADD
          </button>
        </div>
      </div>

      {/* Cover image */}
      <div>
        <label className="block text-xs tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          COVER IMAGE
        </label>
        <ImageDropZone
          preview={data.coverPreview}
          onFile={(f) => onChange({ ...data, coverFile: f, coverPreview: URL.createObjectURL(f) })}
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          className="btn-primary text-xs px-8 py-3 rounded-sm"
          disabled={!canNext}
          onClick={onNext}
          style={{ opacity: canNext ? 1 : 0.4 }}
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}

// ─── Step 2 ──────────────────────────────────────────────────────────────────

function ArtworkCard({
  artwork,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  artwork: ArtworkDraft;
  index: number;
  onChange: (a: ArtworkDraft) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div
      className="rounded-sm p-4 space-y-3"
      style={{ background: 'rgba(18,18,26,0.6)', border: '1px solid rgba(139,92,246,0.12)' }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>
          ARTWORK {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            className="btn-ghost text-xs px-2 py-1 rounded-sm"
            style={{ color: 'var(--text-muted)' }}
            onClick={onRemove}
          >
            ✕ REMOVE
          </button>
        )}
      </div>

      <ImageDropZone
        compact
        preview={artwork.imagePreview}
        onFile={(f) => onChange({ ...artwork, imageFile: f, imagePreview: URL.createObjectURL(f) })}
      />

      <input
        type="text"
        placeholder="Title *"
        className="w-full px-4 py-2 rounded-sm text-xs"
        value={artwork.title}
        onChange={(e) => onChange({ ...artwork, title: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Medium (e.g. Oil on Canvas)"
          className="w-full px-4 py-2 rounded-sm text-xs"
          value={artwork.medium}
          onChange={(e) => onChange({ ...artwork, medium: e.target.value })}
        />
        <input
          type="number"
          placeholder="Year"
          className="w-full px-4 py-2 rounded-sm text-xs"
          value={artwork.year}
          onChange={(e) => onChange({ ...artwork, year: e.target.value })}
          min={1800}
          max={new Date().getFullYear()}
        />
      </div>
      <textarea
        placeholder="Description"
        className="w-full px-4 py-2 rounded-sm text-xs resize-none"
        rows={2}
        value={artwork.description}
        onChange={(e) => onChange({ ...artwork, description: e.target.value })}
      />
    </div>
  );
}

function Step2({
  artworks,
  onChange,
  onBack,
  onNext,
}: {
  artworks: ArtworkDraft[];
  onChange: (a: ArtworkDraft[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const canNext = artworks.some((a) => a.title.trim() && a.imagePreview);

  return (
    <div className="space-y-4">
      {artworks.map((aw, i) => (
        <ArtworkCard
          key={aw.id}
          artwork={aw}
          index={i}
          onChange={(updated) => onChange(artworks.map((a) => (a.id === updated.id ? updated : a)))}
          onRemove={() => onChange(artworks.filter((a) => a.id !== aw.id))}
          canRemove={artworks.length > 1}
        />
      ))}

      {artworks.length < 6 && (
        <button
          type="button"
          className="btn-ghost w-full py-3 text-xs rounded-sm"
          onClick={() => onChange([...artworks, newArtwork()])}
        >
          ADD ARTWORK +
        </button>
      )}

      <div className="flex justify-between pt-2">
        <button type="button" className="btn-ghost text-xs px-6 py-3 rounded-sm" onClick={onBack}>
          ← BACK
        </button>
        <button
          type="button"
          className="btn-primary text-xs px-8 py-3 rounded-sm"
          disabled={!canNext}
          onClick={onNext}
          style={{ opacity: canNext ? 1 : 0.4 }}
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}

// ─── Step 3 ──────────────────────────────────────────────────────────────────

function Step3({
  step1,
  artworks,
  onBack,
  onPublish,
  publishing,
  publishError,
}: {
  step1: Step1Data;
  artworks: ArtworkDraft[];
  onBack: () => void;
  onPublish: () => void;
  publishing: boolean;
  publishError: string;
}) {
  const validArtworks = artworks.filter((a) => a.title.trim() && a.imagePreview);

  return (
    <div className="space-y-6">
      {/* Preview card */}
      <div
        className="rounded-sm overflow-hidden"
        style={{ border: '1px solid rgba(139,92,246,0.2)', background: 'rgba(18,18,26,0.6)' }}
      >
        {step1.coverPreview ? (
          <div className="h-40 overflow-hidden">
            <img src={step1.coverPreview} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center" style={{ background: 'rgba(91,63,160,0.07)' }}>
            <span className="font-display text-4xl" style={{ color: 'rgba(139,92,246,0.3)' }}>◈</span>
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="tag"
              style={{ background: 'rgba(91,63,160,0.3)', border: '1px solid rgba(139,92,246,0.4)', color: 'var(--purple-bright)' }}
            >
              {step1.style.toUpperCase()}
            </span>
            {step1.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          <h3 className="font-display text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>
            {step1.title}
          </h3>
          {step1.description && (
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
              {step1.description}
            </p>
          )}
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {validArtworks.length} artwork{validArtworks.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {publishError && (
        <p className="text-xs" style={{ color: '#f87171' }}>{publishError}</p>
      )}

      <div className="flex justify-between">
        <button type="button" className="btn-ghost text-xs px-6 py-3 rounded-sm" onClick={onBack} disabled={publishing}>
          ← BACK
        </button>
        <button
          type="button"
          className="btn-primary text-xs px-8 py-3 rounded-sm"
          onClick={onPublish}
          disabled={publishing}
        >
          {publishing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              PUBLISHING...
            </span>
          ) : 'PUBLISH GALLERY'}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CreateGalleryPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [step, setStep] = useState(1);
  const [step1, setStep1] = useState<Step1Data>({
    title: '',
    description: '',
    style: '',
    tags: [],
    coverFile: null,
    coverPreview: '',
  });
  const [artworks, setArtworks] = useState<ArtworkDraft[]>([newArtwork()]);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');

  // Wait for auth to resolve before redirecting
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-void)' }}>
        <div className="font-display text-4xl animate-float" style={{ color: 'var(--purple-bright)' }}>◎</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6" style={{ background: 'var(--bg-void)' }}>
        <div className="font-display text-5xl" style={{ color: 'var(--text-muted)' }}>◈</div>
        <h2 className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>
          Sign in to create a gallery
        </h2>
        <p className="text-sm text-center" style={{ color: 'var(--text-muted)', maxWidth: '320px' }}>
          You need an account to publish your work on InterOcci.
        </p>
        <div className="flex items-center gap-3">
          <Link to="/" className="btn-ghost text-xs px-6 py-3 rounded-sm">
            ← HOME
          </Link>
          <Link to="/?signin=1" className="btn-primary text-xs px-6 py-3 rounded-sm">
            SIGN IN
          </Link>
        </div>
      </div>
    );
  }

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const { error } = await supabase.storage.from('artworks').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('artworks').getPublicUrl(path);
    return data.publicUrl;
  };

  const handlePublish = async () => {
    setPublishing(true);
    setPublishError('');

    try {
      const ts = Date.now();

      // Upload cover image
      let coverUrl: string | null = null;
      if (step1.coverFile) {
        coverUrl = await uploadFile(step1.coverFile, `covers/${user.id}/${ts}-${step1.coverFile.name}`);
      }

      // Insert gallery row
      const { data: galleryData, error: galleryErr } = await supabase
        .from('galleries')
        .insert({
          artist_id: user.id,
          title: step1.title.trim(),
          description: step1.description.trim() || null,
          style: step1.style,
          tags: step1.tags,
          cover_image: coverUrl,
          featured: false,
          views: 0,
          likes: 0,
        })
        .select('id')
        .single();

      if (galleryErr) throw galleryErr;
      const galleryId = galleryData.id as string;

      // Upload artwork images and insert rows
      const validArtworks = artworks.filter((a) => a.title.trim() && a.imagePreview);
      for (let i = 0; i < validArtworks.length; i++) {
        const aw = validArtworks[i];
        let imageUrl = aw.imageUrl;
        if (aw.imageFile) {
          imageUrl = await uploadFile(aw.imageFile, `artworks/${user.id}/${galleryId}/${ts}-${i}-${aw.imageFile.name}`);
        }
        const { error: awErr } = await supabase.from('artworks').insert({
          gallery_id: galleryId,
          artist_id: user.id,
          title: aw.title.trim(),
          medium: aw.medium.trim() || null,
          year: aw.year ? parseInt(aw.year) : null,
          description: aw.description.trim() || null,
          image_url: imageUrl || null,
          display_order: i,
        });
        if (awErr) throw awErr;
      }

      navigate(`/gallery/${galleryId}`);
    } catch (err: unknown) {
      setPublishError(err instanceof Error ? err.message : 'Failed to publish gallery. Please try again.');
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 grid-lines" style={{ background: 'var(--bg-void)' }}>
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="py-12">
          <p className="text-xs tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            NEW GALLERY
          </p>
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text-primary)' }}>
            Create Your Gallery
          </h1>
        </div>

        <StepIndicator step={step} />

        <div
          className="rounded-sm p-6 sm:p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(18,18,26,0.98), rgba(10,10,16,0.98))',
            border: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          {step === 1 && (
            <Step1 data={step1} onChange={setStep1} onNext={() => setStep(2)} />
          )}
          {step === 2 && (
            <Step2
              artworks={artworks}
              onChange={setArtworks}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <Step3
              step1={step1}
              artworks={artworks}
              onBack={() => setStep(2)}
              onPublish={handlePublish}
              publishing={publishing}
              publishError={publishError}
            />
          )}
        </div>
      </div>
    </div>
  );
}
