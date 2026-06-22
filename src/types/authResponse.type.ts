import type { IUser } from './user.interface';
import type { IAuthTokens } from './authTokens.interface';

export type TAuthResponse = {
  user: IUser;
  tokens: IAuthTokens;
};
