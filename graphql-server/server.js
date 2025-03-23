// server-express.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const jwt = require("jsonwebtoken");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const configureMongoose = require("./config/mongoose");

const JWT_SECRET = process.env.JWT_SECRET || "my_jwt_secret";
const PORT = process.env.PORT || 4000;

async function startServer() {
  // Connect to MongoDB
  await configureMongoose();

  const app = express();

  // Configure CORS with explicit origin and credentials enabled
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  // Use bodyParser to parse JSON bodies
  app.use(bodyParser.json());

  // Create and start the Apollo Server instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  // Attach Apollo middleware to Express with context handling
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        let user = null;
        if (req.headers.cookie) {
          // Simple cookie parsing
          const cookies = req.headers.cookie.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.split("=");
            acc[key.trim()] = value;
            return acc;
          }, {});
          if (cookies.token) {
            try {
              user = jwt.verify(cookies.token, JWT_SECRET);
            } catch (err) {
              console.error("JWT verification failed:", err);
            }
          }
        }
        return { req, res, user };
      },
    })
  );

  app.listen(PORT, () => {
    console.log(`🚀 Express server running on http://localhost:${PORT}/graphql`);
  });
}

startServer();
