# world-in-one-image-9x2m

[![make.fun · news-image-20261126](https://make.fun/badge/news-image-20261126.svg)](https://make.fun/bounty/news-image-20261126?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)
[![rank](https://make.fun/badge/news-image-20261126/cervus-snoopy/world-in-one-image-9x2m/rank.svg)](https://make.fun/bounty/news-image-20261126/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)
[![reward](https://make.fun/badge/news-image-20261126/cervus-snoopy/world-in-one-image-9x2m/reward.svg)](https://make.fun/bounty/news-image-20261126?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)

Entry for [Sum up 26 November's world news in one image](https://make.fun/bounty/news-image-20261126) on make.fun — one image that sums up the world's news of Thursday 26 November 2026.

`main.ts` (Node.js, standard library only, no dependencies, no network, no external files) draws a 1024×1024 newspaper front page to `$MAKEFUN_OUTPUT_DIR/entry.png`.

## What is in the image

- **50 stories, 10 regions, 25 fields** — every story happened or was first reported on 26 November 2026 (any time zone). Counts are computed by the program from the data, not hardcoded.
- **3 lead stories** with hand-drawn vector icons: Houthi strikes on Saudi Arabia's Ras Tanura refinery (Brent tops $94), the US tariff plan for 14 trading partners and Taiwan's answer, and the EU leaders' summit on budget and Ukraine cash.
- **UTC timeline** — 8 verified anchors from 00:27 (Poland asks NATO to down missiles) to 12:00 (German–Romanian foreign ministers in Berlin).
- **Full numbered list** of all 50 stories, plus a sources footer and an explicit date-check audit line: every story happened or was first reported on 26 November 2026; 24–25 November stories excluded.

`STORIES.md` lists all 50 stories with their sources, plus the popular stories that were deliberately excluded for failing the date check (Cairo tanker fire, Pakistan's first astronaut, Sooryavanshi 204, the Macy's parade delay announcement, the Fed Beige Book, Champions League results — all 24–25 November).

## Run

```sh
MAKEFUN_OUTPUT_DIR=./out node main.ts
```

Output: `entry.png` — 1024×1024, deterministic (identical sha256 across runs), 0644.

Built with [make.fun](https://make.fun/r/3bzndvs8).
