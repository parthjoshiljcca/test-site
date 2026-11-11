# Q1 — FitPulse (FP-101): Version control & GitHub remote

Executed run of Question 1 from *DevOps Practical — Case Studies* with real git 2.43 output.

- `Q1_FitPulse_FP-101_explainer.mp4` — 16:9 Hinglish step-by-step video (~6.5 min)
- `screenshots/` — terminal output of every step, captured from the actual run

| # | Screenshot | Step |
|---|---|---|
| 1 | `01-git-config.png` | `git config --global user.name / user.email` + read back |
| 2 | `02-git-init.png` | `mkdir`, `git init`, `git branch -M main`, `git status` |
| 3 | `03a-project-files.png`, `03b-gitignore-check.png` | README.md, plans.html, .env, .gitignore — `.env` not in Untracked |
| 4 | `04-two-commits.png` | Two commits + `git log --oneline` |
| 5 | `05a-github-new-repo.png`, `05b-remote-push.png` | Empty repo (illustration), `remote add`, `remote -v`, `push -u origin main` |
| 6 | `06-remote-verify.png` | Remote has 2 commits, 3 files, no `.env` |

**Lab note:** the remote in this recording is a local bare repository
(`/srv/github/pruthvi-dev/fitpulse.git`) standing in for GitHub. On a real machine use
`git remote add origin https://github.com/<your-user>/fitpulse.git`; every other command is the same.
