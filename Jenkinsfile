def imageName = 'lucas/movies-marketplace'

node('workers'){
    stage('Checkout'){
        checkout scm
    }
    def imageTest = docker.build("${imageName}-test","-f Dockerfile.test .")

    stage('Quality Tests'){
        sh "docker run --rm ${imageName}-test npm run lint"
    }

    stage('Unit Tests'){
        sh "docker run --rm -v $PWD/coverage:/app/coverage ${imageName}-test npm run test"
        publishHTML (target: [
            allowMissing: false,
            alwaysLinkToLastBuild: false,
            keepAll: true,
            reportDir: "$PWD/coverage/marketplace",
            reportFiles: "index.html",
            reportName: "Coverage Report"
        ])
    }

}
