/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';

export interface AuthGettersInterface {
  getToken: (state: AuthStateInterface) => string;
  isLoggedIn: (state: AuthStateInterface) => boolean;
}

const getters: GetterTree<AuthStateInterface, StateInterface> = {
  getToken(state: AuthStateInterface) {
    return state.token;
  },

  isLoggedIn: (state) => {
    return !!state.token;
  },
  GET_USER_COMPANIES: (state) => state.userCompanies,
  GET_CURRENT_COMPANY: (state) => state.currentCompany,
  GET_USER_PROFILE: (state) => state.userProfile,
  GET_USER_SUMMARY: (state) => state.userSummary,
  GET_USER_ID: (state) => state.userSummary?.id,
  GET_AUTH_ROLE: (state) => state.authRole?.name,
  GET_AUTH_USER_EMAIL: (state) => state.userSummary?.email,
  IS_EMAIL_VERIFIED: (state) => state.userSummary?.is_email_verified,
  IS_GLOBAL_USER: (state, getters, rootState, rootGetters) => {
    const globalRoles: string[] = rootGetters['roles/GET_GLOBAL_ROLES'];
    const authRole: string = getters.GET_AUTH_ROLE;
    return authRole && globalRoles && !!globalRoles.length
      ? globalRoles.some((role: string) => role === authRole)
      : false;
  },
  GET_AUTH_USER_PROFILE_PICTURE: (state, getters, rootState, rootGetters) => {
    const rootUrl = rootGetters['getRootURL'] as string;
    const profilePictureBase = state.userProfile?.profile_picture;
    const profilePictureFormat = { thumbnail: '', small: '' };

    if (profilePictureBase) {
      profilePictureFormat.thumbnail =
        profilePictureBase?.formats?.thumbnail?.url ??
        profilePictureBase?.formats?.thumbnail?.url ??
        '';

      profilePictureFormat.small =
        profilePictureBase?.formats?.small?.url ??
        profilePictureFormat?.thumbnail ??
        profilePictureBase?.url ??
        '';
    }

    return {
      thumbnail: profilePictureFormat.thumbnail
        ? `${rootUrl}/${profilePictureFormat.thumbnail}`
        : '',
      small: profilePictureFormat.small
        ? `${rootUrl}/${profilePictureFormat.small}`
        : '',
    };
  },
};

export default getters;
