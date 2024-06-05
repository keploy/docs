---
id: jenkins
title: Integrating with Jenkins
description: Guide into Keploy Jenkins Pipeline
sidebar_label: Jenkins
keywords:
  - ci testing
  - ci/cd
  - jenkins
  - ci pipeline
tags:
  - ci
  - cd
  - plugin
---

Keploy can integrated with Jenkins to ensure continuous testing as part of your CI/CD pipeline.

## Prerequisites

```sh
pipeline {
    agent any 
    stages {
        stage('Test') { 
            steps {
                git branch: 'main', url: 'https://github.com/Sonichigo/new_samples_js.git'

                // Download and prepare Keploy binary
                sh "curl --silent --location 'https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz' | tar xz --overwrite -C /tmp"
                sh "mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin/keploy"
                
                sh"""
                npm install
                sudo -E keploy test -c "npm run start"
                """
            }
        }
    }
}
```