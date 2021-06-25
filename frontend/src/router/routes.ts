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
    name: 'home',
    redirect: '/dashboard',
    meta: {
      label: 'Home',
      icon: 'home',
      requiresAuth: true,
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/dashboard',
        component: () => import('pages/PagesIndex.vue'),
        name: 'Dashboard',
        meta: {
          label: 'Dashboard',
          icon: 'dashboard',
          requiresAuth: true,
          permission: 'can_view_company_dashboard',
        },
      },
      {
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
      },
      {
        path: 'inventories',
        component: () => import('pages/inventories/InventoryIndex.vue'),
        redirect: '/inventories/products',
        meta: {
          label: 'Inventories',
          icon: 'inventory',
          permission: 'can_list_inventories',
        },
        children: [
          {
            path: '',
            redirect: '/inventories/products',
            name: 'all_inventory',
            meta: {
              label: 'All Inventory',
              icon: 'inventory',
            },
          },
          {
            path: 'products',
            component: () =>
              import('pages/inventories/products/ProductIndex.vue'),
            name: 'products',
            meta: {
              label: 'Products',
              icon: 'local_grocery_store',
            },
            children: [
              {
                path: '',
                component: () =>
                  import('pages/inventories/products/Products.vue'),
                name: 'all_products',
                meta: {
                  label: 'All Products',
                  icon: 'local_grocery_store',
                },
              },
              {
                path: ':productId/view',
                component: () =>
                  import('pages/inventories/products/Product.vue'),
                props: true,
                name: 'view_product',
                meta: {
                  label: 'View Product',
                  permission: 'can_view_inventories',
                },
              },
              {
                path: ':productId/edit',
                component: () =>
                  import('pages/inventories/products/EditProduct.vue'),
                props: true,
                name: 'edit_product',
                meta: {
                  label: 'Edit Product',
                  permission: 'can_edit_inventories',
                },
              },
              {
                path: 'new',
                component: () =>
                  import(
                    'pages/inventories/products/new/CreateProductIndex.vue'
                  ),
                name: 'create_product_index',
                meta: {
                  label: 'New Product',
                  icon: 'add_circle',
                  permission: 'can_create_inventories',
                },
                children: [
                  {
                    path: '',
                    redirect: '/inventories/products/new/simple-product',
                    name: 'create_product',
                    meta: {
                      label: 'New Product',
                      icon: 'local_grocery_store',
                    },
                  },
                  {
                    path: 'simple-product',
                    component: () =>
                      import(
                        'pages/inventories/products/new/CreateSimpleProduct.vue'
                      ),
                    name: 'create_simple_product',
                    meta: {
                      label: 'New Simple Product',
                      permission: 'can_create_inventories',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: 'quotations',
        name: 'quotations',
        component: () => import('pages/quotations/QuotationIndex.vue'),
        meta: {
          label: 'All Quotations',
          icon: 'request_page',
          permission: 'can_list_quotations',
        },
      },
      {
        path: '/quotations/new',
        component: () => import('pages/quotations/CreateQuotation.vue'),
        name: 'create_quotation',
        meta: {
          label: 'New Quotation',
          permission: 'can_create_quotations',
        },
      },
      {
        path: 'invoices',
        name: 'invoices',
        component: () => import('pages/invoices/InvoiceIndex.vue'),
        meta: {
          label: 'All Invoices',
          icon: 'list_alt',
          permission: 'can_list_invoices',
        },
      },
      {
        path: '/invoices/new',
        component: () => import('pages/invoices/CreateInvoice.vue'),
        name: 'create_invoice',
        meta: {
          label: 'New Invoice',
          permission: 'can_create_invoices',
        },
      },
      {
        path: 'receipts',
        name: 'receipts',
        component: () => import('pages/receipts/ReceiptIndex.vue'),
        meta: {
          label: 'All Receipts',
          icon: 'receipt',
          permission: 'can_list_receipts',
        },
      },
      {
        path: '/receipts/new',
        component: () => import('pages/receipts/CreateReceipt.vue'),
        name: 'create_receipt',
        meta: {
          label: 'New Receipt',
          permission: 'can_create_receipts',
        },
      },
      {
        path: 'settings',
        component: () => import('pages/settings/Index.vue'),
        meta: {
          label: 'Settings',
          icon: 'settings',
          permission: 'can_edit_self',
        },
        children: [
          {
            path: '',
            component: () => import('pages/settings/AllSettings.vue'),
            name: 'all_settings',
            meta: {
              label: 'All Settings',
              icon: 'settings',
            },
          },
          {
            path: 'users',
            component: () => import('pages/settings/users/Index.vue'),
            meta: {
              label: 'Users',
              permission: 'can_list_users',
            },
            children: [
              {
                path: '',
                component: () => import('pages/settings/users/AllUsers.vue'),
                name: 'all_users',
                meta: {
                  label: 'All Users',
                },
              },
              {
                path: 'new',
                component: () => import('pages/settings/users/CreateUser.vue'),
                name: 'add_user',
                meta: {
                  label: 'New User',
                  permission: 'can_create_users',
                },
              },
              {
                path: ':userId/view',
                props: true,
                component: () => import('pages/settings/users/User.vue'),
                name: 'view_user',
                meta: {
                  label: 'View User',
                  permission: 'can_view_users',
                },
              },
              {
                path: ':userId/edit',
                props: true,
                component: () => import('pages/settings/users/EditUser.vue'),
                name: 'edit_user',
                meta: {
                  label: 'Edit User',
                  permission: 'can_edit_users',
                },
              },
            ],
          },
          {
            path: 'companies',
            component: () => import('pages/settings/companies/Index.vue'),
            meta: {
              label: 'Companies',
              permission: 'can_list_companies',
            },
            children: [
              {
                path: '',
                component: () =>
                  import('pages/settings/companies/AllCompanies.vue'),
                name: 'all_companies',
                meta: {
                  label: 'All Companies',
                },
              },
              {
                path: 'new',
                component: () =>
                  import('pages/settings/companies/CreateCompany.vue'),
                name: 'add_company',
                meta: {
                  label: 'New Company',
                  permission: 'can_create_companies',
                },
              },
              {
                path: ':companyId/view',
                props: true,
                component: () => import('pages/settings/companies/Company.vue'),
                name: 'view_company',
                meta: {
                  label: 'View Company',
                  permission: 'can_view_companies',
                },
              },
              {
                path: ':companyId/edit',
                props: true,
                component: () =>
                  import('pages/settings/companies/EditCompany.vue'),
                name: 'edit_company',
                meta: {
                  label: 'Edit Company',
                  permission: 'can_edit_companies',
                },
              },
            ],
          },
          {
            path: 'personal-settings',
            component: () =>
              import('pages/settings/personal-settings/Index.vue'),
            meta: {
              label: 'Personal Settings',
            },
            children: [
              {
                path: '',
                component: () =>
                  import(
                    'pages/settings/personal-settings/AllPersonalSettings.vue'
                  ),
                name: 'all_personal_settings',
                meta: {
                  label: 'All Personal Settings',
                },
              },
              {
                path: 'my-account',
                component: () =>
                  import('pages/settings/personal-settings/MyAccount.vue'),
                name: 'my_account',
                meta: {
                  label: 'My Account',
                },
              },
              {
                path: 'change-my-password',
                component: () =>
                  import(
                    'pages/settings/personal-settings/ChangeMyPassword.vue'
                  ),
                name: 'change_my_password',
                meta: {
                  label: 'Change My Password',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/auth',
    redirect: '/auth/login',
    component: () => import('pages/auth/AuthIndex.vue'),
    name: 'auth',
    children: [
      {
        path: 'login',
        component: () => import('pages/auth/Login.vue'),
        name: 'Login',
        meta: {
          label: 'Login',
          requiresAuth: false,
        },
      },
      {
        path: 'register',
        component: () => import('pages/auth/Register.vue'),
        name: 'Register',
        meta: {
          label: 'Register',
          requiresAuth: false,
        },
      },
      {
        path: 'forgot-password',
        component: () => import('pages/auth/ForgotPassword.vue'),
        name: 'forgot_password',
        meta: {
          label: 'Reset Password',
          requiresAuth: false,
        },
      },
      {
        path: 'reset-password/:verificationKey',
        component: () => import('pages/auth/ResetPassword.vue'),
        name: 'reset_password',
        props: true,
        meta: {
          label: 'Reset Password',
          requiresAuth: false,
        },
      },
      {
        path: 'verify-email/:verificationKey',
        component: () => import('pages/auth/VerifyNewAccountEmail.vue'),
        name: 'verify_new_account_email',
        props: true,
        meta: {
          label: 'Verify New Account Email',
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
