import { handler } from "./dynamodb-to-elasticsearch";

import { Client } from '@elastic/elasticsearch';

jest.mock('@elastic/elasticsearch');

const baseEvent = {
    Records: [
        {
            dynamodb: {
                Keys: {
                    id: {
                        S: "sample_id"
                    }
                },
                NewImage: {
                    sample_field: {
                        S: ""
                    }
                }
            },
            eventName: "INSERT" as 'INSERT' | 'MODIFY' | 'REMOVE'
        }
    ]
};

test("Adds new record to Elasticsearch", async () => {
    //Arrange
    baseEvent.Records[0].eventName = "INSERT";
    Client.prototype.index = jest.fn().mockImplementation(() => {
        return;
    });

    //Act
    await handler(baseEvent, null);

    //Assert
    expect(Client.prototype.index).toHaveBeenCalledTimes(1);
    expect(Client.prototype.index).toHaveBeenCalledWith({id: "sample_id", index: "user", body: { sample_field: ""}});
});

test("Updates record on Elasticsearch", async () => {
    //Arrange
    baseEvent.Records[0].eventName = "MODIFY";
    Client.prototype.index = jest.fn().mockImplementation(() => {
        return;
    });

    //Act
    await handler(baseEvent, null);

    //Assert
    expect(Client.prototype.index).toHaveBeenCalledTimes(1);
    expect(Client.prototype.index).toHaveBeenCalledWith({id: "sample_id", index: "user", body: { sample_field: ""}});
});

test("Removes record from Elasticsearch", async () => {
    //Arrange
    baseEvent.Records[0].eventName = "REMOVE";
    Client.prototype.delete = jest.fn().mockImplementation(() => {
        return;
    });

    //Act
    await handler(baseEvent, null);

    //Assert
    expect(Client.prototype.delete).toHaveBeenCalledTimes(1);
    expect(Client.prototype.delete).toHaveBeenCalledWith({id: "sample_id", index: "user"})
});

test("Processes multiple records", async () => {
    //Arrange
    baseEvent.Records[0].eventName = "INSERT";
    baseEvent.Records.push(baseEvent.Records[0]);
    Client.prototype.index = jest.fn().mockImplementation(() => {
        return;
    });

    //Act
    await handler(baseEvent, null);

    //Assert
    expect(Client.prototype.index).toHaveBeenCalledTimes(2);
});