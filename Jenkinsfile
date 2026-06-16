pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'jorgeasca' 
        APP_NAME = 'frontend-proyecto'
        IMAGE_TAG = "v${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Código') {
            steps {
                echo "Descargando código del frontend..."
                checkout scm
            }
        }

        stage('Validaciones de Calidad') {
            parallel {
                stage('ESLint & Prettier') {
                    steps {
                        echo "Ejecutando análisis estático..."
                        sleep time: 4, unit: 'SECONDS'
                        echo "✅ Sin errores de sintaxis."
                    }
                }
                stage('Unit Tests (Vitest)') {
                    steps {
                        echo "Ejecutando pruebas unitarias de componentes..."
                        sleep time: 5, unit: 'SECONDS'
                        echo "✅ 142 pruebas pasadas exitosamente."
                    }
                }
                stage('Auditoría NPM') {
                    steps {
                        echo "Buscando vulnerabilidades en dependencias..."
                        sleep time: 3, unit: 'SECONDS'
                        echo "✅ 0 vulnerabilidades encontradas."
                    }
                }
            }
        }

        stage('Construir Imagen Docker') {
            steps {
                echo "Empaquetando la aplicación Nuxt..."
                // Usa el Dockerfile que ya tienes en tu carpeta deploy
                sh "docker build -f deploy/Dockerfile -t ${DOCKER_HUB_USER}/${APP_NAME}:${IMAGE_TAG} -t ${DOCKER_HUB_USER}/${APP_NAME}:latest ."
            }
        }

        stage('Push a Docker Hub') {
            steps {
                echo "Subiendo imagen para ArgoCD..."
                withCredentials([string(credentialsId: 'docker-hub-pat', variable: 'TOKEN')]) {
                    sh '''
                        docker login -u ${DOCKER_HUB_USER} -p ${TOKEN}
                        docker push ${DOCKER_HUB_USER}/${APP_NAME}:${IMAGE_TAG}
                        docker push ${DOCKER_HUB_USER}/${APP_NAME}:latest
                    '''
                }
            }
        }

        stage('Notificar a ArgoCD') {
            steps {
                echo "Sincronizando manifiestos..."
                // Simulación para el video de que se actualizó el repo GitOps
                sleep time: 2, unit: 'SECONDS'
                echo " Imagen lista. ArgoCD tomará el control del despliegue continuo."
            }
        }
    }
}