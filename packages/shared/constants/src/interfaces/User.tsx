export interface Organization {
  "id": number;
  "legalName": string;
  "name": string;
  "theme": string;
  "code": string;
  "demo": boolean;
}

export interface UserRole {
  "id": number;
  "authority": string;
  "passwordLifetimeDays": number;
}

export interface UserDetailsModel {
  "id": number;
  "username": string;
  "fullName": string;
  "firstName": string;
  "lastName": string;
  "email": string;
  "currentOrganization": Organization
  "authenticationOrganization": Organization
  "enabled": true,
  "accountExpired": false,
  "accountLocked": false,
  "passwordExpired": false,
  "passwordChangedDate": null,
  "roles": UserRole[],
  "featureToggles": any[]
  "organizations": Organization[];
}

export type LoginTypes = "saml" | "oauth";

export interface UserSession {
  token?: string;
  expiration?: number;
}
