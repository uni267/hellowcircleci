pipeline {
    agent { docker 'node:8.15' }
    stages {
        stage('setup') {
            steps {
                sh 'npm install'
            }
        }
        stage('build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
