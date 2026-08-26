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
                      docker rm -f dronetv-frontend-prod 2>/dev/null || true
                      docker run -d \
                          --name dronetv-frontend-prod \
                          --network coolify \
                          --network-alias dronetv-frontend-prod \
                          --restart unless-stopped \
                          --label traefik.enable=true \
                          --label 'traefik.http.routers.dronetv-frontend-prod-https.rule=Host(`dronetv.in`) || Host(`www.dronetv.in`)' \
                          --label traefik.http.routers.dronetv-frontend-prod-https.entrypoints=https \
                          --label traefik.http.routers.dronetv-frontend-prod-https.tls=true \
                          --label traefik.http.routers.dronetv-frontend-prod-https.tls.certresolver=letsencrypt \
                          --label traefik.http.services.dronetv-frontend-prod.loadbalancer.server.port=80 \
                          --label 'traefik.http.routers.dronetv-frontend-prod-http.rule=Host(`dronetv.in`) || Host(`www.dronetv.in`)' \
                          --label traefik.http.routers.dronetv-frontend-prod-http.entrypoints=http \
                          --label traefik.http.routers.dronetv-frontend-prod-http.middlewares=dronetv-frontend-prod-https-redirect \
                          --label traefik.http.middlewares.dronetv-frontend-prod-https-redirect.redirectscheme.scheme=https \
                          --label traefik.http.middlewares.dronetv-frontend-prod-https-redirect.redirectscheme.permanent=true \
                          dronetv-frontend-prod-img:latest
                      for i in 1 2 3 4 5; do
                          docker exec dronetv-frontend-prod wget -qO- http://127.0.0.1/health && break
                          sleep 3
                      done
                      docker exec dronetv-frontend-prod wget -qO- http://127.0.0.1/health || (docker logs --tail 60 dronetv-frontend-prod; exit 1)
                  '''
              } 
          }
      }
      post {
          success { echo 'dronetv-frontend-prod deployed' }
      }
  }  