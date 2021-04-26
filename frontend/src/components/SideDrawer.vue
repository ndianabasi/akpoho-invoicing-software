<template>
  <q-drawer
    v-model="leftDrawerOpen"
    bordered
    mini
    behavior="mobile"
    @click="TOGGLE_LEFT_DRAWER()"
    @input="TOGGLE_LEFT_DRAWER()"
  >
    <q-scroll-area class="fit">
      <q-toolbar class="AGIS__toolbar">
        <q-toolbar-title class="row items-center text-grey-8">
          <!-- <img
              class="q-pl-md"
              src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
            /> -->
          <span class="q-ml-sm">Agboho</span>
        </q-toolbar-title>
      </q-toolbar>

      <q-select
        class="q-mx-md"
        filled
        v-model="model"
        :options="options"
        label="Choose Company"
        color="teal"
        clearable
        options-selected-class="text-deep-orange"
      >
        <template #option="scope">
          <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
            <q-item-section avatar>
              <q-icon :name="scope.opt.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label v-html="scope.opt.label" />
              <q-item-label caption>{{ scope.opt.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-list padding>
        <template v-if="links1 && links1.length">
          <q-item
            v-for="link in links1"
            :key="link.title"
            clickable
            class="AGIS__drawer-item"
            :to="{ name: link.link }"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <template v-if="links2 && links2.length">
          <q-separator class="q-my-md" />
          <q-item
            v-for="link in links2"
            :key="link.title"
            clickable
            class="AGIS__drawer-item"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <template v-if="links3 && links3.length">
          <q-separator class="q-my-md" />
          <q-item
            v-for="link in links3"
            :key="link.title"
            clickable
            class="AGIS__drawer-item"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <!--<q-separator class="q-my-md" /> <q-item
            clickable
            class="AGIS__drawer-item AGIS__drawer-item--storage"
          >
            <q-item-section avatar>
              <q-icon name="cloud" />
            </q-item-section>
            <q-item-section top>
              <q-item-label>Storage</q-item-label>
              <q-linear-progress :value="storage" class="q-my-sm" />
              <q-item-label caption>2.6 GB of 15 GB</q-item-label>
            </q-item-section>
          </q-item> -->
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'SideDrawer',
  components: {},
  props: {
    /* routes: {
      type: Array,
      required: true,
    }, */
  },
  setup(/* props */) {
    const store = useStore();

    const options = ref([
      {
        label: 'Google',
        value: 'Google',
        description: 'Search engine',
        icon: 'mail',
      },
      {
        label: 'Facebook',
        value: 'Facebook',
        description: 'Social media',
        icon: 'bluetooth',
      },
      {
        label: 'Twitter',
        value: 'Twitter',
        description: 'Quick updates',
        icon: 'map',
      },
      {
        label: 'Apple',
        value: 'Apple',
        description: 'iStuff',
        icon: 'golf_course',
      },
      {
        label: 'Oracle',
        value: 'Oracle',
        disable: true,
        description: 'Databases',
        icon: 'casino',
      },
    ]);

    //const leftDrawerOpen = unref(GET_LEFT_DRAWER_OPEN) as boolean;
    const leftDrawerOpen = ref(false);

    const TOGGLE_LEFT_DRAWER = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    /* watch(
      () => leftDrawerOpen,
      () => {
        store.commit('menus/TOGGLE_LEFT_DRAWER');
      }
    ); */

    return {
      links1: computed(() => store.getters['menus/GET_LINKS1']),
      links2: computed(() => store.getters['menus/GET_LINKS2']),
      links3: computed(() => store.getters['menus/GET_LINKS3']),
      TOGGLE_LEFT_DRAWER,
      leftDrawerOpen,
      model: ref(null),
      options,
    };
  },
});
</script>
