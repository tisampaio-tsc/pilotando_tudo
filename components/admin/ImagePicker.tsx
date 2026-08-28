"use client";

import { useRef, useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

interface ImagePickerProps {
  label: string;
  value: string;
  mediaFiles: { key: string; url: string }[];
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string>;
}

export default function ImagePicker({
  label,
  value,
  mediaFiles,
  onChange,
  onUpload,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.[0]) return;
    setUploading(true);
    try {
      const url = await onUpload(files[0]);
      onChange(url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <p className="block text-sm font-medium text-white/80 mb-1.5">{label}</p>

      {value && (
        <div className="relative w-full h-32 rounded-xl overflow-hidden bg-white/5 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <Field
        label="URL da imagem"
        value={value}
        onChange={onChange}
        hint="Cole a URL ou escolha da galeria"
      />

      <div className="flex gap-2 mt-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex-1 py-2.5 bg-white/10 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Upload size={16} />
          {uploading ? "Enviando..." : "Enviar foto"}
        </button>
        <button
          type="button"
          onClick={() => setShowGallery(!showGallery)}
          className="flex-1 py-2.5 bg-white/10 rounded-lg text-sm flex items-center justify-center gap-2"
        >
          <ImageIcon size={16} />
          Galeria
        </button>
      </div>

      {showGallery && mediaFiles.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {mediaFiles.map((file) => (
            <button
              key={file.key}
              type="button"
              onClick={() => {
                onChange(file.url);
                setShowGallery(false);
              }}
              className={`aspect-square rounded-lg overflow-hidden border-2 ${
                value === file.url ? "border-gold" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={file.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div className="mt-2">
      <label className="block text-xs text-white/60 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white min-h-[40px]"
      />
      {hint && <p className="text-white/40 text-xs mt-1">{hint}</p>}
    </div>
  );
}
