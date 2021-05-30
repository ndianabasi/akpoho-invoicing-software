import { RouteRecordRaw } from 'vue-router';

export type CustomRouteRecord = RouteRecordRaw & {
  meta?: {
    label?: string;
    icon?: string;
    permission?: string;
    requiresAuth?: boolean;
  };
};

const routes: CustomRouteRecord[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    name: 'Home',
    meta: {
      label: 'Home',
      icon: 'home',
      requiresAuth: true,
      permission: 'can_view_company_dashboard',
    },
    children: [
      { path: '', component: () => import('../pages/Index.vue') },
      {
        path: 'customers',
        component: () => import('../pages/customers/Index.vue'),
        meta: {
          label: 'Customers',
          icon: 'people',
          permission: 'can_list_customers',
        },
        children: [
          {
            path: '',
            component: () => import('../pages/customers/AllCustomers.vue'),
            name: 'customers',
            meta: {
              label: 'All Customers',
              icon: 'people',
            },
          },
          {
            path: ':customerId',
            component: () => import('../pages/customers/Customer.vue'),
            props: true,
            name: 'view_customer',
            meta: {
              label: 'View Customer',
              permission: 'can_view_customers',
            },
          },
          {
            path: 'new',
            component: () => import('../pages/customers/CreateCustomer.vue'),
            name: 'create_customer',
            meta: {
              label: 'New Customer',
              permission: 'can_create_customers',
            },
          },
        ],
      },
      {
        path: 'quotations',
        name: 'quotations',
        component: () => import('../pages/quotations/Index.vue'),
        meta: {
          label: 'All Quotations',
          icon: 'request_page',
          permission: 'can_list_quotations',
        },
      },
      {
        path: '/quotations/new',
        component: () => import('../pages/quotations/CreateQuotation.vue'),
        name: 'create_quotation',
        meta: {
          label: 'New Quotation',
          permission: 'can_create_quotations',
        },
      },
      {
        path: 'invoices',
        name: 'invoices',
        component: () => import('../pages/invoices/Index.vue'),
        meta: {
          label: 'All Invoices',
          icon: 'list_alt',
          permission: 'can_list_invoices',
        },
      },
      {
        path: '/invoices/new',
        component: () => import('../pages/invoices/CreateInvoice.vue'),
        name: 'create_invoice',
        meta: {
          label: 'New Invoice',
          permission: 'can_create_invoices',
        },
      },
      {
        path: 'receipts',
        name: 'receipts',
        component: () => import('../pages/receipts/Index.vue'),
        meta: {
          label: 'All Receipts',
          icon: 'receipt',
          permission: 'can_list_receipts',
        },
      },
      {
        path: '/receipts/new',
        component: () => import('../pages/receipts/CreateReceipt.vue'),
        name: 'create_receipt',
        meta: {
          label: 'New Receipt',
          permission: 'can_create_receipts',
        },
      },
      {
        path: 'settings',
        component: () => import('../pages/settings/Index.vue'),
        meta: {
          label: 'Settings',
          icon: 'settings',
          permission: 'can_edit_self',
        },
        children: [
          {
            path: '',
            component: () => import('../pages/settings/AllSettings.vue'),
            name: 'all_settings',
            meta: {
              label: 'All Settings',
              icon: 'settings',
            },
          },
          {
            path: 'users',
            component: () => import('../pages/settings/users/Index.vue'),
            meta: {
              label: 'Users',
              permission: 'can_list_users',
            },
            children: [
              {
                path: '',
                component: () => import('../pages/settings/users/AllUsers.vue'),
                name: 'all_users',
                meta: {
                  label: 'All Users',
                },
              },
              {
                path: 'new',
                component: () =>
                  import('../pages/settings/users/CreateUser.vue'),
                name: 'add_user',
                meta: {
                  label: 'New User',
                  permission: 'can_create_users',
                },
              },
              {
                path: ':?userId/view',
                props: true,
                component: () => import('../pages/settings/users/User.vue'),
                name: 'view_user',
                meta: {
                  label: 'View User',
                  permission: 'can_view_users',
                },
              },
              {
                path: ':?userId/edit',
                props: true,
                component: () => import('../pages/settings/users/EditUser.vue'),
                name: 'edit_user',
                meta: {
                  label: 'Edit User',
                  permission: 'can_edit_users',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    component: () => import('../pages/Login.vue'),
    name: 'Login',
    meta: {
      label: 'Login',
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/Error404.vue'),
  },
];

export default routes;
