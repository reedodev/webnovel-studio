#!/usr/bin/env node
// 시나리오 후보 점수 계산(계산만 한다. 점수는 사람이 근거를 보고 정한다).
// 사용: node scenario-score.cjs <candidates.json>
// 형식: { "weights": {...선택...}, "candidates": [ { "name": "...", "gates": { "overlap":true|false, ... }, "scores": { "영문":4, ... }, "evidence": { "영문":"근거 한 줄", ... } } ] }
// gates 값이 true 이면 "걸림"(탈락 사유). 근거 칸이 비어 있는 점수는 0점으로 센다.
const fs = require('fs');
const DEFAULT_W = { 영문: 1.0, 한국: 1.5, 일본: 1.0, 반복보상: 1.5, 차별성: 1.5, 생산성: 1.0, 사실확보: 1.0, 한줄의힘: 1.0 };
const GATES = { 겹침: '기존 작품과 둘 이상 겹침', 정책: 'AI 정책에 걸림', 지속: '80화 이상 반복 보상 루프 없음', 사실: '현실 수치·절차 확인 길 없음', 등급: '이용 등급 범위 이탈' };

const f = process.argv[2];
if (!f) { console.log('사용: node scenario-score.cjs <candidates.json>'); process.exit(2); }
const data = JSON.parse(fs.readFileSync(f, 'utf8').replace(/^\uFEFF/, ''));
const W = Object.assign({}, DEFAULT_W, data.weights || {});
const maxTotal = Object.values(W).reduce((a, b) => a + b * 5, 0);
const rows = [];
for (const c of data.candidates || []) {
  const used = {}; const missing = [];
  let total = 0;
  for (const k of Object.keys(W)) {
    let s = Number((c.scores || {})[k] ?? 0);
    const ev = ((c.evidence || {})[k] || '').trim();
    if (!ev && s > 0) { missing.push(k); s = 0; }
    s = Math.max(0, Math.min(5, s));
    used[k] = s; total += s * W[k];
  }
  const hit = Object.keys(GATES).filter((g) => (c.gates || {})[g] === true);
  rows.push({ name: c.name, total, pct: (100 * total / maxTotal), used, hit, missing });
}
rows.sort((a, b) => (a.hit.length ? 1 : 0) - (b.hit.length ? 1 : 0) || b.total - a.total);
console.log(`가중 만점 ${maxTotal.toFixed(1)}`);
rows.forEach((r, i) => {
  const status = r.hit.length ? `탈락(${r.hit.map((g) => GATES[g]).join('; ')})` : `${i + 1}순위`;
  console.log(`${status}  ${r.name}  ${r.total.toFixed(1)}점 (${r.pct.toFixed(0)}%)`);
  console.log('   ' + Object.entries(r.used).map(([k, v]) => `${k} ${v}`).join(' / '));
  if (r.missing.length) console.log(`   근거 없어 0점 처리: ${r.missing.join(', ')}`);
});
console.log('--- 점수는 사람이 매긴 추정이며 도구는 합산만 한다. 상위 후보는 scenario-synthesis.md 5번 반증 단계를 거칠 것.');
