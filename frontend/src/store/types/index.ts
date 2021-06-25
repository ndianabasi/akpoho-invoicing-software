import { AxiosResponse, AxiosError } from 'axios';
import { DataRows } from '../quasar_tables/state';

export interface RootState {
  gtmID: string;
  httpTimeout: number;
  currentYear: number | null;
  message: AlertInterface;
  tokenRefreshTime: number;
  darkMode: boolean;
  isOffline: boolean;
  apiPort: string;
  apiVersion: string;
  apiProtocol: string;
  apiHost: string;
}

export interface AlertInterface {
  type: string;
  content: string;
  status: number | null;
  statusText: string;
  activity: string;
}

export enum RootMutationTypes {
  SET_DARK_MODE = 'SET_DARK_MODE',
}

export type LoginData = {
  username: string;
  password: string;
  remember_me: boolean;
};

export interface IDNameInterface {
  id: string | number | undefined | null;
  name: string;
}

export interface StringIDNameInterface extends IDNameInterface {
  id: string;
}

export enum ROLES {
  SUPERADMIN = 'SuperAdmin',
  SUPER_EDITOR = 'SuperEditor',
  SUPER_VIEWER = 'SuperViewer',
  DEVELOPER = 'Developer',
  COMPANY_ADMIN = 'CompanyAdmin',
  COMPANY_EDITOR = 'CompanyEditor',
  COMPANY_STAFF = 'CompanyStaff',
}

export type ROLES_VALUES =
  | ROLES.SUPERADMIN
  | ROLES.SUPER_EDITOR
  | ROLES.SUPER_VIEWER
  | ROLES.DEVELOPER
  | ROLES.COMPANY_ADMIN
  | ROLES.COMPANY_EDITOR
  | ROLES.COMPANY_STAFF;

export interface RoleInterface extends StringIDNameInterface {
  name: ROLES_VALUES;
}

export interface NumberIDNameInterface extends IDNameInterface {
  id: number | null;
}

export interface CompanySizeInterface extends IDNameInterface {
  id: number;
  size: string;
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
  role: RoleInterface;
  passwordHistories: Array<{ created_at: string; user_id: string }>;
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
  profilePictureFile: FileMultiFormats;
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

export interface SelectOption {
  label: string;
  value: string | boolean | number | null;
  icon?: string;
  description?: string;
}

export interface StringSelectOption extends SelectOption {
  label: string;
  value: string;
  icon?: string;
  description?: string;
}

export type CurrentlyViewedUser = {
  profile: {
    first_name: string;
    last_name: string;
    middle_name: string;
    phone_number: string;
    address: string;
    city: string;
    profilePictureFile: FileMultiFormats;
    userState?: NumberIDNameInterface;
    userCountry?: NumberIDNameInterface;
  };
  email: string;
  login_status: boolean;
  role: StringIDNameInterface;
};

export type CurrentlyViewedCompany = {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  address?: string;
  city?: string;
  companySize?: CompanySizeInterface;
  state?: NumberIDNameInterface;
  country?: NumberIDNameInterface;
  website?: string;
  type: 'personal' | 'corporate';
  approved_at: string;
  created_at: string;
  updated_at: string;
  slug: string;
  is_approved: string;
};

interface CurrentCustomerBaseInterface {
  first_name: string;
  last_name: string;
  middle_name: string | null;
  email: string;
  phone_number: string;
  is_corporate: boolean;
  corporate_has_rep: boolean;
  company_name: string | null;
  company_phone: string | null;
  company_email: string | null;
}

export interface CurrentlyViewedCustomer extends CurrentCustomerBaseInterface {
  title?: {
    id: number | null | undefined;
    name: string | null | undefined;
  };
}

export interface CurrentlyViewedAddress {
  id: string;
  address_type: string;
  city: string;
  created_at: string;
  postal_code: string;
  street_address: string;
  updated_at: string;
  addressCountry: {
    id: number;
    name: string;
  };
  addressState: {
    id: number;
    name: string;
  };
}

export interface CustomerAddressInterface {
  [key: string]: boolean | number | SelectOption | string | null | undefined;
  country: number | null;
  type: string | null;
  state: number | null;
  address: string | null;
  lga: string | null;
  postal_code: string | null;
}

export interface CustomerFormShape extends CurrentCustomerBaseInterface {
  [key: string]: boolean | number | SelectOption | string | null | undefined;
  title: number | null;
  is_billing_shipping_addresses_same: boolean;
  shipping_country: number | null;
  shipping_state: number | null;
  billing_country: number | null;
  billing_state: number | null;
  shipping_address: string | null;
  shipping_lga: string | null;
  shipping_postal_code: string | null;
  billing_address: string | null;
  billing_lga: string | null;
  billing_postal_code: string | null;
}

export interface SelectionOption {
  label: string;
  value: string & number & boolean;
}

export interface TitleInfo extends Object {
  title: string;
  avatar?: string;
}

export interface UserFormShape {
  [index: string]: string | undefined | null | number | boolean | File | Blob;
  first_name: string;
  last_name: string;
  middle_name: string | undefined | null;
  phone_number: string | undefined | null;
  address: string | undefined | null;
  city: string | undefined | null;
  email: string;
  role_id: string | undefined;
  state_id: number | string | null;
  country_id: number | string | null;
  login_status: boolean;
  profile_picture: File | null;
}

export interface CompanyFormShape {
  name: string;
  phoneNumber: string | undefined | null;
  address: string | undefined | null;
  city: string | undefined | null;
  email: string;
  size: number | undefined | null;
  stateId: number | null;
  countryId: number | null;
  website: string | undefined | null;
  isPersonalBrand: boolean | undefined;
}

export enum PERMISSION {
  CAN_LIST_USERS = 'can_list_users',
  CAN_CREATE_USERS = 'can_create_users',
  CAN_VIEW_USERS = 'can_view_users',
  CAN_EDIT_USERS = 'can_edit_users',
  CAN_DELETE_USERS = 'can_delete_users',
  CAN_LIST_CUSTOMERS = 'can_list_customers',
  CAN_CREATE_CUSTOMERS = 'can_create_customers',
  CAN_VIEW_CUSTOMERS = 'can_view_customers',
  CAN_EDIT_CUSTOMERS = 'can_edit_customers',
  CAN_DELETE_CUSTOMERS = 'can_delete_customers',
  CAN_LIST_COMPANIES = 'can_list_companies',
  CAN_CREATE_COMPANIES = 'can_create_companies',
  CAN_VIEW_COMPANIES = 'can_view_companies',
  CAN_EDIT_COMPANIES = 'can_edit_companies',
  CAN_DELETE_COMPANIES = 'can_delete_companies',
}

export interface FileMultiFormats {
  formats: {
    thumbnail?: FileFormatAttributes;
    large?: FileFormatAttributes;
    medium?: FileFormatAttributes;
    small?: FileFormatAttributes;
  };
  url: string;
}

export type FileFormatAttributes = {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path: string | null;
  url: string;
};

type InputComponentType = 'select' | 'input' | 'date' | 'toggle';

export interface FormSchemaProperties {
  model?: unknown;
  inputType?: string;
  options?: SelectOption[];
  default?: string | number | boolean | null;
  autocomplete?: string;
  isVisible?: boolean;
  name: string;
  label: string;
  componentType: InputComponentType;
}

export type FormSchema = Record<string, FormSchemaProperties>;

export type ResourceType =
  | 'user'
  | 'company'
  | 'customer_address'
  | 'quotation'
  | 'invoice'
  | 'receipt'
  | 'customer';

export type ResourceName =
  | 'User'
  | 'Company'
  | 'Customer Address'
  | 'Quotation'
  | 'Invoice'
  | 'Receipt'
  | 'Customer';

export type ResourceNamePlural =
  | 'Users'
  | 'Companies'
  | 'Customer Addresses'
  | 'Quotations'
  | 'Invoices'
  | 'Receipts'
  | 'Customers';

export type CurrentlyViewedProduct = {
  id: string;
  name: string;
  attributeSetId: string;
};

export interface ProductFormShape {
  attributeSetId: string;
}

export interface AttributeSetData {
  id: string;
}
