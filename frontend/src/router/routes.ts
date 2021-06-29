import { RouteRecordRaw } from 'vue-router';
import auth from './routes/auth';
import customers from './routes/customers';
import inventories from './routes/inventories';
import settings from './settings';

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
      { ...customers },
      { ...inventories },
      { ...settings },
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
    ],
  },
  { ...auth },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
