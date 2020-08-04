# API

This is the main API template project, which currently packs the following child APIs:

* [Superformula User API](./superformula-user-api/README.md)

## Requirements

To run and deploy the application, you'll need the following tools:

* AWS SAM CLI - [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
* Node.js - [Install Node.js 10](https://nodejs.org/en/), including the npm package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community).

Make sure you have `aws-cli` configured with the credentials of a user allowing the following policies:
* `AWSLambdaFullAccess`
* `IAMFullAccess`
* `AmazonS3FullAccess`
* `AmazonDynamoDBFullAccess`
* `AWSAppSyncAdministrator`
* `AWSCloudFormationFullAccess`
* `ElasticsearchFullAccess`
    * ```json
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "VisualEditor0",
                    "Effect": "Allow",
                    "Action": "es:*",
                    "Resource": "*"
                }
            ]
        }
        ```

To configure `aws-cli` just run:

```bash
aws configure
```

#### AWS Deployment
To deploy the API to an AWS account, first ensure you have a `S3` bucket ready by running:

```bash
npm run awss3:init
```

Then just run the following command to have `AWS SAM` create the complete infrastructure
and configurations for you

```bash
npm run push
```

#### Cleanup

To delete the application and all of its resources from AWS, run the following:

```bash
npm run clean
```

#### Unit Tests

To run the Unit Tests using `Jest`

```bash
npm run test
```