import { TableRow } from '../../../types/table';
import { stringSortFn, dateSortFn } from '../../../helpers/utils';
import { CustomersIndexResultInterface } from 'src/store/types';

interface CustomerHeaders extends TableRow {
  name: CustomerColumns;
  field: CustomerColumns | ((row: CustomersIndexResultInterface) => unknown);
  /**
   * Make `visibleAsColumn` mandatory for all columns
   * in this definition. See `TableRow` type for more explanations
   */
  visibleAsColumn: boolean;
}

enum CustomerColumns {
  id = 'id',
  customer_name = 'customer_name',
  customer_email = 'customer_email',
  customer_phone = 'customer_phone',
  first_name = 'first_name',
  last_name = 'last_name',
  email = 'email',
  phone_number = 'phone_number',
  is_corporate = 'is_corporate',
  corporate_has_rep = 'corporate_has_rep',
  created_at = 'created_at',
  updated_at = 'updated_at',
  title = 'title',
  company_name = 'company_name',
  company_phone = 'company_phone',
  company_email = 'company_email',
}

const columns: Array<CustomerHeaders> = [
  {
    name: CustomerColumns.id,
    required: false,
    label: 'Customer ID',
    align: 'center',
    field: CustomerColumns.id,
    filterable: true,
    filterInputType: 'text',
    visibleAsColumn: true,
  },
  {
    name: CustomerColumns.title,
    required: false,
    label: 'Title',
    align: 'center',
    field: CustomerColumns.title,
    sortable: false,
    filterable: false,
    visibleAsColumn: false,
  },
  {
    name: CustomerColumns.customer_name,
    required: true,
    label: 'Customer Name',
    align: 'center',
    field: CustomerColumns.customer_name,
    sortable: true,
    filterable: false,
    visibleAsColumn: true,
  },
  {
    name: CustomerColumns.customer_email,
    required: true,
    label: 'Customer Email',
    align: 'center',
    field: (row: CustomersIndexResultInterface) => row, // This becomes value for `format` property
    format: (val: CustomersIndexResultInterface): string | null => {
      if (val?.is_corporate) return val?.company_email;
      else return val?.email;
    },
    sortable: true,
    filterable: false,
    visibleAsColumn: true,
  },
  {
    name: CustomerColumns.customer_phone,
    required: true,
    label: 'Customer Phone',
    align: 'center',
    field: (row: CustomersIndexResultInterface) => row, // This becomes value for `format` property
    format: (val: CustomersIndexResultInterface): string | null => {
      if (val?.is_corporate) return val?.company_phone;
      else return val?.phone_number;
    },
    sortable: true,
    filterable: false,
    visibleAsColumn: true,
  },
  {
    name: CustomerColumns.first_name,
    required: true,
    label: 'First Name',
    align: 'center',
    field: CustomerColumns.first_name,
    sortable: true,
    filterable: true,
    filterInputType: 'text',
    visibleAsColumn: false,
  },
  {
    name: CustomerColumns.last_name,
    required: true,
    label: 'Last Name',
    align: 'center',
    field: CustomerColumns.last_name,
    sortable: true,
    sort: (a: string, b: string) => stringSortFn(a, b),
    filterable: true,
    filterInputType: 'text',
    visibleAsColumn: false,
  },
  {
    name: CustomerColumns.email,
    required: true,
    label: 'Email Address',
    align: 'center',
    field: CustomerColumns.email,
    sortable: true,
    sort: (a: string, b: string) => stringSortFn(a, b),
    filterable: true,
    filterInputType: 'text',
    visibleAsColumn: false,
  },
  {
    name: CustomerColumns.phone_number,
    required: true,
    label: 'Phone Number',
    align: 'center',
    field: CustomerColumns.phone_number,
    sortable: true,
    sort: (a: string, b: string) => stringSortFn(a, b),
    filterable: true,
    filterInputType: 'text',
    visibleAsColumn: false,
  },
  {
    name: CustomerColumns.is_corporate,
    required: true,
    label: 'Is Company?',
    align: 'center',
    field: CustomerColumns.is_corporate,
    sortable: true,
    filterable: true,
    filterInputType: 'select',
    filterOptions: [
      { label: '', value: null },
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
    visibleAsColumn: false,
  },
  {
    name: CustomerColumns.corporate_has_rep,
    required: true,
    label: 'Company Has Rep?',
    align: 'center',
    field: CustomerColumns.corporate_has_rep,
    sortable: true,
    filterable: true,
    filterInputType: 'select',
    filterOptions: [
      { label: '', value: null },
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
    visibleAsColumn: false,
  },
  {
    name: CustomerColumns.company_phone,
    required: true,
    label: 'Company Phone Number',
    align: 'center',
    field: CustomerColumns.company_phone,
    sortable: true,
    sort: (a: string, b: string) => stringSortFn(a, b),
    filterable: true,
    filterInputType: 'text',
    visibleAsColumn: false,
  },
  {
    name: CustomerColumns.company_name,
    required: true,
    label: 'Company Name',
    align: 'center',
    field: CustomerColumns.company_name,
    sortable: true,
    sort: (a: string, b: string) => stringSortFn(a, b),
    filterable: true,
    filterInputType: 'text',
    visibleAsColumn: false,
  },
  {
    name: CustomerColumns.company_email,
    required: true,
    label: 'Company Email',
    align: 'center',
    field: CustomerColumns.company_email,
    sortable: true,
    sort: (a: string, b: string) => stringSortFn(a, b),
    filterable: true,
    filterInputType: 'text',
    visibleAsColumn: false,
  },
  {
    name: CustomerColumns.created_at,
    required: true,
    label: 'Created At',
    align: 'center',
    field: CustomerColumns.created_at,
    sortable: true,
    sort: (a: string, b: string) => dateSortFn(a, b),
    filterable: true,
    filterInputType: 'date',
    visibleAsColumn: true,
  },
  {
    name: CustomerColumns.updated_at,
    required: true,
    label: 'Updated At',
    align: 'center',
    field: CustomerColumns.updated_at,
    sortable: true,
    sort: (a: string, b: string) => dateSortFn(a, b),
    filterable: true,
    filterInputType: 'date',
    visibleAsColumn: true,
  },
];

export default columns;
