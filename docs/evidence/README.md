# Índice de evidências

Índice técnico das evidências do laboratório CI/CD com Node.js, Jenkins, Docker Hub e Kubernetes/k3d.

## Nota de curadoria

O `README.md` principal concentra apenas as evidências visuais mais representativas do fluxo ponta a ponta.
As capturas mais operacionais, detalhadas ou redundantes permanecem neste índice técnico para preservar uma leitura mais objetiva do portfólio.

## Resumo validado

- Jenkins job: `nodejs-jenkins-k8s-cicd-lab`
- Build de sucesso: `#4`
- Imagem Docker validada: `las43/order-status-api:4-c36c06a`
- Namespace Kubernetes: `jenkins-cicd-lab`
- Deployment: `order-status-api`
- Service Kubernetes: `order-status-api`
- Porta da aplicação e do Service: `3000`
- Estado confirmado do deployment: `2/2` réplicas prontas
- Smoke test interno: endpoint `/health` retornando `success true` e `Service is healthy`

## Tabela de evidências

| Evidência | Arquivo ou comando | O que comprova |
| --- | --- | --- |
| Build Jenkins de sucesso | [`../images/04-jenkins-build-4-success.png`](../images/04-jenkins-build-4-success.png) | Comprova que o job `nodejs-jenkins-k8s-cicd-lab` concluiu o `Build #4` com sucesso. |
| Testes automatizados no Jenkins | [`../images/06-jenkins-console-tests-passed.png`](../images/06-jenkins-console-tests-passed.png) | Comprova que a pipeline executou e aprovou a etapa de testes antes do empacotamento. |
| Imagem Docker publicada no Docker Hub | [`../images/08-jenkins-console-dockerhub-push.png`](../images/08-jenkins-console-dockerhub-push.png) e [`../images/11-dockerhub-order-status-api-tags.png`](../images/11-dockerhub-order-status-api-tags.png) | Comprova o push da imagem para o repositório `las43/order-status-api` e a presença da tag `4-c36c06a`. |
| Deploy Kubernetes/k3d | [`../images/09-jenkins-console-kubernetes-deploy.png`](../images/09-jenkins-console-kubernetes-deploy.png) | Comprova a etapa de deploy da pipeline para o namespace `jenkins-cicd-lab`. |
| Estado geral dos recursos no cluster | [`../images/13-kubernetes-get-all-wide.png`](../images/13-kubernetes-get-all-wide.png) ou `kubectl get all -n jenkins-cicd-lab -o wide` | Comprova a existência dos recursos principais do laboratório no namespace alvo. |
| Validação do rollout | [`../images/14-kubernetes-deployment-ready.png`](../images/14-kubernetes-deployment-ready.png) e `kubectl rollout status deployment/order-status-api -n jenkins-cicd-lab` | Comprova que o deployment `order-status-api` atingiu estado pronto com `2/2` réplicas. |
| Pods em execução após o deploy | [`../images/15-kubernetes-pods-running.png`](../images/15-kubernetes-pods-running.png) | Comprova que os pods da aplicação permaneceram ativos após a atualização. |
| Service interno publicado | [`../images/16-kubernetes-service.png`](../images/16-kubernetes-service.png) | Comprova a exposição interna do serviço da aplicação no cluster. |
| Smoke test interno no cluster | [`../images/17-kubernetes-smoke-test-success.png`](../images/17-kubernetes-smoke-test-success.png) e [`../images/10-jenkins-console-kubernetes-smoke-success.png`](../images/10-jenkins-console-kubernetes-smoke-success.png) | Comprova a validação pós-deploy do endpoint `/health`, com retorno `success true` e mensagem `Service is healthy`. |
| Localização dos logs e prints | `docs/evidence/jenkins-build-4-success.log`, `docs/images/` e [`../images/22-docs-evidence-files.png`](../images/22-docs-evidence-files.png) | Comprova onde consultar o log bruto local do build e as capturas visuais do laboratório. |

## Localização dos artefatos

- Prints versionáveis: `docs/images/`
- Índice técnico: `docs/evidence/README.md`
- Log local de apoio do build Jenkins: `docs/evidence/jenkins-build-4-success.log`

## Pendências

- Não existe, neste momento, uma captura dedicada nomeada especificamente para o comando `kubectl rollout status deployment/order-status-api -n jenkins-cicd-lab`.
- A evidência visual atual mais próxima para rollout concluído é [`../images/14-kubernetes-deployment-ready.png`](../images/14-kubernetes-deployment-ready.png).

## Observações de segurança

- Este índice referencia apenas nomes de arquivos e comandos seguros.
- Nenhum secret, token, senha ou kubeconfig é publicado neste documento.
