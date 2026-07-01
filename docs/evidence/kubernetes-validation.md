# Validação do Kubernetes

Registro técnico das evidências confirmadas para o deploy da aplicação no ambiente Kubernetes/k3d do laboratório.

## Contexto validado

- Ambiente alvo: cluster local `k3d`
- Node validado: `k3d-jenkins-k3d-server-0`
- Namespace: `jenkins-cicd-lab`
- Deployment: `order-status-api`
- Service: `order-status-api`
- Porta do Service: `3000`
- Imagem implantada: `las43/order-status-api:4-c36c06a`

## Evidências confirmadas

| Evidência | Fonte | O que comprova |
| --- | --- | --- |
| Node do cluster em estado `Ready` | [`../images/12-kubernetes-node-ready.png`](../images/12-kubernetes-node-ready.png) | Comprova que o node `k3d-jenkins-k3d-server-0` estava operacional durante a validação. |
| Namespace `jenkins-cicd-lab` | `docs/evidence/jenkins-build-4-success.log` e [`../images/13-kubernetes-get-all-wide.png`](../images/13-kubernetes-get-all-wide.png) | Comprova que o deploy ocorreu no namespace dedicado do laboratório. |
| Deployment `order-status-api` com `2/2` réplicas | [`../images/14-kubernetes-deployment-ready.png`](../images/14-kubernetes-deployment-ready.png) e `docs/evidence/jenkins-build-4-success.log` | Comprova que o deployment atingiu estado pronto com duas réplicas disponíveis. |
| Pods em estado `Running` | [`../images/15-kubernetes-pods-running.png`](../images/15-kubernetes-pods-running.png) | Comprova que os pods da aplicação permaneceram ativos após a atualização. |
| Service `ClusterIP` na porta `3000` | [`../images/16-kubernetes-service.png`](../images/16-kubernetes-service.png) | Comprova a exposição interna do serviço da aplicação na porta esperada. |
| Imagem `las43/order-status-api:4-c36c06a` aplicada no deployment | `docs/evidence/jenkins-build-4-success.log` e [`../images/11-dockerhub-order-status-api-tags.png`](../images/11-dockerhub-order-status-api-tags.png) | Comprova a utilização da imagem validada na etapa de deploy. |
| Smoke test interno com retorno `Service is healthy` | `docs/evidence/jenkins-build-4-success.log`, [`../images/10-jenkins-console-kubernetes-smoke-success.png`](../images/10-jenkins-console-kubernetes-smoke-success.png) e [`../images/17-kubernetes-smoke-test-success.png`](../images/17-kubernetes-smoke-test-success.png) | Comprova a validação pós-deploy do endpoint `/health` com resposta saudável da aplicação. |

## Observações

- O log do Jenkins confirma a execução de `Deploy to Kubernetes`, o rollout bem-sucedido do deployment e o smoke test interno no namespace `jenkins-cicd-lab`.
- As capturas em `docs/images/` complementam o log com evidências visuais do estado final do cluster.
- Nenhum kubeconfig, token ou credencial é reproduzido neste documento.
