import { createContext, useState, useContext } from "react";
import axios from "axios";

axios.defaults.baseURL = "https://tea-production-c79c.up.railway.app";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem("userInfo");

    try {
      return userInfo && userInfo !== "undefined"
        ? JSON.parse(userInfo)
        : null;
    } catch (error) {
      console.error("Invalid localStorage data", error);
      return null;
    }
  });

  const login = async (email, password) => {
    const { data } = await axios.post("/api/auth/login", {
      email,
      password,
    });

    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post("/api/auth/register", {
      name,
      email,
      password,
    });

    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);