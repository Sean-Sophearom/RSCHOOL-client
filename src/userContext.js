import { useState, createContext } from "react";

export const userContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  return <userContext.Provider value={[user, setUser]}>{children}</userContext.Provider>;
};
