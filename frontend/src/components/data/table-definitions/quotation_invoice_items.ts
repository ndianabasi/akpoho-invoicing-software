import { TableRow } from '../../../types/table';
import { reactive } from 'vue';
import { InputComponentType, InputComponentTypeVariant } from 'src/store/types';

interface QuotationInvoiceHeaders extends TableRow {
  name: Columns;
  field: Columns;
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
  },
  {
    name: Columns.qty,
    required: true,
    label: 'Quantity',
    align: 'center',
    field: Columns.qty,
    sortable: false,
    filterable: false,
    componentType: 'input',
    componentTypeVariant: 'text',
    inputClass: 'text-right',
    //inputStyle: 'max-width: 35px',
    columnClass: 'qty-column',
    min: 0,
  },
  {
    name: Columns.unitPrice,
    required: true,
    label: 'Unit Price',
    align: 'center',
    field: Columns.unitPrice,
    sortable: false,
    filterable: false,
    componentType: 'input',
    componentTypeVariant: 'text',
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
    align: 'center',
    field: Columns.unitDiscount,
    sortable: false,
    filterable: false,
    componentType: 'input',
    componentTypeVariant: 'text',
    min: 0,
    inputClass: 'text-right',
    //inputStyle: 'max-width: 35px',
    columnClass: 'unit-discount-column',
  },
  {
    name: Columns.lineDiscount,
    required: false,
    label: 'Line Discount',
    align: 'center',
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
    align: 'center',
    field: Columns.total,
    sortable: false,
    filterable: false,
    columnClass: 'total-column',
    componentType: 'computed',
  },
]);
export default columns;
