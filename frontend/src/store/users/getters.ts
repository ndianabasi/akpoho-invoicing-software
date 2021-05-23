import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { UsersStateInterface } from './state';

export type UsersGetterInterface = GetterTree<
  UsersStateInterface,
  StateInterface
>;

const getters: UsersGetterInterface = {
  GET_CURRENTLY_VIEWED_USER: (state: UsersStateInterface) =>
    state.currentlyViewedUser,
};

export default getters;
