# Arquitetura

## Visão geral

Este laboratório demonstra um fluxo de CI/CD para uma API Node.js simples, cobrindo validação de código, empacotamento em container e deploy em Kubernetes.

O objetivo principal é apresentar um caso de portfólio que conecte desenvolvimento, build, publicação e entrega em um fluxo único e fácil de demonstrar com evidências visuais.

## Fluxo resumido

1. O código é versionado no GitHub.
2. O Jenkins executa a pipeline declarativa definida no `Jenkinsfile`.
3. A pipeline instala dependências e valida qualidade com lint e testes.
4. A aplicação é empacotada em uma imagem Docker.
5. A imagem é publicada no Docker Hub com tag imutável e `latest`.
6. O Jenkins aplica os manifests Kubernetes e atualiza o deployment com a nova imagem.
7. Um smoke test interno valida o Service no cluster k3d.

## Componentes principais

| Componente | Papel |
| --- | --- |
| GitHub | origem do código e gatilho natural para CI/CD |
| Jenkins | orquestração da pipeline |
| Node.js API | aplicação de exemplo para o laboratório |
| Docker | empacotamento da aplicação |
| Docker Hub | registro de imagens |
| Kubernetes k3d | ambiente de deploy e validação |

## Decisões de design

- API sem banco de dados para manter reprodutibilidade
- testes automatizados antes de build e deploy
- tags imutáveis para rastreabilidade entre build e release
- probes de saúde no Kubernetes para aumentar a confiabilidade do deploy
- smoke test interno no cluster para validar a entrega de ponta a ponta
- documentação preparada para screenshots reais sem inventar resultados
