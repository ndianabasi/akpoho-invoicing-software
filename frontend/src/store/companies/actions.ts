/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { CompanyStateInterface } from './state';
import { api as $http } from '../../boot/http';
import { HttpResponse, HttpError, CompanyFormShape } from '../types';
import { PaginationParams } from '../../types/table';
import { Notify } from 'quasar';

const actions: ActionTree<CompanyStateInterface, StateInterface> = {
  async FETCH_ALL_COMPANIES({ commit }, requestParams: PaginationParams) {
    return new Promise(async (resolve, reject) => {
      await $http
        .get('/companies', {
          params: requestParams ? requestParams : {},
        })
        .then((res: HttpResponse) => {
          commit('SET_ALL_COMPANIES', res.data.data);

          return resolve(res.data);
        })
        .catch((error: HttpError) => {
          Notify.create({
            message:
              error?.response?.data?.message ?? 'An unknown error occurred!',
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

          return reject(error);
        });
    });
  },

  async DELETE_COMPANY(ctx, ID: string) {
    return new Promise(async (resolve, reject) => {
      await $http
        .delete(`/companies/${ID}`)
        .then((res: HttpResponse) => {
          return resolve(res.data);
        })
        .catch((error: HttpError) => {
          return reject(error);
        });
    });
  },

  async FETCH_CURRENTLY_VIEWED_COMPANY(
    { commit },
    { companyId }: { companyId: string }
  ) {
    return new Promise(async (resolve) => {
      await $http.get(`/companies/${companyId}`).then((res: HttpResponse) => {
        commit('SET_CURRENTLY_VIEWED_COMPANY', res.data.data);

        resolve(res.data);
      });
    });
  },

  async CREATE_COMPANY(ctx, form: CompanyFormShape) {
    return new Promise(async (resolve, reject) => {
      await $http
        .post('/companies', { ...form })
        .then((res: HttpResponse) => {
          Notify.create({
            message: 'Company was successfully created',
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

  async EDIT_COMPANY(
    ctx,
    { companyId, form }: { companyId: string; form: CompanyFormShape }
  ) {
    return new Promise(async (resolve, reject) => {
      await $http
        .patch(`/companies/${companyId}`, { ...form })
        .then((res: HttpResponse) => {
          Notify.create({
            message: 'Company was successfully edited',
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

  async FETCH_COMPANY_SIZES_FOR_SELECT({ commit }) {
    return new Promise(async (resolve) => {
      await $http
        .get('/company-sizes/company-sizes-for-select')
        .then((res: HttpResponse) => {
          commit('SET_COMPANY_SIZES_FOR_SELECT', res.data.data);

          resolve(res.data);
        });
    });
  },
};

export default actions;
