import { AxiosResponse, AxiosError } from 'axios';

export type LoginResponseData = {
  message: string;
  token: unknown;
  data: unknown;
  status: number;
  statusText: string;
};

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
