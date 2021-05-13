import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { MenusStateInterface } from './state';

export type MenusGettersInterface = GetterTree<
  MenusStateInterface,
  StateInterface
>;

const getters: MenusGettersInterface = {
  GET_CREATE_MENU: (state: MenusStateInterface) => state.createMenu,
  GET_LINKS1: (state: MenusStateInterface) => state.links1,
  GET_LINKS2: (state: MenusStateInterface) => state.links2,
  GET_LINKS3: (state: MenusStateInterface) => state.links3,
  GET_LEFT_DRAWER_OPEN: (state: MenusStateInterface) => state.leftDrawerOpen,
};

export default getters;
