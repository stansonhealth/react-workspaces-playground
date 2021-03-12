export enum StorageKeys {
  STANSON_APP_REDIRECT = "Stanson.Cognito.appRedirect",
  STANSON_FEDERATED_PROVIDER = "Stanson.Cognito.federatedProvider",
  STANSON_TOKEN = "Stanson.Cognito.tokenId",
  STANSON_TOKEN_EXPIRATION = "Stanson.Cognito.tokenExpiration",
  STANSON_IDLE_EXPIRATION = "Stanson.Cognito.tokenIdleExpiration"
}

export enum AuthTiming {
  TOKEN_EXPIRED = 60 * 15,
  TOKEN_REFRESH = 60
}
