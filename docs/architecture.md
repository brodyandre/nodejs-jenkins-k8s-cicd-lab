# Architecture

## Visao geral

Este laboratorio demonstra um fluxo de CI/CD para uma API Node.js simples, cobrindo validacao de codigo, empacotamento em container e deploy em Kubernetes.

O objetivo principal e apresentar um caso de portfolio que conecte desenvolvimento, build, publicacao e entrega em um fluxo unico e facil de demonstrar com evidencias visuais.

## Fluxo resumido

1. O codigo e versionado no GitHub.
2. O Jenkins executa a pipeline declarativa definida no `Jenkinsfile`.
3. A pipeline instala dependencias e valida qualidade com lint e testes.
4. A aplicacao e empacotada em uma imagem Docker.
5. A imagem e publicada no Docker Hub com tag imutavel e `latest`.
6. O Jenkins aplica os manifests Kubernetes e atualiza o deployment com a nova imagem.
7. Um smoke test interno valida o Service no cluster k3d.

## Componentes principais

| Componente | Papel |
| --- | --- |
| GitHub | origem do codigo e gatilho natural para CI/CD |
| Jenkins | orquestracao da pipeline |
| Node.js API | aplicacao de exemplo para o laboratorio |
| Docker | empacotamento da aplicacao |
| Docker Hub | registro de imagens |
| Kubernetes k3d | ambiente de deploy e validacao |

## Decisoes de design

- API sem banco de dados para manter reproducibilidade
- testes automatizados antes de build e deploy
- tags imutaveis para rastreabilidade entre build e release
- probes de saude no Kubernetes para aumentar confiabilidade do deploy
- smoke test interno no cluster para validar a entrega fim a fim
- documentacao preparada para screenshots reais sem inventar resultados
