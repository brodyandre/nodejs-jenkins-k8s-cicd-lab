# Solução de problemas

## Erros comuns e soluções

| Sintoma | Causa provável | Ação recomendada |
| --- | --- | --- |
| `docker: permission denied` | usuário `jenkins` sem permissão no daemon Docker | adicionar o usuário ao grupo `docker` e reiniciar a sessão do agente |
| `docker login failed` | credencial `dockerhub` inválida ou expirada | recriar token no Docker Hub e atualizar a credencial no Jenkins |
| `kubectl` sem contexto | kubeconfig ausente, inválido ou apontando para cluster errado | revisar a credencial `kube` e validar `kubectl config get-contexts` |
| `credentialsId 'kube' not found` | ID da credencial divergente | garantir que o ID no Jenkins seja exatamente `kube` |
| `ImagePullBackOff` | imagem não publicada, tag incorreta ou registro inacessível | validar push da imagem, nome do repositório e tag usada no deployment |
| `CrashLoopBackOff` | falha na inicialização da aplicação ou probes incorretas | revisar `kubectl logs`, `kubectl describe pod` e configurações de `PORT`, `/health` e `/ready` |
| rollout em timeout | nova réplica não fica pronta | verificar eventos do deployment, disponibilidade de imagem e readiness probe |
| `kubectl rollout status` não conclui | pods não ficam prontos ou a imagem não sobe | revisar readiness probe, eventos do deployment e logs da aplicação |
| Jenkins não cria agent | node offline, restrição de executor ou configuração incorreta | revisar status do agente, labels e capacidade de execução |

## Comandos úteis

```bash
docker ps
kubectl config get-contexts
kubectl -n jenkins-cicd-lab get pods
kubectl -n jenkins-cicd-lab describe deployment order-status-api
kubectl -n jenkins-cicd-lab logs deployment/order-status-api
```

## Dica para portfólio

Ao registrar evidências de erro e correção, prefira mostrar:

- sintoma observado
- comando usado para diagnóstico
- ajuste aplicado
- evidência final de sucesso
