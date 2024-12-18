import { getCurrentUser } from "@/lib/api";
import { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const GlobalContext = createContext({
  isLoggedIn: false,
  user: null,
  authToken: null,
  isLoading: true,
  currentlyPlayingVideoId: null,
  setIsLoggedIn: (b: boolean) => {},
  setIsLoading: (b: boolean) => {},
  setUser: (u: object) => {},
  saveAuthToken: (t: string | null) => {},
  setCurrentlyPlayingVideoId: (id: string | null) => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentlyPlayingVideoId, setCurrentlyPlayingVideoId] = useState(null);

  const saveAuthToken = async (authToken: string | null) => {
    await SecureStore.setItemAsync("authToken", authToken);
    setAuthToken(authToken);
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const { user } = await getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
          setUser(user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [authToken]);

  const ctxValue = {
    isLoggedIn,
    user,
    authToken,
    isLoading,
    currentlyPlayingVideoId,
    setIsLoggedIn,
    setIsLoading,
    setUser,
    saveAuthToken,
    setCurrentlyPlayingVideoId,
  };

  return <GlobalContext.Provider value={ctxValue}>{children}</GlobalContext.Provider>;
};
