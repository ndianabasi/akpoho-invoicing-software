/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
//import { UserSummary } from '../types';
import { BannerStateInterface } from './state';

export interface Banner {
  id: string;
  message: string;
  type: 'positive' | 'negative' | 'warning' | 'info';
  dismissible: boolean;
  visible: boolean;
  visibleOnRoutes: 'all' | string[];
  action?:
    | {
        type: 'navigation' | 'function' | 'store_action';
        label: string;
        route?: { name: string; params?: Record<string, string | number> };
        functionName?: (...args: string[]) => void;
        storeAction?: { type: string; payload?: unknown | null };
      }
    | null
    | undefined;
}

export type BannerGettersInterface = GetterTree<
  BannerStateInterface,
  StateInterface
>;

const getters: BannerGettersInterface = {
  GET_BANNERS: (
    state: BannerStateInterface,
    getters,
    rootState,
    rootGetters
  ): Array<Banner> => {
    const IS_APP_OFFLINE = rootGetters['GET_OFFLINE_MODE'] as boolean;
    const IS_EMAIL_VERIFIED = rootGetters['auth/IS_EMAIL_VERIFIED'] as boolean;
    const IS_COMPANY_ADMIN = rootGetters['auth/IS_COMPANY_ADMIN'] as boolean;
    const DOES_USER_HAVE_COMPANIES = rootGetters[
      'auth/DOES_USER_HAVE_COMPANIES'
    ] as boolean;
    /* const authUserEmail = rootGetters[
      'auth/GET_AUTH_USER_EMAIL'
    ] as UserSummary['email']; */

    return [
      {
        id: 'offline_notification',
        message:
          'You have lost connection to the internet. This app is offline.',
        type: 'warning',
        dismissible: false,
        action: null,
        visibleOnRoutes: 'all',
        visible: IS_APP_OFFLINE,
      },
      {
        id: 'new_account_verification_warning',
        message:
          'You have not verified your email address. Please check your email address or request a new one',
        type: 'warning',
        dismissible: false,
        action: {
          label: 'Request Again',
          type: 'store_action',
          storeAction: {
            type: 'auth/REQUEST_EMAIL_VERIFICATION',
            // Payload not necessary as the auth user can be retrieved
            // by the server
          },
        },
        visibleOnRoutes: 'all',
        visible: !IS_EMAIL_VERIFIED,
      },
      {
        id: 'no_company_warning',
        message:
          'You have not created any company yet. Please create one and unleash the full power of the Akpoho Software',
        type: 'warning',
        dismissible: false,
        action: {
          label: 'Create a Company',
          type: 'navigation',
          route: { name: 'add_company' },
        },
        visibleOnRoutes: 'all',
        visible: !DOES_USER_HAVE_COMPANIES && IS_COMPANY_ADMIN,
      },
    ];
  },

  GET_VISIBLE_BANNERS: (
    state: BannerStateInterface,
    getters
  ): Array<Banner> => {
    const banners = getters.GET_BANNERS as Array<Banner>;
    if (banners.length > 0) {
      return banners.filter((banner) => banner?.visible ?? false);
    } else return [];
  },
};

export default getters;
