# 빠른 견적 이메일 선택 입력 — 설계

날짜: 2026-07-04
상태: 승인됨

## 목적

메인 페이지 빠른 견적 폼에서 연락처(전화번호) 아래에 이메일 입력란을 추가한다.
이메일은 **선택 입력**이다 — 빠른 견적의 핵심 가치("1분 완성")를 지키기 위해
입력 부담을 늘리지 않는다.

## 요구사항

- 폼에서 연락처 필드 바로 아래에 `이메일 (선택)` 필드를 노출한다.
- 비워 두고 제출할 수 있다. 값을 입력하면 이메일 형식을 검증한다(최대 120자,
  기존 예약 문의 폼과 동일 기준).
- 입력된 이메일은 기존 `emailEnc` 컬럼에 암호화 저장한다(현재는 빈 문자열을
  암호화해 저장 중 — DB 스키마 변경 없음).
- 문의 내용(content)에 이메일이 있을 때만 `이메일: ...` 줄을 추가한다.
  비어 있으면 기존과 동일한 4줄 출력(하위 호환).

## 변경 파일

| 파일 | 변경 |
| --- | --- |
| `src/lib/quick-quote/schema.ts` | `email` 필드 추가 — `z.literal('').or(이메일 검증)` 패턴. 폼 제출 시 빈 칸은 `''`로 전송되므로 빈 문자열을 명시적으로 허용 |
| `src/lib/quick-quote/format.ts` | `QuickQuoteContentInput`에 `email?` 추가, `buildQuickQuoteContent`가 값이 있을 때만 `이메일:` 줄 출력 |
| `src/components/home/reservation/quick-quote-action.ts` | `encryptPII('')` 대신 `encryptPII(input.email)`, content 빌드에 email 전달 |
| `src/components/home/reservation/QuickQuoteForm.tsx` | 연락처 아래 `이메일 (선택)` 필드 추가 — `type="email"`, `required` 없음, 기존 `Field` 컴포넌트 재사용 |

## 고려한 대안

이메일을 content에 넣지 않고 암호화 컬럼에만 저장하는 방안 — 관리자가 문의
글에서 연락처를 바로 확인하는 현재 흐름(전화번호도 content에 포함)과 어긋나서
제외. content 포함으로 결정.

## 테스트

- `format.test.ts`: 이메일 포함/미포함 시 content 출력 검증.
- 스키마: 빈 문자열 통과, 유효 이메일 통과, 잘못된 형식 거부, 120자 초과 거부.

## 범위 제외

- 이메일 회신 자동화, 알림 메일 발송 — 이번 작업 아님.
- 예약 문의(상세) 폼 변경 없음.
