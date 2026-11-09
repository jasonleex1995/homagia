export type ModelId = 'seedance' | 'kling';

/** One generated clip. `src` is relative to site/public/media/. */
export interface Take {
  /** The clip, or for a blocked attempt, a screenshot of the refusal. */
  src: string;
  /** 'ng' = misses the intent (NG stamp). 'ok' = a keeper. Leave empty if unjudged. */
  verdict?: 'ng' | 'ok';
  /** The model's content filter refused to render this attempt. */
  blocked?: boolean;
}

/** How often a model's content filter refused a prompt. */
export interface BlockStat {
  blocked: number;
  tries: number;
}

export interface Reference {
  id: string;
  film: string;
  year?: number;
  director?: string;
  /** Short scene name, e.g. "the dalgona scene". */
  scene?: string;
  src: string;
  chips: string[];
  why: string;
  /** Where the clip came from (e.g. a YouTube URL), for the credits. */
  source?: string;
}

export type ShotSize = 'wide' | 'medium' | 'close' | 'extreme';

export interface Cut {
  size: ShotSize;
  shot: string;
  seconds: number;
  desc: string;
}

export interface Scenario {
  id: string;
  title: string;
  /** The creator's plain sentence. It is also the plain prompt. */
  query: string;
  /** Shows a "placeholder data" badge until real media is in. */
  placeholder?: boolean;
  plain: Record<ModelId, Take[]>;
  /** Content-filter refusals for the plain prompt, per model. */
  plainBlocked?: Partial<Record<ModelId, BlockStat>>;
  enhanced: {
    /** Content-filter refusals for the GPT-enhanced prompts, per model. */
    blocked?: Partial<Record<ModelId, BlockStat>>;
    /** N GPT-refined prompts. prompts[i] produced takes[model][i]. */
    prompts: string[];
    takes: Record<ModelId, Take[]>;
    /** Phrases the model ignored. They get struck through in the problem story. */
    dropped?: string[];
  };
  references: Reference[];
  /** id of the reference the creator picked. */
  chosen: string;
  recipe: { cuts: Cut[]; prompt: string };
  ours: Record<ModelId, Take[]>;
  /** Optional: powers the keyword-search vs intent-search comparison. */
  keywords?: { terms: string[]; hits: string[] };
}
