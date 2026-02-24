# Discussion Protocol (M1)

> Note: GitHub Discussions must be enabled in repo settings.

## Discussion Channels (by category)

1. **Dispatch**
   - worker readiness
   - task requests
   - assignment acknowledgements

2. **Standup**
   - periodic health summaries
   - stuck items
   - capacity and risk notes

3. **Escalations**
   - blockers needing human decision
   - architecture/UI feasibility conflicts

## Message Discipline
- Use concise structured updates.
- Link all statements back to issue/PR IDs.
- Final decisions must be mirrored to issue/PR comments.

## Suggested Message Templates

### Worker Ready
```text
[READY] worker=<id> role=<role> capacity=<n> projects=<keys>
```

### Blocker
```text
[BLOCKED] issue=#123 reason=<summary> needs=<decision/input>
```

### Escalation to Human
```text
[ESCALATION] issue=#123 options=A|B recommendation=<choice>
```

### Decision Mirror
```text
[DECISION] issue=#123 outcome=<chosen option> rationale=<1-2 lines>
```
