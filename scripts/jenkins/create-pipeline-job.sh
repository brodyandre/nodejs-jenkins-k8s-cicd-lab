#!/usr/bin/env bash

set -euo pipefail

JENKINS_URL="${JENKINS_URL:-}"
JOB_NAME="${JOB_NAME:-order-status-api-pipeline}"
REPO_URL="${REPO_URL:-https://github.com/brodyandre/nodejs-jenkins-k8s-cicd-lab.git}"
BRANCH_NAME="${BRANCH_NAME:-main}"
SCRIPT_PATH="${SCRIPT_PATH:-Jenkinsfile}"
SCM_CREDENTIALS_ID="${SCM_CREDENTIALS_ID:-}"
JOB_DESCRIPTION="${JOB_DESCRIPTION:-Order Status API CI/CD pipeline managed as code}"
JENKINS_USER="${JENKINS_USER:-}"
JENKINS_API_TOKEN="${JENKINS_API_TOKEN:-}"
TRIGGER_BUILD="${TRIGGER_BUILD:-false}"
DRY_RUN="${DRY_RUN:-false}"

if [[ -z "${JENKINS_URL}" ]]; then
  echo "JENKINS_URL is required."
  exit 1
fi

xml_escape() {
  printf '%s' "$1" | sed \
    -e 's/&/\&amp;/g' \
    -e 's/</\&lt;/g' \
    -e 's/>/\&gt;/g' \
    -e "s/'/\&apos;/g" \
    -e 's/"/\&quot;/g'
}

AUTH_ARGS=()
if [[ -n "${JENKINS_USER}" || -n "${JENKINS_API_TOKEN}" ]]; then
  if [[ -z "${JENKINS_USER}" || -z "${JENKINS_API_TOKEN}" ]]; then
    echo "Set both JENKINS_USER and JENKINS_API_TOKEN, or neither."
    exit 1
  fi
  AUTH_ARGS=(--user "${JENKINS_USER}:${JENKINS_API_TOKEN}")
fi

JENKINS_URL="${JENKINS_URL%/}"
JOB_NAME_URL="${JOB_NAME// /%20}"
JOB_URL="${JENKINS_URL}/job/${JOB_NAME_URL}"

CRUMB_HEADER="$(
  curl -fsS "${AUTH_ARGS[@]}" \
    "${JENKINS_URL}/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,\":\",//crumb)" \
    2>/dev/null || true
)"

CURL_HEADERS=()
if [[ -n "${CRUMB_HEADER}" ]]; then
  CURL_HEADERS+=(-H "${CRUMB_HEADER}")
fi

REMOTE_CONFIG_BLOCK="            <hudson.plugins.git.UserRemoteConfig>
              <url>$(xml_escape "${REPO_URL}")</url>"

if [[ -n "${SCM_CREDENTIALS_ID}" ]]; then
  REMOTE_CONFIG_BLOCK="${REMOTE_CONFIG_BLOCK}
              <credentialsId>$(xml_escape "${SCM_CREDENTIALS_ID}")</credentialsId>"
fi

REMOTE_CONFIG_BLOCK="${REMOTE_CONFIG_BLOCK}
            </hudson.plugins.git.UserRemoteConfig>"

CONFIG_FILE="$(mktemp)"
cleanup() {
  rm -f "${CONFIG_FILE}"
}
trap cleanup EXIT

cat > "${CONFIG_FILE}" <<EOF
<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job">
  <actions/>
  <description>$(xml_escape "${JOB_DESCRIPTION}")</description>
  <keepDependencies>false</keepDependencies>
  <properties>
    <jenkins.model.BuildDiscarderProperty>
      <strategy class="hudson.tasks.LogRotator">
        <daysToKeep>-1</daysToKeep>
        <numToKeep>20</numToKeep>
        <artifactDaysToKeep>-1</artifactDaysToKeep>
        <artifactNumToKeep>-1</artifactNumToKeep>
      </strategy>
    </jenkins.model.BuildDiscarderProperty>
    <org.jenkinsci.plugins.workflow.job.properties.DisableConcurrentBuildsJobProperty/>
  </properties>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition" plugin="workflow-cps">
    <scm class="hudson.plugins.git.GitSCM" plugin="git">
      <configVersion>2</configVersion>
      <userRemoteConfigs>
${REMOTE_CONFIG_BLOCK}
      </userRemoteConfigs>
      <branches>
        <hudson.plugins.git.BranchSpec>
          <name>*/$(xml_escape "${BRANCH_NAME}")</name>
        </hudson.plugins.git.BranchSpec>
      </branches>
      <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
      <submoduleCfg class="empty-list"/>
      <extensions/>
    </scm>
    <scriptPath>$(xml_escape "${SCRIPT_PATH}")</scriptPath>
    <lightweight>true</lightweight>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>
EOF

if [[ "${DRY_RUN}" == "true" ]]; then
  echo "Dry run enabled. Generated config for ${JOB_NAME}:"
  cat "${CONFIG_FILE}"
  exit 0
fi

if curl -fsS "${AUTH_ARGS[@]}" "${JOB_URL}/api/json" >/dev/null 2>&1; then
  echo "Updating Jenkins job: ${JOB_NAME}"
  curl -fsS -X POST "${AUTH_ARGS[@]}" "${CURL_HEADERS[@]}" \
    --data-binary @"${CONFIG_FILE}" \
    "${JOB_URL}/config.xml" >/dev/null
else
  echo "Creating Jenkins job: ${JOB_NAME}"
  curl -fsS -X POST "${AUTH_ARGS[@]}" "${CURL_HEADERS[@]}" \
    -H "Content-Type: application/xml" \
    --data-binary @"${CONFIG_FILE}" \
    "${JENKINS_URL}/createItem?name=${JOB_NAME_URL}" >/dev/null
fi

if [[ "${TRIGGER_BUILD}" == "true" ]]; then
  echo "Triggering build for ${JOB_NAME}"
  curl -fsS -X POST "${AUTH_ARGS[@]}" "${CURL_HEADERS[@]}" \
    "${JOB_URL}/build?delay=0sec" >/dev/null
fi

echo "Jenkins job is ready at: ${JOB_URL}"
