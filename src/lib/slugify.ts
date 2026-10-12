// Mirrors the backend's crud.slugify() (services/company/app/crud.py) -
// lowercase, non-alphanumeric runs collapsed to a single hyphen, trimmed.
// A raw company/service name used directly as a route param isn't
// URL-safe (spaces, slashes, punctuation) and breaks routing/readability.
export function slugify(name: string): string {
  const s = (name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "company";
}
