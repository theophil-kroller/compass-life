# Compass Pages Deployment Hotfix 0.5.91.20.1

## Base and scope

Base: Compass 0.5.91.20, GitHub `main`, commit `8484b5a8ad15e210dec01e82e7c0cb7963d3021e`.
This is **a workflow-only hotfix**. The Compass application version stays **0.5.91.20**.
No app JavaScript, user data, Firebase/Cloudflare/worker configuration, FITDays imports, health, or training code is changed.

## Diagnosis from actual GitHub Actions jobs

- Push run `41893496817`: checks, dependencies, `npm run build`, and Pages upload succeeded; `deploy-pages@v4` hung at `updating_pages` until its 600-second timeout.
- Rerun attempt 2 of `41893496817`: duplicate `github-pages` artifacts in the same workflow-run ID.
- New independent manual run `41898747563`: **again** passed build and artifact upload; Pages publication status stayed empty / pending until its 600-second timeout.
- Successful run `41889517704` deployed a Pages artifact of 41,686,169 bytes; the failing new manual run used 41,692,320 bytes. This small size difference is not proof of an asset-size problem.
- Failures are happening within GitHub Pages deployment processing, **not** during app compilation. GitHub's service-side 10-minute Pages limit cannot be bypassed by setting a very large action timeout.

## Changes

1. Split into an independent `build` job and a dependent `deploy` job, matching GitHub's recommended workflow structure.
2. Use `actions/upload-pages-artifact@v5` and `actions/deploy-pages@v5.0.1` (newer status polling with jitter/backoff).
3. Name artifacts `github-pages-${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}` and pass the exact generated name via a build job output. This avoids ambiguous matching when all jobs are rerun, while a **failed-only deploy job rerun** reuses the correct build output/artifact.
4. Keep source snapshots in `compass-full-source-${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}`, so reruns do not collide either.
5. Disable `cancel-in-progress` to prevent a fresh push from cancelling an active deployment; concurrency still serializes releases.
6. If a Pages publish fails, start **one** new workflow run (`recovery_attempt=1`), subject to the GitHub Actions token and repository permissions. That run does **not** dispatch another. The original failed run remains red and is not misleadingly marked successful.
7. Add payload sanity check and actionable failure summary.

## Install

On GitHub `main`, upload the ZIP patch's files **at the repository root**, preserving `.github/workflows/deploy-pages.yml`. Alternatively upload the Full Source ZIP. Uploading the patch to main triggers the revised workflow automatically; **do not rerun the old run**.

Check: https://github.com/theophil-kroller/compass-life/actions/workflows/deploy-pages.yml

If repeated 10-minute `updating_pages` timeouts persist, this is **not fixable in Compass app code**. Check GitHub `Settings → Pages → Build and deployment` is set to `GitHub Actions`, `Settings → Environments → github-pages` has no blocking rules, and contact GitHub Support with the run IDs above. Switching source briefly away from and back to GitHub Actions is a manual recovery option that can affect live publication.

## Verification limitations

The test included in this patch validates workflow structure and bounded retry. A green GitHub Pages deployment can only be confirmed after installing the workflow on GitHub; local testing cannot replicate GitHub's production Pages service.
