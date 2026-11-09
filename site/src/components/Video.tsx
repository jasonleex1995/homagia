import { useEffect, useRef, useState } from 'react';
import { media, posterOf, smallOf } from '../lib/media';

type Props = {
  /** Path relative to public/media/. */
  src: string;
  /** Use the light 480p rendition (grid tiles). */
  small?: boolean;
  className?: string;
  fit?: 'cover' | 'contain';
};

/**
 * Muted looping clip that only downloads when it gets near the viewport and
 * only plays while it is on screen.
 */
export function Video({ src, small = false, className = '', fit = 'cover' }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setOnScreen(e.isIntersecting);
        if (e.isIntersecting) setNear(true);
      },
      { rootMargin: '250px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !near) return;
    if (onScreen) el.play().catch(() => {});
    else el.pause();
  }, [onScreen, near, src]);

  return (
    <video
      ref={ref}
      className={`block h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'} ${className}`}
      src={near ? (small ? smallOf(src) : media(src)) : undefined}
      poster={posterOf(src)}
      muted
      loop
      playsInline
      preload={near ? 'auto' : 'none'}
      aria-hidden
    />
  );
}
