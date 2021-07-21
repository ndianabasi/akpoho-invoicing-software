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

interface SelectOptionBase {
  label: string | undefined;
  icon?: string;
  description?: string;
}

export interface SelectOption extends SelectOptionBase {
  value: string | boolean | number | null | undefined;
}

export interface SelectOptionNumber extends SelectOptionBase {
  value: number | undefined;
}

export interface SelectOptionString extends SelectOptionBase {
  value: string | undefined;
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
  first_name: string | undefined;
  last_name: string | undefined;
  middle_name: string | undefined;
  email: string | undefined;
  phone_number: string | undefined;
  is_corporate: boolean;
  corporate_has_rep: boolean;
  company_name: string | undefined;
  company_phone: string | undefined;
  company_email: string | undefined;
}

export interface CurrentlyViewedCustomer extends CurrentCustomerBaseInterface {
  title?: {
    id: number | undefined;
    name: string | undefined;
  };
}

export type CustomerAddressType =
  | 'billing_address'
  | 'shipping_address'
  | 'both';

export interface CurrentlyViewedAddress {
  id: string;
  address_type: CustomerAddressType;
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

export interface CustomerAddressInterfaceContract {
  [key: string]:
    | boolean
    | number
    | SelectOption
    | SelectOptionNumber
    | string
    | null
    | undefined;
  address: string;
  lga: string | null;
  postal_code: string | null;
}

export interface CustomerAddressInterfaceRaw
  extends CustomerAddressInterfaceContract {
  type: SelectOption | null;
  country: SelectOption | null;
  state: SelectOption | null;
}

export interface CustomerAddressInterface
  extends CustomerAddressInterfaceContract {
  type: string;
  country: string | null;
  state: string | null;
}

export interface CustomerFormShapeBase extends CurrentCustomerBaseInterface {
  [key: string]: boolean | number | SelectOption | string | null | undefined;
  is_billing_shipping_addresses_same: boolean;
  shipping_address: string | null;
  shipping_lga: string | null;
  shipping_postal_code: string | null;
  billing_address: string | null;
  billing_lga: string | null;
  billing_postal_code: string | null;
}

export interface CustomerFormShape extends CustomerFormShapeBase {
  title: number | null;
  shipping_country: number | null;
  shipping_state: number | null;
  billing_country: number | null;
  billing_state: number | null;
}

export interface CustomerFormShapeRaw extends CustomerFormShapeBase {
  title: SelectOptionNumber | null;
  shipping_country: SelectOptionNumber | null;
  shipping_state: SelectOptionNumber | null;
  billing_country: SelectOptionNumber | null;
  billing_state: SelectOptionNumber | null;
}

export interface CustomersIndexResultInterface {
  company_email: string;
  company_name: string;
  company_phone: string;
  corporate_has_rep: boolean;
  created_at: string;
  customer_name: string;
  email: string | null;
  first_name: string | null;
  id: string;
  is_corporate: boolean;
  last_name: string | null;
  meta: unknown;
  phone_number: string | null;
  updated_at: string;
}

export interface SelectionOption {
  label: string;
  value: string & number & boolean;
}

export interface TitleInfo extends Object {
  title: string;
  avatar?: string;
}

export interface UserFormShapeContract {
  [index: string]:
    | string
    | undefined
    | null
    | number
    | boolean
    | File
    | SelectOption;
  first_name: string;
  last_name: string;
  middle_name: string | undefined | null;
  phone_number: string | undefined | null;
  address: string | undefined | null;
  city: string | undefined | null;
  email: string;
  login_status: boolean;
  profile_picture: File | null;
}

export interface UserFormShape extends UserFormShapeContract {
  role_id: SelectOption | null;
  state_id: SelectOption | null;
  country_id: SelectOption | null;
}

export interface UserFormShapeProcessed extends UserFormShapeContract {
  role_id: string | undefined;
  state_id: number | null;
  country_id: number | null;
}

export interface CompanyFormShapeContract {
  name: string;
  phoneNumber: string | undefined | null;
  address: string | undefined | null;
  city: string | undefined | null;
  email: string;
  website: string | undefined | null;
  isPersonalBrand: boolean | undefined;
}

export interface CompanyFormShape extends CompanyFormShapeContract {
  size: number | undefined | null;
  stateId: number | null;
  countryId: number | null;
}

export interface CompanyFormShapeRaw extends CompanyFormShapeContract {
  size: SelectOption | null;
  stateId: SelectOption | null;
  countryId: SelectOption | null;
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
  CAN_LIST_INVENTORIES = 'can_list_inventories',
  CAN_CREATE_INVENTORIES = 'can_create_inventories',
  CAN_VIEW_INVENTORIES = 'can_view_inventories',
  CAN_EDIT_INVENTORIES = 'can_edit_inventories',
  CAN_DELETE_INVENTORIES = 'can_delete_inventories',
  CAN_LIST_QUOTATIONS = 'can_list_quotations',
  CAN_CREATE_QUOTATIONS = 'can_create_quotations',
  CAN_VIEW_QUOTATIONS = 'can_view_quotations',
  CAN_EDIT_QUOTATIONS = 'can_edit_quotations',
  CAN_DELETE_QUOTATIONS = 'can_delete_quotations',
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

export interface ResolvedProfilePictureUrls {
  thumbnail: string | undefined;
  small: string | undefined;
  original: string | undefined;
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

export type InputComponentType =
  | 'select'
  | 'input'
  | 'date'
  | 'time'
  | 'toggle'
  | 'editor'
  | 'none';

export type InputComponentTypeVariant =
  | 'text'
  | 'textarea'
  | 'multi-select'
  | 'single-select'
  | 'date'
  | 'number'
  | 'password'
  | 'email'
  | 'search'
  | 'tel'
  | 'url'
  | 'time';

export interface FormSchemaProperties {
  model?: unknown;
  inputType?: string;
  options?: SelectOption[] | null;
  default?:
    | string
    | number
    | boolean
    | null
    | Array<string | number>
    | SelectOption;
  required?: boolean;
  autocomplete?: string;
  isVisible?: boolean | unknown;
  regex?: RegExp | undefined | null;
  name?: string;
  label: string;
  componentType: InputComponentType;
  classes?: string | string[] | Record<string, number | string>;
  overrideClasses?: boolean;
}

export type FormSchema = Record<string, FormSchemaProperties>;

export type ResourceType =
  | 'user'
  | 'company'
  | 'customer_address'
  | 'quotation'
  | 'invoice'
  | 'receipt'
  | 'customer'
  | 'product';

export type ResourceName =
  | 'User'
  | 'Company'
  | 'Customer Address'
  | 'Quotation'
  | 'Invoice'
  | 'Receipt'
  | 'Customer'
  | 'Product';

export type ResourceNamePlural =
  | 'Users'
  | 'Companies'
  | 'Customer Addresses'
  | 'Quotations'
  | 'Invoices'
  | 'Receipts'
  | 'Customers'
  | 'Products';

export type CurrentlyViewedProduct = {
  id: string;
  name: string;
  attributeSetId: string;
};

export interface ProductFormShapeContract {
  productTypeId: string;
  attributeSetId?: string;
  productName: string;
  sku: string;
  price: number | null;
  isEnabled: boolean;
  visibility?: PRODUCT_VISIBILITY;
  stockStatus: PRODUCT_STOCK_STATUS;
  productHasWeight: boolean;
  description: string;
  shortDescription: string;
  productImages: '';
  weight: number | null;
}

export interface ProductFormShapeRaw extends ProductFormShapeContract {
  countryOfManufacture: SelectOptionNumber | null;
}

export interface ProductFormShape extends ProductFormShapeContract {
  countryOfManufacture: number | null;
}

export interface AttributeSetData {
  id: string;
  is_system: number;
  name: string;
  sort_order: number;
  attributeGroups: Array<AttributeGroup>;
}

export interface AttributeGroup {
  id: string;
  attribute_set_id: string;
  is_system: number;
  name: string;
  sort_order: number;
  attributes: Array<Attribute>;
}

export interface Attribute {
  attribute_code: string;
  fieldInputType: FieldInputType;
  fieldInputValidationType: FieldInputValidationType;
  field_input_type_id: string;
  field_input_validation_type_id: string;
  id: string;
  is_system_attribute: number;
  name: string;
  options: Array<AttributeOption>;
  visibility: number;
  required: number;
  default_value: string | number | boolean | null | Array<string | number>;
}

export interface FieldInputType {
  id: string;
  name: string;
  code: string;
}

export interface FieldInputValidationType {
  id: string;
  name: string;
  code: string;
  regex: string;
}

export interface AttributeOption {
  id: string;
  name: string;
}

export type AttributeGroupsCollection = Record<
  string,
  Array<FormSchemaProperties>
>;

export type PRODUCT_STOCK_STATUS =
  | 'In Stock'
  | 'Out of Stock'
  | 'Made to Order'
  | 'Drop-shipped'
  | '';

export type PRODUCT_VISIBILITY =
  | 'Catalogue Only'
  | 'Search Only'
  | 'Catalogue and Search'
  | 'Embedded'
  | '';

export type MinMaxParams = {
  $params: {
    min?: number;
    max?: number;
  };
};

export type PRODUCT_OWNERSHIP_TYPES = 'owner' | 'consumer';

export type PRODUCT_TYPE =
  | 'Simple Product'
  | 'Variable Product'
  | 'Compound Product'
  | 'Virtual Product'
  | 'Bundle Product'
  | 'Downloadable Product'
  | 'Gift Card';

export interface ProductResultRowInterface {
  id: string;
  product_type: string;
  name: string;
  sku: string;
  price: number;
  is_enabled: number;
  stock_status: string;
  product_has_weight: number;
  created_at: string;
  updated_at: string;
  slug: string;
  weight: number;
  country_of_manufacture: string;
  meta?: {
    weight_unit?: 'kg' | 'lb';
    product_type?: PRODUCT_TYPE;
  };
  type?: { id: string; name: PRODUCT_TYPE };
  country?: { id: string; name: string };
  productCategories?: { id: string; name: string }[];
  description?: string;
  short_description?: string;
}

export type UnitOfMeasurement =
  | 'kg'
  | 'lb'
  | 'm'
  | 'yd'
  | 'ft'
  | 'in'
  | 'cm'
  | 'sq.m'
  | 'sq.ft'
  | 'sq.in'
  | 'cu.m'
  | 'cu.ft'
  | 'cu.in';

export type ItemCollectionType =
  | 'set(s)'
  | 'piece(s)'
  | 'pack(s)'
  | 'carton(s)'
  | 'box(es)'
  | 'bottle(s)'
  | 'truck(s)'
  | 'container(s)'
  | 'dozen(s)'
  | 'wrap(s)'
  | 'roll(s)';

export type DiscountType = 'percentage' | 'number';
export type RoundingType = 'none' | 'nearest' | 'down' | 'up';
export type ThousandSeparator = 'comma' | 'period' | 'none' | 'space';

export const discountTypes: DiscountType[] = ['number', 'percentage'];
export const roundingTypes: RoundingType[] = ['none', 'nearest', 'down', 'up'];
export const thousandSeparatorTypes: ThousandSeparator[] = [
  'comma',
  'period',
  'none',
  'space',
];

export const itemCollectionTypes: ItemCollectionType[] = [
  'set(s)',
  'piece(s)',
  'pack(s)',
  'carton(s)',
  'box(es)',
  'bottle(s)',
  'truck(s)',
  'container(s)',
  'dozen(s)',
  'wrap(s)',
  'roll(s)',
];

export const unitOfMeasurementTypes: Array<
  ItemCollectionType | UnitOfMeasurement
> = [
  ...itemCollectionTypes,
  'kg',
  'lb',
  'm',
  'yd',
  'ft',
  'in',
  'cm',
  'sq.m',
  'sq.ft',
  'sq.in',
  'cu.m',
  'cu.ft',
  'cu.in',
];

export type ProductNameType = 'custom_product' | 'real_product';

export const ProductNameTypes: ProductNameType[] = [
  'custom_product',
  'real_product',
];

export const productNameTypeOptions: Array<{
  label: string;
  value: ProductNameType;
}> = [
  { label: 'Custom', value: 'custom_product' },
  { label: 'Product', value: 'real_product' },
];

export interface QuotationInvoiceItemShape {
  productId: SelectOption | null;
  productName: string | null;
  productNameType: ProductNameType;
  description: string | null;
  qty: number | null;
  groupQty: number | null;
  UOM: UnitOfMeasurement;
  collectionTypeId: ItemCollectionType;
  unitPrice: number | null;
  unitDiscount: number | null;
  discountType: DiscountType;
  readonly total?: number;
  files?: Array<File>;
  customSerialNumber: number | null;
}

export type QuotationInvoiceFormShape = {
  [index: string]: unknown;
  date: string;
  code: string | null | undefined;
  customerId: SelectOption | null | undefined;
  customerBillingAddressId: SelectOption | null | undefined;
  customerShippingAddressId: SelectOption | null | undefined;
  introduction: string | null | undefined;
  title: string | null | undefined;
  items: Array<QuotationInvoiceItemShape>;
  numberOfDecimals: number;
  simpleQuantities: boolean;
  amountsAreTaxInclusive: boolean;
  taxPercentage: number;
  roundAmounts: boolean;
  roundAmountType: RoundingType;
  showDiscounts: boolean;
  discountType: DiscountType;
  setDiscountTypePerLine: boolean;
  calculateTotals: boolean;
  changeProductPrices: boolean;
  useThousandSeparator: boolean;
  thousandSeparatorType: ThousandSeparator;
  notes: string;
  theme?: string | null;
  showAdditionalSubtotalDiscount: boolean;
  additionalDiscountType: DiscountType;
  additionalDiscountAmount: number;
  showAdditionalFees: boolean;
  additionalFees: Array<AdditionalFee>;
  showImages: boolean;
  useCustomSerialNumbers: boolean;
  useEditor: boolean;
};

export interface SelectNewValueCallback {
  (val: string, done: (fn?: () => void) => void): void;
}

export type AdditionalFee = { name: string; amount: number };

export type CustomerAddressForSelectPayload = {
  shippingAddresses: SelectOption[];
  billingAddresses: SelectOption[];
};

export interface QuotationResultRowInterface {
  id: string;
  title: string;
  tax_percentage: number;
  simple_quantities: number;
  show_discounts: number;
  created_at: string;
  updated_at: string;
  meta?: {
    is_corporate: number;
    first_name: string;
    last_name: string;
    corporate_has_rep: number;
    company_name: string;
  };
}

export type UnitOfMeasurementTypes = 'collection' | 'discrete';

export type CustomerAddressShape = {
  id: string;
  addressCountry: {
    id: number;
    name: string;
  };
  addressState: {
    id: number;
    name: string;
  };
  full_address: string;
  street_address: string;
  city: string;
  postal_code: string;
};

export interface CurrentlyViewedInvoiceQuotation {
  id: string;
  type: 'quotation' | 'invoice';
  date: string;
  code: string;
  title: string;
  introduction: string;
  notes: string;
  additional_fees: Array<AdditionalFee>;
  simple_quantities: boolean;
  amounts_are_tax_inclusive: boolean;
  tax_percentage: number;
  round_amounts: boolean;
  round_amount_type: RoundingType;
  show_discounts: boolean;
  discount_type: DiscountType;
  set_discount_type_per_line: boolean;
  calculate_totals: boolean;
  change_product_prices: boolean;
  number_of_decimals: number;
  use_thousand_separator: boolean;
  thousand_separator_type: ThousandSeparator;
  show_additional_subtotal_discount: boolean;
  additional_discount_type: DiscountType;
  additional_discount_amount: number;
  show_additional_fees: boolean;
  show_images: boolean;
  use_custom_serial_numbers: boolean;
  use_editor: boolean;
  created_at: string;
  updated_at: string;
  customer: {
    id: string;
    customer_name: string;
    is_corporate: boolean;
    corporate_has_rep: boolean;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    company_name?: string;
    company_phone?: string;
    company_email?: string;
    title?: { name: string };
  };
  shipping_address: CustomerAddressShape;
  billing_address: CustomerAddressShape;
  items: Array<{
    id: string;
    product_name: string | null;
    description: string;
    sort_order: number;
    qty: number;
    group_qty: number | null;
    unit_price: number;
    unit_discount: number | null;
    discount_type: DiscountType;
    collectionType: {
      id: number;
      name: ItemCollectionType;
      type: UnitOfMeasurementTypes;
    };
    files: Array<unknown>;
    product: {
      id: string;
      name: string;
      meta: { weight_unit: string };
    } | null;
    unitOfMeasurement: {
      id: number;
      name: UnitOfMeasurement;
      type: UnitOfMeasurementTypes;
    };
    custom_serial_number: number | null;
  }>;
  company: {
    address: string;
    city?: string;
    country?: { name: string };
    email: string;
    name: string;
    phone_number?: string;
    state?: { name: string };
  };
}
