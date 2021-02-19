interface Menu {
  icon: string;
  title: string;
  caption?: string;
  link?: string;
}
export interface MenusStateInterface {
  links1: Array<Menu>;
  links2: Array<Menu>;
  links3: Array<Menu>;
  createMenu: Array<Menu>;
}

function state(): MenusStateInterface {
  return {
    links1: [
      { icon: 'people', title: 'Customers', link: 'customers' },
      { icon: 'request_page', title: 'Quotations', link: 'quotations' },
      { icon: 'list_alt', title: 'Invoices', link: 'invoices' },
      { icon: 'receipt', title: 'Receipts', link: 'receipts' },
    ],
    links2: [
      { icon: 'archive', title: 'Archive' },
      { icon: 'delete', title: 'Trash' },
    ],
    links3: [
      { icon: 'settings', title: 'Settings' },
      { icon: 'help', title: 'Help & Feedback' },
      { icon: 'get_app', title: 'App Downloads' },
    ],
    createMenu: [
      { icon: 'person_add_alt', title: 'Customer' },
      { icon: 'request_page', title: 'Quotation' },
      { icon: 'list_alt', title: 'Invoice' },
      { icon: 'receipt', title: 'Receipt' },
    ],
  };
}

export default state;
