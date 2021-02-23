<template>
  <q-btn
    flat
    dense
    no-wrap
    color="primary"
    icon="add"
    no-caps
    :label="$q.screen.gt.md ? 'Create' : ''"
    class="q-ml-sm q-px-md"
  >
    <q-menu>
      <q-list class="text-grey-8" style="min-width: 100px">
        <q-item aria-hidden="true">
          <q-item-section
            class="text-uppercase text-grey-7"
            style="font-size: 0.7rem"
            >Create New</q-item-section
          >
        </q-item>
        <q-item
          v-for="menu in createMenu"
          :key="menu.title"
          clickable
          v-close-popup
          aria-hidden="true"
          :to="{ name: menu.link }"
        >
          <q-item-section avatar>
            <q-icon :name="menu.icon" />
          </q-item-section>
          <q-item-section>{{ menu.title }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'CreateMenu',
  props: {
    /* routes: {
      type: Array,
      required: true,
    }, */
  },
  setup(/* props */) {
    const store = useStore();
    return {
      createMenu: computed(() => store.getters['menus/GET_CREATE_MENU']),
    };
  },
});
</script>
