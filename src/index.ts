import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { UserResolver } from "./graphql/userResolver";
import { PostResolver } from "./graphql/postResolver";

const main = async () => {
  // Connecting to mongodb

  await createConnection();

  // Initializing the express app

  const app = Express();

  // Creating & Adding the schema to apollo-server

  const schema = await buildSchema({
    resolvers: [UserResolver, PostResolver],
    emitSchemaFile: true,
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req }),
  });

  // Starting the server before applying the app as middleware and listening on port 8080

  await server.start();

  server.applyMiddleware({ app });

  app.listen(8080, () => {
    console.log("Server is listening on http://localhost:8080/graphql");
  });
};

main();
