import /* booleanFormatter */ 'src/helpers/utils';
import { /* Formatter, */ TableRow } from '../../../types/table';

interface UserHeaders extends TableRow {
  name: UserColumns;
  field: UserColumns;
}

enum UserColumns {
  id = 'id',
  email = 'email',
  first_name = 'first_name',
  last_name = 'last_name',
  login_status = 'login_status',
  is_account_activated = 'is_account_activated',
  is_email_verified = 'is_email_verified',
  lifetime_login = 'lifetime_login',
  password_change_required = 'password_change_required',
  last_login_time = 'last_login_time',
  account_activated_at = 'account_activated_at',
  email_verified_at = 'email_verified_at',
  created_at = 'created_at',
  updated_at = 'updated_at',
}

/* const booleanFormatter: Formatter<boolean, TableRow, string> = function (
  value: boolean,
  row: TableRow
) {
  console.log(value, row);
  return value ? 'TRUE' : 'FALSE';
}; */

const columns: Array<UserHeaders> = [
  {
    name: UserColumns.id,
    required: true,
    label: 'User ID',
    align: 'center',
    field: UserColumns.id,
  },
  {
    name: UserColumns.first_name,
    required: true,
    label: 'First Name',
    align: 'center',
    field: UserColumns.first_name,
    sortable: true,
  },
  {
    name: UserColumns.last_name,
    required: true,
    label: 'Last Name',
    align: 'center',
    field: UserColumns.last_name,
    sortable: true,
  },
  {
    name: UserColumns.email,
    required: true,
    label: 'Email Address',
    align: 'center',
    field: UserColumns.email,
    sortable: true,
  },
  {
    name: UserColumns.login_status,
    required: true,
    label: 'Login Status',
    align: 'center',
    field: UserColumns.login_status,
    sortable: true,
  },
  {
    name: UserColumns.is_account_activated,
    required: true,
    label: 'Is Account Activated',
    align: 'center',
    field: UserColumns.is_account_activated,
    sortable: true,
  },
  {
    name: UserColumns.is_email_verified,
    required: false,
    label: 'Is Email Verified',
    align: 'center',
    field: UserColumns.is_email_verified,
    sortable: true,
  },
  {
    name: UserColumns.lifetime_login,
    required: false,
    label: 'Lifetime Login',
    align: 'center',
    field: UserColumns.lifetime_login,
    sortable: true,
  },
  {
    name: UserColumns.last_login_time,
    required: false,
    label: 'Last Login Time',
    align: 'center',
    field: UserColumns.last_login_time,
    sortable: true,
  },
  {
    name: UserColumns.account_activated_at,
    required: false,
    label: 'Account Activated At',
    align: 'center',
    field: UserColumns.account_activated_at,
    sortable: true,
  },
  {
    name: UserColumns.email_verified_at,
    required: false,
    label: 'Email Verified At',
    align: 'center',
    field: UserColumns.email_verified_at,
    sortable: true,
  },
  {
    name: UserColumns.created_at,
    required: false,
    label: 'Created At',
    align: 'center',
    field: UserColumns.created_at,
    sortable: true,
  },
  {
    name: UserColumns.updated_at,
    required: false,
    label: 'Updated At',
    align: 'center',
    field: UserColumns.updated_at,
    sortable: true,
  },
];

export default columns;
