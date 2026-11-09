import type { ModelId } from './types';

export const SITE = {
  repo: 'https://github.com/jasonleex1995/homagia',
  /** TODO: link to the 2-minute demo video (Loom / YouTube). The button hides while empty. */
  demoVideo: '',
  team: [
    { name: 'Jaeseong Lee', role: 'AI, Backend' },
    { name: 'Minji Kim', role: 'Frontend, UI/UX Design' },
    { name: 'Seongyeon Park', role: 'PM, Data Analysis, Marketing' },
  ],
};

export const MODELS: Record<ModelId, { label: string; version: string }> = {
  seedance: { label: 'Seedance', version: '2.5' },
  kling: { label: 'Kling', version: '3.0' },
};

/** "Kling 3.0" — the model as it appears on every label. */
export const modelName = (m: ModelId) => `${MODELS[m].label} ${MODELS[m].version}`;

/** Left-to-right order of the model columns on every stage card. */
export const MODEL_ORDER: ModelId[] = ['kling', 'seedance'];
