#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULTS = {
  JOB_NAME: "nodejs-jenkins-k8s-cicd-lab",
  GITHUB_REPO_URL: "https://github.com/brodyandre/nodejs-jenkins-k8s-cicd-lab.git",
  GIT_BRANCH: "main",
  JENKINSFILE_PATH: "Jenkinsfile"
};

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..", "..");
const localEnvFilePath = path.join(repositoryRoot, ".env.jenkins.local");

const stripWrappingQuotes = (value) => {
  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
};

const loadLocalEnvFile = (filePath) => {
  if (!existsSync(filePath)) {
    return;
  }

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const rawLine of lines) {
    const trimmedLine = rawLine.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const normalizedLine = trimmedLine.startsWith("export ")
      ? trimmedLine.slice(7).trim()
      : trimmedLine;
    const separatorIndex = normalizedLine.indexOf("=");

    if (separatorIndex <= 0) {
      continue;
    }

    const key = normalizedLine.slice(0, separatorIndex).trim();
    const value = normalizedLine.slice(separatorIndex + 1).trim();

    if (!key || Object.prototype.hasOwnProperty.call(process.env, key)) {
      continue;
    }

    process.env[key] = stripWrappingQuotes(value);
  }
};

loadLocalEnvFile(localEnvFilePath);

const args = new Set(process.argv.slice(2));
const applyMode = args.has("--apply");
const triggerBuild = args.has("--build");

if (triggerBuild && !applyMode) {
  console.error("Use --build only together with --apply.");
  process.exit(1);
}

const env = {
  JENKINS_URL: process.env.JENKINS_URL?.trim() || "",
  JENKINS_USER: process.env.JENKINS_USER?.trim() || "",
  JENKINS_API_TOKEN: process.env.JENKINS_API_TOKEN?.trim() || "",
  JOB_NAME: process.env.JOB_NAME?.trim() || DEFAULTS.JOB_NAME,
  GITHUB_REPO_URL: process.env.GITHUB_REPO_URL?.trim() || DEFAULTS.GITHUB_REPO_URL,
  GIT_BRANCH: process.env.GIT_BRANCH?.trim() || DEFAULTS.GIT_BRANCH,
  JENKINSFILE_PATH: process.env.JENKINSFILE_PATH?.trim() || DEFAULTS.JENKINSFILE_PATH
};

if (applyMode) {
  const required = ["JENKINS_URL", "JENKINS_USER", "JENKINS_API_TOKEN"];
  const missing = required.filter((key) => !env[key]);

  if (missing.length > 0) {
    console.error(`Missing required environment variables for --apply: ${missing.join(", ")}`);
    process.exit(1);
  }
}

const xmlEscape = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll("\"", "&quot;")
  .replaceAll("'", "&apos;");

const createConfigXml = ({
  jobName,
  githubRepoUrl,
  gitBranch,
  jenkinsfilePath
}) => `<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job">
  <actions/>
  <description>${xmlEscape(`Pipeline from SCM for ${jobName}`)}</description>
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
        <hudson.plugins.git.UserRemoteConfig>
          <url>${xmlEscape(githubRepoUrl)}</url>
        </hudson.plugins.git.UserRemoteConfig>
      </userRemoteConfigs>
      <branches>
        <hudson.plugins.git.BranchSpec>
          <name>${xmlEscape(`*/${gitBranch}`)}</name>
        </hudson.plugins.git.BranchSpec>
      </branches>
      <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
      <submoduleCfg class="empty-list"/>
      <extensions/>
    </scm>
    <scriptPath>${xmlEscape(jenkinsfilePath)}</scriptPath>
    <lightweight>true</lightweight>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>
`;

const main = async () => {
  const configXml = createConfigXml({
    jobName: env.JOB_NAME,
    githubRepoUrl: env.GITHUB_REPO_URL,
    gitBranch: env.GIT_BRANCH,
    jenkinsfilePath: env.JENKINSFILE_PATH
  });

  if (!applyMode) {
    console.log(`Dry run: config.xml for job "${env.JOB_NAME}"`);
    console.log(configXml);
    return;
  }

  const baseUrl = env.JENKINS_URL.replace(/\/+$/, "");
  const jobUrl = `${baseUrl}/job/${encodeURIComponent(env.JOB_NAME)}`;
  const authHeader = `Basic ${Buffer.from(`${env.JENKINS_USER}:${env.JENKINS_API_TOKEN}`).toString("base64")}`;

  const request = async (url, options = {}) => fetch(url, {
    ...options,
    headers: {
      Authorization: authHeader,
      ...(options.headers || {})
    }
  });

  const failWithHttpError = async (response, context) => {
    const body = await response.text();
    const preview = body.trim().slice(0, 500);
    const suffix = preview ? ` Response: ${preview}` : "";

    throw new Error(`${context} failed with HTTP ${response.status} ${response.statusText}.${suffix}`);
  };

  const getCrumbHeader = async () => {
    const response = await request(`${baseUrl}/crumbIssuer/api/json`);

    if (response.status === 404 || !response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data?.crumbRequestField || !data?.crumb) {
      return null;
    }

    return {
      [data.crumbRequestField]: data.crumb
    };
  };

  const crumbHeader = await getCrumbHeader();
  const postHeaders = {
    "Content-Type": "application/xml",
    ...(crumbHeader || {})
  };

  const jobExistsResponse = await request(`${jobUrl}/api/json`);

  if (jobExistsResponse.status === 404) {
    const createResponse = await request(
      `${baseUrl}/createItem?name=${encodeURIComponent(env.JOB_NAME)}`,
      {
        method: "POST",
        headers: postHeaders,
        body: configXml
      }
    );

    if (!createResponse.ok) {
      await failWithHttpError(createResponse, `Create job "${env.JOB_NAME}"`);
    }

    console.log(`Created Jenkins job: ${env.JOB_NAME}`);
  } else if (jobExistsResponse.ok) {
    const updateResponse = await request(`${jobUrl}/config.xml`, {
      method: "POST",
      headers: postHeaders,
      body: configXml
    });

    if (!updateResponse.ok) {
      await failWithHttpError(updateResponse, `Update job "${env.JOB_NAME}"`);
    }

    console.log(`Updated Jenkins job: ${env.JOB_NAME}`);
  } else {
    await failWithHttpError(jobExistsResponse, `Check job "${env.JOB_NAME}"`);
  }

  if (triggerBuild) {
    const buildResponse = await request(`${jobUrl}/build?delay=0sec`, {
      method: "POST",
      headers: crumbHeader || {}
    });

    if (!buildResponse.ok) {
      await failWithHttpError(buildResponse, `Trigger build for "${env.JOB_NAME}"`);
    }

    console.log(`Triggered build for Jenkins job: ${env.JOB_NAME}`);
  }

  console.log(`Jenkins job ready at: ${jobUrl}`);
};

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Jenkins job automation failed: ${message}`);
  process.exit(1);
}
