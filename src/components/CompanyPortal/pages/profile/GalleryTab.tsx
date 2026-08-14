import { useRef, useState } from "react";
import { Card, Btn, EmptyState } from "../../ui";
import { uploadCompanyFile } from "../../api";
import type { TabProps } from "./CompanyProfilePage";

export default function GalleryTab({ publishedId, profile, save }: TabProps) {
  const [images, setImages] = useState<string[]>(profile.gallery || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const persist = async (next: string[]) => {
    setImages(next);
    await save("gallery", next);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadCompanyFile(publishedId, "gallery", file);
        uploaded.push(url);
      }
      await persist([...images, ...uploaded]);
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (i: number) => persist(images.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-ink-caption flex-1">Showcase your fleet, projects, and team through photos</div>
        <Btn onClick={() => inputRef.current?.click()}>{uploading ? "Uploading..." : "+ Upload Photos"}</Btn>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={e => handleFiles(e.target.files)} />
      </div>
      {error && <div className="text-xs text-status-error mb-4">{error}</div>}

      {images.length === 0 ? <EmptyState text="No photos uploaded yet" /> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, i) => (
            <Card key={i} className="overflow-hidden group relative">
              <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-32 object-cover" />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
