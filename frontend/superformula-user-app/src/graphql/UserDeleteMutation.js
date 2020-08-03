import gql from "graphql-tag";

const userDeleteMutation = gql`
    mutation deleteUser($id: ID!) {
        deleteUser(id: $id) {
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

export default userDeleteMutation;