import { AxiosResponse, AxiosError } from 'axios';

type Token = {
  token: string;
  type: string;
};

export interface ResponseData {
  message?: string;
  status?: number;
  statusText?: string;
  stack?: string;
  data?: unknown;
}

export interface LoginResponseData extends ResponseData {
  token: Token;
  data?: LoginUserData;
}

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
  profile_picture: string;
}

export interface LoginHttpResponse extends AxiosResponse {
  data: LoginResponseData;
}

export interface HttpResponse extends AxiosResponse {
  data: ResponseData;
  message?: string;
  code?: string;
  stack?: string;
}

export interface HttpError extends AxiosError {
  response?: HttpResponse;
}

export type SelectOption = {
  label: string;
  value: string;
  icon?: string;
  description?: string;
};
