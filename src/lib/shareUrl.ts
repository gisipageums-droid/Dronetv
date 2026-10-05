// Readable link for a shared gallery photo: the photo's name plus the first 8 characters of its id
// (which keeps two photos with the same title apart), e.g.
// /gp/drone-expo-2026-networking-session-5ded65a6
export function gallerySharePath(id: string, title: string): string {
  const slug = (title || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  ;
  // keep it short: cut at the last whole word within 50 characters
  const trimmed = slug.length > 50 ? slug.slice(0, 50).replace(/-[^-]*$/, '') : slug;
  const short = id.replace(/-/g, '').slice(0, 8);
  return `/gp/${trimmed ? `${trimmed}-` : ''}${short}`;
}
