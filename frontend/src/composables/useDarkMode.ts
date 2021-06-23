/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { watch, ref } from 'vue';
import { store } from '../store';
import { Dark } from 'quasar';

export const $dark = {
  toggleDarkMode: function () {
    Dark.toggle();
    store.commit('SET_DARK_MODE', Dark.isActive);
  },
  isDarkModeActive: ref(false),
};

watch(
  () => store.getters.GET_DARK_MODE as boolean,
  (value) => {
    $dark.isDarkModeActive.value = value;
  }
);
