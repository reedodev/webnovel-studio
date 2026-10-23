// Runs the three checkers against small fixtures. Exit 0 = all passed.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const scripts = path.join(here, '..', 'scripts');
const fx = (f) => path.join(here, 'fixtures', f);
const run = (script, args) => {
  const r = spawnSync('node', [path.join(scripts, script), ...args], { encoding: 'utf8' });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
};
let fails = 0;
const check = (name, cond, detail = '') => { console.log((cond ? 'ok   ' : 'FAIL ') + name + (cond ? '' : '  ' + detail)); if (!cond) fails++; };

let r = run('chapter-check.cjs', [fx('ch-ok.txt'), '--min', '200', '--prev', fx('ch-prev.txt')]);
check('chapter ok: exit 0, no WARN', r.code === 0 && !/\[WARN\]/.test(r.out), r.out);
r = run('chapter-check.cjs', [fx('ch-short.txt'), '--min', '200']);
check('chapter too short: FAIL exit 1', r.code === 1 && /\[FAIL\]/.test(r.out), r.out);
r = run('chapter-check.cjs', [fx('ch-bad.txt'), '--min', '100']);
check('bad prose signals are flagged', /감정 텔링/.test(r.out) && /빈 수식어/.test(r.out) && /요약형 마무리/.test(r.out), r.out);
r = run('chapter-check.cjs', [fx('ch-terms.txt'), '--min', '10', '--terms', fx('terms.json')]);
check('mixed term spelling is flagged', /용어 표기가 섞임/.test(r.out), r.out);
r = run('chapter-check.cjs', [fx('en-ok.txt'), '--lang', 'en', '--min', '60', '--skip', '2']);
check('english chapter passes', r.code === 0, r.out);

r = run('ledger-check.cjs', [fx('ledger-ok.json'), '--reserve', '1', '--dir', here + '/fixtures']);
check('ledger ok: exit 0', r.code === 0 && !/\[(WARN|FAIL)\]/.test(r.out), r.out);
r = run('ledger-check.cjs', [fx('ledger-bad.json'), '--dir', here + '/fixtures']);
check('ledger bad: number gap is FAIL', r.code === 1 && /번호 빈틈/.test(r.out), r.out);

r = run('ledger-check.cjs', [fx('ledger-simple-ok.json'), '--reserve', '1', '--dir', here + '/fixtures']);
check('ledger (lastPublished/ready format): exit 0 and platform gap flagged', r.code === 0 && /lastPublished\/ready 방식/.test(r.out) && /플랫폼 naver/.test(r.out), r.out);

r = run('scenario-score.cjs', [fx('candidates.json')]);
const lines = r.out.split('\n');
const iA = lines.findIndex((l) => /1순위\s+A/.test(l));
check('scenario score: A ranks first, B gated out', iA >= 0 && /탈락.*B/.test(r.out), r.out);
check('scenario score: no-evidence scores count as 0', /근거 없어 0점 처리|C\s+0\.0점|0\.0점/.test(r.out), r.out);

console.log(fails ? `\n${fails} FAILED` : '\nall passed');
process.exit(fails ? 1 : 0);