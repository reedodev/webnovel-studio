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

// 두 번째 형식: { lastPublished, totalPlanned, ready: {"50":"final/ep50.md"}, munpia:{lastPublished}, naver:{lastPublished} }
if (!eps.length && !Array.isArray(data) && Number.isInteger(data.lastPublished)) {
  const o2 = []; let w2 = 0;
  const say2 = (m) => { o2.push('[WARN] ' + m); w2++; };
  const last = data.lastPublished;
  const readyKeys = Object.keys(data.ready || {}).map(Number).filter(Number.isInteger).sort((a, b) => a - b);
  o2.unshift('형식: lastPublished/ready 방식. 마지막 공개 ' + last + '화' + (Number.isInteger(data.totalPlanned) ? ' / 계획 ' + data.totalPlanned + '화(' + Math.round(100 * last / data.totalPlanned) + '%)' : '') + ', 대기 ' + readyKeys.length + '화 [' + readyKeys.join(', ') + ']');
  if (readyKeys.length && readyKeys[0] !== last + 1) say2('대기 첫 번호가 ' + (last + 1) + '화여야 하는데 ' + readyKeys[0] + '화');
  for (let i = 1; i < readyKeys.length; i++) if (readyKeys[i] !== readyKeys[i - 1] + 1) say2('대기 번호가 이어지지 않음: ' + readyKeys[i - 1] + ' 다음 ' + readyKeys[i]);
  for (const k of readyKeys) { const rel = data.ready[String(k)]; if (typeof rel === 'string' && !fs.existsSync(path.join(dir, rel))) say2('대기 ' + k + '화 원고 파일 없음: ' + rel); }
  for (const [k, v] of Object.entries(data)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && Number.isInteger(v.lastPublished) && v.lastPublished !== last) say2('플랫폼 ' + k + ' 마지막 공개 ' + v.lastPublished + '화가 대표값 ' + last + '화와 다름(의도한 차이인지 확인)');
  }
  const lastFile = ['final/ep' + String(last).padStart(2, '0') + '.md', 'final/ep' + last + '.md', 'ep' + String(last).padStart(3, '0') + '.txt'].find((p) => fs.existsSync(path.join(dir, p)));
  if (!lastFile) say2('마지막 공개 ' + last + '화 원고 파일을 final/ 에서 찾지 못함(다른 폴더로 옮겼다면 무시)');
  if (readyKeys.length < reserveTarget) say2('비축분 ' + readyKeys.length + '화 < 목표 ' + reserveTarget + '화');
  o2.push('--- 결과: FAIL 0, WARN ' + w2 + '. 기록 형식만 점검함(게시 여부는 사이트 목록으로 대조해야 함).');
  console.log(o2.join('\n'));
  process.exit(0);
}
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
