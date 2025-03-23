// schema/typeDefs.js
const { gql } = require("@apollo/server");

const typeDefs = `
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

  type Team {
    id: ID!
    teamName: String!
    description: String
    members: [User]
    createdAt: String
    status: String
    slogan: String
  }

  type Project {
    id: ID!
    projectName: String!
    description: String
    team: Team
    startDate: String
    endDate: String
    status: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User

    users: [User!]!
    user(id: ID!): User

    teams: [Team!]!
    team(id: ID!): Team

    projects: [Project!]!
    project(id: ID!): Project
  }

  type Mutation {
    # Auth
     logout: Boolean!
    register(username: String!, email: String!, password: String!, role: String): AuthPayload
    login(email: String!, password: String!): AuthPayload

    # Users
    createUser(username: String!, email: String!, password: String!, role: String!): User
    updateUser(id: ID!, username: String, email: String, password: String, role: String): User
    deleteUser(id: ID!): User

    # Teams
    createTeam(teamName: String!, description: String, status: String, slogan: String, members: [ID]): Team

    updateTeam(id: ID!, teamName: String, description: String, status: String, slogan: String, members: [ID]): Team

    deleteTeam(id: ID!): Team

    # Projects
    createProject(projectName: String!, description: String, team: ID, startDate: String, endDate: String, status: String): Project

    updateProject(id: ID!, projectName: String, description: String, team: ID, startDate: String, endDate: String, status: String): Project

    deleteProject(id: ID!): Project
  }
`;

module.exports = typeDefs;
