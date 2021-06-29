/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { watchEffect, onBeforeUnmount } from 'vue';
import { store } from 'src/store';
import { TableRow } from '../../../types/table';
import { stockStatusForSelect, yesNoOptionsForSelect } from 'src/helpers/utils';
import { PRODUCT_OWNERSHIP_TYPES, PRODUCT_TYPES } from 'src/store/types';

interface ProductHeaders extends TableRow {
  name: ProductColumns;
  field: ProductColumns | ((row: ProductResultRowInterface) => unknown);
}

enum ProductColumns {
  id = 'id',
  product_type = 'product_type',
  name = 'name',
  sku = 'sku',
  price = 'price',
  is_enabled = 'is_enabled',
  stock_status = 'stock_status',
  product_has_weight = 'product_has_weight',
  created_at = 'created_at',
  updated_at = 'updated_at',
  slug = 'slug',
  weight = 'weight',
  country_of_manufacture = 'country_of_manufacture',
}

interface ProductResultRowInterface {
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
  weight: string;
  country_of_manufacture: string;
  meta: {
    pivot_ownership: PRODUCT_OWNERSHIP_TYPES;
    product_type: PRODUCT_TYPES;
  };
}

const stopFetchProductSizesForSelect = watchEffect(() => {
  void store.dispatch('companies/FETCH_PRODUCT_SIZES_FOR_SELECT');
});

const columns: ProductHeaders[] = [
  {
    name: ProductColumns.id,
    required: false,
    label: 'Product ID',
    align: 'center',
    field: ProductColumns.id,
    filterable: true,
    filterInputType: 'text',
  },
  {
    name: ProductColumns.name,
    required: true,
    label: 'Name',
    align: 'center',
    field: ProductColumns.name,
    sortable: true,
    filterable: true,
    filterInputType: 'text',
  },
  {
    name: ProductColumns.product_type,
    required: true,
    label: 'Product Type',
    align: 'center',
    field: (row) => row.meta.product_type,
    sortable: true,
    filterable: true,
    filterInputType: 'text',
  },
  {
    name: ProductColumns.sku,
    required: true,
    label: 'SKU',
    align: 'center',
    field: ProductColumns.sku,
    sortable: true,
    filterable: true,
    filterInputType: 'text',
  },
  {
    name: ProductColumns.price,
    required: true,
    label: 'Price',
    align: 'center',
    field: ProductColumns.price,
    sortable: true,
    filterable: true,
    filterInputType: 'text',
  },
  {
    name: ProductColumns.is_enabled,
    required: true,
    label: 'Is Enabled',
    align: 'center',
    field: ProductColumns.is_enabled,
    sortable: true,
    filterable: true,
    filterInputType: 'select',
    filterOptions: yesNoOptionsForSelect.value,
  },
  {
    name: ProductColumns.stock_status,
    required: true,
    label: 'Stock Status',
    align: 'center',
    field: ProductColumns.stock_status,
    sortable: true,
    filterable: true,
    filterInputType: 'select',
    filterOptions: stockStatusForSelect.value,
  },
  {
    name: ProductColumns.product_has_weight,
    required: false,
    label: 'Product Has Weight',
    align: 'center',
    field: ProductColumns.product_has_weight,
    sortable: true,
    filterable: true,
    filterInputType: 'select',
    filterOptions: yesNoOptionsForSelect.value,
  },
  {
    name: ProductColumns.weight,
    required: false,
    label: 'Weight',
    align: 'center',
    field: ProductColumns.weight,
    sortable: true,
    filterable: true,
    filterInputType: 'text',
  },
  {
    name: ProductColumns.slug,
    required: false,
    label: 'Slug',
    align: 'center',
    field: ProductColumns.slug,
    sortable: false,
    filterable: false,
  },
  {
    name: ProductColumns.country_of_manufacture,
    required: false,
    label: 'Country of Manufacture',
    align: 'center',
    field: ProductColumns.country_of_manufacture,
    sortable: true,
    filterable: true,
    filterInputType: 'text',
  },
  {
    name: ProductColumns.created_at,
    required: false,
    label: 'Created At',
    align: 'center',
    field: ProductColumns.created_at,
    sortable: true,
    filterable: true,
    filterInputType: 'date',
  },
  {
    name: ProductColumns.updated_at,
    required: false,
    label: 'Updated At',
    align: 'center',
    field: ProductColumns.updated_at,
    sortable: true,
    filterable: true,
    filterInputType: 'date',
  },
];

onBeforeUnmount(() => {
  stopFetchProductSizesForSelect();
});

export default columns;
