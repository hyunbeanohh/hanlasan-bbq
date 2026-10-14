# Windows에서 Cloudflare 빌드와 배포

Windows의 OpenNext 심볼릭 링크 권한 오류를 피하기 위해 Ubuntu WSL의 Linux 파일시스템에서 빌드합니다. 원본 소스와 Windows 개발 서버는 유지됩니다.

## 준비

- Ubuntu WSL: Node.js 22, npm, rsync 설치
- Windows 저장소에서 `pnpm exec wrangler login`으로 배포 계정 인증
- 운영 Worker `hanlasan-bbq`에 기존 D1 및 시크릿 설정 유지

## 배포 전 검증 (운영 변경 없음)

```powershell
powershell -ExecutionPolicy Bypass -File scripts/cloudflare-wsl.ps1 -Mode check
```

잠금 파일대로 의존성을 설치한 뒤 Next.js/OpenNext 빌드와 Wrangler dry-run을 실행합니다. 실행마다 `/tmp/hanlasan-bbq-cloudflare.*`에 새 빌드 폴더를 만들며, 완료 메시지에 경로가 표시됩니다. 임시 빌드 폴더는 확인을 위해 남겨 둡니다.

## 실제 배포

검토한 변경을 머지하고 배포할 소스가 맞는지 확인한 뒤 실행합니다.

```powershell
powershell -ExecutionPolicy Bypass -File scripts/cloudflare-wsl.ps1 -Mode deploy
```

이 명령은 현재 로컬 소스(미커밋 변경 포함)를 새로 빌드한 뒤 운영 Worker와 연결 도메인에 배포합니다. Git 커밋·푸시·머지는 수행하지 않습니다. DB 마이그레이션과 운영 시크릿 변경도 수행하지 않습니다.

Windows OAuth 설정은 `AppData/Roaming/xdg.config`에서 읽어 표준 입력으로 전달합니다. WSL에서는 접근 권한을 제한한 별도 임시 인증 폴더에 저장하고 스크립트 종료 시 삭제합니다. 토큰은 로그·소스·빌드 폴더에 남기지 않습니다. `.dev.vars*`, `.env*`는 빌드 복사에서 제외되며, 홈페이지에 필요한 공개 Turnstile 키만 `wrangler.toml`에서 빌드 환경으로 전달합니다.
