<template>
  <q-drawer
    v-model="leftDrawerOpen"
    bordered
    mini
    behavior="mobile"
    :width="300"
    @hide="handleDrawerHide"
  >
    <q-scroll-area class="fit">
      <q-toolbar class="AIS__toolbar">
        <q-toolbar-title class="row items-center">
          <!-- <img
              class="q-pl-md"
              src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
            /> -->
          <span class="q-ml-sm">Akpoho Invoicing Software</span>
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
        <template v-if="mainSideDrawerMenu && !!mainSideDrawerMenu.length">
          <template v-for="link in mainSideDrawerMenu">
            <q-item
              v-if="!link.subMenu"
              :key="link.title"
              clickable
              :to="{ name: link.link }"
              class="AIS__drawer-item"
              active-class="AIS__drawer-item__active"
            >
              <q-item-section avatar>
                <q-icon :name="link.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ link.title }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-expansion-item
              v-else
              :key="link.title"
              group="side_drawer_group"
              :icon="link.icon"
              :label="link.title"
              header-class="AIS__drawer-item AIS__drawer-expansion-header"
              active-class="AIS__drawer-item__active"
            >
              <q-list class="AIS__drawer-expansion-list">
                <q-item
                  v-for="subMenu in link.subMenu"
                  :key="'submenu_' + subMenu.title"
                  v-ripple
                  :to="{ name: subMenu.link }"
                  class="AIS__drawer-item subitem"
                  active-class="AIS__drawer-item__active"
                >
                  <q-item-section avatar>
                    <q-icon :name="subMenu.icon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ subMenu.title }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </template>
        </template>

        <template v-if="sideDrawerFooterMenu && !!sideDrawerFooterMenu.length">
          <q-separator inset class="q-my-md" />
          <q-item
            v-for="link in sideDrawerFooterMenu"
            :key="link.title"
            clickable
            class="AIS__drawer-item"
            :to="{ name: link.link }"
            active-class="AIS__drawer-item__active"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <template v-if="sideDrawerBottomMenu && !!sideDrawerBottomMenu.length">
          <q-separator class="q-my-md" />
          <q-item
            v-for="link in sideDrawerBottomMenu"
            :key="link.title"
            clickable
            class="AIS__drawer-item"
            :to="{ name: link.link }"
            active-class="AIS__drawer-item__active"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<script lang="ts">
import { defineComponent, computed, ref, watch, Ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { SelectOption, StringIDNameInterface } from '../store/types';
import {
  mainSideDrawerMenu,
  sideDrawerFooterMenu,
  sideDrawerBottomMenu,
} from '../composables/menus/useMenu';

export default defineComponent({
  name: 'SideDrawer',
  components: {},
  props: {
    isOpen: {
      type: Boolean,
      default: () => false,
      required: true,
    },
  },
  emits: ['drawer-hidden'],
  setup(props, ctx) {
    const store = useStore();

    const selectedCompany: Ref<SelectOption | null> = ref(null);
    let currentCompany: Ref<StringIDNameInterface | null> = ref(null);
    currentCompany = computed(
      () => store.getters['auth/GET_CURRENT_COMPANY'] as StringIDNameInterface
    );

    let companies: Ref<SelectOption[]> = ref([]);
    watch(
      () => store.getters['auth/GET_USER_COMPANIES'] as StringIDNameInterface[],
      (newCompanies) => {
        // Unwrap the proxy
        newCompanies = [...newCompanies];

        if (!newCompanies.length) {
          store.commit('auth/SET_CURRENT_COMPANY', []);
          return;
        }

        companies.value = newCompanies.map((company) => ({
          label: company.name,
          value: company.id,
        }));

        currentCompany.value = {
          name: newCompanies?.[0].name,
          id: newCompanies?.[0].id,
        };

        if (currentCompany.value) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          selectedCompany.value = {
            label: currentCompany.value.name,
            value: currentCompany.value.id,
          };

          store.commit('auth/SET_CURRENT_COMPANY', selectedCompany.value);
        } else {
          if (companies.value && companies.value.length) {
            selectedCompany.value = companies.value?.[0];
            store.commit('auth/SET_CURRENT_COMPANY', selectedCompany.value);
          }
        }
      },
      { deep: true }
    );

    watch(
      () => props.isOpen,
      (isOpen) => (leftDrawerOpen.value = isOpen)
    );

    watchEffect(
      () => store.getters['auth/GET_USER_COMPANIES'] as StringIDNameInterface[],
      { flush: 'pre' }
    );

    const leftDrawerOpen = ref(false);

    const TOGGLE_LEFT_DRAWER = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const handleSelectedCompanyUpdate = (event: SelectOption) => {
      store.commit('auth/SET_CURRENT_COMPANY', event);
    };

    return {
      mainSideDrawerMenu,
      sideDrawerFooterMenu,
      sideDrawerBottomMenu,
      TOGGLE_LEFT_DRAWER,
      leftDrawerOpen,
      selectedCompany,
      userCompanies: companies,
      handleSelectedCompanyUpdate,
      handleDrawerHide: () => ctx.emit('drawer-hidden'),
    };
  },
});
</script>
