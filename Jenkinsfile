/*
* Build file for container
*/

@Library('devops-jenkins-lib@master') _

/**
* manageruiContainerBuild - Build container and push to ECR, will create a branch for each git branch.
*
* To disable CD completly do not set "env_for_cd" and "deployment_pipeline_name" variables.
* To enable CD for specific branch/ branches set the following variables: "env_for_cd" and "deployment_pipeline_name"
* To get version from json file set versionSource to json and set the versionfileLocation
*
* @param gitRepo - url for the git repository to pull from
* @param branchName - the branch from where to pull from
* @param imageName - image name, should match ECR repo ( note "_" not supported use "-" )
* @param env_for_cd - list - envs for we should deploy for on commit ( for example pcn-dev )
* @param deployment_pipeline_name - str - name of the deployment pipeline base name i.e without branch
* @param custom_tag - for local dev, you can override the default tag ( version ) and add your own, optional
* @param versionSource - from where we get the version (manager ui json file)
* @param versionfileLocation - the location of the version file
* @param createImageTag - Boolean - create and push custom_tag
*
*/
genericContainerBuild(git_repo: "git@bitbucket.org:email-service.git",
                      versionSource: "json",
                      versionfileLocation: "version.txt",
                      image_name: "email-service",
                      deployment_pipeline_name: "pipeline-deployment-email-service",
                      env_for_cd: ["dev"])
