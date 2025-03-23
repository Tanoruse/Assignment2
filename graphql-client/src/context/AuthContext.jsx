import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";

const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      role
    }
  }
`;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const { data, loading, error, refetch } = useQuery(ME_QUERY, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data && data.me) {
      setAuthUser(data.me);
    } else {
      setAuthUser(null);
    }
  }, [data]);

  const refreshUser = () => {
    return refetch();
  };

  const logoutUser = () => {
    setAuthUser(null);
  };

  return <AuthContext.Provider value={{ authUser, loading, error, refreshUser, logoutUser, setAuthUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
