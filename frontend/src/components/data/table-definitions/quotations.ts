/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { onBeforeUnmount } from 'vue';
import { TableRow } from '../../../types/table';

interface Headers extends TableRow {
  name: Columns;
  field: Columns;
}

enum Columns {
  id = 'id',
  title = 'title',
  customer = 'customer',
  tax_percentage = 'tax_percentage',
  simple_quantities = 'simple_quantities',
  show_discounts = 'show_discounts',
  created_at = 'created_at',
  updated_at = 'updated_at',
}

const columns: Headers[] = [
  {
    name: Columns.id,
    required: false,
    label: 'Company ID',
    align: 'center',
    field: Columns.id,
    filterable: true,
    filterInputType: 'text',
  },
  {
    name: Columns.title,
    required: true,
    label: 'Title',
    align: 'center',
    field: Columns.title,
    sortable: true,
    filterable: true,
    filterInputType: 'text',
  },
  {
    name: Columns.customer,
    required: true,
    label: 'Customer Name',
    align: 'center',
    field: Columns.customer,
    sortable: true,
    filterable: true,
    filterInputType: 'text',
  },
  {
    name: Columns.tax_percentage,
    required: true,
    label: 'Tax Percentage',
    align: 'center',
    field: Columns.tax_percentage,
    sortable: true,
    filterable: true,
    filterInputType: 'text',
  },
  {
    name: Columns.simple_quantities,
    required: true,
    label: 'Uses Simple Quantities?',
    align: 'center',
    field: Columns.simple_quantities,
    sortable: true,
    filterable: true,
    filterInputType: 'select',
    filterOptions: [
      { label: '', value: null },
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  },
  {
    name: Columns.show_discounts,
    required: true,
    label: 'Discounts Visible?',
    align: 'center',
    field: Columns.show_discounts,
    sortable: true,
    filterable: true,
    filterInputType: 'select',
    filterOptions: [
      { label: '', value: null },
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  },
  {
    name: Columns.created_at,
    required: false,
    label: 'Created At',
    align: 'center',
    field: Columns.created_at,
    sortable: true,
    filterable: true,
    filterInputType: 'date',
  },
  {
    name: Columns.updated_at,
    required: false,
    label: 'Updated At',
    align: 'center',
    field: Columns.updated_at,
    sortable: true,
    filterable: true,
    filterInputType: 'date',
  },
];

onBeforeUnmount(() => {
  //stopFetchCompanySizesForSelect();
});

export default columns;
