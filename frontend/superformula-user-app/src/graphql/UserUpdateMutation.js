import gql from "graphql-tag";

const userUpdateMutation = gql`
    mutation updateUser($id: ID!, $user: UserInput!) {
        updateUser(id: $id, user: $user) {
            id
            name
            dob
            address
            description
            createdAt
            updatedAt
        }
    }
`;

export default userUpdateMutation;