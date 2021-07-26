import { TableRow } from 'src/types';
import { reactive } from 'vue';
import {
  InputComponentType,
  InputComponentTypeVariant,
  SelectOption,
} from 'src/types';

export interface QuotationInvoiceHeaders extends TableRow {
  name: Columns;
  field: Columns;
  options?: Array<SelectOption>;
  componentType?: InputComponentType | 'computed';
  componentTypeVariant?: InputComponentTypeVariant;
  inputClass?: string;
  mask?: string;
  fillMask?: string | boolean;
  unMaskValue?: boolean;
  reverseFillMask?: boolean;
  hint?: string;
  disabled?: boolean;
  columnClass?: string;
  columnStyle?: Record<string, string | number>;
  autoWidth?: boolean;
  asyncFilterAction?: string;
  asyncFilterMode?: boolean;
  min?: number;
  max?: number;
  autogrow?: boolean;
  required?: boolean;
  label: string;
}

enum Columns {
  productId = 'productId',
  productName = 'productName',
  description = 'description',
  qty = 'qty',
  UOM = 'UOM',
  unitPrice = 'unitPrice',
  unitDiscount = 'unitDiscount',
  lineDiscount = 'lineDiscount',
  total = 'total',
}

const columns: QuotationInvoiceHeaders[] = reactive([
  {
    name: Columns.productId,
    required: true,
    label: 'Product/Service Name',
    align: 'center',
    field: Columns.productId,
    filterable: false,
    componentType: 'select',
    componentTypeVariant: 'single-select',
    options: [],
    asyncFilterAction: 'products/FETCH_PRODUCTS_FOR_SELECT',
    asyncFilterMode: true,
    columnClass: 'product-id-column',
  },
  /* {
    name: Columns.productName,
    required: true,
    label: 'Product/Service Name',
    align: 'center',
    field: Columns.productName,
    filterable: false,
    componentType: 'input',
    componentTypeVariant: 'text',
    columnClass: 'product-id-column', // Use same class as `productId` column
  }, */
  {
    name: Columns.description,
    required: true,
    label: 'Description',
    align: 'center',
    field: Columns.description,
    sortable: false,
    filterable: false,
    componentType: 'input',
    componentTypeVariant: 'textarea',
    columnClass: 'desc-column',
    autogrow: true,
  },
  {
    name: Columns.qty,
    required: true,
    label: 'Quantity',
    align: 'right',
    field: Columns.qty,
    sortable: false,
    filterable: false,
    componentType: 'input',
    componentTypeVariant: 'number',
    inputClass: 'text-right',
    //inputStyle: 'max-width: 35px',
    columnClass: 'qty-column',
    min: 0,
  },
  {
    name: Columns.unitPrice,
    required: true,
    label: 'Unit Price',
    align: 'right',
    field: Columns.unitPrice,
    sortable: false,
    filterable: false,
    componentType: 'input',
    componentTypeVariant: 'number',
    inputClass: 'text-right',
    //inputStyle: 'max-width: 100px',
    columnClass: 'price-column',
    min: 0,
    disabled: true,
  },
  {
    name: Columns.unitDiscount,
    required: false,
    label: 'Unit Discount',
    align: 'right',
    field: Columns.unitDiscount,
    sortable: false,
    filterable: false,
    componentType: 'input',
    componentTypeVariant: 'number',
    min: 0,
    inputClass: 'text-right',
    //inputStyle: 'max-width: 35px',
    columnClass: 'unit-discount-column',
  },
  {
    name: Columns.lineDiscount,
    required: false,
    label: 'Line Discount',
    align: 'right',
    field: Columns.lineDiscount,
    sortable: false,
    filterable: false,
    componentType: 'computed',
    //inputStyle: 'max-width: 35px',
    columnClass: 'line-discount-column',
  },
  {
    name: Columns.total,
    required: true,
    label: 'Total',
    align: 'right',
    field: Columns.total,
    sortable: false,
    filterable: false,
    columnClass: 'total-column',
    componentType: 'computed',
  },
]);
export default columns;
