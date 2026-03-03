#!/usr/bin/env bash
set -euo pipefail

# Sync a GitHub issue's governance labels to Project v2 fields.
#
# Required env:
#   PROJECT_V2_ID
#   PROJECT_V2_STATUS_FIELD_ID
#   PROJECT_V2_OPT_INTAKE
#   PROJECT_V2_OPT_DESIGN
#   PROJECT_V2_OPT_REVIEW_GATE
#   PROJECT_V2_OPT_DECOMPOSITION
#   PROJECT_V2_OPT_EXECUTION
#   PROJECT_V2_OPT_VERIFICATION
#   PROJECT_V2_OPT_DEPLOYMENT
#   PROJECT_V2_OPT_DONE
#   PROJECT_V2_OPT_BLOCKED
#
# Optional (full-granularity governance mirror field):
#   PROJECT_V2_GOV_FIELD_ID
#   PROJECT_V2_GOV_OPT_INTAKE
#   PROJECT_V2_GOV_OPT_DESIGN
#   PROJECT_V2_GOV_OPT_REVIEW_GATE
#   PROJECT_V2_GOV_OPT_DECOMPOSITION
#   PROJECT_V2_GOV_OPT_EXECUTION
#   PROJECT_V2_GOV_OPT_VERIFICATION
#   PROJECT_V2_GOV_OPT_DEPLOYMENT
#   PROJECT_V2_GOV_OPT_DONE
#   PROJECT_V2_GOV_OPT_BLOCKED
#
# Usage:
#   scripts/projectv2_sync.sh <owner/repo> <issue_number>

REPO="${1:-}"
ISSUE_NUMBER="${2:-}"

if [[ -z "$REPO" || -z "$ISSUE_NUMBER" ]]; then
  echo "usage: $0 <owner/repo> <issue_number>" >&2
  exit 2
fi

required_env=(
  PROJECT_V2_ID
  PROJECT_V2_STATUS_FIELD_ID
  PROJECT_V2_OPT_INTAKE
  PROJECT_V2_OPT_DESIGN
  PROJECT_V2_OPT_REVIEW_GATE
  PROJECT_V2_OPT_DECOMPOSITION
  PROJECT_V2_OPT_EXECUTION
  PROJECT_V2_OPT_VERIFICATION
  PROJECT_V2_OPT_DEPLOYMENT
  PROJECT_V2_OPT_DONE
  PROJECT_V2_OPT_BLOCKED
)

for k in "${required_env[@]}"; do
  if [[ -z "${!k:-}" ]]; then
    echo "missing required env: $k" >&2
    exit 2
  fi
done

issue_json="$(gh api "repos/${REPO}/issues/${ISSUE_NUMBER}")"
state="$(jq -r '.state' <<<"$issue_json")"
labels="$(jq -r '.labels[].name' <<<"$issue_json" || true)"

has_label() {
  local needle="$1"
  grep -Fxq "$needle" <<<"$labels"
}

target_key="intake"
selection_reason="default:intake"
if [[ "$state" == "closed" ]]; then
  target_key="done"
  selection_reason="state:closed"
elif has_label "status:done"; then
  target_key="done"
  selection_reason="label:status:done"
elif has_label "status:blocked"; then
  target_key="blocked"
  selection_reason="label:status:blocked"
elif has_label "stage:deployment"; then
  target_key="deployment"
  selection_reason="label:stage:deployment"
elif has_label "stage:verification"; then
  target_key="verification"
  selection_reason="label:stage:verification"
elif has_label "stage:execution"; then
  target_key="execution"
  selection_reason="label:stage:execution"
elif has_label "stage:decomposition"; then
  target_key="decomposition"
  selection_reason="label:stage:decomposition"
elif has_label "stage:review-gate"; then
  target_key="review_gate"
  selection_reason="label:stage:review-gate"
elif has_label "stage:design"; then
  target_key="design"
  selection_reason="label:stage:design"
elif has_label "stage:intake"; then
  target_key="intake"
  selection_reason="label:stage:intake"
fi

case "$target_key" in
  intake) status_option_id="$PROJECT_V2_OPT_INTAKE" ;;
  design) status_option_id="$PROJECT_V2_OPT_DESIGN" ;;
  review_gate) status_option_id="$PROJECT_V2_OPT_REVIEW_GATE" ;;
  decomposition) status_option_id="$PROJECT_V2_OPT_DECOMPOSITION" ;;
  execution) status_option_id="$PROJECT_V2_OPT_EXECUTION" ;;
  verification) status_option_id="$PROJECT_V2_OPT_VERIFICATION" ;;
  deployment) status_option_id="$PROJECT_V2_OPT_DEPLOYMENT" ;;
  done) status_option_id="$PROJECT_V2_OPT_DONE" ;;
  blocked) status_option_id="$PROJECT_V2_OPT_BLOCKED" ;;
  *)
    echo "unknown target key: $target_key" >&2
    exit 2
    ;;
esac

issue_node_id="$({
  gh api graphql \
    -f query='query($owner:String!, $repo:String!, $number:Int!) { repository(owner:$owner, name:$repo) { issue(number:$number) { id } } }' \
    -f owner="${REPO%%/*}" \
    -f repo="${REPO##*/}" \
    -F number="$ISSUE_NUMBER"
} | jq -r '.data.repository.issue.id')"

if [[ -z "$issue_node_id" || "$issue_node_id" == "null" ]]; then
  echo "failed to resolve issue node id for ${REPO}#${ISSUE_NUMBER}" >&2
  exit 1
fi

item_id="$({
  gh api graphql \
    -f query='mutation($project:ID!, $content:ID!) { addProjectV2ItemById(input:{projectId:$project, contentId:$content}) { item { id } } }' \
    -f project="$PROJECT_V2_ID" \
    -f content="$issue_node_id"
} | jq -r '.data.addProjectV2ItemById.item.id')"

if [[ -z "$item_id" || "$item_id" == "null" ]]; then
  echo "failed to add/fetch project item for ${REPO}#${ISSUE_NUMBER}" >&2
  exit 1
fi

update_single_select_field() {
  local field_id="$1"
  local option_id="$2"

  gh api graphql \
    -f query='mutation($project:ID!, $item:ID!, $field:ID!, $option:String!) { updateProjectV2ItemFieldValue(input:{ projectId:$project, itemId:$item, fieldId:$field, value:{ singleSelectOptionId:$option } }) { projectV2Item { id } } }' \
    -f project="$PROJECT_V2_ID" \
    -f item="$item_id" \
    -f field="$field_id" \
    -f option="$option_id" >/dev/null
}

update_single_select_field "$PROJECT_V2_STATUS_FIELD_ID" "$status_option_id"

gov_field_updated="false"
gov_option_id=""

# Optional: mirror full governance lifecycle in dedicated field when configured.
if [[ -n "${PROJECT_V2_GOV_FIELD_ID:-}" ]]; then
  case "$target_key" in
    intake) gov_option_id="${PROJECT_V2_GOV_OPT_INTAKE:-}" ;;
    design) gov_option_id="${PROJECT_V2_GOV_OPT_DESIGN:-}" ;;
    review_gate) gov_option_id="${PROJECT_V2_GOV_OPT_REVIEW_GATE:-}" ;;
    decomposition) gov_option_id="${PROJECT_V2_GOV_OPT_DECOMPOSITION:-}" ;;
    execution) gov_option_id="${PROJECT_V2_GOV_OPT_EXECUTION:-}" ;;
    verification) gov_option_id="${PROJECT_V2_GOV_OPT_VERIFICATION:-}" ;;
    deployment) gov_option_id="${PROJECT_V2_GOV_OPT_DEPLOYMENT:-}" ;;
    done) gov_option_id="${PROJECT_V2_GOV_OPT_DONE:-}" ;;
    blocked) gov_option_id="${PROJECT_V2_GOV_OPT_BLOCKED:-}" ;;
  esac

  if [[ -z "${gov_option_id:-}" ]]; then
    echo "warning: governance field enabled but missing option id for ${target_key}; skipping governance-state update" >&2
  else
    update_single_select_field "$PROJECT_V2_GOV_FIELD_ID" "$gov_option_id"
    gov_field_updated="true"
  fi
fi

echo "sync_report repo=${REPO} issue=${ISSUE_NUMBER} issue_state=${state} governance_key=${target_key} selection_reason=${selection_reason} status_field_id=${PROJECT_V2_STATUS_FIELD_ID} status_option_id=${status_option_id} gov_field_updated=${gov_field_updated} gov_field_id=${PROJECT_V2_GOV_FIELD_ID:-unset} gov_option_id=${gov_option_id:-unset}"