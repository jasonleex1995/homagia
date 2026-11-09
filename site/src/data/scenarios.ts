import type { Scenario } from './types';

/* ---------------------------------------------------------------------------
 * Scenario data. Media paths are relative to site/public/media/.
 *
 * Scenario 1 is all real: the prompt, the plain and GPT-enhanced takes, the
 * four reference clips, the creator's pick, and the Homagia recipe with its
 * render. A new scenario can start from placeholder clips under `_placeholder/`
 * with `placeholder: true`, which shows a badge until the real ones land.
 * ------------------------------------------------------------------------- */
const PH = '_placeholder';

// The four rewrites GPT produced from the plain prompt, run as-is on both models.
const GPT_PROMPTS = [
  'A cinematic scene of a man subtly expressing his romantic feelings toward a woman without directly confessing his love. His affection is conveyed through natural actions, subtle gestures, and meaningful interactions. Realistic human behavior, emotional storytelling, natural lighting, and cinematic camera movements. No dialogue, no sexual content.',
  'A man notices that a woman is feeling cold while they walk together on a quiet evening street. Without saying anything, he gently takes off his jacket and places it over her shoulders. She looks at him with a small smile. He smiles back shyly. A subtle romantic moment, cinematic medium shot, natural movements, warm street lighting, realistic film style.',
  "A man gently places his headphones over a woman's ears so she can listen to his favorite song. He watches her reaction with a shy, affectionate smile. She looks at him and smiles softly. A quiet, romantic moment filled with unspoken affection. Cinematic close-up shots, warm natural lighting, realistic movements, no dialogue.",
  'Create a cinematic scene in which a man expresses his love to a woman in an indirect, romantic, non-sexual way. Show his feelings through subtle actions, gestures, and body language rather than dialogue. Use natural lighting and realistic human interactions.',
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'the-confession',
    title: 'The Confession',
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
      prompts: GPT_PROMPTS,
      // Take i is prompt v(i+1), generated once per model. Seedance refused v3.
      takes: {
        kling: [1, 2, 3, 4].map((i) => ({ src: `s1/gpt/kling-${i}.mp4`, verdict: 'ng' as const })),
        seedance: [
          { src: 's1/gpt/seedance-1.mp4', verdict: 'ng' },
          { src: 's1/gpt/seedance-2.mp4', verdict: 'ng' },
          { src: 's1/gpt/seedance-3-blocked.png', blocked: true },
          { src: 's1/gpt/seedance-4.mp4', verdict: 'ng' },
        ],
      },
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
    // The recipe Homagia wrote from the Love Actually scene, run as-is on Seedance.
    recipe: {
      cuts: [
        { size: 'medium', shot: 'Medium', seconds: 3, desc: 'He holds a stack of sketchbook pages and smiles shyly' },
        { size: 'close', shot: 'Close-up', seconds: 2, desc: 'He turns a page: two hand-drawn snowmen side by side' },
        { size: 'close', shot: 'Close-up', seconds: 3, desc: 'She looks surprised, then softens into a warm smile' },
        { size: 'wide', shot: 'Wide', seconds: 2, desc: 'He gives a small nod, turns, and walks away' },
      ],
      prompt: [
        'Winter evening on a quiet snowy street. A front door with a warm porch light and soft string lights. Cinematic, realistic, 35mm film look.',
        'A young man in a dark wool coat and a young woman in a cream knit sweater.',
        '[0-3s] Medium shot, static camera. The door opens and warm light falls on the man. He holds a stack of large sketchbook pages and smiles shyly.',
        '[3-5s] Close-up on the sketchbook. He turns a page: a simple hand-drawn picture of two snowmen standing side by side under falling snow.',
        '[5-8s] Close-up on the woman in the doorway. She looks surprised, then her expression softens into a gentle, warm smile.',
        '[8-10s] Wide shot, static camera. He gives a small nod, turns, and walks away down the snowy street. She stays in the doorway, watching him go.',
        'Sound: soft piano, light wind, footsteps in snow, a page turning.',
        'Mood: sweet, heartfelt, calm. Slow pacing. The man stays silent the whole time.',
      ].join('\n\n'),
    },
    // One render so far: Seedance 2.5, which the creator keeps.
    ours: {
      kling: [],
      seedance: [{ src: 's1/ours/seedance-1.mp4', verdict: 'ok' }],
    },
    keywords: {
      terms: ['man', 'woman', 'love'],
      hits: ['couple kissing', 'wedding proposal', 'man and woman hugging'],
    },
  },
];

/** True once a clip is real footage rather than a generated placeholder. */
export const isRealClip = (src: string) => !src.startsWith(`${PH}/`);
