export enum StorageKeys {
  STANSON_APP_REDIRECT = "Stanson.Cognito.appRedirect",
  STANSON_FEDERATED_PROVIDER = "Stanson.Cognito.federatedProvider",
  STANSON_TOKEN = "Stanson.Cognito.tokenId",
  STANSON_TOKEN_EXPIRATION = "Stanson.Cognito.tokenExpiration"
}

export enum AuthTiming {
  TOKEN_REFRESH = 290,
  TOKEN_EXPIRED = 10
}
