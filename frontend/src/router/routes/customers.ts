export default {
  path: 'customers',
  component: () => import('pages/customers/CustomerIndex.vue'),
  meta: {
    label: 'Customers',
    icon: 'people',
    permission: 'can_list_customers',
  },
  children: [
    {
      path: '',
      component: () => import('pages/customers/AllCustomers.vue'),
      name: 'customers',
      meta: {
        label: 'All Customers',
        icon: 'people',
      },
    },
    {
      path: ':customerId/view',
      component: () => import('pages/customers/ViewCustomer.vue'),
      props: true,
      name: 'view_customer',
      meta: {
        label: 'View Customer',
        permission: 'can_view_customers',
      },
    },
    {
      path: ':customerId/edit',
      component: () => import('pages/customers/EditCustomer.vue'),
      props: true,
      name: 'edit_customer',
      meta: {
        label: 'Edit Customer',
        permission: 'can_edit_customers',
      },
    },
    {
      path: 'new',
      component: () => import('pages/customers/CreateCustomer.vue'),
      name: 'create_customer',
      meta: {
        label: 'New Customer',
        permission: 'can_create_customers',
      },
    },
  ],
};
