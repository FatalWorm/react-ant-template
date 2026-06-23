import type { TUser } from './user.type';
import type { TAuthTokens } from './authTokens.type';

export type TAuthResponse = {
  user: TUser;
  tokens: TAuthTokens;
};
