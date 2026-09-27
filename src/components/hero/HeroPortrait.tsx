import { profile } from "@/data";
import { usePhotoSrc } from "@/hooks";

/**
 * Portrait shown in the Hero — a plain, static image (no animation), replacing the
 * animated "AI Core" node graph.
 *
 * `usePhotoSrc(profile.photos)` walks the accepted extensions in order
 * (`profile.png` → `.jpg` → `.webp` → `.jpeg`), so dropping one file in `public/` is
 * enough. While none of them exists the card falls back to `profile.initials`.
 * `profile.photoPosition` sets the crop (`object-position`) inside the 4:5 frame.
 */
export function HeroPortrait() {
  const { src, onError } = usePhotoSrc(profile.photos);

  return (
    <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-[22rem]">
      {/* Static decorative glow — no animation. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_35%,rgba(99,102,241,0.22),rgba(56,189,248,0.08)_55%,transparent_75%)] blur-2xl"
      />

      <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] shadow-glow">
        {src ? (
          <img
            src={src}
            alt={`Portrait of ${profile.name}`}
            loading="eager"
            decoding="async"
            onError={onError}
            style={{ objectPosition: profile.photoPosition }}
            className="aspect-[4/5] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/5] flex-col items-center justify-center gap-3 bg-gradient-to-br from-sky-500/15 via-indigo-500/10 to-violet-500/15 px-4 text-center">
            <span className="gradient-text text-4xl font-bold tracking-tight">
              {profile.initials}
            </span>
            <span className="text-[0.7rem] leading-relaxed text-slate-400">
              Drop your portrait in{" "}
              <span className="font-mono text-slate-300">{profile.photoHint}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
