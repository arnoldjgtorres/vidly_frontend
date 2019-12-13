import httpService from "./httpService";
import jwtDecode from "jwt-decode";

//import { apiUrl } from "../config.json";
//const apiEndpoint = apiUrl + "/auth";
const apiEndpoint = "/auth";
const tokenKey = "token";

httpService.setJwt(getJwt());

export async function login(username, password) {
  const { data: jwt } = await httpService.post(apiEndpoint, {
    email: username,
    password: password
  });
  localStorage.setItem(tokenKey, jwt);
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export default {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt
};
