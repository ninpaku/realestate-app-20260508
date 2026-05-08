# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Real estate application (realestate-app-20260508). This file will be updated as the project structure evolves.

## Repository

GitHub: https://github.com/ninpaku/realestate-app-20260508.git

## Git Workflow Rules

**Every code change must be committed and pushed to GitHub immediately after it is made.**

Follow this sequence after any file change:

```
git add <changed files>
git commit -m "<descriptive message>"
git push origin main
```

- Stage specific files rather than `git add .` to avoid committing unintended files
- Write clear, descriptive commit messages that explain what changed and why
- Never accumulate multiple unrelated changes in a single commit — commit each logical unit separately
- Always verify `git status` before committing to confirm only intended files are staged
- If a push fails due to upstream changes, run `git pull --rebase origin main` then push again
