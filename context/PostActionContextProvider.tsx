import { createContext, useContext, useState } from "react";
import { useGlobalContext } from "./GlobalContextProvider";
import { savePost, unsavePost } from "@/lib/appwrite";

const PostActionContext = createContext({
  currentPostId: null,
  isProcessing: false,
  save: async () => {},
  unsave: async () => {},
  setCurrentPostId: (id: string) => {},
});

export const usePostActionContext = () => useContext(PostActionContext);

export const PostActionContextProvider = ({ children }) => {
  const { user, setUser } = useGlobalContext();
  const [state, setState] = useState({
    currentPostId: null,
    isProcessing: false,
  });

  const save = async () => {
    setState((prevState) => ({ ...prevState, isProcessing: true }));
    try {
      const result = await savePost(user, state.currentPostId);
      if (result) {
        setUser((prevUser) => {
          return { ...prevUser, savedVideos: [...result.savedVideos] };
        });
      }
    } finally {
      setState((prevState) => ({ ...prevState, isProcessing: false }));
    }
  };

  const unsave = async () => {
    setState((prevState) => ({ ...prevState, isProcessing: true }));

    try {
      const result = await unsavePost(user, state.currentPostId);
      if (result) {
        setUser((prevUser) => {
          return { ...prevUser, savedVideos: [...result.savedVideos] };
        });
      }
    } finally {
      setState((prevState) => ({ ...prevState, isProcessing: false }));
    }
  };

  const setCurrentPostId = (id: string) => {
    setState((prevState) => ({ ...prevState, currentPostId: id }));
  };

  const ctxValue = {
    currentPostId: state.currentPostId,
    isProcessing: state.isProcessing,
    save,
    unsave,
    setCurrentPostId,
  };

  return <PostActionContext.Provider value={ctxValue}>{children}</PostActionContext.Provider>;
};