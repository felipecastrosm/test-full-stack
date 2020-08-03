import gql from "graphql-tag";

const userSearchQuery = gql`
    query users($filter: UserFilter, $limit: Int, $nextToken: String) {
        users(filter: $filter, limit: $limit, nextToken: $nextToken) {
            nextToken
            users {
                id
                name
                dob
                address
                description
                createdAt
                updatedAt
            }
        }
    }
`;

export default userSearchQuery;