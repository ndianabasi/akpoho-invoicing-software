/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { CountriesStatesStateInterface /* Users */ } from './state';
import { api as $http } from '../../boot/http';
import { HttpResponse } from '../types';

const actions: ActionTree<CountriesStatesStateInterface, StateInterface> = {
  async FETCH_COUNTRIES_FOR_SELECT({ commit }) {
    return new Promise(async (resolve) => {
      await $http
        .get('/countries/countries-for-select')
        .then((res: HttpResponse) => {
          commit('SET_COUNTRIES_FOR_SELECT', res.data.data);

          resolve(res.data);
        });
    });
  },

  async FETCH_COUNTRY_STATES_FOR_SELECT(
    { commit },
    { countryId }: { countryId: string }
  ) {
    return new Promise(async (resolve) => {
      await $http
        .get(`/countries/${countryId}/states-for-select`)
        .then((res: HttpResponse) => {
          commit('SET_COUNTRY_STATES_FOR_SELECT', res.data.data);

          resolve(res.data);
        });
    });
  },
};

export default actions;
