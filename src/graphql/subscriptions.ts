/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost($filter: ModelSubscriptionPostFilterInput) {
    onCreatePost(filter: $filter) {
      id
      clientId
      markdown
      title
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePostWithId = `subscription onUpdatePostWithId($id: ID!) {
  onUpdatePostWithId(id: $id) {
    id
    clientId
    markdown
    title
    createdAt
  }
}
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost($filter: ModelSubscriptionPostFilterInput) {
    onUpdatePost(filter: $filter) {
      id
      clientId
      markdown
      title
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost($filter: ModelSubscriptionPostFilterInput) {
    onDeletePost(filter: $filter) {
      id
      clientId
      markdown
      title
      createdAt
      updatedAt
    }
  }
`;
