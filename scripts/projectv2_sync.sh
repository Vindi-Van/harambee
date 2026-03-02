#!/usr/bin/env bash
set -euo pipefail

# Sync a GitHub issue's governance labels to a Project v2 Status field.
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
if [[ "$state" == "closed" ]] || has_label "status:done"; then
  target_key="done"
elif has_label "status:blocked"; then
  target_key="blocked"
elif has_label "stage:deployment"; then
  target_key="deployment"
elif has_label "stage:verification"; then
  target_key="verification"
elif has_label "stage:execution"; then
  target_key="execution"
elif has_label "stage:decomposition"; then
  target_key="decomposition"
elif has_label "stage:review-gate"; then
  target_key="review_gate"
elif has_label "stage:design"; then
  target_key="design"
elif has_label "stage:intake"; then
  target_key="intake"
fi

case "$target_key" in
  intake) option_id="$PROJECT_V2_OPT_INTAKE" ;;
  design) option_id="$PROJECT_V2_OPT_DESIGN" ;;
  review_gate) option_id="$PROJECT_V2_OPT_REVIEW_GATE" ;;
  decomposition) option_id="$PROJECT_V2_OPT_DECOMPOSITION" ;;
  execution) option_id="$PROJECT_V2_OPT_EXECUTION" ;;
  verification) option_id="$PROJECT_V2_OPT_VERIFICATION" ;;
  deployment) option_id="$PROJECT_V2_OPT_DEPLOYMENT" ;;
  done) option_id="$PROJECT_V2_OPT_DONE" ;;
  blocked) option_id="$PROJECT_V2_OPT_BLOCKED" ;;
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

gh api graphql \
  -f query='mutation($project:ID!, $item:ID!, $field:ID!, $option:String!) { updateProjectV2ItemFieldValue(input:{ projectId:$project, itemId:$item, fieldId:$field, value:{ singleSelectOptionId:$option } }) { projectV2Item { id } } }' \
  -f project="$PROJECT_V2_ID" \
  -f item="$item_id" \
  -f field="$PROJECT_V2_STATUS_FIELD_ID" \
  -f option="$option_id" >/dev/null

echo "synced ${REPO}#${ISSUE_NUMBER} -> ${target_key} (option ${option_id})"
