import React from "react";

// Turn an arbitrary submitted-form value into something readable instead of a
// raw JSON blob. Used by the admin company / professional / event "Details"
// modals, which dump whatever the user submitted.

export const prettyLabel = (key: string): string =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bUrl\b/g, "URL")
    .replace(/\bId\b/g, "ID")
    .trim();

const isEmpty = (v: unknown) =>
  v === null ||
  v === undefined ||
  v === "" ||
  (Array.isArray(v) && v.length === 0) ||
  (typeof v === "object" && v !== null && Object.keys(v).length === 0);

const Dash = () => <span className="text-ink-caption italic">—</span>;

// An image URL — either an obvious image extension, or a URL from a host we
// only ever store images on (MinIO/CDN/Unsplash/YouTube thumbs). Rendered as
// a small preview instead of a long unreadable link.
const isImageUrl = (s: string): boolean =>
  /^https?:\/\//i.test(s) &&
  (/\.(jpe?g|png|webp|gif|svg|avif|bmp)(\?|#|$)/i.test(s) ||
    /(minio[-.]|\/dronetv-dev\/|\/dronetv-prod\/|res\.cloudinary\.com|images\.unsplash\.com|img\.youtube\.com|ytimg\.com|cdn\.prod\.website-files\.com)/i.test(s));

// The template forms wrap every media slot in a
// { mediaUrl, uploaded, uploading, mediaType, fileName } object. When the slot
// is empty that renders as a meaningless "Uploaded: No / Media Type: image /
// Uploading: No" blob - detect these and show only the media (or "No media").
const MEDIA_URL_KEYS = ["mediaUrl", "url", "imageUrl", "s3Url", "fileUrl", "src", "href", "link"];
const MEDIA_META_KEYS = [
  "uploaded", "uploading", "isUploading", "mediaType", "type",
  "fileName", "filename", "originalName", "name", "progress",
  "caption", "alt", "title", "size", "width", "height", "id",
];

const isMediaWrapper = (obj: Record<string, unknown>): boolean => {
  const keys = Object.keys(obj);
  if (keys.length === 0) return false;
  const hasMeta = keys.some((k) => MEDIA_META_KEYS.includes(k));
  const hasUrlKey = keys.some((k) => MEDIA_URL_KEYS.includes(k));
  if (!hasMeta && !hasUrlKey) return false;
  return keys.every((k) => MEDIA_URL_KEYS.includes(k) || MEDIA_META_KEYS.includes(k));
};

const mediaWrapperUrl = (obj: Record<string, unknown>): string | null => {
  for (const k of MEDIA_URL_KEYS) {
    const v = obj[k];
    if (typeof v === "string" && /^https?:\/\//i.test(v)) return v;
  }
  return null;
};

const NoMedia = () => <span className="text-ink-caption italic">No image</span>;

const MediaValue: React.FC<{ url: string | null }> = ({ url }) => {
  if (!url) return <NoMedia />;
  if (isImageUrl(url)) return <ImageThumb src={url} />;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-status-info hover:underline break-all text-xs">
      View file ↗
    </a>
  );
};

const ImageThumb: React.FC<{ src: string }> = ({ src }) => {
  const [broken, setBroken] = React.useState(false);
  if (broken) {
    return (
      <a href={src} target="_blank" rel="noopener noreferrer" className="text-status-info hover:underline break-all text-xs">
        View image ↗
      </a>
    );
  }
  return (
    <a href={src} target="_blank" rel="noopener noreferrer" className="inline-block">
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={() => setBroken(true)}
        className="max-h-24 max-w-[180px] rounded-lg border border-ink-light object-cover bg-ink-offwhite"
      />
    </a>
  );
};

export const PrettyValue: React.FC<{ value: unknown; depth?: number }> = ({
  value,
  depth = 0,
}) => {
  if (isEmpty(value)) return <Dash />;

  if (typeof value === "boolean")
    return <>{value ? "Yes" : "No"}</>;

  if (typeof value === "number") return <>{String(value)}</>;

  if (typeof value === "string") {
    if (isImageUrl(value)) return <ImageThumb src={value} />;
    if (/^https?:\/\//i.test(value)) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-status-info hover:underline break-all"
        >
          {value}
        </a>
      );
    }
    return <>{value}</>;
  }

  if (Array.isArray(value)) {
    // Simple list — join with commas.
    if (value.every((x) => x === null || typeof x !== "object")) {
      return <>{value.filter((x) => x !== null && x !== "").join(", ") || <Dash />}</>;
    }
    // Media gallery — array of media-slot wrappers. Show only the ones that
    // actually have a file, as a strip of thumbnails.
    if (value.every((x) => x && typeof x === "object" && isMediaWrapper(x as Record<string, unknown>))) {
      const urls = value
        .map((x) => mediaWrapperUrl(x as Record<string, unknown>))
        .filter((u): u is string => !!u);
      if (urls.length === 0) return <span className="text-ink-caption italic">No media uploaded</span>;
      return (
        <div className="flex flex-wrap gap-2">
          {urls.map((u, i) => <MediaValue key={i} url={u} />)}
        </div>
      );
    }
    // List of objects — stack them.
    return (
      <div className="flex flex-col gap-2">
        {value.map((item, i) => (
          <div
            key={i}
            className="pl-3 border-l-2 border-ink-light"
          >
            <PrettyValue value={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (isMediaWrapper(obj)) {
      return <MediaValue url={mediaWrapperUrl(obj)} />;
    }
    return (
      <div className={depth > 0 ? "flex flex-col gap-1" : "flex flex-col gap-1.5"}>
        {Object.entries(obj)
          .filter(([, v]) => !isEmpty(v))
          .map(([k, v]) => (
            <div key={k} className="text-sm">
              <span className="text-ink-caption">{prettyLabel(k)}: </span>
              <span className="text-ink break-words">
                <PrettyValue value={v} depth={depth + 1} />
              </span>
            </div>
          ))}
      </div>
    );
  }

  return <>{String(value)}</>;
};
