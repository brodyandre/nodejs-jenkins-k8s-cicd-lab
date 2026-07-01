# Automação do job Jenkins

## Para que serve

Este diretório contém uma automação segura para criar ou atualizar um job Jenkins do tipo `Pipeline from SCM` usando a Remote Access API do Jenkins.

O script:

- gera o `config.xml` do job
- roda em `dry-run` por padrão
- só chama o Jenkins real com a flag `--apply`
- pode disparar uma build com `--build`
- carrega `.env.jenkins.local` automaticamente quando esse arquivo existir na raiz do projeto

## Como criar um API token no Jenkins

1. Acesse o Jenkins com seu usuário.
2. Clique no usuário logado no canto superior direito.
3. Abra `Security`.
4. Crie um novo `API Token`.
5. Guarde o token localmente e não o versione no repositório.

## Variáveis suportadas

| Variável | Obrigatória no dry-run | Obrigatória no --apply | Padrão |
| --- | --- | --- | --- |
| `JENKINS_URL` | não | sim | - |
| `JENKINS_USER` | não | sim | - |
| `JENKINS_API_TOKEN` | não | sim | - |
| `JOB_NAME` | não | não | `nodejs-jenkins-k8s-cicd-lab` |
| `GITHUB_REPO_URL` | não | não | URL pública deste repositório |
| `GIT_BRANCH` | não | não | `main` |
| `JENKINSFILE_PATH` | não | não | `Jenkinsfile` |

## Dry-run

Exibe o `config.xml` gerado sem chamar o Jenkins:

```bash
node scripts/jenkins/create-pipeline-job.mjs
```

Com variáveis customizadas:

```bash
JOB_NAME=nodejs-jenkins-k8s-cicd-lab-dev \
GIT_BRANCH=main \
node scripts/jenkins/create-pipeline-job.mjs
```

## Aplicar no Jenkins real

Opção 1, usando variáveis exportadas no shell:

```bash
export JENKINS_URL="http://jenkins.example.local:8080"
export JENKINS_USER="your_jenkins_user"
export JENKINS_API_TOKEN="your_jenkins_api_token"

node scripts/jenkins/create-pipeline-job.mjs --apply
```

Opção 2, usando o arquivo `.env.jenkins.local`:

```bash
cp .env.jenkins.example .env.jenkins.local
node scripts/jenkins/create-pipeline-job.mjs --apply
```

## Aplicar e disparar build

```bash
export JENKINS_URL="http://jenkins.example.local:8080"
export JENKINS_USER="your_jenkins_user"
export JENKINS_API_TOKEN="your_jenkins_api_token"

node scripts/jenkins/create-pipeline-job.mjs --apply --build
```

## Cuidados importantes

- não versione tokens nem credenciais reais
- mantenha o token em variáveis de ambiente locais, por exemplo em `.env.jenkins.local`
- revise o `dry-run` antes do primeiro `--apply`
- o script tenta obter crumb automaticamente, mas continua funcionando com API token se o crumb não estiver habilitado
