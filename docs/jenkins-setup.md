# Jenkins Setup

## Plugins necessarios

O laboratorio foi desenhado para funcionar com os recursos ja usados no projeto:

- Pipeline
- Git
- Credentials Binding
- Docker Pipeline
- Kubernetes CLI

Se o Jenkins estiver rodando em uma VM Ubuntu, valide tambem:

- acesso do usuario `jenkins` ao Docker
- presenca de `node`, `npm`, `docker` e `kubectl` no agente que executara o job

## Credentials IDs esperados

| ID | Tipo recomendado | Uso |
| --- | --- | --- |
| `dockerhub` | `Username with password` | login no Docker Hub e push da imagem |
| `kube` | credencial com kubeconfig | autenticacao do `kubectl` na pipeline |

## Boas praticas de credenciais

- usar token do Docker Hub no lugar de senha tradicional
- manter o kubeconfig separado por ambiente
- nao reutilizar credenciais pessoais em ambientes compartilhados

## Como criar o job Pipeline from SCM

1. Clique em `New Item`.
2. Escolha `Pipeline`.
3. Defina um nome como `nodejs-jenkins-k8s-cicd-lab`.
4. Em `Pipeline`, selecione `Pipeline script from SCM`.
5. Em `SCM`, escolha `Git`.
6. Informe a URL do repositorio.
7. Configure credenciais Git se o repositorio for privado.
8. Em `Script Path`, use `Jenkinsfile`.
9. Salve o job e execute `Build Now`.

## Opcao automatizada

Se voce preferir evitar configuracao manual, o repositorio agora inclui um script para criar ou atualizar o job pela API do Jenkins:

```bash
cp .env.jenkins.example .env.jenkins.local
npm run jenkins:job:dry-run
npm run jenkins:job:apply
```

Se preferir usar variaveis exportadas no shell:

```bash
export JENKINS_URL="http://192.168.15.96:8080"
export JENKINS_USER="seu_usuario"
export JENKINS_API_TOKEN="seu_api_token"

node scripts/jenkins/create-pipeline-job.mjs --apply
```

Referencia complementar:

- `scripts/jenkins/README.md`

## O que validar no primeiro build

- o agente Jenkins consegue executar `node`, `npm`, `docker` e `kubectl`
- a credencial `dockerhub` permite login e push
- a credencial `kube` permite acessar o cluster alvo
- o namespace `jenkins-cicd-lab` existe ou e criado pelos manifests
- o `Jenkinsfile` esta na raiz do repositorio
