pipeline {
  agent any

  options {
    skipDefaultCheckout(true)
  }

  environment {
    APP_NAME = 'Order Status API'
    APP_VERSION = '1.0.0'
    K8S_NAMESPACE = 'jenkins-cicd-lab'
    APP_DEPLOYMENT = 'order-status-api'
    APP_CONTAINER = 'order-status-api'
    LOCAL_SMOKE_CONTAINER = 'order-status-api-smoke'
    LOCAL_SMOKE_PORT = '18080'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script {
          env.GIT_SHORT_SHA = sh(
            script: 'git rev-parse --short=7 HEAD',
            returnStdout: true
          ).trim()

          withCredentials([
            usernamePassword(
              credentialsId: 'dockerhub',
              usernameVariable: 'DOCKERHUB_USER',
              passwordVariable: 'DOCKERHUB_PASSWORD'
            )
          ]) {
            env.DOCKERHUB_USER = DOCKERHUB_USER.trim()
          }

          env.IMAGE_REPOSITORY = "${env.DOCKERHUB_USER}/order-status-api"
          env.IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_SHORT_SHA}"
          env.IMAGE_IMMUTABLE = "${env.IMAGE_REPOSITORY}:${env.IMAGE_TAG}"
          env.IMAGE_LATEST = "${env.IMAGE_REPOSITORY}:latest"
        }
      }
    }

    stage('Tooling Info') {
      steps {
        sh '''
          set -e
          echo "Node: $(node --version)"
          echo "NPM: $(npm --version)"
          echo "Docker: $(docker --version)"
          echo "Kubectl:"
          kubectl version --client
          echo "Git: $(git --version)"
          echo "Image repository: ${IMAGE_REPOSITORY}"
          echo "Immutable tag: ${IMAGE_IMMUTABLE}"
        '''
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh '''
          set -e
          docker build \
            -t "${IMAGE_IMMUTABLE}" \
            -t "${IMAGE_LATEST}" \
            .
        '''
      }
    }

    stage('Smoke Test Docker Image') {
      steps {
        sh '''
          set -e
          docker rm -f "${LOCAL_SMOKE_CONTAINER}" >/dev/null 2>&1 || true
          trap 'docker rm -f "${LOCAL_SMOKE_CONTAINER}" >/dev/null 2>&1 || true' EXIT

          docker run -d --rm \
            --name "${LOCAL_SMOKE_CONTAINER}" \
            -p "${LOCAL_SMOKE_PORT}:3000" \
            -e APP_NAME="${APP_NAME}" \
            -e APP_VERSION="${APP_VERSION}" \
            -e PORT=3000 \
            "${IMAGE_IMMUTABLE}"

          for attempt in $(seq 1 20); do
            if curl -fsS "http://127.0.0.1:${LOCAL_SMOKE_PORT}/health" >/dev/null; then
              exit 0
            fi
            sleep 2
          done

          docker logs "${LOCAL_SMOKE_CONTAINER}" || true
          exit 1
        '''
      }
    }

    stage('Push Docker Image to Docker Hub') {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'dockerhub',
            usernameVariable: 'DOCKERHUB_USER',
            passwordVariable: 'DOCKERHUB_PASSWORD'
          )
        ]) {
          sh '''
            set -e
            set +x
            echo "${DOCKERHUB_PASSWORD}" | docker login -u "${DOCKERHUB_USER}" --password-stdin
            set -x

            docker push "${IMAGE_IMMUTABLE}"
            docker push "${IMAGE_LATEST}"
          '''
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        withKubeConfig([credentialsId: 'kube']) {
          sh '''
            set -e
            kubectl apply -k k8s/
            kubectl -n "${K8S_NAMESPACE}" set image deployment/"${APP_DEPLOYMENT}" \
              "${APP_CONTAINER}"="${IMAGE_IMMUTABLE}"
            kubectl -n "${K8S_NAMESPACE}" rollout status deployment/"${APP_DEPLOYMENT}" --timeout=180s
          '''
        }
      }
    }

    stage('Kubernetes Smoke Test') {
      steps {
        withKubeConfig([credentialsId: 'kube']) {
          sh '''
            set -e
            kubectl -n "${K8S_NAMESPACE}" delete pod smoke-test --ignore-not-found=true
            kubectl run smoke-test --rm -i --restart=Never \
              --image=curlimages/curl \
              -n "${K8S_NAMESPACE}" -- \
              curl -fsS http://order-status-api.jenkins-cicd-lab.svc.cluster.local:3000/health
          '''
        }
      }
    }

    stage('Cleanup Local Docker Resources') {
      steps {
        sh '''
          docker rm -f "${LOCAL_SMOKE_CONTAINER}" >/dev/null 2>&1 || true
          docker image rm "${IMAGE_IMMUTABLE}" "${IMAGE_LATEST}" >/dev/null 2>&1 || true
        '''
      }
    }
  }

  post {
    always {
      sh '''
        docker rm -f "${LOCAL_SMOKE_CONTAINER}" >/dev/null 2>&1 || true
        docker logout >/dev/null 2>&1 || true
      '''
    }
  }
}
