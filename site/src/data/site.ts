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

export const MODELS: Record<ModelId, { label: string }> = {
  seedance: { label: 'Seedance' },
  kling: { label: 'Kling' },
};

export const MODEL_IDS = Object.keys(MODELS) as ModelId[];
