import { AxiosResponse, AxiosError } from 'axios';
import { DataRows } from '../quasar_tables/state';

export type LoginData = {
  username: string;
  password: string;
  remember_me: boolean;
};

export interface IDNameInterface {
  id: string | number;
  name: string;
}

export interface StringIDNameInterface extends IDNameInterface {
  id: string;
}

type Token = {
  token: string;
  type: string;
};

export interface ResponseData {
  message?: string;
  status?: number;
  statusText?: string;
  stack?: string;
  data: ResponseData & PaginatedData;
  errors?: Array<{ rule: string; field: string; message: string }>;
}

export type PaginatedData = {
  data?: DataRows;
  meta: {
    current_page: number;
    first_page: number;
    first_page_url: string;
    last_page: number;
    last_page_url: string;
    next_page_url: string;
    per_page: number;
    previous_page_url: string;
    total: number;
  };
};

export interface LoginResponseData {
  token: Token;
  data: LoginUserData;
  message?: string;
}

interface IDEntity {
  id: string;
}

export interface LoginUserDataInterface {
  companies: StringIDNameInterface[];
  profile: UserProfileSummary;
  role: StringIDNameInterface;
}

export type LoginUserData = LoginUserSummary & LoginUserDataInterface;

export type StateUserData = UserSummary & LoginUserDataInterface;

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
  data: ResponseData & string;
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

export type CurrentlyViewedUser = {
  profile: {
    first_name: string;
    last_name: string;
    middle_name: string;
    phone_number: string;
    address: string;
    city: string;
    profile_picture: string;
  };
  email: string;
  login_status: boolean;
  role: StringIDNameInterface;
};

export interface SelectionOption {
  label: string;
  value: string & number & boolean;
}

export interface TitleInfo extends Object {
  title: string;
  avatar: string;
}

export interface UserFormShape extends Object {
  first_name: string;
  last_name: string;
  middle_name: string;
  phone_number: string;
  address: string;
  city: string;
  email: string;
  role_id: string;
  state_id: string;
  country_id: string;
}
