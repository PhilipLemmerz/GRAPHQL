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

  type AuthData {
    _id: String,
    token: String
  }

  type PostData {
    _id: ID!
    title: String!
    content: String!
    user_id: String!
  }

  type ResponseData {
    _id: String
  }


  type RootMutation {
    createUser(userData: userParam): User!
    createPost(title: String!, content: String!): PostData!
    deletePost(_id: String!): ResponseData
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    posts: [Post!]!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }

`)


