/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { CountriesStatesStateInterface /* Users */ } from './state';
import { api as $http } from '../../boot/http';
import { HttpResponse, StringIDNameInterface } from '../types';

const actions: ActionTree<CountriesStatesStateInterface, StateInterface> = {
  async FETCH_COUNTRIES_STATES_FOR_SELECT(
    { commit, rootGetters },
    { userId }: { userId: string }
  ) {
    return new Promise(async (resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const currentCompany = rootGetters[
        'auth/GET_CURRENT_COMPANY'
      ] as StringIDNameInterface;

      await $http
        .get(`/${currentCompany.id}/users/${userId}`)
        .then((res: HttpResponse) => {
          commit('SET_COUNTRIES_STATES_FOR_SELECT', res.data.data);

          resolve(res.data);
        });
    });
  },
};

export default actions;
