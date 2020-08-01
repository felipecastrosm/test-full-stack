import { handler } from "./user-search";
import { Client } from "@elastic/elasticsearch";

jest.mock('@elastic/elasticsearch');

const responseBody = {
    hits: {
        hits: [
            {
                _source: {
                    sample_field: "sample_value"
                }
            }
        ]
    },
    _scroll_id: "sample_scroll_id"
};

const searchRequest = {
    index: "user",
    scroll: "5m",
    size: 20,
    body: {
        query: {}
    }
};

test("Searches for all elements when no filter is provided", async () => {
    //Arrange
    Client.prototype.search = jest.fn().mockImplementation(() => {
        return {
            statusCode: 200,
            body: responseBody
        };
    });
    searchRequest.body.query = {
        match_all: {}
    };

    //Act
    await handler({});

    //Assert
    expect(Client.prototype.search).toHaveBeenCalledTimes(1);
    expect(Client.prototype.search).toHaveBeenCalledWith(searchRequest);
});

test("Searches using the name filter", async () => {
    //Arrange
    Client.prototype.search = jest.fn().mockImplementation(() => {
        return {
            statusCode: 200,
            body: responseBody
        };
    });
    searchRequest.body.query = {
        wildcard: {
            name: {
                value: `*john*`
            }
        }
    };

    //Act
    await handler({ filter: { name: "john" } });

    //Assert
    expect(Client.prototype.search).toHaveBeenCalledTimes(1);
    expect(Client.prototype.search).toHaveBeenCalledWith(searchRequest);
});

test("Scrolls using the nextToken", async () => {
    //Arrange
    Client.prototype.scroll = jest.fn().mockImplementation(() => {
        return {
            statusCode: 200,
            body: responseBody
        };
    });

    //Act
    await handler({ nextToken: "123" });

    //Assert
    expect(Client.prototype.scroll).toHaveBeenCalledTimes(1);
    expect(Client.prototype.scroll).toHaveBeenCalledWith({ scroll_id: "123", scroll: "5m" });
});

test("Maps result to users", async () => {
    //Arrange
    Client.prototype.search = jest.fn().mockImplementation(() => {
        return {
            statusCode: 200,
            body: responseBody
        };
    });

    //Act
    const result = await handler({ filter: { name: "john" } });

    //Assert
    expect(result.users).toEqual(responseBody.hits.hits.map(hit => hit._source));
});

test("Returns the nextToken when there are still results", async () => {
    //Arrange
    Client.prototype.search = jest.fn().mockImplementation(() => {
        return {
            statusCode: 200,
            body: responseBody
        };
    });

    //Act
    const result = await handler({ filter: { name: "john" } });

    //Assert
    expect(result.nextToken).toEqual(responseBody._scroll_id);
});

test("Does not return the nextToken when no more results are available", async () => {
    //Arrange
    responseBody.hits.hits = [];
    Client.prototype.search = jest.fn().mockImplementation(() => {
        return {
            statusCode: 200,
            body: responseBody
        };
    });

    //Act
    const result = await handler({ filter: { name: "john" } });

    //Assert
    expect(result.nextToken).toBeNull();
});

test("Returns empty users when response status is not OK", async () => {
    //Arrange
    Client.prototype.search = jest.fn().mockImplementation(() => {
        return {
            statusCode: 500,
            body: responseBody
        };
    });

    //Act
    const result = await handler({ filter: { name: "john" } });

    //Assert
    expect(result.users.length).toBe(0);
});