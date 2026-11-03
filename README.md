# Moved to cardtroca/atlas

This repository is archived and read-only. The CardTroca site now lives in
[`cardtroca/atlas`](https://github.com/cardtroca/atlas), at
[`web/apps/site/`](https://github.com/cardtroca/atlas/tree/main/web/apps/site),
with this repository's full history (CARD-382).

| Here | In atlas |
|---|---|
| everything at the root | `web/apps/site/` |
| `docs/superpowers/` | `docs/archive/superpowers/site/` (history only) |
| `.claude/` | atlas's `.claude/` and `web/CLAUDE.md` |
| npm and `package-lock.json` | the root Yarn workspace (`yarn install` at atlas's root) |
| Vercel's Git integration | AWS ECS, deployed only by atlas's `deploy` workflow (CARD-394) |

Start with atlas's [`README.md`](https://github.com/cardtroca/atlas/blob/main/README.md)
and [`web/CLAUDE.md`](https://github.com/cardtroca/atlas/blob/main/web/CLAUDE.md).
Nothing here builds, deploys or runs any more.
