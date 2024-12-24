import { getAuthToken } from "./secureStore";

interface PostQueryParams {
  latest?: boolean;
  search?: string;
  scope?: string;
  userId?: string;
  limit?: Number;
  page?: Number;
}

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

export const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
  const response = await createNonGetRequest("POST", "/auth/register", { name, email, password, passwordConfirmation });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const login = async (email: string, password: string) => {
  const response = await createNonGetRequest("POST", "/auth/login", { email, password });
  const data = await response.json();

  if (response.status === 423) {
    return { user: null, message: data.message, confirmationPending: true };
  }

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const requestOtp = async (email: string) => {
  const response = await createNonGetRequest("POST", "/auth/confirm", { email });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const confirmViaOtp = async (email: string, otp: string) => {
  const response = await createNonGetRequest("POST", "/auth/confirm/otp", { email, otp });
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

  const response = await createNonGetRequest("DELETE", "/auth/logout", {}, { authToken: token });
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

  const response = await createGetRequest("/auth/me", {}, { authToken: token });
  const data = await response.json();

  if (response.status === 423) {
    return { user: null, error: data.message };
  }

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const getAllPosts = async (params: PostQueryParams) => {
  const token = await getAuthToken();
  if (!token) {
    return { user: null };
  }

  const response = await createGetRequest("/posts", params, { authToken: token });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const getLatestPosts = () => getAllPosts({ latest: true, limit: 5 });
export const searchPosts = (query: string) => getAllPosts({ search: query });
export const searchLikedPosts = (query: string) => getAllPosts({ search: query, scope: "liked" });
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

export const createPost = async ({ title, video, thumbnail }) => {
  const token = await getAuthToken();
  if (!token) {
    return { user: null };
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("video", { uri: video.uri, name: video.fileName, type: video.mimeType });
  formData.append("thumbnail", { uri: thumbnail.uri, name: thumbnail.fileName, type: thumbnail.mimeType });

  const response = await fetch(getUrl("/posts"), {
    method: "POST",
    body: formData,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data", Accept: "application/json" },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};
