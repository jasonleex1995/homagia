import { useState } from 'react';
import { SCENARIOS } from '../data/scenarios';
import { MODEL_ORDER } from '../data/site';
import type { Reference, Scenario } from '../data/types';
import { wordCount } from '../lib/media';
import { ShotIcon } from './ShotIcon';
import { Carousel, ModelPair, ScenarioTabs, takesAt } from './Stage';
import { autoPhrases, Chip, Phrases, RevealWords, SectionTag } from './ui';
import { Video } from './Video';

/**
 * Homagia on the same stage as the problem: the references it found for the
 * same sentence, then the creator's pick turned into a recipe and rendered on
 * the same two models.
 */
export function Solution({ sid, onScenario }: { sid: number; onScenario: (i: number) => void }) {
  const s = SCENARIOS[sid];
  const refs = s.references;
  const pickIndex = Math.max(0, refs.findIndex((r) => r.id === s.chosen));
  const chosen = refs[pickIndex];
  const oursCount = Math.max(1, ...MODEL_ORDER.map((m) => s.ours[m].length));

  return (
    <section id="solution" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <header className="text-center">
          <SectionTag n="03" label="The solution" center />
          <h2 className="display mt-5 text-[clamp(2.2rem,4.6vw,4.2rem)]">
            <RevealWords text="From a sentence | to shots." />
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-paper/60">
            <Phrases
              text={'Homagia searches by feeling, | not keywords.\nPick the scene that nails it, | and get a cut-by-cut recipe | for the same models.'}
            />
          </p>
        </header>

        <div className="mt-10">
          <ScenarioTabs sid={sid} onChange={onScenario} />
        </div>

        <div className="mt-10">
          <Carousel
            key={`refs-${s.id}`}
            accent
            count={refs.length}
            start={pickIndex}
            caption={(i) => <RefCaption query={s.query} index={i} total={refs.length} picked={refs[i].id === s.chosen} />}
            slide={(i) => <RefSlide r={refs[i]} />}
          />

          <div className="flex flex-col items-center py-6 text-center md:py-8">
            <span className="h-8 w-px bg-brand-400/60" />
            <p className="hud mt-3">
              <Phrases text={`The creator picks ${chosen.film}. | Homagia turns it into a recipe.`} />
            </p>
            <span className="mt-3 h-8 w-px bg-brand-400/60" />
          </div>

          <Carousel
            key={`ours-${s.id}`}
            accent
            count={oursCount}
            caption={(i) => <RecipeCaption recipe={s.recipe} from={chosen} counter={oursCount > 1 ? `Take ${i + 1} / ${oursCount}` : ''} />}
            slide={(i, live) => <ModelPair order={MODEL_ORDER} takes={takesAt(s.ours, MODEL_ORDER, i)} live={live} glow />}
          />
        </div>
      </div>
    </section>
  );
}

function RefCaption({ query, index, total, picked }: { query: string; index: number; total: number; picked: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="text-[0.8rem] font-bold uppercase tracking-[0.18em] text-paper">References Homagia found</h3>
          {picked && (
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-paper">
              Creator’s pick
            </span>
          )}
        </div>
        <span className="shrink-0 font-script text-xs text-paper/50">
          {index + 1} / {total}
        </span>
      </div>
      <p className="mt-3 font-script text-[clamp(0.9rem,1.05vw,1.02rem)] leading-relaxed text-paper/80">
        <span className="text-paper/45">Intent search · </span>“{query}”
      </p>
    </div>
  );
}

/** One reference: the film clip on the left, what makes it work on the right. */
function RefSlide({ r }: { r: Reference }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 md:gap-4">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-ink ring-1 ring-paper/10">
        <Video src={r.src} />
        <span className="absolute left-2 top-2 rounded-full bg-ink/65 px-2.5 py-1 text-[0.7rem] font-semibold text-paper backdrop-blur md:left-3 md:top-3 md:text-xs">
          Reference
        </span>
      </div>
      <div className="flex flex-col justify-center rounded-xl bg-paper/5 p-5 ring-1 ring-paper/10 md:p-8">
        <p className="font-serif text-[clamp(1.5rem,2.4vw,2.2rem)] font-semibold leading-tight">{r.film}</p>
        <p className="mt-1 text-sm text-paper/55">{[r.year, r.director].filter(Boolean).join(' · ')}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {r.chips.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>
        <p className="label mt-6">Why it works</p>
        <p className="mt-2 font-serif text-[clamp(1.05rem,1.4vw,1.3rem)] leading-snug text-paper/90">
          <Phrases text={autoPhrases(r.why)} />
        </p>
      </div>
    </div>
  );
}

/** The recipe above the result: cut strip, full prompt, and one-click copy. */
function RecipeCaption({ recipe, from, counter }: { recipe: Scenario['recipe']; from: Reference; counter: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(recipe.prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-[0.8rem] font-bold uppercase tracking-[0.18em] text-paper">Homagia recipe</h3>
          <span className="font-script text-xs text-paper/45">
            from {from.film} · {wordCount(recipe.prompt)} words
          </span>
        </div>
        <span className="shrink-0 font-script text-xs text-paper/50">{counter}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {recipe.cuts.map((c, k) => (
          <div key={k} className="flex items-center gap-3 rounded-xl bg-paper/5 p-2 ring-1 ring-paper/10">
            <div className="relative aspect-video w-14 shrink-0 overflow-hidden rounded-md bg-ink text-paper/35 md:w-20">
              <ShotIcon size={c.size} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">
                {c.shot} · {c.seconds}s
              </p>
              <p className="line-clamp-2 text-xs leading-snug text-paper/55">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4">
        <button type="button" onClick={() => setOpen((o) => !o)} className="text-xs text-paper/50 transition-colors hover:text-paper">
          {open ? 'Hide full prompt' : 'Show full prompt'}
        </button>
        <button type="button" onClick={copy} className="text-xs font-semibold text-brand-400 transition-colors hover:text-paper">
          {copied ? 'Copied ✓' : 'Copy prompt'}
        </button>
      </div>
      {open && (
        <pre
          data-lenis-prevent
          className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-xl bg-paper/5 p-4 font-script text-[0.85rem] leading-relaxed text-paper/80"
        >
          {recipe.prompt}
        </pre>
      )}
    </div>
  );
}
