pipeline {
    agent any
    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                bat 'set CI=true && npm test'
            }
        }
        stage('Build Project') {
            steps {
                bat 'npm run build'
            }
        }
        stage('Business Idea Test 1') {
            steps {
                echo "Running Business Idea Test 1..."
            }
        }
        stage('Business Idea Test 2') {
            steps {
                echo "Running Business Idea Test 2..."
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
