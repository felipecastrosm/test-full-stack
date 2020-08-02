import gql from "graphql-tag";

const locationSearchQuery = gql`
    query location($locationInput: LocationInput!) {
        location(locationInput: $locationInput) {
            coordinates
        }
    }
`;

export default locationSearchQuery;