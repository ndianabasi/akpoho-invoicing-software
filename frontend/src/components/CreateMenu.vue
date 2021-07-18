<template>
  <q-btn
    flat
    dense
    no-wrap
    icon="add"
    no-caps
    :label="$q.screen.gt.md ? 'Create' : ''"
    class="q-ml-sm q-px-md primary-toolbar-create-btn"
  >
    <q-menu>
      <q-list class="text-grey-8" style="min-width: 100px">
        <q-item
          v-for="menu in createMenu"
          :key="menu.title"
          v-close-popup
          clickable
          aria-hidden="true"
          :to="{ name: menu.link }"
        >
          <q-item-section avatar>
            <q-icon :name="menu.icon" />
          </q-item-section>
          <q-item-section>New {{ menu.title }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<script lang="ts">
import { defineComponent } from 'vue';
import { createMenu } from '../composables/menus/useMenu';

export default defineComponent({
  name: 'CreateMenu',
  props: {
    /* routes: {
      type: Array,
      required: true,
    }, */
  },
  setup(/* props */) {
    return {
      createMenu,
    };
  },
});
</script>
