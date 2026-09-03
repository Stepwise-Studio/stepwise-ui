#!/usr/bin/env bash
# Stepwise UI CLI test suite.
#
#   ./test/cli.test.sh [registry-url]
#
# Defaults to http://localhost:3000/r, so run the www dev server first.
# Every case runs in a throwaway project under $TMPDIR.

set -uo pipefail
REGISTRY="${1:-http://localhost:3000/r}"
CLI="$(cd "$(dirname "$0")/.." && pwd)/dist/index.js"
ROOT="$(mktemp -d)"
export STEPWISE_REGISTRY_URL="$REGISTRY"

PASS=0; FAIL=0
ok()   { PASS=$((PASS+1)); printf '  \033[32mPASS\033[0m %s\n' "$1"; }
bad()  { FAIL=$((FAIL+1)); printf '  \033[31mFAIL\033[0m %s\n     %s\n' "$1" "$2"; }
head() { printf '\n\033[1m%s\033[0m\n' "$1"; }

# project <name> [tsconfig-json]
project() {
  local d="$ROOT/$1"; rm -rf "$d"; mkdir -p "$d"; cd "$d"
  printf '{"name":"t","version":"1.0.0"}' > package.json
  [ $# -gt 1 ] && printf '%s' "$2" > tsconfig.json
  echo "$d"
}
ALIAS='{"compilerOptions":{"baseUrl":".","paths":{"@/*":["./*"]}}}'

expect_code() { # label, expected, actual
  [ "$2" = "$3" ] && ok "$1" || bad "$1" "expected exit $2, got $3"
}
expect_has()  { # label, needle, haystack
  case "$3" in *"$2"*) ok "$1";; *) bad "$1" "missing: $2";; esac
}
expect_not()  {
  case "$3" in *"$2"*) bad "$1" "should not contain: $2";; *) ok "$1";; esac
}

head "exit codes"
project ec "$ALIAS" >/dev/null
node "$CLI" add no-such-component >/dev/null 2>&1; expect_code "unknown component -> 1" 1 $?
node "$CLI" add >/dev/null 2>&1;                   expect_code "add with no args -> 1"  1 $?
node "$CLI" frobnicate >/dev/null 2>&1;            expect_code "unknown command -> 1"   1 $?
node "$CLI" add button --bogus >/dev/null 2>&1;    expect_code "unknown flag -> 1"      1 $?
node "$CLI" --version >/dev/null 2>&1;             expect_code "--version -> 0"         0 $?
node "$CLI" --help >/dev/null 2>&1;                expect_code "--help -> 0"            0 $?
node "$CLI" list --all >/dev/null 2>&1;            expect_code "list --all -> 0"        0 $?

head "no project"
cd "$ROOT"; rm -f package.json
out=$(node "$CLI" add button 2>&1); code=$?
expect_code "outside a project -> 1" 1 $code
expect_has  "explains why" "package.json" "$out"

head "network failures"
project net "$ALIAS" >/dev/null
out=$(STEPWISE_REGISTRY_URL=http://127.0.0.1:59999/r node "$CLI" list --all 2>&1)
expect_has "unreachable host is named" "127.0.0.1:59999" "$out"
out=$(STEPWISE_REGISTRY_URL="${REGISTRY%/r}/definitely-not-here" node "$CLI" list --all 2>&1)
expect_has "404 index is distinguished" "not found" "$out"

head "install"
project inst "$ALIAS" >/dev/null
out=$(node "$CLI" add date-picker 2>&1)
expect_has "resolves transitive deps" "Also required: calendar" "$out"
[ -f components/stepwise/date-picker.tsx ] && ok "writes the component" || bad "writes the component" "missing file"
[ -f lib/utils/cn.ts ] && ok "writes shared files" || bad "writes shared files" "missing cn.ts"

out=$(node "$CLI" add date-picker 2>&1)
expect_has "re-add is a no-op" "already up to date" "$out"

printf '\n// local edit\n' >> components/stepwise/calendar.tsx
out=$(node "$CLI" add calendar 2>&1)
expect_has "protects local edits" "differs" "$out"
grep -q "local edit" components/stepwise/calendar.tsx && ok "edit survived" || bad "edit survived" "clobbered"
node "$CLI" add calendar --yes >/dev/null 2>&1
grep -q "local edit" components/stepwise/calendar.tsx && bad "--yes overwrites" "edit still there" || ok "--yes overwrites"

head "partial failure"
project part "$ALIAS" >/dev/null
out=$(node "$CLI" add button no-such-component 2>&1); code=$?
expect_code "mixed run -> 1" 1 $code
[ -f components/stepwise/button.tsx ] && ok "valid component still installed" || bad "valid component still installed" "missing"

head "list"
project ls "$ALIAS" >/dev/null
out=$(node "$CLI" list 2>&1)
expect_has "empty project points at init" "stepwise-ui init" "$out"
node "$CLI" add kbd >/dev/null 2>&1
out=$(node "$CLI" list 2>&1)
expect_has "reports installed" "kbd" "$out"
expect_not "does not list everything" "video-player" "$out"
out=$(node "$CLI" list --all 2>&1)
expect_has "--all lists everything" "video-player" "$out"

head "init without a tty"
project tty "$ALIAS" >/dev/null
out=$(node "$CLI" init 2>&1); code=$?
expect_code "init -> 1"        1 $code
expect_has  "suggests add"     "add" "$out"
expect_not  "does not hang"    "Pick components" "$out"

head "tsconfig handling (the glob trap)"
# A create-next-app config: globs contain / * and * / , which a naive comment
# stripper reads as one huge block comment and deletes the include array.
NEXTCFG='{"compilerOptions":{"baseUrl":".","paths":{"@/*":["./*"]},"strict":true},"include":["next-env.d.ts","**/*.ts","**/*.tsx",".next/types/**/*.ts"],"exclude":["node_modules"]}'
project ts1 "$NEXTCFG" >/dev/null
out=$(node "$CLI" add button 2>&1)
expect_not "valid alias raises no warning" "path alias" "$out"
n=$(node -e 'console.log(JSON.parse(require("fs").readFileSync("tsconfig.json","utf8")).include.length)' 2>/dev/null)
[ "$n" = "4" ] && ok "glob include array intact" || bad "glob include array intact" "include is now: $n"

printf '\n\033[1mtotal\033[0m  %s passed, %s failed\n' "$PASS" "$FAIL"
cd /; rm -rf "$ROOT"
[ "$FAIL" -eq 0 ]
