export const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\/+/, '')}`;

/** Full-quality clip (big players). */
export const media = (p: string) => asset(`media/${p}`);
/** Poster frame written next to every clip by scripts/encode.sh. */
export const posterOf = (p: string) => media(p.replace(/\.(mp4|webm|mov)$/i, '.jpg'));
/** Lightweight 480p rendition for grid tiles. */
export const smallOf = (p: string) => media(p.replace(/\.mp4$/i, '.sm.mp4'));

export const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
export const pad2 = (n: number) => String(n).padStart(2, '0');
