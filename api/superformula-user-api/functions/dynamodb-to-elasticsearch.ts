const host = process.env.esUrl;
const index = 'user';

import { createAWSConnection, awsCredsifyAll, awsGetCredentials } from '@acuris/aws-es-connection';
import { Client } from "@elastic/elasticsearch";
import { DynamoDB } from "aws-sdk";

import {
    DynamoDBStreamEvent,
    Context
} from "aws-lambda";

export const handler = async (event: DynamoDBStreamEvent, _context: Context) => {
    const awsCredentials = await awsGetCredentials()
    const AWSConnection = createAWSConnection(awsCredentials)
    const client = awsCredsifyAll(
        new Client({
            node: `https://${host}`,
            Connection: AWSConnection
        })
    );

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
            const document = DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
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