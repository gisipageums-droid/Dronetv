// The website's partner logos live as static files in /images/partners. One list
// feeds both the "Our Partners" section and the gallery event picker, so a new
// partner added here shows up in both without uploading the image again.
export const PARTNER_LOGO_SLUGS = [
  "telangana-govt", "andhra-govt", "odisha-govt", "jharkhand-govt", "telangana-police", "ap-police",
  "construction-skill-dev", "ncc-urban", "pioneer", "corteva", "apgenco", "siri-sampada",
  "aparna", "vensa", "ctrls", "vensa-breeze", "dsr-sr", "vpr",
  "vasavi", "rajapushpa", "vamsiram", "ameya", "my-home-avatar", "sunyuga",
  "aarvi", "aspire-spaces", "eesha", "pristine-properties", "margana", "botanika",
];

export const partnerLogoPath = (slug: string) => `/images/partners/${slug}.png`;

export const partnerName = (slug: string) =>
  slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export const partnerSlugFromPath = (path: string): string | null => {
  const m = path.match(/^\/images\/partners\/([a-z0-9-]+)\.png$/);
  return m ? m[1] : null;
};
