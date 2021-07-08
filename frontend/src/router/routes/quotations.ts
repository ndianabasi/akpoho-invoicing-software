export default {
  path: 'quotations',
  component: () => import('pages/quotations/QuotationIndex.vue'),
  meta: {
    label: 'Quotations',
    icon: 'people',
    permission: 'can_list_quotations',
  },
  children: [
    {
      path: '',
      component: () => import('pages/quotations/AllQuotations.vue'),
      name: 'quotations',
      meta: {
        label: 'All Quotations',
        icon: 'people',
      },
    },
    {
      path: ':quotationId/view',
      component: () => import('pages/quotations/Quotation.vue'),
      props: true,
      name: 'view_quotation',
      meta: {
        label: 'View Quotation',
        permission: 'can_view_quotations',
      },
    },
    {
      path: ':quotationId/edit',
      component: () => import('pages/quotations/EditQuotation.vue'),
      props: true,
      name: 'edit_quotation',
      meta: {
        label: 'Edit Quotation',
        permission: 'can_edit_quotations',
      },
    },
    {
      path: 'new',
      component: () => import('pages/quotations/CreateQuotation.vue'),
      name: 'create_quotation',
      meta: {
        label: 'New Quotation',
        permission: 'can_create_quotations',
      },
    },
  ],
};
