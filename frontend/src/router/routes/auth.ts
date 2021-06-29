export default {
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
};
