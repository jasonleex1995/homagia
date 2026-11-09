export type ModelId = 'seedance' | 'kling';

/** One generated clip. `src` is relative to site/public/media/. */
export interface Take {
  src: string;
  /** 'ng' = misses the intent (NG stamp). 'ok' = a keeper. Leave empty if unjudged. */
  verdict?: 'ng' | 'ok';
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
  enhanced: {
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
