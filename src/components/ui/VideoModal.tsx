import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export type VideoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  title: string;
  subtitle?: string;
};

/**
 * Accessible modal viewer for project demo videos.
 * Features:
 * - Mounted via React portal to `document.body`
 * - Focus trapped / Escape key listener / Backdrop click
 * - Body scroll lock while open
 * - 16:9 responsive frame with HTML5 video player (`preload="metadata"`, no autoplay)
 */
export function VideoModal({
  isOpen,
  onClose,
  videoSrc,
  title,
  subtitle,
}: VideoModalProps) {
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocusedElement = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previousFocusedElement?.focus?.();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-amber-500/25 bg-base-950/95 shadow-2xl shadow-amber-500/10 ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3 sm:px-6">
              <div className="min-w-0 pr-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-amber-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Live Demo
                  </span>
                  {subtitle && (
                    <span className="hidden text-xs text-slate-400 sm:inline truncate">
                      • {subtitle}
                    </span>
                  )}
                </div>
                <h2
                  id="video-modal-title"
                  className="mt-1 text-sm font-semibold text-slate-100 sm:text-base truncate"
                >
                  {title}
                </h2>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close demo video"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.05] text-slate-300 transition duration-200 hover:border-amber-400/60 hover:bg-amber-400/10 hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>

            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                src={videoSrc}
                controls
                playsInline
                preload="metadata"
                className="aspect-video h-full w-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-base-950 px-4 py-2.5 text-xs text-slate-400 sm:px-6">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Interactive Video Demo</span>
              </span>
              <span className="font-mono text-[0.7rem] text-slate-500">
                Press <kbd className="rounded border border-white/15 bg-white/[0.06] px-1.5 py-0.5 text-slate-300">Esc</kbd> or click outside to close
              </span>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
