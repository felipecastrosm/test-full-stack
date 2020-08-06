# Superformula User App

This is the web application built with `Vue` that uses `AppSync's GraphQL API` to provide
a basic frontend for the CRUD functionality.

Maps are shown using `MapBox`'s map service, and avatars are randomly loaded from `Unsplash`

For local execution, feel free to rename the `.env.example` to `.env.local` to use the 
live API and external services' access keys and information.

##### Setup the project and install dependencies
```
yarn install
```

##### Compile and run locally with hot-reloads
```
yarn serve
```

##### Compile and minify resources for production
```
yarn build
```

##### Run Unit tests
```
yarn test
```

##### Run E2E tests
```
cypress run
```

### Deployment

##### Create initial S3 Bucket
```
yarn sam:createBucket
```

##### Deploy Application
```
yarn push
```