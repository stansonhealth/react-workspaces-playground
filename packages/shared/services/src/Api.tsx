import axios, {AxiosInstance} from "axios";
import setupAmplify from "@stanson/components/src/SetupAmplify";
import {CognitoUser} from "amazon-cognito-identity-js";


export function useCognitoApi(user?: CognitoUser): AxiosInstance | undefined {
  setupAmplify();

  const token = user?.getSignInUserSession()?.getIdToken()?.getJwtToken();
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
