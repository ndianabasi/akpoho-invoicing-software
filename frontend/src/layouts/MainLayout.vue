<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<template>
  <q-layout v-scroll="onScroll" view="lHh Lpr fff" class="bg-grey-1">
    <q-header reveal elevated class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="AGIS__toolbar" style="height: 64px">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mx-md"
        />

        <q-toolbar-title
          v-if="$q.screen.gt.sm"
          shrink
          class="row items-center no-wrap"
        >
          <img
            src="https://cdn.quasar.dev/img/layout-gallery/logo-google.svg"
          />
          <span class="q-ml-sm">Photos</span>
        </q-toolbar-title>

        <q-space />

        <q-input
          class="AGIS__toolbar-input"
          dense
          standout="bg-primary"
          v-model="search"
          placeholder="Search"
        >
          <!-- eslint-disable-next-line vue/v-slot-style -->
          <template v-slot:prepend>
            <q-icon v-if="search === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="search = ''"
            />
          </template>
        </q-input>

        <create-menu />

        <q-btn
          v-if="$q.screen.gt.xs"
          flat
          dense
          no-wrap
          color="primary"
          icon="cloud_upload"
          no-caps
          label="Upload"
          class="q-ml-sm q-px-md"
        />

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="text-grey-7" icon="apps">
            <q-tooltip>Google Apps</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating> 2 </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      behavior="mobile"
      @click="leftDrawerOpen = false"
    >
      <q-scroll-area class="fit">
        <q-toolbar class="AGIS__toolbar">
          <q-toolbar-title class="row items-center text-grey-8">
            <img
              class="q-pl-md"
              src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
            />
            <span class="q-ml-sm">Photos</span>
          </q-toolbar-title>
        </q-toolbar>

        <q-list padding>
          <q-item
            v-for="link in links1"
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

          <q-separator class="q-my-md" />

          <q-item
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
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller>

    <q-page-sticky expand position="top" style="z-index: 10">
      <secondary-top-toolbar />
    </q-page-sticky>

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

    <q-page-container class="AGIS__page-container q-mt-xl q-mx-lg">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<script lang="ts">
//import EssentialLink from '../components/EssentialLink.vue';
import { useStore } from 'vuex';
import { defineComponent, ref, onMounted, computed, Ref } from 'vue';
import CreateMenu from '../components/CreateMenu.vue';
import { debounce } from 'quasar';
import SecondaryTopToolbar from '../components/SecondaryTopToolbar.vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    CreateMenu,
    SecondaryTopToolbar,
  },

  setup() {
    const store = useStore();
    const leftDrawerOpen = ref(false);
    const search = ref('');
    const storage = ref(0.26);

    let breadcrumbsRoutes;
    let scrollDirection: Ref<string> = ref('');

    const scrollPosition: Array<number> = [];
    function onScroll(position: number) {
      scrollPosition.push(position);
      console.log('scrolling', scrollPosition);
      const currentPosition = scrollPosition[scrollPosition.length - 1];
      const previousPosition = scrollPosition[scrollPosition.length - 2];
      console.log(
        'currentPosition: ',
        currentPosition,
        'previousPosition: ',
        previousPosition
      );

      scrollDirection.value =
        currentPosition - previousPosition || 0 >= 0 ? 'downwards' : 'upwards';

      console.log('scrollDirection', scrollDirection.value);
    }

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

    return {
      links1: computed(() => store.getters['menus/GET_LINKS1']),
      links2: computed(() => store.getters['menus/GET_LINKS2']),
      links3: computed(() => store.getters['menus/GET_LINKS3']),
      leftDrawerOpen,
      search,
      storage,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      breadcrumbsRoutes,
      onScroll: debounce(onScroll, 100),
      scrollDirection,
    };
  },
});
</script>

<style lang="sass">
.AGIS
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
