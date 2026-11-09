import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useState } from 'react';
import { SITE } from '../data/site';
import { EASE } from './ui';

const LINKS = [
  { href: '#problem', label: 'Problem' },
  { href: '#solution', label: 'Solution' },
  { href: '#method', label: 'Under the hood' },
  { href: '#team', label: 'Team' },
];

/** Hidden over the hero (the letterbox HUD plays that role), slides in after. */
export function Nav() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => setShow(v > window.innerHeight * 0.75));

  return (
    <motion.header
      initial={false}
      animate={{ y: show ? 0 : -72, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50 border-b border-paper/10 bg-ink/70 backdrop-blur-md"
    >
      <nav className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5 md:px-8">
        <a href="#top" className="font-serif text-xl font-semibold tracking-tight">
          Homagia
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-paper/60 transition-colors hover:text-paper">
              {l.label}
            </a>
          ))}
        </div>
        <a
          href={SITE.repo}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-paper/20 px-3.5 py-1.5 text-sm text-paper/80 transition-colors hover:border-paper/60 hover:text-paper"
        >
          GitHub
        </a>
      </nav>
    </motion.header>
  );
}
