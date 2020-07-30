# API

This is the User API project. A live demo can be found [here](https://d3asdy4glrgk7co4o3gmn5srtm.appsync-api.us-east-2.amazonaws.com/graphql)

* [`template.yml`](template.yml) - AWS Serverless Application Model template that defines all necessary infrastructure
    * DynamoDB for persistence
    * AppSync for GraphQL API, Schema and Resolvers
* [`user.graphql`](user.graphql) - API GraphQL Schema definition