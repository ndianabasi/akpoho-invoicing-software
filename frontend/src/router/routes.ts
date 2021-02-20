import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    name: 'Home',
    meta: {
      label: 'Home',
      icon: 'home',
      //canViewOrganisations: true,
    },
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: 'customers',
        name: 'customers',
        component: () => import('pages/customers/index.vue'),
        meta: {
          label: 'All Customers',
          icon: 'people',
          //canViewOrganisations: true,
        },
        children: [
          {
            path: ':customerId',
            component: () => import('pages/customers/customer.vue'),
            props: true,
            name: 'Customer View',
            meta: {
              label: 'View Customer',
              //canViewOrganisations: true,
            },
          },
        ],
      },
      {
        path: 'quotations',
        name: 'quotations',
        component: () => import('pages/quotations/index.vue'),
        meta: {
          label: 'All Quotations',
          icon: 'request_page',
          //canViewOrganisations: true,
        },
      },
      {
        path: 'invoices',
        name: 'invoices',
        component: () => import('pages/invoices/index.vue'),
        meta: {
          label: 'All Invoices',
          icon: 'list_alt',
          //canViewOrganisations: true,
        },
      },
      {
        path: 'receipts',
        name: 'receipts',
        component: () => import('pages/receipts/index.vue'),
        meta: {
          label: 'All Receipts',
          icon: 'receipt',
          //canViewOrganisations: true,
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
