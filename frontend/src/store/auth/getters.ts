/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';
import { DateTime } from 'luxon';
import MultiFormatPicture from 'src/helpers/MultiFormatPicture';

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
  DOES_USER_HAVE_COMPANIES: (state) => state.userCompanies?.length ?? 0 > 0,
  GET_CURRENT_COMPANY: (state) => state.currentCompany,
  GET_USER_PROFILE: (state) => state.userProfile,
  GET_USER_SUMMARY: (state) => state.userSummary,
  GET_USER_ID: (state) => state.userSummary?.id,
  GET_AUTH_ROLE: (state) => state.authRole?.name,
  IS_COMPANY_ADMIN: (state) => state.authRole?.name === 'CompanyAdmin',
  GET_AUTH_USER_EMAIL: (state) => state.userSummary?.email,
  IS_EMAIL_VERIFIED: (state) => state.userSummary?.is_email_verified,
  IS_GLOBAL_USER: (state, getters, rootState, rootGetters) => {
    const globalRoles: string[] = rootGetters['roles/GET_GLOBAL_ROLES'];
    const authRole: string = getters.GET_AUTH_ROLE;
    return authRole && globalRoles && !!globalRoles.length
      ? globalRoles.some((role: string) => role === authRole)
      : false;
  },
  GET_AUTH_USER_PROFILE_PICTURE: (state): string => {
    const profilePictureBase = state.userProfile?.profile_picture;
    return profilePictureBase
      ? new MultiFormatPicture(profilePictureBase).avatarImageUrl
      : '';
  },
  GET_AUTH_USER_PROFILE_PICTURE_URLS: (state) => {
    const profilePictureBase = state.userProfile?.profile_picture;
    return profilePictureBase
      ? new MultiFormatPicture(profilePictureBase).imageUrls
      : '';
  },
  GET_LAST_PASSWORD_HISTORY: (state) => {
    return state.lastPasswordHistory
      ? DateTime.fromISO(state.lastPasswordHistory).toLocaleString()
      : '';
  },
};

export default getters;
