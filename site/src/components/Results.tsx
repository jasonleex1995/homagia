import { useInView } from 'motion/react';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { SCENARIOS } from '../data/scenarios';
import type { ModelId, Reference, Take } from '../data/types';
import { useSyncedVideos } from '../lib/hooks';
import { media, pad2, posterOf, wordCount } from '../lib/media';
import { TakeTile } from './Takes';
import { autoPhrases, ModelToggle, PauseIcon, Phrases, PlaceholderBadge, PlayIcon, RevealWords, SectionTag, Stamp } from './ui';
import { Video } from './Video';

type Column = { key: 'plain' | 'gpt' | 'ours'; label: string; take?: Take; prompt: string };

/** Take board for every scenario + a synced three-way comparison. */
export function Results() {
  const [sid, setSid] = useState(0);
  const [model, setModel] = useState<ModelId>('seedance');
  const [pick, setPick] = useState({ p: 0, g: 0, o: 0 });

  const s = SCENARIOS[sid];
  const plain = s.plain[model];
  const gpt = s.enhanced.takes[model];
  const ours = s.ours[model];
  const chosen = s.references.find((r) => r.id === s.chosen) ?? s.references[0];

  useEffect(() => {
    setPick({ p: 0, g: 0, o: 0 });
  }, [sid, model]);

  const n = Math.max(4, plain.length, gpt.length, ours.length + 1);
  const gridStyle = { '--cols': `repeat(${n}, minmax(0, 1fr))` } as CSSProperties;
  const avgGpt = Math.round(
    s.enhanced.prompts.reduce((a, p) => a + wordCount(p), 0) / Math.max(1, s.enhanced.prompts.length),
  );

  const cols: Column[] = [
    { key: 'plain', label: 'Plain prompt', take: plain[pick.p], prompt: s.query },
    { key: 'gpt', label: 'GPT-enhanced', take: gpt[pick.g], prompt: s.enhanced.prompts[pick.g] ?? '' },
    { key: 'ours', label: 'Homagia recipe', take: ours[pick.o], prompt: s.recipe.prompt },
  ];

  return (
    <section id="results" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <SectionTag n="05" label="Results" />
        <h2 className="display mt-5 text-[clamp(2.4rem,5.4vw,5rem)]">
          <RevealWords text="Same sentence. | Same model." />
          <br />
          <span className="text-paper/40">
            <RevealWords text="Three ways | to direct it." delay={0.2} />
          </span>
        </h2>

        <div className="mt-12 flex flex-col gap-4 border-y border-paper/10 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setSid(i)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  i === sid ? 'bg-accent text-paper' : 'bg-paper/6 text-paper/70 hover:bg-paper/12'
                }`}
              >
                <span className="mr-2 font-script text-xs opacity-60">S{pad2(i + 1)}</span>
                {x.title}
              </button>
            ))}
          </div>
          <ModelToggle id="results" value={model} onChange={setModel} />
        </div>

        <div className="mt-10 flex flex-wrap items-start justify-between gap-4">
          <p className="max-w-4xl text-balance font-serif text-[clamp(1.25rem,2.1vw,1.75rem)] leading-snug">
            <Phrases text={autoPhrases(`“${s.query}”`)} />
          </p>
          <PlaceholderBadge show={s.placeholder} />
        </div>

        <div className="mt-10 space-y-7">
          <BoardRow label="Plain prompt" meta={`${wordCount(s.query)} words · ${plain.length} takes`} style={gridStyle}>
            {plain.map((t, i) => (
              <TakeTile
                key={`${sid}-${model}-p${i}`}
                take={t}
                index={i}
                active={pick.p === i}
                onClick={() => setPick((v) => ({ ...v, p: i }))}
              />
            ))}
          </BoardRow>
          <BoardRow label="GPT-enhanced" meta={`~${avgGpt} words · ${gpt.length} takes`} style={gridStyle}>
            {gpt.map((t, i) => (
              <TakeTile
                key={`${sid}-${model}-g${i}`}
                take={t}
                index={i}
                active={pick.g === i}
                onClick={() => setPick((v) => ({ ...v, g: i }))}
              />
            ))}
          </BoardRow>
          <BoardRow
            label="Homagia"
            accent
            meta={`${wordCount(s.recipe.prompt)} words · ${ours.length} take${ours.length === 1 ? '' : 's'}`}
            style={gridStyle}
          >
            <RefTile r={chosen} />
            {ours.map((t, i) => (
              <TakeTile
                key={`${sid}-${model}-o${i}`}
                take={t}
                index={i}
                appearDelay={0.15 + i * 0.12}
                active={pick.o === i}
                onClick={() => setPick((v) => ({ ...v, o: i }))}
              />
            ))}
          </BoardRow>
        </div>

        <Compare cols={cols} resetKey={`${sid}-${model}-${pick.p}-${pick.g}-${pick.o}`} />
        <p className="mt-5 font-serif italic text-paper/45">
          <Phrases text={`Fig. 3 — ${s.title}. | The three columns play in sync. | Click any take above to swap it in.`} />
        </p>
      </div>
    </section>
  );
}

function BoardRow({
  label,
  meta,
  accent = false,
  style,
  children,
}: {
  label: string;
  meta: string;
  accent?: boolean;
  style: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[10.5rem_1fr] md:gap-6">
      <div className="md:pt-1">
        <p className={`text-[0.78rem] font-bold uppercase tracking-[0.18em] ${accent ? 'text-glow' : 'text-paper/70'}`}>{label}</p>
        <p className="mt-1 font-script text-xs text-paper/40">{meta}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:[grid-template-columns:var(--cols)]" style={style}>
        {children}
      </div>
    </div>
  );
}

function RefTile({ r }: { r: Reference }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-md bg-ink-3 ring-1 ring-brand-400/80">
      <Video src={r.src} small />
      <span className="absolute left-2 top-1.5 max-w-[85%] truncate font-script text-[0.66rem] uppercase tracking-wider text-paper/90 [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">
        Ref · {r.film}
      </span>
    </div>
  );
}

function Compare({ cols, resetKey }: { cols: Column[]; resetKey: string }) {
  const box = useRef<HTMLDivElement>(null);
  const near = useInView(box, { once: true, margin: '300px 0px' });
  const { vids, bar, tc, playing, setPlaying, seek } = useSyncedVideos(`${resetKey}:${near}`);
  const [open, setOpen] = useState(false);

  return (
    <div ref={box} className="mt-14 rounded-2xl bg-ink-2 p-4 ring-1 ring-paper/10 md:p-6">
      <div className="grid gap-5 md:grid-cols-3">
        {cols.map((c, i) => (
          <figure key={c.key}>
            <div className="mb-2 flex items-center justify-between">
              <span className={`text-[0.72rem] font-bold uppercase tracking-[0.18em] ${c.key === 'ours' ? 'text-glow' : 'text-paper/60'}`}>
                {c.label}
              </span>
              <span className="font-script text-xs text-paper/40">{wordCount(c.prompt)} words</span>
            </div>
            <div
              className={`relative aspect-video overflow-hidden rounded-lg bg-ink ${
                c.key === 'ours' ? 'ring-2 ring-brand-400' : 'ring-1 ring-paper/10'
              }`}
            >
              {c.take && (
                <video
                  key={c.take.src}
                  ref={(el) => {
                    vids.current[i] = el;
                  }}
                  src={near ? media(c.take.src) : undefined}
                  poster={posterOf(c.take.src)}
                  muted
                  playsInline
                  preload="auto"
                  className="h-full w-full object-cover"
                />
              )}
              {c.take?.verdict && <Stamp key={`${c.take.src}-stamp`} kind={c.take.verdict} delay={0.2} className="right-2 top-2" />}
            </div>
            <div
              data-lenis-prevent
              className={`mt-3 whitespace-pre-line font-script text-[0.76rem] leading-relaxed text-paper/60 ${
                open ? 'max-h-60 overflow-auto' : 'fade-bottom max-h-[5em] overflow-hidden'
              }`}
            >
              {c.prompt}
            </div>
          </figure>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          aria-label={playing ? 'Pause' : 'Play'}
          onClick={() => setPlaying((p) => !p)}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-paper"
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div
          className="relative h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-paper/15"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            seek((e.clientX - r.left) / r.width);
          }}
        >
          <div ref={bar} className="absolute inset-0 origin-left bg-brand-400" style={{ transform: 'scaleX(0)' }} />
        </div>
        <span ref={tc} className="font-script text-xs tabular-nums text-paper/50">
          00:00:00:00
        </span>
        <button type="button" onClick={() => setOpen((o) => !o)} className="hidden text-xs text-paper/50 transition-colors hover:text-paper sm:block">
          {open ? 'Collapse prompts' : 'Full prompts'}
        </button>
      </div>
    </div>
  );
}
