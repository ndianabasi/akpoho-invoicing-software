<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<template>
  <q-layout
    :view="$q.screen.lt.md ? 'lHh Lpr fFf' : 'lHh Lpr fff'"
    class="AIS__Layout"
  >
    <q-header reveal elevated class="bg-white text-grey-8" height-hint="64">
      <primary-toolbar @update:leftDrawerOpen="TOGGLE_LEFT_DRAWER($event)" />
    </q-header>

    <side-drawer v-model="leftDrawerOpen" />

    <go-to-top />

    <secondary-toolbar />

    <sticky-sidebar />

    <q-page-container class="AIS__page-container q-my-xl q-mx-sm-xs q-mx-lg-md">
      <akpoho-banners />

      <router-view />
    </q-page-container>

    <q-footer
      v-if="$q.screen.lt.md && links1 && !!links1.length"
      elevated
      class="footer"
    >
      <q-tabs :dense="$q.screen.lt.sm" mobile-arrows align="justify">
        <q-route-tab
          v-for="link in firstTwoLinks"
          :key="link.title"
          :icon="link.icon"
          :to="{ name: link.link }"
          :label="link.title"
        />
        <q-btn
          class="column flex-center"
          align="center"
          flat
          @click="showCreateSheet"
        >
          <q-icon class="col block" center name="add_circle_outline" />
          <div class="col block">New</div></q-btn
        >
        <q-route-tab
          v-for="link in lastTwoLinks"
          :key="link.title"
          :icon="link.icon"
          :to="{ name: link.link }"
          :label="link.title"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<script lang="ts">
//import EssentialLink from '../components/EssentialLink.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  watchEffect,
  onBeforeUnmount,
} from 'vue';
import SecondaryToolbar from '../components/SecondaryToolbar.vue';
import StickySidebar from '../components/StickySidebar.vue';
import GoToTop from '../components/GoToTop.vue';
import SideDrawer from '../components/SideDrawer.vue';
import PrimaryToolbar from '../components/PrimaryToolbar.vue';
import AkpohoBanners from '../components/AkpohoBanners.vue';
import { useMeta, useQuasar } from 'quasar';
import { Menu } from '../store/menus/state';

const metaData = {
  // sets document title
  title: 'Index Page',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => `${title} - Akpoho Invoicing Software`,

  // meta tags
  meta: {
    description: {
      name: 'description',
      content:
        'Akpoho Invoicing Software is an open-source software which provides quotation, invoicing, and receipt functionalities for small businesses.',
    },
    keywords: {
      name: 'keywords',
      content:
        'invoice software, invoicing software, Akpoho Invoicing Software, invoice',
    },
    equiv: {
      'http-equiv': 'Content-Type',
      content: 'text/html; charset=UTF-8',
    },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogTitle: {
      name: 'og:title',
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template(ogTitle: string) {
        return `${ogTitle} - Akpoho Invoicing Software`;
      },
    },
  },

  // CSS tags
  link: {
    material: {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
    },
  },

  // JS tags
  script: {
    ldJson: {
      type: 'application/ld+json',
      innerHTML: '{ "@context": "http://schema.org" }',
    },
  },

  // <html> attributes
  htmlAttr: {
    'xmlns:cc': 'http://creativecommons.org/ns#', // generates <html xmlns:cc="http://creativecommons.org/ns#">,
  },

  // <body> attributes
  bodyAttr: {},

  // <noscript> tags
  noscript: {
    default: 'This is content for browsers with no JS (or disabled JS)',
  },
};

export default defineComponent({
  name: 'MainLayout',

  components: {
    SecondaryToolbar,
    StickySidebar,
    GoToTop,
    SideDrawer,
    PrimaryToolbar,
    AkpohoBanners,
  },

  setup() {
    const $q = useQuasar();
    const router = useRouter();
    useMeta(metaData);
    const store = useStore();

    const search = ref('');
    const storage = ref(0.26);

    const leftDrawerOpen = ref(false);

    let breadcrumbsRoutes;

    watchEffect(() => void store.dispatch('auth/FETCH_AUTH_PROFILE'));

    watchEffect(
      () => void store.dispatch('permissions/FETCH_USER_PERMISSIONS')
    );

    watchEffect(() => void store.dispatch('roles/FETCH_GLOBAL_ROLES'));

    onMounted(() => {
      window.addEventListener('offline', () => {
        store.commit('SET_OFFLINE', true);
      });

      window.addEventListener('online', () => {
        store.commit('SET_OFFLINE', false);
      });
    });

    onBeforeUnmount(() => {
      window.removeEventListener('offline', () => {
        store.commit('SET_OFFLINE', true);
      });

      window.removeEventListener('online', () => {
        store.commit('SET_OFFLINE', false);
      });
    });

    const TOGGLE_LEFT_DRAWER = (payload: boolean) => {
      if (payload) {
        leftDrawerOpen.value = payload;
        return;
      }
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const links1 = computed(
      () => store.getters['menus/GET_LINKS1'] as Array<Menu>
    );
    const links2 = computed(
      () => store.getters['menus/GET_LINKS2'] as Array<Menu>
    );
    const links3 = computed(
      () => store.getters['menus/GET_LINKS3'] as Array<Menu>
    );

    const createMenu = computed(
      () => store.getters['menus/GET_CREATE_MENU'] as Array<Menu>
    );

    const bottomSheetActions = createMenu.value.map((link) => ({
      label: link.title,
      icon: link.icon,
      link: link.link,
    }));

    const showCreateSheet = (grid: boolean) => {
      $q.bottomSheet({
        message: 'Create',
        grid,
        actions: bottomSheetActions,
      }).onOk((action: { label: string }) => {
        const selectedLink = bottomSheetActions.filter(
          (link) =>
            link.label.trim().toLowerCase() === action.label.toLowerCase()
        )[0];
        void router.push({ name: selectedLink.link });
      });
    };

    return {
      links1,
      links2,
      links3,
      firstTwoLinks: links1.value.filter((_, index) => index < 2),
      lastTwoLinks: links1.value.filter(
        (_, index, array) => index >= array.length - 2
      ),
      TOGGLE_LEFT_DRAWER,
      search,
      storage,
      breadcrumbsRoutes,
      mobileData: ref(true),
      bluetooth: ref(false),
      leftDrawerOpen,
      showCreateSheet,
    };
  },
});
</script>

<style lang="sass">
.AIS
  &__toolbar
    height: 64px
  &__toolbar-input
    width: 35%
  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px
    .q-item__section--avatar
      padding-left: 12px
      .q-icon
        color: #5f6368
    .q-item__label:not(.q-item__label--caption)
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem
    &--storage
      border-radius: 0
      margin-right: 0
      padding-top: 24px
      padding-bottom: 24px
  &__side-btn
    &__label
      font-size: 12px
      line-height: 24px
      letter-spacing: .01785714em
      font-weight: 500
  @media (min-width: 1024px)
    &__page-container
      padding-left: 94px
</style>
