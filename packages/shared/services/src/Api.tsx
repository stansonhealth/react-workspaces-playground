import axios, {AxiosInstance} from "axios";
import {UserSession} from "@stanson/constants";

export function useCognitoApi(userSession?: UserSession, callback?: () => void): AxiosInstance {
  if (userSession?.token) {
    const cognitoApi = axios.create({
      baseURL: process.env.REACT_APP_STANSON_API,
      headers: {
        'x-requested-with': "XMLHttpRequest",
        'Authorization': `Bearer ${userSession.token}`,
      },
      transformRequest: [function (data, headers) {
        if (callback) {
          callback();
        }
        return data;
      }],
    })
    return cognitoApi
  }

  return axios.create()
}
