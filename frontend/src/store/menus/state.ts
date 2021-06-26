export interface Menu {
  icon: string;
  title: string;
  caption?: string;
  link?: string;
  subMenu?: Menu[];
}
export interface MenusStateInterface {
  links1: Array<Menu>;
  links2: Array<Menu>;
  links3: Array<Menu>;
  createMenu: Array<Menu>;
  leftDrawerOpen: boolean;
}

function state(): MenusStateInterface {
  return {
    links1: [
      {
        icon: 'people',
        title: 'Customers',
        link: 'customers',
        subMenu: [
          { icon: 'people', title: 'All Customers', link: 'customers' },
          { icon: 'people', title: 'Customer Groups', link: 'customers' },
        ],
      },
      { icon: 'request_page', title: 'Quotations', link: 'quotations' },
      { icon: 'list_alt', title: 'Invoices', link: 'invoices' },
      { icon: 'receipt', title: 'Receipts', link: 'receipts' },
      {
        icon: 'inventory',
        title: 'Inventories',
        link: 'all_products',
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
    ],
    links2: [
      /* { icon: 'archive', title: 'Archive' },
      { icon: 'delete', title: 'Trash' }, */
    ],
    links3: [
      { icon: 'settings', title: 'Settings', link: 'all_settings' },
      { icon: 'help', title: 'Help & Feedback' /* link: 'help' */ },
    ],
    createMenu: [
      { icon: 'person_add_alt', title: 'Customer', link: 'create_customer' },
      { icon: 'request_page', title: 'Quotation', link: 'create_quotation' },
      { icon: 'list_alt', title: 'Invoice', link: 'create_invoice' },
      { icon: 'receipt', title: 'Receipt', link: 'create_receipt' },
    ],
    leftDrawerOpen: false,
  };
}

export default state;
