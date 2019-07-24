pipeline {
    agent { docker 'node:8.15.0' }
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
