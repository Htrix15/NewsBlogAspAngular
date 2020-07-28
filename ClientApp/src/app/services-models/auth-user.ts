import { authType } from '../shared/my-types';

export class AuthUser {
  private accessToken: string
    constructor(
      public email?: string,
      public firstName?: string,
      public lastName?: string,
      public userId?: string,
      public type?: authType
    ) { }
    public setToken(token:string){
      this.accessToken = token;
    }
    public getToken():string{
      return this.accessToken;
    }
  }
  