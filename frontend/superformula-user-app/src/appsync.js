import Vue from "vue";
import AWSAppSyncClient from "aws-appsync";
import VueApollo from "vue-apollo";
import { InMemoryCache } from 'apollo-cache-inmemory'

const config = {
    url: process.env.VUE_APP_AWS_APPSYNC_ENDPOINT,
    region: process.env.VUE_APP_AWS_APPSYNC_REGION,
    auth: {
        type: process.env.VUE_APP_AWS_APPSYNC_AUTH_TYPE,
        apiKey: process.env.VUE_APP_AWS_APPSYNC_API_KEY
    }
};

const cache = new InMemoryCache();

const options = {
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "cache-and-network"
        }
    },
    cache
};

const defaultClient = new AWSAppSyncClient(config, options);

const apolloProvider = new VueApollo({ defaultClient });

Vue.use(VueApollo);

export default apolloProvider;