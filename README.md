# Superformula Team List

This project is a complete fullstack application following the requirements of the 
coding [challenge](challenge.md) by **Superformula**.

### TL;DR
Just head to [superformula.live](https://superformula.live) and check it out!

### Architecture

##### Backend
The [api](/api) folder contains the backend project, designed around an 
`AWS AppSync GraphQL API` backed by `DynamoDB` for persistence and `ElasticSearch` for 
text search.

The `GraphQL` resolvers are a mix of direct, template-based `AppSync -> DynamoDB` mappings 
and `AppSync -> Lambda -> ElasticSearch` bridge functions.

To keep data synchronized between `DynamoDB` and `ElasticSearch`, there's a `Lambda` function
fed by a direct `DynamoDb Event Stream`, adding, updating and deleting data accordingly.

##### Frontend
The [frontend](/frontend) folder stores the web application built with `Vue` and `Apollo`
to consume the `GraphQL` endpoint. Unit tests were written with `Jest` and E2E tests 
use `Cypress`.

### Roadmap
This repository is being used following `GitFlow` guidelines, with commits being pushed
only to feature or fix branches, and reaching master exclusively through `Pull Requests`.

There's a [`ZenHub` board](https://app.zenhub.com/workspaces/superformula-fullstack-coding-challenge-5f2345df51d1680019e26266/board?filterLogic=any&repos=282525719) 
that was used during all the initial development phase of this MVP, and all issues are 
in sync with this repository.

Further features and issue tracking will follow the same guidelines and will be tracked
through issues on this repository along with `ZenHub`.

There's currently no CI/CD configuration for the projects here, but deployment can be
easily done using the scripts within each project's folder. More info on their respective
readme's.