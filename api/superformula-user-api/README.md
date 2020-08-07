# Superformula User API

This is the User API project. A live demo can be found [here](https://w5q2e6gfkfagjkmuzy63dwxvuu.appsync-api.us-east-2.amazonaws.com/graphql)

Just use the `API Key` below:

`da2-6bxyui2sfzebzahjarx73sy7jy`

##### Structure
* [`template.yml`](template.yml) - AWS Serverless Application Model template that defines all necessary infrastructure
    * DynamoDB for persistence
    * AppSync for GraphQL API, Schema and Resolvers
* [`user.graphql`](user.graphql) - API GraphQL Schema definition