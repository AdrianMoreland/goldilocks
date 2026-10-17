#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Workspace dependencies
if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1 || npm install -g pnpm
fi
pnpm install

# i-have-adhd plugin, always-on (best effort; never block the session)
CONFIG_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
claude plugin marketplace add ayghri/i-have-adhd >/dev/null 2>&1 || true
claude plugin install i-have-adhd@i-have-adhd >/dev/null 2>&1 || true
mkdir -p "$CONFIG_DIR"
touch "$CONFIG_DIR/.i-have-adhd-always"
