import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const root = new URL('../', import.meta.url);
const packageVersion = JSON.parse(readFileSync(new URL('package.json',root),'utf8')).version;
const clientVersion = JSON.parse(readFileSync(new URL('client/package.json',root),'utf8')).version;
const source = readFileSync(new URL('client/src/main.js',root),'utf8');

test('release versions are identical across the root package, client package and UI',()=>{
 assert.equal(clientVersion,packageVersion);
 assert.ok(source.includes(`COMPASS_CLIENT_VERSION='${packageVersion}'`));
});
test('quick actions remain available in the global header at locked vault',()=>{
 assert.match(source,/\$\{worktimeQuickButton\(\)\}\$\{habitQuickButton\(\)\}/);
 assert.match(source,/appendSealedWorktime\(entry\)/);
 assert.match(source,/appendSealedHabit\(entry\)/);
});
