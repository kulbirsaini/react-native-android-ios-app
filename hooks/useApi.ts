import { useEffect, useState } from "react";

const useApi = (fn, defaultValue) => {
  const [data, setData] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const reset = () => {
    setData(defaultValue);
    setIsLoading(false);
    setError(null);
  };

  const refresh = async () => {
    reset();
    await asyncFn();
  };

  const asyncFn = async () => {
    console.log("fetching", fn);
    setIsLoading(true);
    try {
      const result = await fn();
      setData(result);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    asyncFn();
  }, [fn]);

  return {
    data,
    isLoading,
    error,
    reset,
    refresh,
  };
};

export default useApi;
