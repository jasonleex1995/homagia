import { useEffect, useRef, useState } from 'react';

/** Types `text` out while `run` is true. Changing `token` restarts it. */
export function useTypewriter(text: string, run: boolean, token: unknown = 0, cps = 42) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    if (!run) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) window.clearInterval(id);
    }, 1000 / cps);
    return () => window.clearInterval(id);
  }, [text, run, token, cps]);
  return { typed: text.slice(0, n), done: n >= text.length };
}

export const timecode = (t: number, fps = 24) => {
  const s = Math.max(0, t);
  const parts = [Math.floor(s / 3600), Math.floor((s % 3600) / 60), Math.floor(s % 60), Math.floor((s % 1) * fps)];
  return parts.map((v) => String(v).padStart(2, '0')).join(':');
};

/**
 * Keeps several <video> elements on one clock (the longest clip).
 * Shorter clips hold their last frame until the longest one loops.
 */
export function useSyncedVideos(resetKey: unknown) {
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const bar = useRef<HTMLDivElement>(null);
  const tc = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(true);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const list = vids.current.filter((v): v is HTMLVideoElement => !!v);
      let master: HTMLVideoElement | null = null;
      for (const v of list) if (v.duration && (!master || v.duration > master.duration)) master = v;
      if (master) {
        if (master.ended || master.currentTime >= master.duration - 0.05) {
          for (const v of list) {
            v.currentTime = 0;
            if (playingRef.current) v.play().catch(() => {});
          }
        } else {
          for (const v of list) {
            if (v === master || !v.duration) continue;
            const target = Math.min(master.currentTime, v.duration - 0.05);
            if (Math.abs(v.currentTime - target) > 0.15) v.currentTime = target;
          }
        }
        if (bar.current) bar.current.style.transform = `scaleX(${master.currentTime / master.duration})`;
        if (tc.current) tc.current.textContent = timecode(master.currentTime);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    for (const v of vids.current) {
      if (!v) continue;
      if (playing) v.play().catch(() => {});
      else v.pause();
    }
  }, [playing, resetKey]);

  const seek = (p: number) => {
    const list = vids.current.filter((v): v is HTMLVideoElement => !!v);
    const d = Math.max(0, ...list.map((v) => v.duration || 0));
    if (!d) return;
    for (const v of list) v.currentTime = Math.min(p * d, (v.duration || d) - 0.05);
  };

  return { vids, bar, tc, playing, setPlaying, seek };
}
