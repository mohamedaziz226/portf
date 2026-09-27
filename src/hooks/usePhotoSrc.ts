import { useCallback, useState } from "react";

/**
 * Photo that may exist in `public/` under several extensions.
 *
 * `photos` (see `profile.photos`) is walked in order: the first entry is used and
 * every failed load advances to the next one. `src` becomes `undefined` once all
 * candidates failed, which lets the caller render a graceful fallback (initials,
 * icon, …) instead of a broken image.
 */
export function usePhotoSrc(photos: readonly string[]) {
  const [index, setIndex] = useState(0);

  // Clamped: once the last candidate failed, `src` is undefined and no <img> is
  // rendered anymore, so no further error can fire.
  const onError = useCallback(
    () => setIndex((current) => Math.min(current + 1, photos.length)),
    [photos.length],
  );

  const src: string | undefined = photos[index];

  return { src, onError };
}
