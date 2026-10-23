#!/usr/bin/env node
// 웹소설 원고 기계 점검. 분량, 문단 길이, 끝맺음 반복, 앞 화와 겹침을 센다.
// 사용: node chapter-check.cjs <원고.txt> [--min N] [--lang ko|en] [--prev 파일]... [--skip 2] [--ban 단어,단어]
// 첫 줄 제목, 둘째 줄 빈 줄, 이후 본문 형식을 기본으로 한다(--skip 2).
// 이 점검은 재미, 사실, 문장 품질을 판단하지 못한다. 통과해도 직접 읽어야 한다.
const fs = require('fs');

const argv = process.argv.slice(2);
if (!argv.length || argv[0].startsWith('--')) {
  console.log('사용: node chapter-check.cjs <원고.txt> [--min N] [--lang ko|en] [--prev 파일]... [--skip 2] [--ban 단어,단어]');
  process.exit(2);
}
const file = argv[0];
const opt = { prev: [], lang: 'ko', skip: 2, min: null, ban: [] };
for (let i = 1; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--min') opt.min = Number(argv[++i]);
  else if (a === '--lang') opt.lang = argv[++i];
  else if (a === '--prev') opt.prev.push(argv[++i]);
  else if (a === '--skip') opt.skip = Number(argv[++i]);
  else if (a === '--ban') opt.ban = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
  else if (a === '--terms') opt.terms = argv[++i];
}
const ko = opt.lang !== 'en';
if (opt.min == null) opt.min = ko ? 3500 : 1800;

const out = [];
let fail = 0, warn = 0;
const say = (lv, msg) => { out.push(`[${lv}] ${msg}`); if (lv === 'FAIL') fail++; if (lv === 'WARN') warn++; };

function bodyOf(path, skip) {
  const lines = fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/);
  return { title: (lines[0] || '').trim(), lines: lines.slice(skip) };
}
const { title, lines } = bodyOf(file, opt.skip);
const body = lines.join('\n');
const paras = lines.map((l) => l.trim()).filter(Boolean);
const size = (s) => (ko ? s.replace(/\s/g, '').length : s.split(/\s+/).filter(Boolean).length);
const unit = ko ? '자(공백 제외)' : '단어';

// 1. 분량
const total = size(body);
out.push(`제목: ${title}`);
out.push(`분량: ${total}${unit} (기준 ${opt.min}) / 문단 ${paras.length}개`);
if (total < opt.min) say('FAIL', `분량 부족: ${total} < ${opt.min}`);

// 2. 문단 길이(모바일 가독성)
const lens = paras.map(size);
const avg = lens.reduce((a, b) => a + b, 0) / (lens.length || 1);
const maxLen = ko ? 150 : 120;
const avgLim = ko ? 50 : 45;
const longOnes = lens.map((n, i) => [n, i + 1]).filter(([n]) => n > maxLen);
out.push(`문단 평균 ${avg.toFixed(1)}, 최장 ${Math.max(0, ...lens)}`);
if (avg > avgLim) say('WARN', `문단 평균이 ${avgLim}을 넘음: ${avg.toFixed(1)}`);
if (longOnes.length) say('WARN', `${maxLen} 초과 문단 ${longOnes.length}개 (문단 번호 ${longOnes.slice(0, 8).map((x) => x[1]).join(', ')})`);

// 3. 대사 비중
const isDialogue = (p) => /^["“‘'「『\[]/.test(p);
const dlg = paras.filter(isDialogue).length;
out.push(`대사/알림으로 시작하는 문단 비율: ${(100 * dlg / (paras.length || 1)).toFixed(0)}%`);
if (paras.length >= 20 && dlg / paras.length < 0.2) say('WARN', '대사 비율이 20% 미만: 설명이 길지 않은지 확인');

// 4. 문장 끝맺음 반복(한국어만)
if (ko) {
  const sents = body.split(/(?<=[.!?…])["”’')\]]*\s+/).map((s) => s.trim()).filter((s) => s.length > 3 && !isDialogue(s));
  const endOf = (s) => s.replace(/[.!?…"”’')\]\s]+$/g, '').slice(-2);
  let run = 1, maxRun = 1, runEnd = '';
  for (let i = 1; i < sents.length; i++) {
    if (endOf(sents[i]) === endOf(sents[i - 1])) { run++; if (run > maxRun) { maxRun = run; runEnd = endOf(sents[i]); } } else run = 1;
  }
  out.push(`지문 문장 ${sents.length}개, 같은 끝맺음 연속 최대 ${maxRun}회`);
  if (maxRun >= 5) say('WARN', `끝맺음 "${runEnd}" 이 ${maxRun}번 연속`);
  const freq = {};
  sents.forEach((s) => { const e = endOf(s); freq[e] = (freq[e] || 0) + 1; });
  const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
  if (top && sents.length >= 20) out.push(`가장 많은 끝맺음 "${top[0]}" ${(100 * top[1] / sents.length).toFixed(0)}%`);
  if (top && sents.length >= 20 && top[1] / sents.length > 0.5) say('WARN', `끝맺음 "${top[0]}" 가 절반을 넘음`);
}

// 4-1. AI 투/번역투 신호(한국어만). 기존 연재 원고 64화 측정값 기준으로 잡은 문턱이며, 넘으면 WARN만 낸다.
if (ko) {
  const tells = [
    ['감정 텔링(슬픔을 느꼈다류)', /(슬픔|분노|기쁨|배신감|두려움|공포|불안|절망|안도|당혹감|초조함)(을|이|가|를)\s?(느꼈다|느꼈|치밀었다|밀려왔다|몰려왔다|밀려들었다)/g, 0.5],
    ['마치 ~같았다 비유', /마치[^.\n]{0,40}(같았다|듯했다|듯이|처럼)/g, 0.6],
    ['그 순간/바로 그때', /그 순간|바로 그때|그때였다|순간이었다/g, 0.9],
    ['빈 수식어(매우/정말/굉장히/너무)', /매우|정말|굉장히|너무/g, 1.1],
    ['문어체(하였다/되었다)', /하였다|되었다/g, 1.1],
    ['~것이었다 번역투', /것이었다|것이다\./g, 1.8],
    ['동시 묘사(하며 ... 하며)', /하며[^.\n]{0,40}하며/g, 0.5],
    ['문두 접속사', /(^|\n)\s*(그리고|하지만|그러나|또한)\s/g, 1.1],
    ['그는/그녀는 주어 반복', /(^|\s)(그는|그녀는)\s/g, 5.0],
    ['요약형 마무리(그렇게 ~시작되었다)', /그렇게[^.\n]{0,40}(시작되었다|저물었다|끝났다|시작됐다)/g, 0.5],
  ];
  const per = Math.max(1, size(body)) / 1000;
  for (const [name, re, lim] of tells) {
    const hits = (body.match(re) || []).length;
    const dens = hits / per;
    if (dens > lim) say('WARN', `${name}: ${hits}회 (1000자당 ${dens.toFixed(2)}, 기준 ${lim} 초과)`);
  }
  out.push('AI 투 신호 점검 끝(설교조·말투 구분은 사람이 읽어 판단)');
}

// 5. 같은 화 안 중복 문단
const seen = new Map();
const dupList = [];
paras.forEach((p, i) => { if (size(p) >= (ko ? 20 : 8)) { if (seen.has(p)) dupList.push(p); else seen.set(p, i); } });
if (dupList.length) say('WARN', `같은 문단이 다시 나옴 ${dupList.length}개 (예: "${dupList[0].slice(0, 30)}")`);

// 6. 앞 화와 겹침
const norm = (s) => (ko ? s.replace(/\s/g, '') : s.toLowerCase().replace(/\s+/g, ' '));
function shingles(text) {
  const set = new Set();
  if (ko) { const t = norm(text); for (let i = 0; i + 15 <= t.length; i++) set.add(t.slice(i, i + 15)); }
  else { const w = norm(text).split(' '); for (let i = 0; i + 8 <= w.length; i++) set.add(w.slice(i, i + 8).join(' ')); }
  return set;
}
const mine = shingles(body);
for (const pf of opt.prev) {
  try {
    const pb = bodyOf(pf, opt.skip);
    const ps = shingles(pb.lines.join('\n'));
    let hit = 0; mine.forEach((s) => { if (ps.has(s)) hit++; });
    const ratio = mine.size ? hit / mine.size : 0;
    out.push(`앞 화(${pf.split(/[\\/]/).pop()})와 겹치는 구간 비율: ${(100 * ratio).toFixed(1)}%`);
    if (ratio > 0.03) say('WARN', `${pf.split(/[\\/]/).pop()} 와 겹침 ${(100 * ratio).toFixed(1)}% : 복사된 장면이나 대사가 없는지 확인`);
    const pp = new Set(pb.lines.map((l) => l.trim()).filter((l) => size(l) >= (ko ? 20 : 8)));
    const dup = paras.filter((p) => pp.has(p));
    if (dup.length) say('WARN', `앞 화와 똑같은 문단 ${dup.length}개: "${dup[0].slice(0, 30)}"`);
    const pLast = pb.lines.map((l) => l.trim()).filter(Boolean).slice(-2);
    const myLast = paras.slice(-2);
    if (pLast.length && myLast.length && pLast[pLast.length - 1] === myLast[myLast.length - 1]) say('WARN', '마지막 문단이 앞 화와 같음');
  } catch (e) { say('WARN', `앞 화 읽기 실패: ${pf}`); }
}

// 7. 금지어
for (const b of opt.ban) { const n = body.split(b).length - 1; if (n) say('WARN', `금지어 "${b}" ${n}회`); }

// 7-1. 용어 표기 일관성: --terms 파일(JSON 배열 [["마법진","봉인진"],["검은문","검은 문"]])의 한 묶음 안 표기가 한 화에 둔 이상 섞여 있으면 WARN
if (opt.terms) {
  try {
    const groups = JSON.parse(fs.readFileSync(opt.terms, 'utf8').replace(/^\uFEFF/, ''));
    for (const g of groups) {
      const found = g.filter((t) => body.includes(t));
      if (found.length > 1) say('WARN', `용어 표기가 섞임: ${found.join(' / ')}`);
    }
    out.push(`용어 표기 묶음 ${groups.length}개 점검 끝`);
  } catch (e) { say('WARN', `terms 파일 읽기 실패: ${opt.terms}`); }
}

// 8. 사람이 직접 봐야 할 부분
const cut = (s) => (s.length > 70 ? s.slice(0, 70) + '…' : s);
out.push('--- 첫 3문단 (행동·위험이 바로 나오는지 직접 확인)');
paras.slice(0, 3).forEach((p, i) => out.push(`${i + 1}) ${cut(p)}`));
out.push('--- 마지막 2문단 (다음 화를 누르게 하는지 직접 확인)');
paras.slice(-2).forEach((p, i) => out.push(`${i + 1}) ${cut(p)}`));
out.push(`--- 결과: FAIL ${fail}, WARN ${warn}. 기계 점검이며 재미와 사실 확인을 대신하지 못함.`);
console.log(out.join('\n'));
process.exit(fail ? 1 : 0);
