# M4 + M5 Periodic Replay Check Runbook

Purpose: keep optional hardening evidence fresh after milestone closeout by rerunning lightweight replay checks for:
- M4 telemetry/reclaim simulation behavior
- M5 external adoption proof links and workflow viability

## Cadence
- **Weekly (recommended):** run every Monday.
- **Release gate:** run once within 24h before any tagged release/cutover.
- **After infra/policy changes:** run immediately after changes touching Redis coordination logic, workflow automation, or starter-kit docs.

## Preconditions
- Run from repository root (`harambee/`).
- `npm install` already completed.
- `gh auth status` succeeds for checking external GitHub artifacts.

## Replay Commands

### 1) M4 telemetry replay health check
```bash
npx vitest run packages/oga/test/execution/m4RedisCoordinationSimulation.test.ts
```

Optional full signal sweep:
```bash
npm run test --workspace @harambee/oga
```

### 2) M5 external adoption artifact check
Verify the external replay issue and workflow run still resolve:
```bash
gh issue view 1 --repo Vindi-Van/sandbox --json number,state,title,url

gh run view 22595451581 --repo Vindi-Van/sandbox --json databaseId,status,conclusion,url,name
```

Reference artifact doc for immutable links:
```bash
sed -n '1,120p' docs/validation/artifacts/m5-external-adoption-replay-2026-03-02.md
```

## Evidence Capture Format
For each replay run, create one dated markdown artifact:
- Path: `docs/validation/artifacts/m4-m5-periodic-replay-YYYY-MM-DD.md`

Template:
```md
# M4/M5 Periodic Replay — YYYY-MM-DD

## Operator
- Name/handle:
- Start/End time (UTC):

## M4 Check
- Command:
- Result: PASS/FAIL
- Key output excerpt:

## M5 Check
- Commands:
- Result: PASS/FAIL
- Confirmed links (issue/workflow + discussion URL from artifact doc):

## Follow-ups
- None / list created issues + owners + ETA
```

## Failure Escalation Path
If any replay check fails:
1. **Open blocker issue** in `Vindi-Van/harambee` with label `blocker` and include command output + timestamp.
2. **Start escalation discussion** using `.github/DISCUSSION_TEMPLATE/escalation.yml` and link blocker issue.
3. **Assign owner + ETA** in issue body within the same day.
4. **Re-run failed check** after fix and append results to the same dated artifact.

Severity guidance:
- **SEV-2 (same-day fix):** M4 test regression or failed external workflow run resolution.
- **SEV-3 (next business day):** stale/missing non-critical link evidence with viable fallback proof.
