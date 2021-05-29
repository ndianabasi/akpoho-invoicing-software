export const roles = [
  {
    name: 'SuperAdmin',
    description:
      'Users assigned to this role can view, create, and edit companies, users, receipts, invoices, quotation, and settings for the entire application. This is the owner of the application',
  },
  {
    name: 'SuperEditor',
    description:
      "Users assigned can do everything the SuperAdmin does except deleting companies and editing/deleting other SuperAdmin's or SuperEditor's accounts.",
  },
  {
    name: 'SuperViewer',
    description:
      'Users assigned can view every resource across companies but cannot edit or delete them.',
  },
  {
    name: 'Developer',
    description:
      'A developer has access to all resources and settings and hidden/unfinished/beta resources not meant for general/production use.',
  },
  {
    name: 'CompanyAdmin',
    description:
      'Users assigned to this role can create, view, edit, and delete any resource within his or her company but cannot delete the company itself. This role can view and edit all company settings. This is the role with the highest privilege in the company.',
  },
  {
    name: 'CompanyEditor',
    description:
      'Users assigned to this role can do everything the CompanyAdmin does but cannot delete any resource within the company.',
  },
  {
    name: 'CompanyStaff',
    description:
      'Users assigned to the role can only view company resource but cannot edit r delete them.',
  },
]

export const globalRoles = ['SuperAdmin', 'SuperEditor', 'SuperViewer', 'Developer']

export enum ROLES {
  SUPERADMIN = 'SuperAdmin',
  SUPER_EDITOR = 'SuperEditor',
  SUPER_VIEWER = 'SuperViewer',
  DEVELOPER = 'Developer',
  COMPANY_ADMIN = 'CompanyAdmin',
  COMPANY_EDITOR = 'CompanyEditor',
  COMPANY_STAFF = 'CompanyStaff',
}
