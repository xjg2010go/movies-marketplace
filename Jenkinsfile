def imageName = 'lucas/movies-marketplace'

node('workers'){
    stage('Checkout'){
        checkout scm
    }
    def imageTest = docker.build("${imageName}-test","-f Dockerfile.test .")
    stage('Pre-integration Test') {
        parallel (
            'Quality Tests': {
                sh 'docker run --rm ${imageName}-test npm run lint'
            },
            'Unit Test': {
                sh "docker run --rm -v $PWD/converage:/app/coverage ${imageName}-test npm run test"
                publishHTML (target:[
                    allowMissing: false,
                    alwaysLinkToLastBuild: false,
                    keepAll: true,
                    reportDir: "$PWD/coverage",
                    reportFiles: "index.html",
                    reportName: "Coverage Report"
                ])
            }
        )
    }
}
