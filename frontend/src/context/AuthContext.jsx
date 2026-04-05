import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

const TOKEN_KEY = "giftlink-token";
const USER_KEY = "giftlink-user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const value = {
    token,
    user,
    login(nextToken, nextUser) {
      setToken(nextToken);
      setUser(nextUser);
    },
    logout() {
      setToken("");
      setUser(null);
    },
    updateProfile(nextToken, nextUser) {
      setToken(nextToken || token);
      setUser(nextUser);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
