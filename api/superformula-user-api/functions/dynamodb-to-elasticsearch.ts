const host = process.env.esUrl;
const index = 'user';

const AWS = require('aws-sdk');
const httpAwsEs = require('http-aws-es');
const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
    host: host,
    connectionClass: httpAwsEs,
    amazonES: {
        region: process.env.AWS_REGION,
        credentials: new AWS.EnvironmentCredentials('AWS')
    }
});

import {
    DynamoDBStreamEvent,
    Context
} from "aws-lambda"

exports.handler = async (event: DynamoDBStreamEvent, _context: Context) => {
    let count = 0;

    for (const record of event.Records) {
        const id = record.dynamodb.Keys.id.S;

        if (record.eventName == 'REMOVE') {
            await client.delete({
                id: id,
                index: index
            });
            console.log(`Item ${id} removed`);
        } else {
            const document = record.dynamodb.NewImage;
            console.log(`Adding document ${id}`);
            console.log(document);

            await client.index({
                id: id,
                index: index,
                body: document
            });

            console.log(`Document ${id} successfully added`);
        }

        count++;
    }

    return `Successfully processed ${count} records.`;
};