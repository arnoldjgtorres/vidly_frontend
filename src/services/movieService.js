import httpService from "./httpService";
//import { apiUrl } from "../config.json";

//const apiEndpoint = apiUrl + "/movies";
const apiEndpoint = "/movies";

export function getMovies() {
  return httpService.get(apiEndpoint);
}

export function deleteMovie(movieId) {
  return httpService.delete(apiEndpoint + "/" + movieId);
}

export function getMovie(movieId) {
  return httpService.get(apiEndpoint + "/" + movieId);
}

export function saveMovie(movie) {
  if (movie._id) {
    const body = { ...movie };
    delete body._id;
    return httpService.put(apiEndpoint + "/" + movie._id, body);
  }
  return httpService.post(apiEndpoint, movie);
}
