/** @format */
import React from "react";
import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";
import Test from "./index.android";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  uri: "https://frozen-journey-67030.herokuapp.com/graphql"
});

const App = () => (
  <ApolloProvider client={client}>
    <Test />
  </ApolloProvider>
);

AppRegistry.registerComponent(appName, () => App);
