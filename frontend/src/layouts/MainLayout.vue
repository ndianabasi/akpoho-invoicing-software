<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<template>
  <q-layout view="lHh Lpr fff" class="AIS__Layout">
    <q-header reveal elevated class="bg-white text-grey-8" height-hint="64">
      <primary-toolbar @update:leftDrawerOpen="TOGGLE_LEFT_DRAWER($event)" />
    </q-header>

    <side-drawer v-model="leftDrawerOpen" />

    <go-to-top />

    <secondary-toolbar />

    <sticky-sidebar />

    <q-page-container class="AIS__page-container q-my-xl q-mx-lg">
      <transition
        appear
        enter-active-class="animated slide-right"
        leave-active-class="animated slide-left"
        :duration="{ enter: 500, leave: 800 }"
      >
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<script lang="ts">
//import EssentialLink from '../components/EssentialLink.vue';
import { useStore } from 'vuex';
import { defineComponent, ref, onMounted, computed, watchEffect } from 'vue';
import SecondaryToolbar from '../components/SecondaryToolbar.vue';
import StickySidebar from '../components/StickySidebar.vue';
import GoToTop from '../components/GoToTop.vue';
import SideDrawer from '../components/SideDrawer.vue';
import PrimaryToolbar from '../components/PrimaryToolbar.vue';
import { useMeta } from 'quasar';

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
  },

  setup() {
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

    onMounted(() => {
      /* console.log('route matched', route.matched);
      const matchedRoutes = route.matched;
      breadcrumbsRoutes = computed(() => {
        return matchedRoutes.map((route) => ({
          meta: route.meta,
          path: route.path,
          name: route.name,
        }));
      });
      console.log('breadcrumbsRoutes', breadcrumbsRoutes.value); */
    });

    const TOGGLE_LEFT_DRAWER = (payload: boolean) => {
      if (payload) {
        leftDrawerOpen.value = payload;
        return;
      }
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    return {
      links1: computed(() => store.getters['menus/GET_LINKS1']),
      links2: computed(() => store.getters['menus/GET_LINKS2']),
      links3: computed(() => store.getters['menus/GET_LINKS3']),
      TOGGLE_LEFT_DRAWER,
      search,
      storage,
      breadcrumbsRoutes,
      mobileData: ref(true),
      bluetooth: ref(false),
      leftDrawerOpen,
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
