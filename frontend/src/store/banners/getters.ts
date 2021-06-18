/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { BannerStateInterface } from './state';

export interface Banner {
  id: string;
  message: string;
  type: 'positive' | 'negative' | 'warning' | 'info';
  dismissible: boolean;
  visible: boolean;
  visibleOnRoutes: 'all' | string[];
  action: {
    type: 'navigation' | (() => void);
    label: string;
  } | null;
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
    const IS_EMAIL_VERIFIED = rootGetters['auth/IS_EMAIL_VERIFIED'] as boolean;

    return [
      {
        id: 'offline_notification',
        message:
          'You have lost connection to the internet. This app is offline.',
        type: 'warning',
        dismissible: false,
        action: null,
        visibleOnRoutes: 'all',
        visible: true,
      },
      {
        id: 'new_account_verfication_warning',
        message:
          'You have not verified your email address. Please check your email address or request a new one',
        type: 'warning',
        dismissible: false,
        action: {
          label: 'Request Again',
          type: () => {
            return null;
          },
        },
        visibleOnRoutes: 'all',
        visible: !IS_EMAIL_VERIFIED,
      },
    ];
  },

  GET_VISIBLE_BANNERS: (
    state: BannerStateInterface,
    getters
  ): Array<Banner> => {
    const banners = getters.GET_BANNERS as Array<Banner>;
    return banners.filter((banner) => banner.visible);
  },
};

export default getters;
