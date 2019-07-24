pipeline {
    stages {
        stage('setup') {
            steps {
                sh 'groups'
            }
        }
        stage('build') {
            steps {
                sh 'npm run build'
            }
        }
      }
}
