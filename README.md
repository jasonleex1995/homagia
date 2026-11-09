# Homagia

**Directing-reference search for a billion creators.**

Describe how a scene should feel. Homagia shows you how the masters already shot it, then turns it into a cut-by-cut recipe your video model can follow.

- **Project page:** https://jasonleex1995.github.io/homagia/
- **Demo video:** coming soon

Built at c0mpiled-17: Seoul (Nov 9, 2026) by Team Yonsei.

## The problem

AI creators can picture a shot but can't describe it. So they reroll again and again, burning time and credits. Longer, GPT-written prompts don't fix it: models drop or misread the details that carried the feeling.

People can't direct, but they recognize great directing when they see it.

## How Homagia works

1. **Intent search.** Search with a plain sentence. Scenes that create the same feeling are grouped together, even when their styles differ.
2. **Direction breakdown.** Each reference comes with technique chips and a one-line *why it works*.
3. **Reference to recipe.** The chosen scene becomes a cut-by-cut recipe (shot size, timing, action) and a short prompt ready for Seedance, Kling, or Veo.

## Repository layout

| Path | What it is |
|---|---|
| `site/` | The project page (Vite, React, TypeScript, Tailwind CSS, Motion) |
| `site/src/data/scenarios.ts` | All page content: prompts, takes, references, recipes |
| `site/public/media/` | Web-encoded clips (`.mp4` full, `.sm.mp4` grid tile, `.jpg` poster) |
| `scripts/encode.sh` | Converts raw clips into web-ready files |
| `.github/workflows/deploy.yml` | Builds the page and deploys it to GitHub Pages |

## Run locally

```bash
cd site
npm install
npm run dev   # http://localhost:5173/homagia/
```

## Add results

```bash
scripts/encode.sh raw   # raw/ → site/public/media/ (full quality, 480p tile, poster)
```

Then point the scenario in `site/src/data/scenarios.ts` at the new files and remove `placeholder: true`.

## Team

- Jaeseong Lee — AI, Backend
- Minji Kim — Frontend, UI/UX Design
- Seongyeon Park — PM, Data Analysis, Marketing

Film excerpts are short references used for research and demonstration. All rights belong to their respective owners.
