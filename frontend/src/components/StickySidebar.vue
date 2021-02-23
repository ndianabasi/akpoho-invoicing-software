<template>
  <q-page-sticky v-if="$q.screen.gt.sm" expand position="left">
    <div class="fit q-pt-xl q-px-sm column">
      <q-btn
        v-for="item in links1"
        :key="`links1_${item.title}`"
        :to="{ name: item.link }"
        round
        flat
        color="grey-8"
        stack
        no-caps
        size="26px"
        class="AGIS__side-btn"
      >
        <q-icon size="22px" :name="item.icon" />
        <div class="AGIS__side-btn__label">{{ item.title }}</div>
      </q-btn>
    </div>
  </q-page-sticky>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'StickySidebar',
  components: {},
  props: {
    /* routes: {
      type: Array,
      required: true,
    }, */
  },
  setup(/* props */) {
    const store = useStore();

    return {
      links1: computed(() => store.getters['menus/GET_LINKS1']),
    };
  },
});
</script>
