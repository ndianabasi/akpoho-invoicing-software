import { AxiosResponse, AxiosError } from 'axios';

type Token = {
  token: string;
  type: string;
};

export type LoginResponseData = {
  message: string;
  token: Token;
  data: LoginUserData;
  status: number;
  statusText: string;
};

interface IDEntity {
  id: string;
}

export interface LoginUserDataInterface {
  companies: UserCompany[];
  profile: UserProfileSummary;
}

export type LoginUserData = LoginUserSummary & LoginUserDataInterface;

export type StateUserData = UserSummary & LoginUserDataInterface;

export interface UserCompany extends IDEntity {
  name: string;
}

export interface UserSummary extends IDEntity {
  email: string;
  is_account_activated: boolean;
  is_email_verified: boolean;
  login_status: boolean;
}

export interface LoginUserSummary extends IDEntity {
  email: string;
  is_account_activated: number;
  is_email_verified: number;
  login_status: number;
}

export interface UserProfileSummary extends IDEntity {
  first_name: string;
  last_name: string;
}

export type ResponseData = {
  message: string;
  data: unknown;
};

export interface LoginHttpResponse extends AxiosResponse {
  data: LoginResponseData;
}

export interface HttpResponse extends AxiosResponse {
  data: ResponseData;
}

export type HttpError = AxiosError;

export type SelectOption = {
  label: string;
  value: string;
  icon?: string;
  description?: string;
};
