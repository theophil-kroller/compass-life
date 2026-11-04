import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const file = readFileSync(new URL('../.github/workflows/deploy-pages.yml', import.meta.url), 'utf8');

test('Pages build stays validated before upload', () => {
  for (const phrase of ['npm run check:deploy', 'npm run build', 'client/dist/index.html', 'git archive --format=zip'])
    assert.ok(file.includes(phrase), `missing ${phrase}`);
  assert.ok(file.indexOf('npm run build') < file.indexOf('Upload Pages artifact'));
});

test('two dependent jobs keep build apart from service deployment', () => {
  assert.match(file, /  build:\n/);
  assert.match(file, /  deploy:\n/);
  assert.match(file, /    needs: build/);
  assert.match(file, /actions\/deploy-pages@v5\.0\.1/);
  assert.match(file, /actions\/upload-pages-artifact@v5/);
});

test('every build attempt gets a unique Pages artifact name', () => {
  assert.match(file, /github-pages-\$\{GITHUB_RUN_ID\}-\$\{GITHUB_RUN_ATTEMPT\}/);
  assert.match(file, /pages_artifact: \$\{\{ steps\.artifact-name\.outputs\.name \}\}/);
  assert.match(file, /artifact_name: \$\{\{ needs\.build\.outputs\.pages_artifact \}\}/);
  assert.match(file, /retention-days: 7/);
});

test('retry creates fresh workflow at most once and does not hide failure', () => {
  assert.match(file, /recovery_attempt:\n/);
  assert.match(file, /inputs\.recovery_attempt != '1'/);
  assert.match(file, /gh workflow run deploy-pages\.yml --ref "\$REF_NAME" -f recovery_attempt=1/);
  assert.doesNotMatch(file, /continue-on-error:\s*true/);
  assert.match(file, /cancel-in-progress: false/);
  assert.match(file, /actions: write/);
});

test('no unofficial Pages timeout override or alternate website source', () => {
  assert.match(file, /timeout: 600000/);
  assert.match(file, /name: github-pages/);
  assert.match(file, /VITE_BASE_PATH: \/compass-life\//);
});
