export default {
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
          component: () => import('pages/settings/companies/AllCompanies.vue'),
          name: 'all_companies',
          meta: {
            label: 'All Companies',
          },
        },
        {
          path: 'new',
          component: () => import('pages/settings/companies/CreateCompany.vue'),
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
          component: () => import('pages/settings/companies/EditCompany.vue'),
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
      component: () => import('pages/settings/personal-settings/Index.vue'),
      meta: {
        label: 'Personal Settings',
      },
      children: [
        {
          path: '',
          component: () =>
            import('pages/settings/personal-settings/AllPersonalSettings.vue'),
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
            import('pages/settings/personal-settings/ChangeMyPassword.vue'),
          name: 'change_my_password',
          meta: {
            label: 'Change My Password',
          },
        },
      ],
    },
  ],
};
