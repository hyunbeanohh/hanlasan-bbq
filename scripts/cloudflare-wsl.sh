#!/usr/bin/env bash
set -euo pipefail

mode="${1:-check}"
source_dir="${2:?Repository path is required}"
case "$mode" in check|build|deploy) ;; *) echo 'Expected check, build or deploy' >&2; exit 2 ;; esac

# Keep the approved OAuth session outside the build tree and remove it on exit.
umask 077
auth_root="$(mktemp -d /tmp/hanlasan-wrangler-auth.XXXXXX)"
mkdir -p "$auth_root/.wrangler/config"
auth_file="$auth_root/.wrangler/config/default.toml"
trap 'rm -f "$auth_file"; rmdir "$auth_root/.wrangler/config" "$auth_root/.wrangler" "$auth_root" 2>/dev/null || true' EXIT
cat > "$auth_file"
export XDG_CONFIG_HOME="$auth_root"
export WRANGLER_SEND_METRICS=false

# Build on the Linux filesystem: Windows mounts cannot reliably create the
# dependency symlinks required by OpenNext. Each run starts with fresh sources.
build_dir="$(mktemp -d /tmp/hanlasan-bbq-cloudflare.XXXXXX)"
echo "Build workspace: $build_dir"
rsync -a --exclude=node_modules --exclude=.git --exclude=.next \
  --exclude=.open-next --exclude=.wrangler --exclude='.dev.vars*' \
  --exclude='.env*' --exclude='*.tsbuildinfo' \
  "$source_dir/" "$build_dir/"
cd "$build_dir"

pnpm() { npm exec --yes --package=pnpm@10.20.0 -- pnpm "$@"; }
pnpm install --frozen-lockfile
pnpm exec wrangler whoami

# The homepage is prerendered and reads this public key from process.env.
# Private runtime secrets stay on Cloudflare and are never copied into the build.
export TURNSTILE_SITE_KEY
TURNSTILE_SITE_KEY="$(node -e 'const fs = require("node:fs"); const config = fs.readFileSync("wrangler.toml", "utf8"); const match = config.match(/^TURNSTILE_SITE_KEY\s*=\s*"([^"]+)"/m); if (!match) process.exit(1); process.stdout.write(match[1]);')"
pnpm exec opennextjs-cloudflare build

if [[ "$mode" == check ]]; then
  pnpm exec wrangler deploy --dry-run --outdir .wrangler/dry-run
elif [[ "$mode" == deploy ]]; then
  pnpm exec opennextjs-cloudflare deploy
fi
echo "Completed: $mode ($build_dir)"
