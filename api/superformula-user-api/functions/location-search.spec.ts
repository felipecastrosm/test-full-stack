const OLD_ENV = process.env;
process.env.MAPBOX_ACCESS_TOKEN = "sample_token";
process.env.MAPBOX_BASE_URL = "sample_url";

import { handler } from "./location-search";

import axios from "axios";

jest.mock('axios');

afterAll(() => {
    process.env = OLD_ENV;
});

test("Searches mapbox api with encoded location string", async () => {
    //Arrange
    axios.get = jest.fn().mockImplementation(() => { return { data: {} }; });

    //Act
    await handler({locationInput: { location: "some_address" } });

    //Assert
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith("sample_url/geocoding/v5/mapbox.places/some_address.json", expect.anything());
});

test("Searches mapbox api with access token", async () => {
    //Arrange
    axios.get = jest.fn().mockImplementation(() => { return { data: {} }; });

    //Act
    await handler({locationInput: { location: "some_address" } });

    //Assert
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(expect.anything(), {params: {access_token: "sample_token"}});
});

test("Returns null when no results are returned from search", async () => {
    //Arrange
    axios.get = jest.fn().mockImplementation(() => { return { data: {} }; });

    //Act
    const result = await handler({locationInput: { location: "some_address" } });

    //Assert
    expect(result).toBeNull();
});

test("Returns coordinates from first location result", async () => {
    //Arrange
    axios.get = jest.fn().mockImplementation(() => { return { data: { features: [{center: [1, 2]}]} }; });

    //Act
    const result = await handler({locationInput: { location: "some_address" } });

    //Assert
    expect(result).toEqual({coordinates: [1,2]});
});