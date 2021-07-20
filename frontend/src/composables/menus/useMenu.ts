import { Menu } from 'src/store/menus/state';
import { computed } from 'vue';

export const mainSideDrawerMenu = computed((): Menu[] => {
  return [
    {
      title: 'Customers',
      link: 'customers',
      icon: 'people',
      subMenu: [
        { icon: 'people', title: 'All Customers', link: 'customers' },
        { icon: 'people', title: 'Customer Groups', link: 'customers' },
      ],
    },
    { title: 'Quotations', link: 'quotations', icon: 'request_page' },
    { title: 'Invoices', link: 'invoices', icon: 'list_alt' },
    { title: 'Receipts', link: 'receipts', icon: 'receipt' },
    {
      title: 'Inventories',
      link: 'all_products',
      icon: 'inventory',
      subMenu: [
        {
          icon: 'local_grocery_store',
          title: 'Products',
          link: 'all_products',
        },
        {
          icon: 'storefront',
          title: 'Product Categories',
          link: 'all_products',
        },
      ],
    },
  ];
});

export const sideDrawerBottomMenu = computed((): Menu[] => {
  return [
    { icon: 'settings', title: 'Settings', link: 'all_settings' },
    /* { icon: 'help', title: 'Help & Feedback', link: 'help' }, */
  ];
});

export const sideDrawerFooterMenu = computed((): Menu[] => {
  return [
    /* { icon: 'archive', title: 'Archive' },
      { icon: 'delete', title: 'Trash' }, */
  ];
});

export const createMenu = computed((): Menu[] => {
  return [
    { icon: 'person_add_alt', title: 'Customer', link: 'create_customer' },
    { icon: 'request_page', title: 'Quotation', link: 'create_quotation' },
    { icon: 'list_alt', title: 'Invoice', link: 'create_invoice' },
    { icon: 'receipt', title: 'Receipt', link: 'create_receipt' },
  ];
});

export const mobileFooterMenu = computed((): Menu[] => {
  const customerMenu = mainSideDrawerMenu.value.filter(
    (menu) => menu.title === 'Customers'
  );
  const quotationMenu = mainSideDrawerMenu.value.filter(
    (menu) => menu.title === 'Quotations'
  );
  const receiptMenu = mainSideDrawerMenu.value.filter(
    (menu) => menu.title === 'Receipts'
  );
  const inventoryMenu = mainSideDrawerMenu.value.filter(
    (menu) => menu.title === 'Inventories'
  );

  return [...customerMenu, ...quotationMenu, ...receiptMenu, ...inventoryMenu];
});
