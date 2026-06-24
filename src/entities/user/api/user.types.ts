export type TAuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type TUser = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
};

export type TAuthResponse = {
  user: TUser;
  tokens: TAuthTokens;
};

export type TLoginCredentials = {
  email: string;
  password: string;
};

export type TRegisterCredentials = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};
