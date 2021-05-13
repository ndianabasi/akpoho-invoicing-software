/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';
import { apiNoAuth as $httpNoAuth } from '../../boot/httpNoAuth';
import { api as $http } from '../../boot/http';
import { Notify } from 'quasar';
import { LoginHttpResponse, HttpError } from '../types';

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  LOGIN_USER({ commit }, form) {
    return new Promise(async (resolve, reject) => {
      await $httpNoAuth
        .post('login', form)
        .then((res: LoginHttpResponse) => {
          console.log(res.data);
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
          Notify.create({
            message:
              (error?.response?.data as string) ?? 'An unknown error occurred!',
            type: 'negative',
            position: 'top',
            progress: true,
            timeout: 10000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });

          reject(error);
        });
    });
  },
  LOGOUT_USER({ commit }) {
    commit('LOGOUT_USER');

    return new Promise(async (resolve, reject) => {
      await $http
        .post('logout')
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
          Notify.create({
            message:
              (error?.response?.data as string) ?? 'An unknown error occurred!',
            type: 'negative',
            position: 'top',
            progress: true,
            timeout: 10000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });

          reject(error);
        });
    });
  },
};

export default actions;
