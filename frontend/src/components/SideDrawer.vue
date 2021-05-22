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
        v-model="selectedCompany"
        class="q-mx-md"
        filled
        :options="userCompanies"
        label="Choose Company"
        color="teal"
        clearable
        options-selected-class="text-deep-orange"
        @update:model-value="handleSelectedCompanyUpdate"
      >
        <template #option="scope">
          <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
            <q-item-section>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <q-item-label v-html="scope.opt.label" />
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

        <template v-if="links3 && links3.length">
          <q-separator class="q-my-md" />
          <q-item
            v-for="link in links3"
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
import { SelectOption, StringIDNameInterface } from '../store/types';

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

    const selectedCompany = ref({ label: '', value: '' });
    const currentCompany = computed(
      () => store.getters['auth/GET_CURRENT_COMPANY'] as StringIDNameInterface
    );

    const userCompanies = store.getters[
      'auth/GET_USER_COMPANIES'
    ] as StringIDNameInterface[];
    const companies = userCompanies.map((company) => ({
      label: company.name,
      value: company.id,
    }));

    if (currentCompany.value) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      selectedCompany.value = {
        label: currentCompany.value.name,
        value: currentCompany.value.id,
      };
    } else if (companies.length === 1) {
      selectedCompany.value = companies[0];
      store.commit('auth/SET_CURRENT_COMPANY', selectedCompany.value);
    } else {
      selectedCompany.value = companies[0];
      store.commit('auth/SET_CURRENT_COMPANY', selectedCompany.value);
    }

    //const leftDrawerOpen = unref(GET_LEFT_DRAWER_OPEN) as boolean;
    const leftDrawerOpen = ref(false);

    const TOGGLE_LEFT_DRAWER = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const handleSelectedCompanyUpdate = (event: SelectOption) => {
      store.commit('auth/SET_CURRENT_COMPANY', event);
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
      selectedCompany,
      userCompanies: ref(companies),
      handleSelectedCompanyUpdate,
    };
  },
});
</script>
