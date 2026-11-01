#!/bin/bash
# Cloud sessions only: install dependencies and build shared-types so tests run straight away.
set -euo pipefail
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
cd "$CLAUDE_PROJECT_DIR"
export DIRECT_URL="${DIRECT_URL:-postgresql://ci:ci@localhost:5432/ci}"
export DATABASE_URL="${DATABASE_URL:-postgresql://ci:ci@localhost:5432/ci}"
pnpm install --frozen-lockfile
pnpm --filter @goldilocks/shared-types build
