import { TableRow } from '../../../types/table';
import { reactive } from 'vue';
import { InputComponentType, InputComponentTypeVariant } from 'src/store/types';

interface QuotationInvoiceHeaders extends TableRow {
  name: Columns;
  field: Columns;
  componentType?: InputComponentType;
  componentTypeVariant?: InputComponentTypeVariant;
}

enum Columns {
  productId = 'productId',
  description = 'description',
  qty = 'qty',
  UOM = 'UOM',
  unitPrice = 'unitPrice',
  unitDiscount = 'unitDiscount',
  discountType = 'discountType',
  total = 'total',
}

const columns: QuotationInvoiceHeaders[] = reactive([
  {
    name: Columns.productId,
    required: true,
    label: 'Product',
    align: 'center',
    field: Columns.productId,
    filterable: false,
    componentType: 'select',
    componentTypeVariant: 'single-select',
  },
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
  },
  {
    name: Columns.qty,
    required: true,
    label: 'Qty',
    align: 'center',
    field: Columns.qty,
    sortable: false,
    filterable: false,
    componentType: 'input',
    componentTypeVariant: 'number',
  },
  {
    name: Columns.UOM,
    required: true,
    label: 'UOM',
    align: 'center',
    field: Columns.UOM,
    sortable: false,
    filterable: false,
    componentType: 'select',
    componentTypeVariant: 'single-select',
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
    componentTypeVariant: 'number',
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
    componentTypeVariant: 'number',
  },
  {
    name: Columns.discountType,
    required: false,
    label: 'Discount Type',
    align: 'center',
    field: Columns.discountType,
    sortable: false,
    filterable: false,
    componentType: 'select',
    componentTypeVariant: 'single-select',
  },
  {
    name: Columns.total,
    required: false,
    label: 'Total',
    align: 'center',
    field: Columns.total,
    sortable: false,
    filterable: false,
  },
]);
export default columns;
