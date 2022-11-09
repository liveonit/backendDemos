import { gql } from 'graphql-request';

export const clearDb = gql`
  mutation clearDb {
    clearDb
  }
`;

export const login = gql`
  mutation Login($username: String!, $password: String!) {
    login(data: { username: $username, password: $password }) {
      id
      accessToken
      refreshToken
    }
  }
`;

export const getMyProfile = gql`
  query GetMyProfile {
  getMyProfile {
    email
    emailVerified
    enabled
    firstName
    id
    lastName
    roles {
      description
      id
      name
      permissions {
        description
        id
        name
      }
    }
    username
  }
}
`;
