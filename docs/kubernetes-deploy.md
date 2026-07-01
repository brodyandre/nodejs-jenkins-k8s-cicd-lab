# Kubernetes Deploy

## Objetivo

Validar se a aplicacao foi entregue corretamente no cluster k3d usando os manifests da pasta `k8s/`.

## Aplicacao manual dos manifests

```bash
kubectl apply -k k8s/
```

## Validacoes principais

### Namespace

```bash
kubectl get namespace jenkins-cicd-lab
```

### Deployment

```bash
kubectl -n jenkins-cicd-lab get deployment order-status-api
kubectl -n jenkins-cicd-lab rollout status deployment/order-status-api
```

### Pods

```bash
kubectl -n jenkins-cicd-lab get pods
kubectl -n jenkins-cicd-lab describe pods
```

### Service

```bash
kubectl -n jenkins-cicd-lab get svc order-status-api
```

### DNS interno do Service

```bash
kubectl -n jenkins-cicd-lab get svc order-status-api -o wide
```

## Smoke test interno

```bash
kubectl -n jenkins-cicd-lab run curl-smoke --rm -it --restart=Never \
  --image=curlimages/curl -- \
  curl -fsS http://order-status-api.jenkins-cicd-lab.svc.cluster.local:3000/health
```

## Sinais de deploy saudavel

- deployment com replicas disponiveis
- pods em `Running` e `Ready`
- service criado com `ClusterIP`
- rollout concluido sem timeout
- endpoint `/health` respondendo com sucesso no smoke test
- namespace correto isolando os recursos do laboratorio
