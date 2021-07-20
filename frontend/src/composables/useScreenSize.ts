/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { computed } from 'vue';
import { Screen } from 'quasar';

export default computed(() => ({
  ltMd: Screen.lt.md,
  isSmall: Screen.name === 'sm',
}));
