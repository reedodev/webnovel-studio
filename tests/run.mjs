// Lints SKILL.md, then runs the skill's own checker tests.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const name = 'webnovel-studio';
const dir = path.join(root, 'skills', name);
const md = fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8').replace(/\r\n/g, '\n');
const fm = md.match(/^---\n([\s\S]*?)\n---\n/);
const get = (k) => ((fm && (fm[1].match(new RegExp('^' + k + ':\\s*(.*)$', 'm')) || [])[1]) || '').replace(/^"|"$/g, '');
const problems = [];
if (get('name') !== name) problems.push('front matter name must be ' + name);
const desc = get('description');
if (!desc || desc.length > 1024 || /<[a-z][^>]*>/i.test(desc)) problems.push('description missing, too long or has XML tags');
if (md.split('\n').length > 500) problems.push('SKILL.md longer than 500 lines');
for (const m of md.matchAll(/`((?:references|scripts)\/[A-Za-z0-9._-]+)`/g)) {
  if (!fs.existsSync(path.join(dir, m[1]))) problems.push('SKILL.md mentions a file that does not exist: ' + m[1]);
}
// public repo must stay free of personal details
const bad = /ReedoC|DESKTOP-|@gmail|C:\\Users/;
for (const f of fs.readdirSync(dir, { recursive: true })) {
  const p = path.join(dir, String(f));
  if (fs.statSync(p).isFile() && bad.test(fs.readFileSync(p, 'utf8'))) problems.push('personal detail found in ' + f);
}
if (problems.length) { console.log('LINT FAIL\n' + problems.join('\n')); process.exit(1); }
console.log('lint ok: ' + name);
const r = spawnSync('node', [path.join(dir, 'tests', 'test.mjs')], { stdio: 'inherit' });
process.exit(r.status ?? 1);
