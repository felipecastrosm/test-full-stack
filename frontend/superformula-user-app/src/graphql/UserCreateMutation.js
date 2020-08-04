import gql from "graphql-tag";

const userCreateMutation = gql`
    mutation createUser($user: UserInput!) {
        createUser(user: $user) {
            id
            name
            dob
            address
            description
            imageUrl
            createdAt
            updatedAt
        }
    }
`;

export default userCreateMutation;