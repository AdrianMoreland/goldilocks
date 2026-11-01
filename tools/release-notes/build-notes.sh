#!/bin/bash
# Turns `gh pr list --json number,title,body,author,url` output (stdin) into release notes (stdout).
# Roadmap-sync PRs are grouped on their own; "Roadmap: <id> | <task>" lines in PR bodies are listed.
set -euo pipefail
jq -r '
  def roadmap: [ (.body // "") | split("\n")[] | select(test("^\\s*[Rr]oadmap:\\s*[0-9]+\\.[0-9]+")) | sub("^\\s*[Rr]oadmap:\\s*"; "") ];
  def line: "- \(.title) ([#\(.number)](\(.url)), @\(.author.login))" +
            ( roadmap as $r | if ($r|length) > 0 then "\n  - Roadmap: " + ($r | join("; ")) else "" end );
  ( map(select(.title | startswith("[roadmap-sync]") | not)) ) as $main
  | ( map(select(.title | startswith("[roadmap-sync]"))) ) as $sync
  | if ($main|length) == 0 and ($sync|length) == 0 then empty else
      "## Merged\n\n" + (if ($main|length) > 0 then ($main | map(line) | join("\n")) else "_Nothing besides roadmap updates._" end)
      + (if ($sync|length) > 0 then "\n\n## Roadmap updates\n\n" + ($sync | map("- \(.title) ([#\(.number)](\(.url)))") | join("\n")) else "" end)
      + "\n"
    end
'
