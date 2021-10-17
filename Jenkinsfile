def imageName = 'movies-marketplace'
def registry = '741767866316.dkr.ecr.us-east-1.amazonaws.com'
def region = 'us-east-1'


node('workers'){
    stage('Checkout'){
        checkout scm
    }
    def imageTest = docker.build("${imageName}-test","-f Dockerfile.test .")

    stage('Quality Tests'){
        sh "docker run --rm ${imageName}-test npm run lint"
    }

    // stage('Unit Tests'){
    //     sh "docker run --rm -v $PWD/coverage:/app/coverage ${imageName}-test npm run test"
    //     publishHTML (target: [
    //         allowMissing: false,
    //         alwaysLinkToLastBuild: false,
    //         keepAll: true,
    //         reportDir: "$PWD/coverage/marketplace",
    //         reportFiles: "index.html",
    //         reportName: "Coverage Report"
    //     ])
    // }


    stage("Static Code Analysis"){
        withSonarQubeEnv('sonarqube') {
            sh 'sonar-scanner'
        }
    }


    stage("Quality Gate"){
            timeout(time: 3, unit: 'MINUTES') {
                sleep(5)
                def qg = waitForQualityGate()
                if (qg.status != 'OK') {
                    error "Pipeline aborted due to quality gate failure: ${qg.status}"
                }
            }
    }

    stage('Build'){
        switch(env.BRANCH_NAME){
            case 'develop':
                docker.build(imageName, '--build-arg ENVIRONMENT=sandbox .')
                break
            case 'preprod':
                docker.build(imageName, '--build-arg ENVIRONMENT=staging .')
                break
            case 'master':
                docker.build(imageName, '--build-arg ENVIRONMENT=production .')
                break
            default:
                docker.build(imageName)
        }
    }

    stage('Push'){
        sh "\$(aws ecr get-login --no-include-email --region ${region}) || true"
        docker.withRegistry("https://${registry}") {
            docker.image(imageName).push(commitID())

            if (env.BRANCH_NAME == 'develop') {
                docker.image(imageName).push('develop')
            }

            if (env.BRANCH_NAME == 'preprod') {
                docker.image(imageName).push('preprod')
            }

            if (env.BRANCH_NAME == 'main') {
                docker.image(imageName).push('latest')
            }
        }
    }

    stage('Analyze'){
        def scannedImage = "${registry}/${imageName}:${commitID()} ${workspace}/Dockerfile"
        writeFile file: 'images', text: scannedImage
        anchore name: 'images',forceAnalyze: true
    }
}
