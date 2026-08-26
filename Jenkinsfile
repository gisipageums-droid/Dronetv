pipeline {
    agent any

    stages {
        stage('Deploy production frontend') {
            steps {
                sh '''
                    set -e
                    docker build -t dronetv-frontend-prod-img:latest \
                        --build-arg VITE_BACKEND_URL_AUTH=https://auth-api.dronetv.in \
                        --build-arg VITE_BACKEND_URL_COMPANY=https://company-api.dronetv.in \
                        --build-arg VITE_BACKEND_URL_PROFESSIONAL=https://professional-api.dronetv.in \
                        --build-arg VITE_BACKEND_URL_EVENTS=https://events-api.dronetv.in \
                        --build-arg VITE_BACKEND_URL_MEDIA=https://media-api.dronetv.in \
                        --build-arg VITE_BACKEND_URL_LEADS=https://leads-api.dronetv.in \
                        --build-arg VITE_BACKEND_URL_PAYMENT=https://payment-api.dronetv.in \
                        --build-arg VITE_BACKEND_URL_ADMIN=https://admin-api.dronetv.in \
                        --build-arg VITE_BACKEND_URL_JOB_APPLICATIONS=https://jobboard-api.dronetv.in \
                        --build-arg VITE_SUREPASS_PROXY_URL=https://fiwnyd2mrg.execute-api.ap-south-1.amazonaws.com/prod/verify \
                        -f Dockerfile .
                    docker rm -f dronetv-frontend-prod-staging 2>/dev/null || true
                    docker run -d \
                        --name dronetv-frontend-prod-staging \
                        --network coolify \
                        --network-alias dronetv-frontend-prod-staging \
                        --restart unless-stopped \
                        --label traefik.enable=true \
                        --label 'traefik.http.routers.dronetv-frontend-prod-staging-https.rule=Host(`prod-staging.dronetv.in`)' \
                        --label traefik.http.routers.dronetv-frontend-prod-staging-https.entrypoints=https \
                        --label traefik.http.routers.dronetv-frontend-prod-staging-https.tls=true \
                        --label traefik.http.routers.dronetv-frontend-prod-staging-https.tls.certresolver=letsencrypt \
                        --label traefik.http.services.dronetv-frontend-prod-staging.loadbalancer.server.port=80 \
                        --label 'traefik.http.routers.dronetv-frontend-prod-staging-http.rule=Host(`prod-staging.dronetv.in`)' \
                        --label traefik.http.routers.dronetv-frontend-prod-staging-http.entrypoints=http \
                        --label traefik.http.routers.dronetv-frontend-prod-staging-http.middlewares=dronetv-frontend-prod-staging-https-redirect \
                        --label traefik.http.middlewares.dronetv-frontend-prod-staging-https-redirect.redirectscheme.scheme=https \
                        --label traefik.http.middlewares.dronetv-frontend-prod-staging-https-redirect.redirectscheme.permanent=true \
                        dronetv-frontend-prod-img:latest
                    for i in 1 2 3 4 5; do
                        docker exec dronetv-frontend-prod-staging wget -qO- http://127.0.0.1/health && break
                        sleep 3
                    done
                    docker exec dronetv-frontend-prod-staging wget -qO- http://127.0.0.1/health || (docker logs --tail 60 dronetv-frontend-prod-staging; exit 1)
                '''
            }
        }
    }
    post {
        success { echo 'prod-staging.dronetv.in deployed (staging hostname - not live dronetv.in yet)' }
    }
}
