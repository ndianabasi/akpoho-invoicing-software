/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';
import { apiNoAuth as $httpNoAuth } from '../../boot/httpNoAuth';
import { api as $http } from '../../boot/http';
import { Notify } from 'quasar';
import { LoginHttpResponse, HttpError, HttpResponse } from '../types';

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  LOGIN_USER({ commit }, form) {
    return new Promise(async (resolve, reject) => {
      await $httpNoAuth
        .post('/auth/login', form)
        .then((res: LoginHttpResponse & HttpResponse) => {
          const data = res.data;
          const token = data.token;
          const userData = data.data;
          commit('SET_TOKEN', token);
          commit('SET_USER_DATA', userData);

          Notify.create({
            message: data?.message,
            type: 'positive',
            position: 'top',
            progress: true,
            timeout: 2000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });

          resolve(res.data);
        })
        .catch((error: HttpError) => {
          reject(error);
        });
    });
  },

  LOGOUT_USER({ commit }) {
    commit('LOGOUT_USER');

    return new Promise(async (resolve, reject) => {
      await $http
        .post('/auth/logout')
        .then((res: LoginHttpResponse) => {
          Notify.create({
            message: 'You have been logged out!',
            type: 'positive',
            position: 'top',
            progress: true,
            timeout: 2000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });

          resolve(res.data);
        })
        .catch((error: HttpError) => {
          reject(error);
        });
    });
  },

  FETCH_AUTH_PROFILE({ commit }, form) {
    return new Promise(async (resolve, reject) => {
      await $http
        .get('/auth/profile', form)
        .then((res: LoginHttpResponse) => {
          commit('SET_USER_DATA', res.data.data);
          resolve(res.data);
        })
        .catch((error: HttpError) => {
          reject(error);
        });
    });
  },

  REQUEST_PASSWORD_RESET(_, form: { email: string }) {
    return new Promise(async (resolve, reject) => {
      await $httpNoAuth
        .post('/auth/request-password-reset', { ...form })
        .then((res: LoginHttpResponse & HttpResponse) => {
          Notify.create({
            message: 'Password-reset email was sent',
            type: 'positive',
            position: 'top',
            progress: true,
            timeout: 2000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });

          return resolve(res.data);
        })
        .catch((error: HttpError) => {
          return reject(error);
        });
    });
  },

  VERIFY_PASSWORD_RESET(_, key: string) {
    return new Promise(async (resolve, reject) => {
      console.log(key);

      await $httpNoAuth
        .post('/auth/verify-password-reset', { key })
        .then((res: LoginHttpResponse & HttpResponse) => {
          Notify.create({
            message: 'Verified. Please reset your password!',
            type: 'positive',
            position: 'top',
            progress: true,
            timeout: 5000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });

          return resolve(res.data.data);
        })
        .catch((error: HttpError) => {
          return reject(error);
        });
    });
  },

  RESET_PASSWORD(
    { commit },
    form: { email: string; newPassword: string; confirmNewPassword: string }
  ) {
    return new Promise(async (resolve, reject) => {
      console.log(form);

      await $httpNoAuth
        .post('/auth/reset-password', { ...form })
        .then((res: LoginHttpResponse & HttpResponse) => {
          const data = res.data;
          const token = data.token;
          const userData = data.data;
          commit('SET_TOKEN', token);
          commit('SET_USER_DATA', userData);

          Notify.create({
            message: data?.message,
            type: 'positive',
            position: 'top',
            progress: true,
            timeout: 2000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });

          return resolve(res.data.data);
        })
        .catch((error: HttpError) => {
          return reject(error);
        });
    });
  },
};

export default actions;
