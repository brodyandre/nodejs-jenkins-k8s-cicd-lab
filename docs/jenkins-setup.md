# Configuração do Jenkins

## Plugins necessários

O laboratório foi desenhado para funcionar com os recursos já usados no projeto:

- Pipeline
- Git
- Credentials Binding
- Docker Pipeline
- Kubernetes CLI

Se o Jenkins estiver rodando em uma VM Ubuntu, valide também:

- acesso do usuário `jenkins` ao Docker
- presença de `node`, `npm`, `docker` e `kubectl` no agente que executará o job

## IDs de credenciais esperados

| ID | Tipo recomendado | Uso |
| --- | --- | --- |
| `dockerhub` | `Username with password` | login no Docker Hub e push da imagem |
| `kube` | credencial com kubeconfig | autenticação do `kubectl` na pipeline |

## Boas práticas de credenciais

- usar token do Docker Hub no lugar de senha tradicional
- manter o kubeconfig separado por ambiente
- não reutilizar credenciais pessoais em ambientes compartilhados

## Como criar o job Pipeline from SCM

1. Clique em `New Item`.
2. Escolha `Pipeline`.
3. Defina um nome como `nodejs-jenkins-k8s-cicd-lab`.
4. Em `Pipeline`, selecione `Pipeline script from SCM`.
5. Em `SCM`, escolha `Git`.
6. Informe a URL do repositório.
7. Configure credenciais Git se o repositório for privado.
8. Em `Script Path`, use `Jenkinsfile`.
9. Salve o job e execute `Build Now`.

## Opção automatizada

Se você preferir evitar configuração manual, o repositório agora inclui um script para criar ou atualizar o job pela API do Jenkins:

```bash
cp .env.jenkins.example .env.jenkins.local
npm run jenkins:job:dry-run
npm run jenkins:job:apply
```

Se preferir usar variáveis exportadas no shell:

```bash
export JENKINS_URL="http://jenkins.example.local:8080"
export JENKINS_USER="your_jenkins_user"
export JENKINS_API_TOKEN="your_jenkins_api_token"

node scripts/jenkins/create-pipeline-job.mjs --apply
```

Referência complementar:

- `scripts/jenkins/README.md`

## O que validar no primeiro build

- o agente Jenkins consegue executar `node`, `npm`, `docker` e `kubectl`
- a credencial `dockerhub` permite login e push
- a credencial `kube` permite acessar o cluster alvo
- o namespace `jenkins-cicd-lab` existe ou é criado pelos manifests
- o `Jenkinsfile` está na raiz do repositório
