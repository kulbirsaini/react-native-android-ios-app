import { createContext, useState, useContext, useEffect } from "react";
import { getCurrentUser } from "@/lib/appwrite";

const GlobalContext = createContext({
  isLoggedIn: false,
  user: null,
  isLoading: true,
  setIsLoggedIn: (b: boolean) => {},
  setIsLoading: (b: boolean) => {},
  setUser: (u: object) => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
          setUser(user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  const ctxValue = {
    isLoggedIn,
    user,
    isLoading,
    setIsLoggedIn,
    setIsLoading,
    setUser,
  };

  return <GlobalContext.Provider value={ctxValue}>{children}</GlobalContext.Provider>;
};
