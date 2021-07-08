/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { computed, watchEffect, onBeforeUnmount } from 'vue';
import { store } from 'src/store';
import { SelectOption } from 'src/store/types';
import { TableRow } from '../../../types/table';

interface CompanyHeaders extends TableRow {
  name: CompanyColumns;
  field: CompanyColumns;
}

enum CompanyColumns {
  id = 'id',
  email = 'email',
  name = 'name',
  phone_number = 'phone_number',
  address = 'address',
  city = 'city',
  is_approved = 'is_approved',
  approved_at = 'approved_at',
  created_at = 'created_at',
  updated_at = 'updated_at',
  type = 'type',
  company_size = 'company_size',
  country = 'country',
  state = 'state',
}

const stopFetchCompanySizesForSelect = watchEffect(() => {
  void store.dispatch('companies/FETCH_COMPANY_SIZES_FOR_SELECT');
});

const companySizes = computed(
  () =>
    store.getters['companies/GET_COMPANY_SIZES_FOR_SELECT'] as SelectOption[]
);

const columns: CompanyHeaders[] = [
  {
    name: CompanyColumns.id,
    required: false,
    label: 'Company ID',
    align: 'center',
    field: CompanyColumns.id,
    filterable: true,
    filterInputType: 'text',
  },
  {
    name: CompanyColumns.name,
    required: true,
    label: 'Name',
    align: 'center',
    field: CompanyColumns.name,
    sortable: true,
    filterable: true,
    filterInputType: 'text',
  },
  {
    name: CompanyColumns.email,
    required: true,
    label: 'Email Address',
    align: 'center',
    field: CompanyColumns.email,
    sortable: true,
    filterable: true,
    filterInputType: 'text',
  },
  {
    name: CompanyColumns.address,
    required: true,
    label: 'Address',
    align: 'center',
    field: CompanyColumns.address,
    sortable: false,
    filterable: false,
  },
  {
    name: CompanyColumns.type,
    required: true,
    label: 'Company Type',
    align: 'center',
    field: CompanyColumns.type,
    sortable: true,
    filterable: true,
    filterInputType: 'select',
    filterOptions: [
      { label: '', value: null },
      { label: 'Personal', value: 'personal' },
      { label: 'Corporate', value: 'corporate' },
    ],
  },
  {
    name: CompanyColumns.phone_number,
    required: true,
    label: 'Phone Number',
    align: 'center',
    field: CompanyColumns.phone_number,
    sortable: false,
    filterable: false,
  },
  {
    name: CompanyColumns.city,
    required: false,
    label: 'City',
    align: 'center',
    field: CompanyColumns.city,
    sortable: true,
    filterable: true,
    filterInputType: 'text',
  },
  {
    name: CompanyColumns.company_size,
    required: false,
    label: 'Company Size',
    align: 'center',
    field: CompanyColumns.company_size,
    sortable: true,
    filterable: true,
    filterInputType: 'select',
    filterOptions: computed(() => companySizes.value).value,
  },
  {
    name: CompanyColumns.state,
    required: false,
    label: 'State',
    align: 'center',
    field: CompanyColumns.state,
    sortable: true,
    filterable: true,
    filterInputType: 'text',
  },
  {
    name: CompanyColumns.country,
    required: false,
    label: 'Country',
    align: 'center',
    field: CompanyColumns.country,
    sortable: true,
    filterable: true,
    filterInputType: 'text',
  },
  {
    name: CompanyColumns.created_at,
    required: false,
    label: 'Created At',
    align: 'center',
    field: CompanyColumns.created_at,
    sortable: true,
    filterable: true,
    filterInputType: 'date',
  },
  {
    name: CompanyColumns.updated_at,
    required: false,
    label: 'Updated At',
    align: 'center',
    field: CompanyColumns.updated_at,
    sortable: true,
    filterable: true,
    filterInputType: 'date',
  },
];

onBeforeUnmount(() => {
  stopFetchCompanySizesForSelect();
});

export default columns;
