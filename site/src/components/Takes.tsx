import { motion } from 'motion/react';
import type { Take } from '../data/types';
import { pad2 } from '../lib/media';
import { EASE, Stamp } from './ui';
import { Video } from './Video';

type Props = {
  take: Take;
  index: number;
  label?: string;
  appearDelay?: number;
  stampDelay?: number;
  active?: boolean;
  onClick?: () => void;
  /** Tiny tiles on phones: hide the label and shrink the stamp below md. */
  compact?: boolean;
};

/** One generated take: looping clip, TAKE label, and its NG / OK stamp. */
export function TakeTile({ take, index, label, appearDelay, stampDelay = 0.4, active = false, onClick, compact = false }: Props) {
  const ng = take.verdict === 'ng';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: appearDelay ?? index * 0.12, duration: 0.5, ease: EASE }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`group relative aspect-video overflow-hidden rounded-md bg-ink transition-shadow ${
        active ? 'ring-2 ring-paper' : 'ring-1 ring-paper/10'
      } ${onClick ? 'cursor-pointer hover:ring-paper/45' : ''}`}
    >
      <motion.div
        className="h-full w-full"
        initial={{ opacity: 1, filter: 'saturate(1)' }}
        animate={{ opacity: ng ? 0.55 : 1, filter: ng ? 'saturate(0.35)' : 'saturate(1)' }}
        transition={{ delay: ng ? stampDelay : 0, duration: 0.6 }}
      >
        <Video src={take.src} small />
      </motion.div>
      <span
        className={`absolute left-2 top-1.5 font-script text-[0.66rem] uppercase tracking-wider text-paper/85 [text-shadow:0_1px_6px_rgba(0,0,0,0.8)] ${
          compact ? 'max-md:hidden' : ''
        }`}
      >
        {label ?? `Take ${pad2(index + 1)}`}
      </span>
      {take.verdict && (
        <Stamp
          kind={take.verdict}
          delay={stampDelay}
          className={`bottom-2 right-2 ${compact ? 'max-md:bottom-1 max-md:right-1 max-md:border max-md:px-1 max-md:text-[0.5rem]' : ''}`}
        />
      )}
    </motion.div>
  );
}
