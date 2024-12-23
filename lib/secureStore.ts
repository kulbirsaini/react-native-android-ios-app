import * as SecureStore from "expo-secure-store";

export const getAuthToken = () => SecureStore.getItem("authToken");
export const storeAuthToken = (token: string) => SecureStore.setItem("authToken", token);
export const getEmail = () => SecureStore.getItem("email");
export const storeEmail = (email: string) => SecureStore.setItem("email", email);
