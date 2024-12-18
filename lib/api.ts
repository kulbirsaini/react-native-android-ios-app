import * as SecureStore from "expo-secure-store";

const getAuthToken = async () => {
  return await SecureStore.getItemAsync("authToken");
};

const getUrl = (endpoint: string, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return `${process.env.EXPO_PUBLIC_API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ""}`;
};

const getHeaders = (headers) => {
  const { authToken = null, json = true, ...otherHeaders } = headers || {};

  if (authToken) {
    otherHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  if (json) {
    otherHeaders["Content-Type"] = "application/json";
  }

  return { ...otherHeaders };
};

const createGetRequest = (endpoint: string, params = {}, headers = {}) => {
  return fetch(getUrl(endpoint, params), {
    headers: getHeaders(headers),
  });
};

const createNonGetRequest = (method: string, endpoint: string, data = {}, headers = {}) => {
  return fetch(getUrl(endpoint), {
    method,
    body: JSON.stringify(data),
    headers: getHeaders(headers),
  });
};

export const register = async (email: string, password: string, username: string) => {
  const response = await createNonGetRequest("POST", "/register", { username, email, password });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const login = async (email: string, password: string) => {
  const response = await createNonGetRequest("POST", "/login", { email, password });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const logout = async () => {
  const token = await getAuthToken();
  if (!token) {
    return { user: null };
  }

  const response = await createNonGetRequest("DELETE", "/logout", {}, { authToken: token });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const getCurrentUser = async () => {
  const token = await getAuthToken();
  if (!token) {
    return { user: null };
  }

  const response = await createGetRequest("/me", {}, { authToken: token });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

interface Params {
  latest?: boolean;
  query?: string;
  scope?: string;
  userId?: string;
}

export const getAllPosts = async (params: Params) => {
  const token = await getAuthToken();
  if (!token) {
    return { user: null };
  }

  const response = await createGetRequest("/posts", params, { authToken: token });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.posts;
};

export const getLatestPosts = () => getAllPosts({ latest: true });
export const searchPosts = (query: string) => getAllPosts({ query });
export const searchSavedPosts = (query: string) => getAllPosts({ query, scope: "saved" });
export const getUserPosts = (userId: string) => getAllPosts({ userId, scope: "user" });

export const likePost = async (postId: string) => {
  const token = await getAuthToken();
  if (!token) {
    return { user: null };
  }

  const response = await createNonGetRequest("PUT", `/posts/${postId}/like`, {}, { authToken: token });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const unlikePost = async (postId: string) => {
  const token = await getAuthToken();
  if (!token) {
    return { user: null };
  }

  const response = await createNonGetRequest("PUT", `/posts/${postId}/unlike`, {}, { authToken: token });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const createPost = async ({ title, prompt, video, thumbnail }) => {
  const token = await getAuthToken();
  if (!token) {
    return { user: null };
  }

  const body = new FormData();
  body.append("title", title);
  body.append("prompt", prompt);
  body.append("video", {
    uri: video.uri,
    name: video.fileName,
    type: video.mimeType,
  });
  body.append("thumbnail", {
    uri: thumbnail.uri,
    name: thumbnail.fileName,
    type: thumbnail.mimeType,
  });

  const response = await fetch(getUrl("/posts"), {
    method: "POST",
    body: body,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data", Accept: "application/json" },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};
