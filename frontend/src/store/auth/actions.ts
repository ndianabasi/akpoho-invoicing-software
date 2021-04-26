/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';
//import {AuthGettersInterface} from './getters'
import { api as $httpNoAuth } from '../../boot/httpNoAuth';
import { AxiosResponse, AxiosError } from 'axios';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';
const router = useRouter();

type LoginResponseData = {
  message: string;
  token: unknown;
  data: unknown;
  status: number;
  statusText: string;
};

interface HttpResponse extends AxiosResponse {
  data: LoginResponseData;
}

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  LOGIN_USER({ commit }, form) {
    return new Promise(async (resolve, reject) => {
      await $httpNoAuth
        .post('login', form)
        .then((res: HttpResponse) => {
          console.log(res.data);
          const data = res.data;

          const token = data.token;
          commit('SET_TOKEN', token);

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
        .catch((error: AxiosError) => {
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
    void router.push({ name: 'Login' });
  },
};

export default actions;
