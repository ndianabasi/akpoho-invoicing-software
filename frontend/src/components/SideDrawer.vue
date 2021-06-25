<template>
  <q-drawer
    v-model="leftDrawerOpen"
    bordered
    mini
    behavior="mobile"
    :width="activeMenu && activeMenu.subMenu ? 600 : 300"
    @click="TOGGLE_LEFT_DRAWER"
    @input="TOGGLE_LEFT_DRAWER"
  >
    <div class="row fit">
      <div class="col">
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
            <template v-if="links1 && !!links1.length">
              <q-item
                v-for="(link, index) in links1"
                :key="link.title"
                clickable
                class="AIS__drawer-item"
                active-class="AIS__drawer-item__active"
                @click.prevent="setActiveLink(index)"
              >
                <q-item-section avatar>
                  <q-icon :name="link.icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ link.title }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>

            <template v-if="links2 && !!links2.length">
              <q-separator inset class="q-my-md" />
              <q-item
                v-for="link in links2"
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

            <template v-if="links3 && !!links3.length">
              <q-separator class="q-my-md" />
              <q-item
                v-for="link in links3"
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

            <!--<q-separator class="q-my-md" />
        <q-item
            clickable
            class="AIS__drawer-item AIS__drawer-item--storage"
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
      </div>
      <q-separator vertical inset />
      <div v-if="activeMenu && activeMenu.subMenu" class="col">
        <q-list>
          <q-item-label class="header text-h5" header>{{
            activeMenu.title
          }}</q-item-label>

          <q-item
            v-for="subMenu in activeMenu.subMenu"
            :key="'submenu_' + subMenu.title"
            v-ripple
            :to="{ name: subMenu.link }"
          >
            <q-item-section>{{ subMenu.title }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-drawer>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<script lang="ts">
import { defineComponent, computed, ref, watch, Ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { SelectOption, StringIDNameInterface } from '../store/types';
import { useRoute, useRouter } from 'vue-router';
import { Menu } from '../store/menus/state';

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
    const route = useRoute();
    const router = useRouter();

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

    watchEffect(
      () => store.getters['auth/GET_USER_COMPANIES'] as StringIDNameInterface[],
      { flush: 'pre' }
    );

    //const leftDrawerOpen = unref(GET_LEFT_DRAWER_OPEN) as boolean;
    const leftDrawerOpen = ref(false);

    const TOGGLE_LEFT_DRAWER = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const handleSelectedCompanyUpdate = (event: SelectOption) => {
      store.commit('auth/SET_CURRENT_COMPANY', event);
    };

    const links1 = computed(() => store.getters['menus/GET_LINKS1'] as Menu[]);
    const links2 = computed(() => store.getters['menus/GET_LINKS2'] as Menu[]);
    const links3 = computed(() => store.getters['menus/GET_LINKS3'] as Menu[]);

    const activeLinkIndex: Ref<number | null> = ref(null);
    const activeMenu: Ref<Menu | null> = ref(null);

    const setActiveLink = function (index: number) {
      activeLinkIndex.value = index;
      activeMenu.value = links1.value[activeLinkIndex.value];
      if (activeMenu.value && activeMenu.value.subMenu) return;
      else void router.push({ name: activeMenu.value?.link });
    };

    return {
      links1,
      links2,
      links3,
      TOGGLE_LEFT_DRAWER,
      leftDrawerOpen,
      selectedCompany,
      userCompanies: companies,
      handleSelectedCompanyUpdate,
      isActive: (link: string) => link === route.name,
      setActiveLink,
      activeMenu,
    };
  },
});
</script>
