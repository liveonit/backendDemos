import { gql } from 'graphql-request';

export const clearDb = gql`
  mutation clearDb {
    clearDb
  }
`;
