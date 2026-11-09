import type { ModelId, Scenario, Take } from './types';

/** Model used for the single-model "Problem" story at the top of the page. */
export const STORY_MODEL: ModelId = 'seedance';

/* ---------------------------------------------------------------------------
 * PLACEHOLDER DATA
 * Copied from the pitch deck so the page can be built before the real clips
 * arrive. Swap each scenario for real media and prompts, then remove
 * `placeholder: true`. Media paths are relative to site/public/media/.
 * ------------------------------------------------------------------------- */
const PH = '_placeholder';
const N = 4;

const takes = (kind: 'plain' | 'gpt'): Record<ModelId, Take[]> => {
  const make = (): Take[] =>
    Array.from({ length: N }, (_, i) => ({ src: `${PH}/${kind}-${i + 1}.mp4`, verdict: 'ng' as const }));
  return { seedance: make(), kling: make() };
};
const ours = (): Record<ModelId, Take[]> => ({
  seedance: [{ src: `${PH}/ours-1.mp4`, verdict: 'ok' }],
  kling: [{ src: `${PH}/ours-2.mp4`, verdict: 'ok' }],
});
const ref = (i: number) => `${PH}/ref-${i}.mp4`;
const repeat = (p: string) => Array.from({ length: N }, () => p);

export const SCENARIOS: Scenario[] = [
  {
    id: 'perfect-but-wrong',
    title: 'Perfect but Wrong',
    placeholder: true,
    query: 'My character walks into a town that looks perfect, but I want viewers to feel something is off.',
    plain: takes('plain'),
    enhanced: {
      prompts: repeat(
        'A cinematic, ultra-detailed 4K shot of a charming, picture-perfect small town on a sunny afternoon. The camera follows the main character as they walk down a pristine street lined with white picket fences, blooming flowers, and immaculate lawns. Neighbors smile and wave while children play, and everything appears idyllic. However, subtle unsettling details create a sense of unease: the smiles feel slightly too wide, the colors are overly saturated, and the movements are a little too synchronized. Soft golden lighting, shallow depth of field, smooth dolly movement, eerie atmosphere, inspired by psychological thrillers, highly realistic, award-winning cinematography.',
      ),
      takes: takes('gpt'),
      dropped: ['the smiles feel slightly too wide', 'the movements are a little too synchronized'],
    },
    references: [
      {
        id: 'blue-velvet',
        film: 'Blue Velvet',
        year: 1986,
        director: 'David Lynch',
        src: ref(1),
        chips: ['postcard color', 'push into the grass'],
        why: 'Postcard color sells the perfect surface, then the camera pushes into the grass to show what crawls underneath.',
      },
      {
        id: 'midsommar',
        film: 'Midsommar',
        year: 2019,
        director: 'Ari Aster',
        src: ref(2),
        chips: ['upside-down camera', 'sunlit wide shots'],
        why: 'Bright daylight leaves nowhere to hide, so the dread has to come from the framing itself.',
      },
      {
        id: 'truman-show',
        film: 'The Truman Show',
        year: 1998,
        director: 'Peter Weir',
        src: ref(3),
        chips: ['hidden-camera POV', 'one wrong detail'],
        why: 'Hidden-camera framing turns the viewer into a watcher, and one wrong detail cracks the whole set.',
      },
    ],
    chosen: 'blue-velvet',
    recipe: {
      cuts: [
        { size: 'wide', shot: 'Wide', seconds: 3, desc: 'Postcard-perfect street, saturated sky, white picket fence' },
        { size: 'medium', shot: 'Medium', seconds: 2, desc: 'Character walks in; neighbors wave in unison' },
        { size: 'close', shot: 'Close-up', seconds: 2, desc: 'Slow push toward the edge of the lawn' },
        { size: 'extreme', shot: 'Extreme CU', seconds: 2, desc: 'Something moves under the grass; sound drops out' },
      ],
      prompt: [
        'Cut 1 — Wide, 3s. Postcard-perfect small-town street, oversaturated colors, white picket fence, noon sun. Static camera.',
        'Cut 2 — Medium, 2s. The character walks in. Neighbors wave in unison, smiles held a beat too long.',
        'Cut 3 — Close-up, 2s. Slow push-in toward the edge of a manicured lawn.',
        'Cut 4 — Extreme close-up, 2s. Insects writhing beneath the grass. Shallow focus. Ambient sound drops away.',
      ].join('\n'),
    },
    ours: ours(),
  },
  {
    id: 'the-standoff',
    title: 'The Standoff',
    placeholder: true,
    query: 'Two rivals talk politely over dinner, but you can feel they want to destroy each other.',
    plain: takes('plain'),
    enhanced: {
      prompts: repeat(
        'A tense, cinematic dinner scene in an elegant, dimly lit restaurant. Two powerful rivals sit across from each other at a candlelit table, dressed in sharp suits. They exchange polite smiles and calm conversation, but beneath the surface there is palpable hostility and simmering tension. Subtle micro-expressions, clenched jaws, and lingering stares reveal their true intentions. Warm amber lighting, shallow depth of field, slow push-in camera movement, rich textures, film grain, dramatic shadows, inspired by classic gangster films, photorealistic, 4K, award-winning cinematography, emotionally charged atmosphere.',
      ),
      takes: takes('gpt'),
      dropped: ['Subtle micro-expressions', 'lingering stares'],
    },
    references: [
      {
        id: 'heat',
        film: 'Heat',
        year: 1995,
        director: 'Michael Mann',
        src: ref(1),
        chips: ['mirrored framing', 'locked eyelines'],
        why: 'Mirrored over-the-shoulder framing makes them equals, so neither rival ever wins the edit.',
      },
      {
        id: 'inglourious-basterds',
        film: 'Inglourious Basterds',
        year: 2009,
        director: 'Quentin Tarantino',
        src: ref(2),
        chips: ['food in close-up', 'prop as threat'],
        why: 'Lingering close-ups on food turn politeness into a threat. The danger lives in the props, not the dialogue.',
      },
      {
        id: 'the-godfather',
        film: 'The Godfather',
        year: 1972,
        director: 'Francis Ford Coppola',
        src: ref(3),
        chips: ['wide to close-up', 'rising train noise'],
        why: 'A slow move from wide to close-up isolates him, while the rising train noise plays the violence he is holding back.',
      },
    ],
    chosen: 'inglourious-basterds',
    recipe: {
      cuts: [
        { size: 'medium', shot: 'Medium', seconds: 3, desc: 'Two rivals across a white tablecloth, polite smiles' },
        { size: 'close', shot: 'Close-up', seconds: 2, desc: 'Dessert set down with ceremony, cream on top' },
        { size: 'close', shot: 'Close-up', seconds: 2, desc: 'One rival watches the other, unblinking' },
        { size: 'extreme', shot: 'Extreme CU', seconds: 2, desc: 'A fork presses into the dessert, then is set down' },
      ],
      prompt: [
        'Cut 1 — Medium two-shot, 3s. Two rivals at a small café table, white tablecloth, both smiling politely. Locked-off camera.',
        'Cut 2 — Close-up, 2s. A dessert placed between them, a slow dollop of cream. Too much attention on the food.',
        'Cut 3 — Close-up, 2s. One rival watches the other, unblinking, still smiling.',
        'Cut 4 — Extreme close-up, 2s. A fork presses into the dessert, then is set down deliberately. Silence.',
      ].join('\n'),
    },
    ours: ours(),
    keywords: {
      terms: ['rivals', 'dinner', 'talk'],
      hits: ['dinner table', 'restaurant interior', 'two people talking'],
    },
  },
  {
    id: 'love-at-a-distance',
    title: 'Love at a Distance',
    placeholder: true,
    query: "They still love each other but can't say it. I want it to hurt without anyone crying.",
    plain: takes('plain'),
    enhanced: {
      prompts: repeat(
        'An emotionally devastating, cinematic scene of two former lovers who still deeply love each other but cannot express their feelings. They stand close yet apart on a quiet city street at night, illuminated by soft neon lights and gentle rain. Their eyes meet with longing, regret, and unspoken words, but neither of them cries. Subtle expressions, restrained body language, melancholic atmosphere, shallow depth of field, slow motion, warm and cool color contrast, intimate framing, inspired by arthouse romance films, photorealistic, 4K, masterful cinematography.',
      ),
      takes: takes('gpt'),
      dropped: ['neither of them cries', 'restrained body language'],
    },
    references: [
      {
        id: 'in-the-mood-for-love',
        film: 'In the Mood for Love',
        year: 2000,
        director: 'Wong Kar-wai',
        src: ref(1),
        chips: ['frame within frame', 'slow-motion passing'],
        why: 'Doorways and window frames trap them in separate boxes, and slow motion stretches every near-touch.',
      },
      {
        id: 'past-lives',
        film: 'Past Lives',
        year: 2023,
        director: 'Celine Song',
        src: ref(2),
        chips: ['space between them', 'long silent hold'],
        why: 'The empty space between them does the talking, and the shot holds long after anyone would speak.',
      },
      {
        id: 'la-la-land',
        film: 'La La Land',
        year: 2016,
        director: 'Damien Chazelle',
        src: ref(3),
        chips: ['wordless glance', 'cross-cut close-ups'],
        why: 'One wordless glance across the room, then cross-cut close-ups, say everything they never will.',
      },
    ],
    chosen: 'in-the-mood-for-love',
    recipe: {
      cuts: [
        { size: 'wide', shot: 'Wide', seconds: 3, desc: 'Narrow hallway, two figures framed by a doorway' },
        { size: 'medium', shot: 'Medium', seconds: 3, desc: 'They pass on the stairs in slow motion, almost touching' },
        { size: 'close', shot: 'Close-up', seconds: 2, desc: 'Her face behind a window frame, looking away' },
        { size: 'close', shot: 'Close-up', seconds: 2, desc: 'His hand hesitates at the door, then lets go' },
      ],
      prompt: [
        'Cut 1 — Wide, 3s. Narrow, warm-lit hallway. Two figures framed inside a doorway, a wall between them.',
        'Cut 2 — Medium, 3s. They pass each other on the stairs in slow motion. Shoulders almost touch. No eye contact.',
        'Cut 3 — Close-up, 2s. Her face behind a window frame, looking away. Holding still.',
        'Cut 4 — Close-up, 2s. His hand rests on the door handle, hesitates, and lets go.',
      ].join('\n'),
    },
    ours: ours(),
  },
];
