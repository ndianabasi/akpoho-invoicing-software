/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionContext, ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { QuasarTableStateInterface, DataRows } from './state';
import { api as $http } from '../../boot/http';
import { HttpResponse, HttpError, StringIDNameInterface } from '../types';
import { RequestParams } from '../../types/table';

export interface QuasarTableActionsContract
  extends ActionTree<QuasarTableStateInterface, StateInterface> {
  FETCH_TABLE_DATA: (
    ctx: ActionContext<QuasarTableStateInterface, StateInterface>,
    payload: {
      requestParams: RequestParams;
      entityEndPoint: string;
      queryObject: { [index: string]: string };
    }
  ) => Promise<unknown>;
}

const actions: QuasarTableActionsContract = {
  async FETCH_TABLE_DATA(
    { commit, rootGetters },
    { requestParams, entityEndPoint, queryObject }
  ) {
    return new Promise(async (resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const currentCompany = rootGetters[
        'auth/GET_CURRENT_COMPANY'
      ] as StringIDNameInterface;

      commit('SET_TABLE_DATA', []);

      await $http
        .get(`/${currentCompany.id}/${entityEndPoint}`, {
          params:
            requestParams && queryObject
              ? { ...requestParams, ...queryObject }
              : {},
        })
        .then((res: HttpResponse) => {
          commit(
            'SET_TABLE_DATA',
            (res.data.data?.data as DataRows) ?? res.data.data
          );

          resolve(res.data);
        })
        .catch((error: HttpError) => {
          reject(error);
        });
    });
  },
};

export default actions;
