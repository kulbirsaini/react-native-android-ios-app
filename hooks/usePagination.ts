import { useState, useCallback, useEffect } from "react";
import useApi from "./useApi";

interface PaginationParams {
  dataKey: string;
  startPage?: number;
  perPage?: number;
}

export const usePagination = (fn, { dataKey, startPage = 0, perPage = 10 }: PaginationParams) => {
  const [state, setState] = useState({
    currentPage: startPage || 0,
    hasMorePages: false,
    resources: [],
  });
  const getPagedResources = useCallback(() => fn({ page: state.currentPage, limit: perPage }), [fn, state.currentPage, perPage]);
  const { data, isLoading, error, refresh } = useApi(getPagedResources, {});

  const getNextPage = () => {
    // Prevent race condition where this function is invoked reapeatedly while another request is still in progress
    if (state.resources.length === 0 || isLoading) {
      return;
    }

    if (state.hasMorePages) {
      setState((prevState) => ({ ...prevState, currentPage: prevState.currentPage + 1 }));
    }
  };

  // If the incoming function has changed, we need to reset the state
  useEffect(() => {
    setState({
      currentPage: startPage || 0,
      hasMorePages: false,
      resources: [],
    });
  }, [fn]);

  // We need to update the resources in here only when we get something from the upstream
  // and it's different from what we already have
  useEffect(() => {
    const newResources = data[dataKey];
    if (!newResources) {
      return;
    }

    setState((prevState) => {
      const seenResourceIds = prevState.resources.map((resource) => resource.id);
      // Exclude already available resources from the fresh data just in case
      return {
        ...prevState,
        resources: [...prevState.resources, ...newResources.filter((resource) => !seenResourceIds.includes(resource.id))],
        hasMorePages: newResources.length >= perPage,
      };
    });
  }, [data[dataKey]]);

  return {
    resources: state.resources,
    isLoading,
    error,
    refresh,
    getNextPage,
  };
};
