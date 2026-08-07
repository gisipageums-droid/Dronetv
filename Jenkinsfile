pipeline {
    agent any

    stages {
        stage('Deploy testdev frontend') {
            steps {
                sh '''
                    set -e
                    docker build -t dronetv-frontend-testdev-img:latest \
                        --build-arg VITE_BACKEND_URL_AUTH=https://api-dev.dronetv.in \
                        --build-arg VITE_BACKEND_URL_COMPANY=https://company-api-dev.dronetv.in \
                        --build-arg VITE_BACKEND_URL_PROFESSIONAL=https://professional-api-dev.dronetv.in \
                        --build-arg VITE_BACKEND_URL_EVENTS=https://events-api-dev.dronetv.in \
                        --build-arg VITE_BACKEND_URL_MEDIA=https://media-api-dev.dronetv.in \
                        --build-arg VITE_BACKEND_URL_LEADS=https://leads-api-dev.dronetv.in \
                        --build-arg VITE_BACKEND_URL_PAYMENT=https://payment-api-dev.dronetv.in \
                        --build-arg VITE_BACKEND_URL_ADMIN=https://admin-api-dev.dronetv.in \
                        --build-arg VITE_BACKEND_URL_JOB_APPLICATIONS=https://jobboard-api-dev.dronetv.in \
                        -f Dockerfile .
                    docker rm -f dronetv-frontend-testdev 2>/dev/null || true
                    docker run -d \
                        --name dronetv-frontend-testdev \
                        --network coolify \
                        --network-alias dronetv-frontend-testdev \
                        --restart unless-stopped \
                        --label traefik.enable=true \
                        --label 'traefik.http.routers.dronetv-frontend-testdev-https.rule=Host(`testdev.dronetv.in`)' \
                        --label traefik.http.routers.dronetv-frontend-testdev-https.entrypoints=https \
                        --label traefik.http.routers.dronetv-frontend-testdev-https.tls=true \
                        --label traefik.http.routers.dronetv-frontend-testdev-https.tls.certresolver=letsencrypt \
                        --label traefik.http.services.dronetv-frontend-testdev.loadbalancer.server.port=80 \
                        --label 'traefik.http.routers.dronetv-frontend-testdev-http.rule=Host(`testdev.dronetv.in`)' \
                        --label traefik.http.routers.dronetv-frontend-testdev-http.entrypoints=http \
                        --label traefik.http.routers.dronetv-frontend-testdev-http.middlewares=dronetv-frontend-testdev-https-redirect \
                        --label traefik.http.middlewares.dronetv-frontend-testdev-https-redirect.redirectscheme.scheme=https \
                        --label traefik.http.middlewares.dronetv-frontend-testdev-https-redirect.redirectscheme.permanent=true \
                        dronetv-frontend-testdev-img:latest
                    for i in 1 2 3 4 5; do
                        docker exec dronetv-frontend-testdev wget -qO- http://localhost/health && break
                        sleep 3
                    done
                    docker exec dronetv-frontend-testdev wget -qO- http://localhost/health || (docker logs --tail 60 dronetv-frontend-testdev; exit 1)
                '''
            }
        }
    }
    post {
        success { echo 'testdev.dronetv.in deployed' }
    }
}
