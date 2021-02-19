import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { MenusStateInterface } from './state';

export type MenusGetterInterface = GetterTree<
  MenusStateInterface,
  StateInterface
>;

const getters: MenusGetterInterface = {
  GET_CREATE_MENU: (state: MenusStateInterface) => state.createMenu,
  GET_LINKS1: (state: MenusStateInterface) => state.links1,
  GET_LINKS2: (state: MenusStateInterface) => state.links2,
  GET_LINKS3: (state: MenusStateInterface) => state.links3,
};

export default getters;
