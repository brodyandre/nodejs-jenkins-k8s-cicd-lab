# Jenkins Automation

Este diretorio contem automacao para criar ou atualizar o job ideal deste laboratorio no Jenkins usando a API HTTP.

## Job recomendado

Para este projeto, o melhor setup inicial e um job dedicado do tipo `Pipeline` apontando para o `Jenkinsfile` do repositório:

- nome sugerido: `order-status-api-pipeline`
- tipo: `Pipeline from SCM`
- branch: `main`

Se no futuro voce quiser validar varias branches e PRs, a evolucao natural e migrar para `Multibranch Pipeline`.

## Script disponivel

`create-pipeline-job.sh`

Cria ou atualiza um job Jenkins apontando para este repositório no GitHub.

## Exemplo de uso

```bash
export JENKINS_URL="http://192.168.15.96:8080"
export JENKINS_USER="admin"
export JENKINS_API_TOKEN="seu-token"
export JOB_NAME="order-status-api-pipeline"

bash scripts/jenkins/create-pipeline-job.sh
```

Para disparar a primeira build logo apos criar o job:

```bash
TRIGGER_BUILD=true bash scripts/jenkins/create-pipeline-job.sh
```

## Variaveis suportadas

| Variavel | Obrigatoria | Padrao |
| --- | --- | --- |
| `JENKINS_URL` | sim | - |
| `JENKINS_USER` | nao | - |
| `JENKINS_API_TOKEN` | nao | - |
| `JOB_NAME` | nao | `order-status-api-pipeline` |
| `REPO_URL` | nao | repositório publico deste projeto |
| `BRANCH_NAME` | nao | `main` |
| `SCRIPT_PATH` | nao | `Jenkinsfile` |
| `SCM_CREDENTIALS_ID` | nao | vazio |
| `JOB_DESCRIPTION` | nao | descricao padrao |
| `TRIGGER_BUILD` | nao | `false` |
| `DRY_RUN` | nao | `false` |
