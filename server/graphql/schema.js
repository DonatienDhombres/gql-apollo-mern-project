const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    user(id:ID!):User!
    isAuth:User!
    post(id:ID!):Post!
    posts(sort:SortInput,queryBy:QueryByInput):[Post]!
    categories(catId:ID):[Category]!
  }

  type Mutation {
    updateUserEmailPass(email:String!,password:String,_id:ID!):User!
    updateUserProfile(name:String,lastname:String,_id:ID!):User!
    authUser(fields:AuthInput!):User!
    signUp(fields:AuthInput!):User!
    createPost(fields:PostInput!):Post!
    createCategory(name:String!):Category!
    updatePost(fields:PostInput!,_id:ID!):Post!
    deletePost(_id:ID!):String!
    updateCategory(_id:ID!,name:String!):Category
    deleteCategory(_id:ID!):String
  }


  type Post{
    _id:ID!
    created_at: String
    updated_at: String
    title: String!
    excerpt: String!
    content: String!
    status: PostStatus
    author: User!
    category: Category!
    related(sort:SortInput):[Post!]
  }

  type User {
    _id:ID!
    email:String!
    password:String
    name:String 
    lastname:String 
    token:String
    posts(sort:SortInput):[Post!]!
    categories:[Category!]!
  }

  type Category { 
    _id: ID!
    name: String!
    author: User!
    posts: [Post]
  }

  input AuthInput {
    email:String!
    password:String!
  }

  input PostInput {
    title: String
    excerpt: String
    content: String
    status: PostStatus
    category: ID
  }

  input SortInput {
    sortBy: String
    order: String
    limit: Int
    skip: Int
  }

  input QueryByInput {
    key:String!
    value:String!
  }

  enum PostStatus {
    PUBLIC,
    DRAFT
  }

`;

module.exports = typeDefs;

