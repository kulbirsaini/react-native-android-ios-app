import { getCurrentUser } from "@/lib/api";
import { createContext, useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import { storeAuthToken } from "@/lib/secureStore";

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
  const [authToken, setAuthToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentlyPlayingVideoId, setCurrentlyPlayingVideoId] = useState(null);

  const saveAuthToken = async (authToken: string) => {
    storeAuthToken(authToken);
    setAuthToken(authToken);
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const { user, error } = await getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
          setUser(user);
        } else {
          setIsLoggedIn(false);
          setUser(null);

          if (error) {
            Alert.alert("Error", error);
          }
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
