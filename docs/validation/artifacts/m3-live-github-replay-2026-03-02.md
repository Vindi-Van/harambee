# M3 Artifact — Live GitHub Replay (2026-03-02)

Purpose: close the optional M3 hardening gap by replaying the contracts-in-practice path in a **live external GitHub repository** with stage-by-stage runtime evidence.

## External Repository
- Repository: <https://github.com/Vindi-Van/sandbox>
- Tracking issue: <https://github.com/Vindi-Van/sandbox/issues/3>
- Workflow definition commit: <https://github.com/Vindi-Van/sandbox/commit/e0675b0f1167985b4ab7e2011a7d8b9b42e06f2e>

## Replay Path + Linked Artifacts
1. Issue opened (intake): <https://github.com/Vindi-Van/sandbox/issues/3>
2. Execution transition run ✅: <https://github.com/Vindi-Van/sandbox/actions/runs/22595813415>
3. Verification transition run ✅: <https://github.com/Vindi-Van/sandbox/actions/runs/22595814280>
4. QA attempt #1 (expected bounce-back) ❌: <https://github.com/Vindi-Van/sandbox/actions/runs/22595815213>
5. QA attempt #2 (after bounce-back fix) ✅: <https://github.com/Vindi-Van/sandbox/actions/runs/22595816414>
6. Done transition run ✅: <https://github.com/Vindi-Van/sandbox/actions/runs/22595817463>

Issue comment with full chain: <https://github.com/Vindi-Van/sandbox/issues/3#issuecomment-3986929985>

## Notes
- `m3-live-replay.yml` enforces QA bounce-back by failing when stage=`qa` and `qa_pass=false`.
- The failed QA run is deliberate evidence that the bounce-back gate works before completion is allowed.
- After successful QA rerun, the issue was closed as done.

## Outcome
- Optional M3 hardening requirement (live GitHub replay including QA bounce-back evidence) is satisfied.
