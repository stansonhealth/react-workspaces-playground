import axios, {AxiosInstance} from "axios";

export function useCognitoApi(token?: string): AxiosInstance | undefined {
  if (token) {
    const cognitoApi = axios.create({
      baseURL: "https://2iwzfbavy9.execute-api.us-east-1.amazonaws.com/demo/",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return cognitoApi
  }

  return


}
