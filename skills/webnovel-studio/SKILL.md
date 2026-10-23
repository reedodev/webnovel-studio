---
name: "webnovel-studio"
description: "웹소설 신작 기획, 설정집, 황금 3화, 회차 집필, 검수, 비축분 연재 운영, 주간 독자 반응 점검, 영어 번역 연재, 영문·한국·일본 시장 교차 시나리오 합성을 한 흐름으로 처리한다. 웹소설, 연재, 신작 구상, 몇 화로 구성, 상위 10개 조사, 비축분, 회차 쓰기, 영어판 연재, Royal Road, Wattpad, Webnovel, Scribble Hub, Novelpia, Munpia, web novel, serial fiction을 말할 때 사용한다. 작품 폴더에 workflow.md가 이미 있으면 그 지침이 먼저고 이 스킬은 빠진 부분을 채운다."
---

# 웹소설 스튜디오

연재 작가가 실제로 돌리던 운영 방식(설정집, 화별 기록, 비축분, 주간 독자 반응 점검, 영문 4개 사이트 번역 연재)을 바탕으로, 공개 GitHub 소설 스킬 중 쓸 만한 부분만 합친 작업 틀이다.

## 준비물 (쓰기 전에 있어야 하는 것)
| 구분 | 무엇 | 없으면 |
|---|---|---|
| 필수 | 작품 폴더 하나(원고 txt와 설정집을 둘 곳) | 스킬이 `references/book-setup.md` 구조로 새로 만든다 |
| 필수 | Node.js 18 이상(검사 도구 3개를 돌린다) | 도구만 못 쓰고 나머지 절차는 그대로 쓸 수 있다 |
| 권장 | 원고 형식: 첫 줄 회차 제목, 둘째 줄 빈 줄, 이후 본문 | `--skip` 옵션으로 줄 수를 바꾼다 |
| 권장 | 인터넷이 되는 브라우저 도구(시장 조사용) | 사용자가 순위 목록을 붙여 넣으면 된다 |
| 선택 | 이전 화 원고와 ledger.json | 앞 화와의 겹침 점검과 기록 빈틈 점검만 빠진다 |

## 이렇게 말하면 바뀝니다
| 이렇게 말하세요 | 바뀌는 것 |
|---|---|
| "영문·한국·일본 상위작 보고 신작 시나리오 골라 줘" | 시장 교차 합성과 후보 점수, 기획 검수 (`scenario-synthesis.md`) |
| "총 몇 화로 구성할지 상위 10개 보고 정해 줘" | 분량·화수 근거 조사와 구간 계약 (`market-scan.md`, `planning-windows.md`) |
| "1~3화 설계표부터 만들어 줘" | 황금 3화 미세 설계 (`golden-three.md`) |
| "다음 화 써 줘" | 읽기, 사실 잠금, 비트 설계, 기계 점검까지 (`chapter-loop.md`) |
| "1화 조회가 안 나와, 제목이랑 소개글 봐 줘" | 패키징과 유입 점검 (`packaging.md`) |
| "독자가 어디서 빠지는지 봐 줘" | 이탈 유형과 8항목 진단 (`retention-and-paid.md`) |
| "영어로 번역해서 올릴 계획 짜 줘" | 번역과 사이트별 순서 (`english-serial.md`) |
| "이 기획서 냉정하게 검수해 줘" | 자체 점검과 독립 검수 (`review.md`, `scenario-synthesis.md`) |
| "분량 기준을 3,000자로 바꿔 줘" | `--min` 옵션으로 분량 기준을 바꾼다 |

## 지킬 것
- 사용자에게는 쉬운 말로 이야기한다. 이모지와 em dash는 쓰지 않는다.
- 작품 폴더에 workflow.md, bible.md, ledger.json, feedback.md가 있으면 그것이 이 스킬보다 우선이다. 작품별 규칙을 이 스킬로 덮어쓰지 않는다.
- 외부 사이트 게시, 새 작품 등록, 사이트 가입은 사이트, 작품, 회차마다 작가의 분명한 지시를 받은 뒤에만 한다. 표지 번호 선택이나 "진행해"는 게시 승인이 아니다. 작가가 미리 승인해 둔 예약 연재(작품 workflow.md가 정한 사이트, 하루 한도, 시각)는 그 범위 안에서만 올리고, 범위 밖의 게시는 다시 확인받는다.
- 외부 문의와 메일은 하지 않는다.
- 이미 쓴 회차와 이미 올린 회차를 다시 쓰거나 다시 올리지 않는다. 고치려면 작가의 결정을 받는다.
- 스크립트 PASS와 점수는 글의 재미와 사실 확인을 대신하지 못한다. 직접 읽고 판단한 것과 도구로 센 것을 구분해 보고한다.

## 작업별로 읽을 문서 (필요한 한 줄만 읽는다)
| 작업 | 읽을 문서 |
|---|---|
| 영문·한국·일본 시장을 교차해 최적의 신작 시나리오를 고를 때, 기획 검수 | `references/scenario-synthesis.md` (시장 자료 `references/markets-learned.md`, 겹침 기준 `references/works-registry.md`, 계산 `scripts/scenario-score.cjs`) |
| 상위 작품 조사, 장르와 분량 정하기 | `references/market-scan.md` |
| 제목, 소개글, 태그, 유입이 적을 때 | `references/packaging.md` |
| 독자 이탈 진단, 유료화 지점 | `references/retention-and-paid.md` |
| 새 작품 시작, 설정집, 상태 파일, 복선 장부, 능력 설계표, 말투표 | `references/book-setup.md` |
| 총 몇 화, 아크와 50화 구간, 5화 예산 | `references/planning-windows.md` |
| 1~3화 설계 | `references/golden-three.md` |
| 회차 한 편 쓰기 | `references/chapter-loop.md` |
| 원고 검수, 독자 시점 점검, 문체 신호, 현실 사실 검증 | `references/review.md` |
| 비축분, 게시, 기록, 주간 독자 반응 | `references/serial-ops.md` |
| 한국어 원문을 영어로 번역해 연재 | `references/english-serial.md` |

## 회차 한 편의 최단 길
1. 작품 폴더 지침, feedback.md의 최신 지시, bible.md 문체 원칙, 오늘 구간 계획, state.md, 직전 3화 요약과 열린 복선, 직전 2화 끝 40줄을 읽는다.
2. 이번 화에서 바꾸면 안 되는 사실을 5~10줄로 적는다(사실 잠금).
3. 3~5개 장면으로 설계한다. 글자 수 구간, 핵심 대사 한두 줄, 마지막 장면 그림 한 줄을 정한다.
4. 쓴다. 첫 3문단 안에 행동이나 위험, 압도 장면 1회, 말도 안 된다는 반응 1회, 마지막 2문단에 다음 화를 누르게 하는 훅.
5. `node scripts/chapter-check.cjs <원고>`로 분량, 문단, 끝맺음 반복, 앞 화와 겹침을 센다.
6. `references/review.md`의 항목으로 점검하고 약한 부분만 고친다(최대 2회).
7. state.md와 ledger.json에 요약, 복선, 회수, 바뀐 상태를 적고 `node scripts/ledger-check.cjs <ledger.json>`으로 기록 빈틈을 본다.

## 출처와 영감
GitHub의 MIT·Apache-2.0 소설 스킬에서 방식만 참고했다(문장과 코드는 복사하지 않음). 자세한 목록과 링크는 저장소 README의 「출처와 영감」에 있다.