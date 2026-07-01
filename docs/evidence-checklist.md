# Checklist de evidências

Checklist de revisão das evidências reais do laboratório para portfólio DevOps/CI/CD.

## Regras gerais

- não capturar senhas, tokens, kubeconfig ou variáveis sensíveis
- ocultar usernames sensíveis se o contexto pedir anonimato
- preferir prints com data, nome do job e status visível
- manter a mesma nomenclatura do projeto em todas as capturas
- manter logs crus fora do Git; publicar apenas resumos sanitizados em `.md` ou `.txt`

## Evidências reais atualmente presentes em `docs/images/`

- `docs/images/01-github-repository.png`
- `docs/images/02-github-jenkinsfile-pipeline-stages.png`
- `docs/images/03-jenkins-job-dashboard.png`
- `docs/images/04-jenkins-build-4-success.png`
- `docs/images/05-jenkins-console-tooling-info.png`
- `docs/images/06-jenkins-console-tests-passed.png`
- `docs/images/07-jenkins-console-docker-build-smoke.png`
- `docs/images/08-jenkins-console-dockerhub-push.png`
- `docs/images/09-jenkins-console-kubernetes-deploy.png`
- `docs/images/10-jenkins-console-kubernetes-smoke-success.png`
- `docs/images/11-dockerhub-order-status-api-tags.png`
- `docs/images/12-kubernetes-node-ready.png`
- `docs/images/13-kubernetes-get-all-wide.png`
- `docs/images/14-kubernetes-deployment-ready.png`
- `docs/images/15-kubernetes-pods-running.png`
- `docs/images/16-kubernetes-service.png`
- `docs/images/17-kubernetes-smoke-test-success.png`
- `docs/images/18-jenkins-kubernetes-cloud-provider.png`
- `docs/images/19-jenkins-k8s-agent-template.png`
- `docs/images/20-jenkins-credentials-list-safe.png`
- `docs/images/21-project-structure.png`
- `docs/images/22-docs-evidence-files.png`

## Evidência sanitizada versionável

- `docs/evidence/README.md`: índice público das capturas e política para logs locais

## Capturas adicionais opcionais

- [ ] tela do job criado automaticamente via API do Jenkins
- [ ] configuração do job `Pipeline from SCM` com branch `main` e `Jenkinsfile`
- [ ] console da primeira execução disparada pela automação do job
