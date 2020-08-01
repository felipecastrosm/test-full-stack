const host = process.env.esUrl;
const index = 'user';
const scrollDuration = "5m";

import { createAWSConnection, awsCredsifyAll, awsGetCredentials } from '@acuris/aws-es-connection';
import {ApiResponse, Client} from "@elastic/elasticsearch";

type UserFilter = {
    name?: string
}

type UserSearchInput = {
    filter?: UserFilter,
    limit?: number,
    nextToken?: string
}

type User = {
    id: string
    name: string
    dob: string
    address: string
    description: string
    createdAt: string
    updatedAt: string
}

type UsersConnection = {
    users: [User?]
    nextToken?: string
}

export const handler = async (searchInput: UserSearchInput):Promise<UsersConnection> => {
    const awsCredentials = await awsGetCredentials()
    const AWSConnection = createAWSConnection(awsCredentials)
    const client = awsCredsifyAll(
        new Client({
            node: `https://${host}`,
            Connection: AWSConnection
        })
    );

    let response: ApiResponse;

    if(searchInput.nextToken) {
        response = await client.scroll({
            scroll_id: searchInput.nextToken,
            scroll: scrollDuration
        })
    } else {
        let query;
        if(searchInput.filter?.name) {
            query = {
                wildcard: {
                    name: {
                        value: `*${searchInput.filter?.name}*`
                    }
                }
            }
        }
        else {
            query = { match_all: {} }
        }

        response = await client.search({
            index: index,
            scroll: scrollDuration,
            size: searchInput.limit ?? 20,
            body: { query: query }
        });
    }

    if(response.statusCode != 200) {
        //TODO: Better error handling
        return {
            users: []
        };
    }

    const users:[User] = response.body.hits.hits.map((hit: { _source: any; }) => hit._source);

    return {
        nextToken: users.length ? response.body._scroll_id : null,
        users: users
    };
};