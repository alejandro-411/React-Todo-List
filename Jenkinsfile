pipeline {
    agent any
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'CI=true npm test'
            }
        }
        stage('Build Project') {
            steps {
                sh 'npm run build'
            }
        }
    }
    post {
        always {
            echo 'Pipeline finished.'
            cleanWs()
        }
    }
}
