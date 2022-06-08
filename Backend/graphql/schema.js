const { buildSchema } = require('graphql');

module.exports = buildSchema(`

  type Post {
    _id: ID!
    title: String!
    content: String!
  }

  type User {
    _id: ID!
    name: String!
    password: String!
    email: String!
    status: String!
    posts: [Post!]!
  }

  input userParam {
    password: String!
    email: String!
    name: String!
  }

  type RootMutation {
    createUser(userData: userParam): User!
  }

  type TestQuery {
    test: String
  }

  schema {
    query: TestQuery
    mutation: RootMutation
  }

`)


