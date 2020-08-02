import axios from "axios";

type LocationSearchInput = {
    locationInput: {
        location: string
    }
}

type CoordinatesResult = {
    coordinates: [number]
}

export const handler = async (searchInput: LocationSearchInput):Promise<CoordinatesResult> => {
    const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN;
    const mapboxBaseUrl = process.env.MAPBOX_BASE_URL;

    const encodedSearch = encodeURIComponent(searchInput.locationInput.location);

    const response = await axios.get(`${mapboxBaseUrl}/geocoding/v5/mapbox.places/${encodedSearch}.json`, {
        params: {
            access_token: mapboxAccessToken
        }
    });

    if(response.data.features && response.data.features.length > 0) {
        return {
            coordinates: response.data.features[0].center
        };
    }

    return null;
};