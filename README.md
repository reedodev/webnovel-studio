# webnovel-studio

[한국어](#한국어) · [English](#english)

## 한국어

**웹소설 한 편을 기획하고, 쓰고, 검수하고, 연재하는 에이전트 스킬**

[![test](https://github.com/reedodev/webnovel-studio/actions/workflows/test.yml/badge.svg)](https://github.com/reedodev/webnovel-studio/actions/workflows/test.yml)

영문·한국·일본 웹소설 상위작에서 **세 시장 중 둘 이상에서 확인된 요소만** 골라 신작 후보를 만들고, 점수와 반증으로 거른 뒤, 첫 3화 설계, 회차 집필, 검수, 비축분 연재, 주간 독자 반응 점검, 영어 번역 연재까지 한 흐름으로 안내합니다. 작은 검사 도구 3개(분량·문체 신호, 화별 기록 빈틈, 후보 점수 합산)가 들어 있습니다.

이 스킬은 스스로 글을 게시하거나, 사이트에 가입하거나, 누구에게 연락하지 않습니다. 게시는 항상 작가의 분명한 지시를 받은 뒤에 합니다.

### 처음 오셨나요? 3분 안내

**무엇을 해 주나요?** 웹소설은 100화, 200화를 이어 가야 해서 중간에 설정이 어긋나거나 소재가 마르거나 독자가 조용히 빠집니다. 이 스킬은 시작 전에 시장 근거로 후보를 고르게 하고, 연재 중에는 "바꾸면 안 되는 사실"을 적어 두게 하고, 화마다 기계 점검을 거치게 하고, 주마다 독자가 빠진 화를 보게 합니다.

| 말 | 뜻 |
|---|---|
| 스킬 | AI 도우미가 읽고 따르는 작업 설명서 폴더(`SKILL.md`)입니다 |
| 에이전트 | Claude Code처럼 파일을 읽고 도구를 돌리는 AI 도우미입니다 |
| Node.js | 검사 도구를 돌리는 프로그램입니다. 터미널에 `node -v`를 입력해 18 이상이 나오면 됩니다 |
| 설정집(bible) | 세계 규칙, 인물, 능력과 대가, 문체 원칙을 적어 두는 문서입니다 |
| 장부(ledger) | 화마다 요약, 심은 복선, 회수한 복선, 게시 여부를 적는 파일입니다 |
| 비축분 | 쓰기만 하고 아직 올리지 않은 화입니다. 하루 연재를 지키는 여유분입니다 |
| 사실 잠금 | 이번 화에서 바꾸면 안 되는 사실(시간, 부상, 수량 등)을 먼저 적어 두는 메모입니다 |
| 구간 계약 | 50화 단위로 "여기서 끝낼 것"과 "일찍 끝내면 안 되는 것"을 정해 두는 표입니다 |

### 설치

Claude Code 플러그인으로 설치하거나, `skills/webnovel-studio` 폴더를 에이전트의 스킬 폴더에 복사합니다.

```
/plugin marketplace add reedodev/webnovel-studio
/plugin install webnovel-studio@webnovel-studio
```

도구 시험: `node tests/run.mjs`

### 쓰는 법

에이전트에게 말로 부탁합니다. 예: "영문·한국·일본 상위작 보고 신작 시나리오 골라 줘", "1~3화 설계표부터 만들어 줘", "다음 화 써 줘", "독자가 어디서 빠지는지 봐 줘". 자세한 표는 `skills/webnovel-studio/SKILL.md`에 있습니다.

### 들어 있는 것

| 문서 | 내용 |
|---|---|
| `scenario-synthesis.md` | 세 시장 교차 합성, 필수 관문, 점수표, 반증, 기획 검수 게이트(자체 점검, 독립 검수, 겹침 재확인) |
| `markets-learned.md` | 2026-10-23 기준 영문·한국·일본 상위작 조사 스냅샷(30일 지나면 다시 조사) |
| `market-scan.md` | 상위 10개를 직접 조사하는 방법과 기록 양식 |
| `packaging.md` | 제목, 소개글, 태그, 유입이 적을 때 점검 순서 |
| `retention-and-paid.md` | 독자 이탈 12유형, 8항목 진단, 유료화 지점 |
| `book-setup.md` | 작품 폴더 구조, 설정집, 상태 파일, 복선 장부, 능력 설계표 |
| `planning-windows.md` | 총 화수, 50화 구간 계약, 5화 예산, 앞지르기 점검 |
| `golden-three.md` | 1~3화의 임무와 화별 미세 설계표 |
| `chapter-loop.md` | 회차 한 편 쓰기 절차, 사실 잠금, 정독 점검 |
| `review.md` | 7+3개 검수 항목, 독자 시점 점검, 문체 신호, 현실 사실 검증, 독립 검수 |
| `serial-ops.md` | 비축분, 게시, 사이트별 글자 수 기준, 주간 독자 반응 점검 |
| `english-serial.md` | 한국어 원문을 영어로 번역해 4개 사이트에 올리는 순서 |

### 한계 (정직하게)

- 이 저장소의 점수와 순위는 사람이 근거를 보고 매긴 추정이고, 도구는 합산만 합니다. 독자 반응이 좋을지는 연재해 봐야 압니다.
- 시장 조사는 특정 날짜의 스냅샷입니다. 일본 쪽은 별도 조사 결과를 옮긴 것이라 다시 확인한 것이 아닙니다.
- 검사 도구는 문체 표면과 기록 형식만 봅니다. 재미, 복선의 질, 사실 확인은 사람이 읽어서 판단해야 합니다.
- 설명서만 읽은 새 사용자 시험은 아직 하지 않았습니다.
- 사이트의 AI 사용 정책, 공모전 규정, 유료 전환 조건은 자주 바뀌므로 쓰기 직전에 공식 안내를 확인하세요.

### 출처와 영감

아래 공개 저장소의 **방식**을 참고했습니다. 코드와 문장은 옮기지 않았고, 이 저장소의 문서와 도구는 처음부터 새로 썼습니다.

| 저장소 | 라이선스 | 참고한 점 |
|---|---|---|
| [xiaofeng-928/chinese-longnovel-skill](https://github.com/xiaofeng-928/chinese-longnovel-skill) | MIT | 사실 잠금, 상태 저장소, 50화 구간, 황금 3화 미세 설계 |
| [zenstory-ai/oh-story-claudecode](https://github.com/zenstory-ai/oh-story-claudecode) | MIT | 스캔과 분석 흐름, 검수 관점, 표현·용필·이야기 인과를 따로 보는 진단 |
| [PenglongHuang/chinese-novelist-skill](https://github.com/PenglongHuang/chinese-novelist-skill) | MIT | 황금 법칙 3개, 중간 이어쓰기, 자동 검증 |
| [haowjy/creative-writing-skills](https://github.com/haowjy/creative-writing-skills) | Apache-2.0 | 독자 시점 시뮬레이션, 편집 단계 순서 |
| [ThomasHoussin/Claude-Book](https://github.com/ThomasHoussin/Claude-Book) | MIT | 변하지 않는 설정집과 화마다 바뀌는 상태의 분리 |
| [ansrhkddns-web/k-webnovel-architect](https://github.com/ansrhkddns-web/k-webnovel-architect) | MIT | 한국 상업 연재의 패키징, 독자 유지력 진단, 유료화 설계, 복선 장부 |
| [muacomet/claude-webnovel-skills](https://github.com/muacomet/claude-webnovel-skills) | MIT | 한국어 문체 신호의 기계 검사, 설교조 검출 |
| [Orda-by-Move/webnovel-harness-plugin](https://github.com/Orda-by-Move/webnovel-harness-plugin) | 라이선스 표기 없음 | 현실 사실 검증 흐름(아이디어만 참고, 코드와 문장은 가져오지 않음) |

시장 조사에 쓴 사이트: Royal Road, Webnovel, Scribble Hub, Wattpad, 네이버 시리즈, 노벨피아, 카쿠요무, 알파폴리스, 소설가가 되자(공개 순위 화면을 읽음).

### 라이선스

MIT

## English

**An agent skill for planning, writing, checking and serializing a web novel**

[![test](https://github.com/reedodev/webnovel-studio/actions/workflows/test.yml/badge.svg)](https://github.com/reedodev/webnovel-studio/actions/workflows/test.yml)

It builds new-series candidates from the elements that show up in **at least two of three markets** (English, Korean, Japanese top lists), filters them with a gate list, scores and a counter-argument step, then walks through golden-three design, a chapter-writing loop with a fact lock, review, reserve-chapter serialization, a weekly reader-drop check and a Korean-to-English translation serial. Three small checkers are included: chapter length and prose signals, ledger gaps, and candidate score totals.

The skill never posts, signs up or contacts anyone on its own. Posting always needs an explicit instruction from the author.

### Install

```
/plugin marketplace add reedodev/webnovel-studio
/plugin install webnovel-studio@webnovel-studio
```

Or copy `skills/webnovel-studio` into your agent's skills folder. Run the checker tests with `node tests/run.mjs` (Node.js 18 or newer).

### Use

Ask in plain words, for example: "Pick the best new-series scenario from the English, Korean and Japanese top lists", "Make the golden-three design sheet", "Write the next chapter", "Show me where readers drop". The table in `skills/webnovel-studio/SKILL.md` lists what each request changes.

### Honest limits

- Scores are human estimates written next to their evidence; the tool only adds them up. Whether readers like a story is known only after serializing it.
- The market notes are a snapshot dated 2026-10-23. The Japanese part was carried over from a separate review and not re-checked here.
- The checkers look at prose surface and record format only. Fun, foreshadowing quality and facts need a human read.
- No fresh-user trial from the docs alone has been run yet.
- Site AI policies, contest rules and paid-conversion terms change often; check the official pages right before relying on them.

### Credits and inspiration

The method ideas come from the public repositories listed in the Korean section above. No code or text was copied; the documents and tools here were written from scratch. One of them (`webnovel-harness-plugin`) shows no license, so only the general flow idea was used.

### License

MIT