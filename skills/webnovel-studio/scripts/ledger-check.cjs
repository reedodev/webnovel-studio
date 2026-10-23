#!/usr/bin/env node
// ledger.json 기록 빈틈 점검 (읽기 전용).
// 사용: node ledger-check.cjs <ledger.json> [--reserve 3] [--dir 원고폴더]
// 형식: { episodes: [ { no, file, title, posted, postedAt, viewer, summary[], plants[], payoffs[], buffer } ] }
const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
if (!argv.length) { console.log('사용: node ledger-check.cjs <ledger.json> [--reserve 3] [--dir 원고폴더]'); process.exit(2); }
const lf = argv[0];
let reserveTarget = 3, dir = path.dirname(path.resolve(lf));
for (let i = 1; i < argv.length; i++) {
  if (argv[i] === '--reserve') reserveTarget = Number(argv[++i]);
  else if (argv[i] === '--dir') dir = argv[++i];
}
const data = JSON.parse(fs.readFileSync(lf, 'utf8').replace(/^\uFEFF/, ''));
const eps = Array.isArray(data) ? data : (data.episodes || []);
const out = []; let fail = 0, warn = 0;
const say = (lv, m) => { out.push(`[${lv}] ${m}`); if (lv === 'FAIL') fail++; else warn++; };

if (!eps.length) { console.log('[FAIL] episodes 가 비어 있음'); process.exit(1); }
const nos = eps.map((e) => e.no);
const seen = new Set();
nos.forEach((n) => { if (seen.has(n)) say('FAIL', `${n}화 번호 중복`); seen.add(n); });
const max = Math.max(...nos);
for (let n = 1; n <= max; n++) if (!seen.has(n)) say('FAIL', `${n}화 기록 없음(번호 빈틈)`);

let totalPlants = 0, totalPayoffs = 0;
for (const e of eps) {
  const tag = `${e.no}화`;
  if (!e.title) say('WARN', `${tag} 제목 없음`);
  if (!e.file) say('WARN', `${tag} file 없음`);
  else if (!fs.existsSync(path.join(dir, e.file))) say('WARN', `${tag} 원고 파일 없음: ${e.file}`);
  if (!Array.isArray(e.summary) || e.summary.length < 3) say('WARN', `${tag} 요약 3줄 미만`);
  if (!Array.isArray(e.plants)) say('WARN', `${tag} plants(복선) 칸 없음`); else totalPlants += e.plants.length;
  if (!Array.isArray(e.payoffs)) say('WARN', `${tag} payoffs(회수) 칸 없음`); else totalPayoffs += e.payoffs.length;
  if (e.posted === true) {
    if (!e.postedAt) say('WARN', `${tag} posted:true 인데 게시 시각 없음`);
    if (!e.viewer && !e.url) say('WARN', `${tag} posted:true 인데 주소(viewer) 없음`);
  }
  if (e.posted === false && !e.buffer) say('WARN', `${tag} 게시 전인데 buffer 표시 없음`);
}
const posted = eps.filter((e) => e.posted === true).map((e) => e.no);
const unposted = eps.filter((e) => e.posted !== true).map((e) => e.no).sort((a, b) => a - b);
const lastPosted = posted.length ? Math.max(...posted) : 0;
if (unposted.length && unposted[0] !== lastPosted + 1) say('WARN', `다음 게시 번호가 ${lastPosted + 1}화여야 하는데 게시 전 화 중 가장 작은 번호는 ${unposted[0]}화`);
posted.sort((a, b) => a - b);
for (let n = 1; n < lastPosted; n++) if (!posted.includes(n)) say('WARN', `${n}화가 게시 전인데 뒤 화(${lastPosted}화)가 이미 게시됨`);
if (unposted.length < reserveTarget) say('WARN', `비축분 ${unposted.length}화 < 목표 ${reserveTarget}화`);

out.unshift(`총 ${eps.length}화, 마지막 번호 ${max}, 게시 ${posted.length}화(마지막 ${lastPosted}화), 비축분 ${unposted.length}화 [${unposted.join(', ')}]`);
out.push(`심은 복선 항목 ${totalPlants}개, 회수 항목 ${totalPayoffs}개 (항목 수만 센 것이며 실제로 회수했는지는 직접 대조해야 함)`);
out.push(`--- 결과: FAIL ${fail}, WARN ${warn}. 기록 형식만 점검함.`);
console.log(out.join('\n'));
process.exit(fail ? 1 : 0);
