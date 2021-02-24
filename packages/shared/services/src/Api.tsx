import axios, {AxiosInstance} from "axios";
import {UserSession} from "@stanson/constants";

export function useCognitoApi(userSession?: UserSession, callback?: () => void): AxiosInstance {
  if (userSession?.token) {
    const cognitoApi = axios.create({
      baseURL: "https://2iwzfbavy9.execute-api.us-east-1.amazonaws.com/demo/",
      headers: {
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
