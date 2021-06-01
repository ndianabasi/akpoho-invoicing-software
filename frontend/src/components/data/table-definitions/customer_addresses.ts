import { TableRow } from '../../../types/table';

interface Headers extends TableRow {
  name: Columns;
  field: Columns;
}

enum Columns {
  id = 'id',
  address_type = 'address_type',
  city = 'city',
  country = 'country',
  postal_code = 'postal_code',
  state = 'state',
  street_address = 'street_address',
}

const columns: Array<Headers> = [
  {
    name: Columns.id,
    required: false,
    label: 'User ID',
    align: 'center',
    field: Columns.id,
  },
  {
    name: Columns.address_type,
    required: true,
    label: 'Address Type',
    align: 'center',
    field: Columns.address_type,
  },
  {
    name: Columns.city,
    required: true,
    label: 'City',
    align: 'center',
    field: Columns.city,
  },
  {
    name: Columns.postal_code,
    required: true,
    label: 'Postal Code',
    align: 'center',
    field: Columns.postal_code,
  },
  {
    name: Columns.street_address,
    required: true,
    label: 'Street Address',
    align: 'center',
    field: Columns.street_address,
  },
  {
    name: Columns.country,
    required: true,
    label: 'Country',
    align: 'center',
    field: Columns.country,
  },
  {
    name: Columns.state,
    required: true,
    label: 'State',
    align: 'center',
    field: Columns.state,
  },
];

export default columns;
