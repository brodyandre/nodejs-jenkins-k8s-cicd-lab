# Evidence Checklist

Checklist sugerido para montar evidencias visuais do laboratorio em um portfolio DevOps/CI/CD.

## Regras gerais

- nao capturar senhas, tokens, kubeconfig ou variaveis sensiveis
- ocultar usernames sensiveis se o contexto pedir anonimato
- preferir prints com data, nome do job e status visivel
- manter a mesma nomenclatura do projeto em todas as capturas

## Checklist de prints

- [ ] Jenkins credentials com os IDs `dockerhub` e `kube` visiveis, sem expor valores
- [ ] Jenkins pipeline com build concluida com sucesso
- [ ] Console output mostrando stages principais executados
- [ ] Docker Hub com a imagem `order-status-api` publicada
- [ ] `kubectl get pods -n jenkins-cicd-lab`
- [ ] `kubectl get deployment -n jenkins-cicd-lab`
- [ ] `kubectl get svc -n jenkins-cicd-lab`
- [ ] `kubectl rollout status deployment/order-status-api -n jenkins-cicd-lab`
- [ ] smoke test Kubernetes com resposta do endpoint `/health`
- [ ] Jenkins Kubernetes cloud agent, se esse modo for usado futuramente

## Sugestao de organizacao dos arquivos

- `docs/images/jenkins-credentials.png`
- `docs/images/jenkins-pipeline-success.png`
- `docs/images/jenkins-console-output.png`
- `docs/images/dockerhub-image.png`
- `docs/images/kubectl-get-pods.png`
- `docs/images/kubectl-get-deployment.png`
- `docs/images/kubectl-get-svc.png`
- `docs/images/kubectl-rollout-status.png`
- `docs/images/kubernetes-smoke-test.png`
- `docs/images/jenkins-kubernetes-cloud-agent.png`
