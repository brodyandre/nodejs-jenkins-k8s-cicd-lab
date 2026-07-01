# Troubleshooting

## Erros comuns e solucoes

| Sintoma | Causa provavel | Acao recomendada |
| --- | --- | --- |
| `docker: permission denied` | usuario `jenkins` sem permissao no daemon Docker | adicionar o usuario ao grupo `docker` e reiniciar a sessao do agente |
| `docker login failed` | credencial `dockerhub` invalida ou expirada | recriar token no Docker Hub e atualizar a credencial no Jenkins |
| `kubectl` sem contexto | kubeconfig ausente, invalido ou apontando para cluster errado | revisar a credencial `kube` e validar `kubectl config get-contexts` |
| `credentialsId 'kube' not found` | ID da credencial divergente | garantir que o ID no Jenkins seja exatamente `kube` |
| `ImagePullBackOff` | imagem nao publicada, tag incorreta ou registro inacessivel | validar push da imagem, nome do repositorio e tag usada no deployment |
| `CrashLoopBackOff` | falha na inicializacao da aplicacao ou probes incorretas | revisar `kubectl logs`, `kubectl describe pod` e configuracoes de `PORT`, `/health` e `/ready` |
| rollout em timeout | nova replica nao fica pronta | verificar eventos do deployment, disponibilidade de imagem e readiness probe |
| `kubectl rollout status` nao conclui | pods nao ficam prontos ou imagem nao sobe | revisar readiness probe, eventos do deployment e logs da aplicacao |
| Jenkins nao cria agent | node offline, restricao de executor ou configuracao incorreta | revisar status do agente, labels e capacidade de execucao |

## Comandos uteis

```bash
docker ps
kubectl config get-contexts
kubectl -n jenkins-cicd-lab get pods
kubectl -n jenkins-cicd-lab describe deployment order-status-api
kubectl -n jenkins-cicd-lab logs deployment/order-status-api
```

## Dica para portfolio

Ao registrar evidencias de erro e correcao, prefira mostrar:

- sintoma observado
- comando usado para diagnostico
- ajuste aplicado
- evidencia final de sucesso
