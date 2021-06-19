/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionContext, ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { QuasarTableStateInterface, DataRows } from './state';
import { api as $http } from '../../boot/http';
import { HttpResponse, HttpError } from '../types';
import { PaginationParams } from '../../types/table';

export interface QuasarTableActionsContract
  extends ActionTree<QuasarTableStateInterface, StateInterface> {
  FETCH_TABLE_DATA: (
    ctx: ActionContext<QuasarTableStateInterface, StateInterface>,
    payload: {
      paginationParams: PaginationParams;
      entityEndPoint: string;
      queryObject: { [index: string]: string };
    }
  ) => Promise<unknown>;
}

const actions: QuasarTableActionsContract = {
  async FETCH_TABLE_DATA(
    { commit },
    { paginationParams, entityEndPoint, queryObject }
  ) {
    return new Promise(async (resolve, reject) => {
      commit('SET_TABLE_DATA', []);

      await $http
        .get(`${entityEndPoint}`, {
          params:
            paginationParams && queryObject
              ? { ...paginationParams, ...queryObject }
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
