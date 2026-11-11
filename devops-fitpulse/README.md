# FitPulse Gym case study (Q1 · Q2 · Q3) — executed run + Hinglish explainer

Covers pages 0–10 of *DevOps Practical — Case Studies*: guide, FitPulse Q1 (FP-101),
Q2 (FP-102), Q3 (FP-103) and the examiner checklist.

- `FitPulse_Q1-Q3_Hinglish_explainer.mp4` — 16:9, 1080p, ~18.5 min, Hinglish voice-over, starts from zero
- `screenshots/` — terminal output of every step, captured from a real run (git 2.43)

## Video chapters

| Time | Chapter |
|---|---|
| 00:00 | Intro + plan |
| 00:37 | Basics — Git, commit, repo, staging, GitHub, branch/PR, CI |
| 04:20 | Q1 — config, init, .gitignore, two commits, remote, push |
| 10:37 | Q2 — feature branch, Pull Request, merge, pull, delete branch, graph |
| 14:06 | Q3 — GitHub Actions workflow, green run, red run, restore |
| 17:28 | Examiner checklist + final history graph |

## Lab notes

- The remote is a local bare repository (`/srv/github/pruthvi-dev/fitpulse.git`) standing in for
  GitHub. On a real machine use `https://github.com/<your-user>/fitpulse.git`; all other commands are the same.
- GitHub web screens (new repository, Pull Request, Actions tab) are illustrations, as in the guide.
- The Q2 merge was made server-side with `git merge --no-ff`, which creates the same merge commit as
  GitHub's "Merge pull request" button.
- The Q3 run logs come from executing the `run:` steps of the pushed `fitpulse-ci.yml` on a fresh
  checkout of `main` (pass → fail with "plans.html is missing" → pass).
