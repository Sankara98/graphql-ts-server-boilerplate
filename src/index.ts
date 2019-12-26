import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import { resolvers } from "./resolvers";
import * as path from "path";
import { createConnection } from "typeorm";

const typeDefs = importSchema(path.join(__dirname, "./schema.graphql"));

const server = new GraphQLServer({ typeDefs, resolvers });
// tslint:disable-next-line: variable-name
createConnection().then(_connection => {
  server.start(() => console.log("Server is running on localhost:4000"));
});
