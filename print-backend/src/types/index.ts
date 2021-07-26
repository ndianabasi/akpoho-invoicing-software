import { AxiosError, AxiosResponse } from 'axios';

interface SelectOptionBase {
  label: string | undefined;
  icon?: string;
  description?: string;
}

export interface SelectOption extends SelectOptionBase {
  value: string | boolean | number | null | undefined;
}

export type DiscountType = 'percentage' | 'number';
export type RoundingType = 'none' | 'nearest' | 'down' | 'up';
export type ThousandSeparator = 'comma' | 'period' | 'none' | 'space';

export type ProductNameType = 'custom_product' | 'real_product';

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

export type AdditionalFee = { name: string; amount: number };

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

type FieldFn = (row: TableRow) => string;
//declare type Format = (value: string) => string;

/* interface Formatter<ValueType, RowType, FormattedType> {
  (value: ValueType, row: RowType): FormattedType;
} */

declare function SortStringToBooleanFn(arg1: string, arg2: string): boolean;
declare function SortStringToNumberFn(arg1: string, arg2: string): number;
declare function SortNumberFn(arg1: number, arg2: number): number;

export type InputTypes = 'text' | 'select' | 'date';
export interface TableRow {
  name: string | Enumerator | unknown;
  label: string;
  align?: string;
  sortable?: boolean;
  sort?:
    | typeof SortStringToBooleanFn
    | typeof SortNumberFn
    | typeof SortStringToNumberFn;
  field: string | FieldFn | unknown;
  required?: boolean; // Use of `required` is important to avoid breaking QTable
  format?: unknown;
  filterable?: boolean;
  filterInputType?: InputTypes;
  filterOptions?: SelectOption[];
  /**
   * Used to indicate whether column is visible as a column or not
   * irrespective of whether it is `required` or not.
   * This could be used for columns meant to appear for filtering only
   */
  visibleAsColumn?: boolean;
}

export interface GenericTableData {
  [index: string]: unknown;
}

export interface TableRequestInterface {
  pagination: {
    page: number;
    rowsPerPage: number;
    sortBy: string;
    descending: boolean;
  };
}

export interface PaginationParams {
  page: number;
  descending: boolean;
  perPage: number;
  sortBy: string;
}

export interface RowProps {
  row: { id: string };
}

export interface PropObject {
  [index: string]: string;
}

export interface FetchTableDataInterface {
  (options?: {
    paginationParams?: PaginationParams;
    queryObject?: { [index: string]: string | boolean };
  }): Promise<void>;
}

export interface SelectionAction {
  label: string;
  icon: string;
  actionType: string;
  resourceType: ResourceType;
  resourceName: ResourceName;
  resourceNamePlural: ResourceNamePlural;
}

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

export type InputComponentType =
  | 'select'
  | 'input'
  | 'date'
  | 'time'
  | 'toggle'
  | 'editor'
  | 'image_cropper'
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

export type InvoiceQuotationType = 'quotation' | 'invoice';

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
    company_logo?: FileMultiFormats;
  };
}

export type UnitOfMeasurementTypes = 'collection' | 'discrete';

export interface FileMultiFormats {
  formats: {
    thumbnail?: FileFormatAttributes;
    large?: FileFormatAttributes;
    medium?: FileFormatAttributes;
    small?: FileFormatAttributes;
  } | null;
  url: string | null;
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

export interface ResolvedProfilePictureUrls {
  thumbnail: string | undefined;
  small: string | undefined;
  original: string | undefined;
}

export interface HttpResponse extends AxiosResponse {
  data: ResponseData & string;
  message?: string;
  code?: string;
  stack?: string;
  headers: Record<string, string>;
}

export interface HttpError extends AxiosError {
  response?: HttpResponse;
}

export interface IDNameInterface {
  id: string | number | undefined | null;
  name: string;
}

export interface StringIDNameInterface extends IDNameInterface {
  id: string;
}

export interface ResponseData {
  message?: string;
  status?: number;
  statusText?: string;
  stack?: string;
  data: ResponseData & PaginatedData & ArrayBuffer;
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

export type DataRows = Array<GenericTableData>;
