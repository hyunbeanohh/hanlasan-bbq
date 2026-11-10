<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 작업 인계 규칙 (README 관리)

- 코드, 배포 설정, 외부 서비스(GA4, 네이버 광고·전환추적, Search Console, 서치어드바이저) 설정을 바꾸면 `README.md`의 '빠른 시작', '배포', '기술 구성', '운영 현황' 중 해당 부분을 같은 커밋 또는 바로 다음 커밋에서 갱신한다.
- README에는 남은 일 목록이나 작업 이력을 두지 않는다(작업 이력은 git 커밋 기록으로 확인).
- 비밀값(API 키, 비밀번호, 토큰)은 README와 저장소에 적지 않는다. 공개 값(GA4 측정 ID, Turnstile 사이트 키, 네이버 전환 공통키)만 적는다.
- `main`에 push하면 Cloudflare Workers Builds로 자동 배포되므로, push 전에 `pnpm lint`, `pnpm test`, `pnpm build`로 확인한다.
