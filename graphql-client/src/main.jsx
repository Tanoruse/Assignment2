import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include", // important
  }),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);
