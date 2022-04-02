export interface IUser {
    identityProvider: string;
    userId: string;
    userDetails: string;
    userRoles: string[];
    claims: string[]
}