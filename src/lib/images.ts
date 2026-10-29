const LEGACY_ASSET_PREFIX = '/src/assets/images/';

export function resolveImageUrl(url?: string | null): string {
  if (!url) return '/images/hero_aircraft_clouds_1793267885903.jpg';
  return url.startsWith(LEGACY_ASSET_PREFIX)
    ? `/images/${url.slice(LEGACY_ASSET_PREFIX.length)}`
    : url;
}
