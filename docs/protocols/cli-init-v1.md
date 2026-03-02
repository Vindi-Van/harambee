# Protocol: `harambee init` (v1)

## Goal
Get a new user from install to a working single-project setup in one guided CLI flow.

## Exact Usage
```bash
harambee init [--allow-oga-override]
```

- Default behavior enforces one active Oga per repository.
- `--allow-oga-override` bypasses that guard and should only be used with explicit owner approval.

## Scope (v1)
- one GitHub repo
- one GitHub Project
- one selected role for the local agent
- write-access required

## Prompt Sequence (exact)
1. `Project name/context` (free text)
2. `GitHub repo URL` (required)
3. validate repo access (`write` required)
4. `GitHub Project URL` (required)
5. validate project access (`read` at minimum, `write` preferred)
6. `Agent role` (enum: `oga`, `dev`, `qa`, `reviewer`, `devops`, `ui`)
   - default = `dev`
7. if role = `oga`, run Oga activation checks

## Oga Activation Checks
- load canonical role registry issue in target repo
- if active Oga exists and it is not current agent:
  - block by default
  - show explicit message with owner override instructions
- if no active Oga exists:
  - register current agent as active Oga

## Config Output
Write `.harambee/config.json`:

```json
{
  "version": 1,
  "projectContext": "string",
  "github": {
    "repoUrl": "https://github.com/owner/repo",
    "projectUrl": "https://github.com/users/<owner>/projects/<id>"
  },
  "agent": {
    "name": "local-agent-id",
    "role": "dev"
  },
  "registry": {
    "issueNumber": 0,
    "issueUrl": "https://github.com/owner/repo/issues/0"
  }
}
```

## Error Handling (v1)
- invalid repo URL -> show expected format + re-prompt
- auth missing -> show `gh auth login` fix + retry
- repo permission < write -> hard fail with remediation text
- invalid project URL -> show expected format + re-prompt
- project inaccessible -> hard fail with remediation text
- duplicate Oga -> hard fail unless override flag present

## Exit Criteria
`harambee init` succeeds only when:
- repo + project validations pass
- role assignment succeeds
- registry update succeeds
- config file is written

## Notes
- Rerunning `harambee init` should be idempotent and safe.
- Existing config should be diffed and updated, not duplicated.
