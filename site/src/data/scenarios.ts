import type { ModelId, Scenario, Take } from './types';

/* ---------------------------------------------------------------------------
 * Scenario data. Media paths are relative to site/public/media/.
 *
 * Real: scenario 1's prompt, its four reference clips, the creator's pick, and
 * the plain-prompt takes. Still placeholder: the GPT-enhanced and Homagia
 * takes, the GPT-enhanced prompt text, and the recipe. Swap them in when they
 * arrive, then remove `placeholder: true`.
 * ------------------------------------------------------------------------- */
const PH = '_placeholder';
const N = 4;

const placeholderTakes = (kind: 'plain' | 'gpt'): Record<ModelId, Take[]> => {
  const make = (): Take[] =>
    Array.from({ length: N }, (_, i) => ({ src: `${PH}/${kind}-${i + 1}.mp4`, verdict: 'ng' as const }));
  return { kling: make(), seedance: make() };
};
const placeholderOurs = (): Record<ModelId, Take[]> => ({
  kling: [{ src: `${PH}/ours-1.mp4`, verdict: 'ok' }],
  seedance: [{ src: `${PH}/ours-2.mp4`, verdict: 'ok' }],
});

// DRAFT: stands in for the real GPT-enhanced prompts (v1–v4).
const GPT_DRAFT =
  'A cinematic, emotionally rich 4K scene of a man expressing his love to a woman in an indirect, romantic, and tasteful way. On a quiet evening street softly lit by warm string lights, he hesitates before finding the courage to show his feelings through a meaningful gesture instead of words. Their eyes meet, and the moment is filled with longing, tenderness, and unspoken emotion. Shallow depth of field, gentle camera movement, golden-hour lighting, soft romantic color grading, subtle facial expressions, inspired by classic romance films, photorealistic, award-winning cinematography.';

export const SCENARIOS: Scenario[] = [
  {
    id: 'the-confession',
    title: 'The Confession',
    placeholder: true,
    query: 'A man expresses his love to a woman in an indirect, romantic, non-sexual way',
    plain: {
      kling: [1, 2, 3, 4].map((i) => ({ src: `s1/plain/kling-${i}.mp4`, verdict: 'ng' as const })),
      seedance: [
        ...[1, 2, 3].map((i) => ({ src: `s1/plain/seedance-${i}.mp4`, verdict: 'ng' as const })),
        { src: 's1/plain/seedance-blocked.png', blocked: true },
      ],
    },
    // Seedance's content filter refused 6 of 10 attempts at this exact prompt.
    plainBlocked: { seedance: { blocked: 6, tries: 10 } },
    enhanced: {
      prompts: Array.from({ length: N }, () => GPT_DRAFT),
      takes: placeholderTakes('gpt'),
      dropped: ['through a meaningful gesture instead of words', 'unspoken emotion'],
    },
    references: [
      {
        id: 'the-notebook',
        film: 'The Notebook',
        year: 2004,
        director: 'Nick Cassavetes',
        scene: 'The Ferris wheel',
        src: 's1/refs/notebook.mp4',
        chips: ['grand public gesture', 'hanging from the Ferris wheel', 'night carnival lights'],
        why: 'He risks his neck in front of everyone, and wide shots of the lit wheel turn one question into a spectacle she can’t refuse.',
      },
      {
        id: 'la-boum',
        film: 'La Boum',
        year: 1980,
        director: 'Claude Pinoteau',
        scene: 'Headphones at the party',
        src: 's1/refs/la-boum.mp4',
        chips: ['headphones shut out the room', 'slow dance in a fast crowd', 'close-up on her reaction'],
        why: 'He slips headphones on her in a loud party, and while the room keeps rushing they slow down. Love becomes a private world, without a word.',
      },
      {
        id: 'love-actually',
        film: 'Love Actually',
        year: 2003,
        director: 'Richard Curtis',
        scene: 'Cue cards at the door',
        src: 's1/refs/love-actually.mp4',
        chips: ['silent cue cards', 'shot / reverse shot at the door', 'Christmas lights'],
        why: 'He says it without saying it. Silent cards at the doorstep, cut between his steady face and her reaction, let restraint carry the confession.',
      },
      {
        id: 'babel',
        film: 'Babel',
        year: 2019,
        director: 'TV CHOSUN series',
        scene: '“Tell me you love only me”',
        src: 's1/refs/babel.mp4',
        source: 'https://www.youtube.com/watch?v=c3q4jlDwVcI',
        chips: ['low-key lamplight', 'over-the-shoulder close-ups', 'possessive grip'],
        why: 'Dim lamplight and tight over-the-shoulder close-ups trap them in one frame, so the confession plays like a threat. Love, expressed as possession.',
      },
    ],
    chosen: 'love-actually',
    // DRAFT: replace with the recipe prompt actually used for the Homagia takes.
    recipe: {
      cuts: [
        { size: 'medium', shot: 'Medium', seconds: 3, desc: 'Night. He waits at her door under warm string lights, holding a stack of cards' },
        { size: 'close', shot: 'Close-up', seconds: 2, desc: 'He turns a handwritten card toward her without a word' },
        { size: 'close', shot: 'Close-up', seconds: 3, desc: 'Her face in the doorway, eyes soft, holding back a smile' },
        { size: 'wide', shot: 'Wide', seconds: 2, desc: 'He nods once and walks away down the quiet street' },
      ],
      prompt: [
        'Cut 1 — Medium, 3s. Night. A man waits at a front door framed by warm string lights, holding a stack of handwritten cards. Static camera.',
        'Cut 2 — Over-the-shoulder close-up, 2s. He turns one card toward her. He does not speak.',
        'Cut 3 — Close-up, 3s. The woman in the doorway reads it, eyes soft, holding back a smile. Quiet.',
        'Cut 4 — Wide, 2s. He gives a small nod, turns, and walks away down the empty street.',
      ].join('\n'),
    },
    ours: placeholderOurs(),
    keywords: {
      terms: ['man', 'woman', 'love'],
      hits: ['couple kissing', 'wedding proposal', 'man and woman hugging'],
    },
  },
];

/** True once a clip is real footage rather than a generated placeholder. */
export const isRealClip = (src: string) => !src.startsWith(`${PH}/`);
