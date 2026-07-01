# Jenkins Job Automation

## Para que serve

Este diretorio contem uma automacao segura para criar ou atualizar um job Jenkins do tipo `Pipeline from SCM` usando a Remote Access API do Jenkins.

O script:

- gera o `config.xml` do job
- roda em `dry-run` por padrao
- so chama o Jenkins real com a flag `--apply`
- pode disparar uma build com `--build`
- carrega `.env.jenkins.local` automaticamente quando esse arquivo existir na raiz do projeto

## Como criar um API token no Jenkins

1. Acesse o Jenkins com seu usuario.
2. Clique no usuario logado no canto superior direito.
3. Abra `Security`.
4. Crie um novo `API Token`.
5. Guarde o token localmente e nao o versione no repositório.

## Variaveis suportadas

| Variavel | Obrigatoria no dry-run | Obrigatoria no --apply | Padrao |
| --- | --- | --- | --- |
| `JENKINS_URL` | nao | sim | - |
| `JENKINS_USER` | nao | sim | - |
| `JENKINS_API_TOKEN` | nao | sim | - |
| `JOB_NAME` | nao | nao | `nodejs-jenkins-k8s-cicd-lab` |
| `GITHUB_REPO_URL` | nao | nao | URL publica deste repositório |
| `GIT_BRANCH` | nao | nao | `main` |
| `JENKINSFILE_PATH` | nao | nao | `Jenkinsfile` |

## Dry-run

Exibe o `config.xml` gerado sem chamar o Jenkins:

```bash
node scripts/jenkins/create-pipeline-job.mjs
```

Com variaveis customizadas:

```bash
JOB_NAME=nodejs-jenkins-k8s-cicd-lab-dev \
GIT_BRANCH=main \
node scripts/jenkins/create-pipeline-job.mjs
```

## Aplicar no Jenkins real

Opcao 1, usando variaveis exportadas no shell:

```bash
export JENKINS_URL="http://jenkins.example.local:8080"
export JENKINS_USER="your_jenkins_user"
export JENKINS_API_TOKEN="your_jenkins_api_token"

node scripts/jenkins/create-pipeline-job.mjs --apply
```

Opcao 2, usando o arquivo `.env.jenkins.local`:

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

- nao versione tokens nem credenciais reais
- mantenha o token em variaveis de ambiente locais, por exemplo em `.env.jenkins.local`
- revise o `dry-run` antes do primeiro `--apply`
- o script tenta obter crumb automaticamente, mas continua funcionando com API token se o crumb nao estiver habilitado
