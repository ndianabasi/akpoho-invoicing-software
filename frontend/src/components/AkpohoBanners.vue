<template>
  <div class="q-pa-md q-gutter-sm">
    <q-banner
      v-if="numberOfBanners"
      :dense="$q.screen.lt.md"
      :inline-actions="!$q.screen.lt.sm"
      rounded
      :class="{
        'bg-warning': currentBanner.type === 'warning',
        'bg-positive': currentBanner.type === 'positive',
        'bg-negative': currentBanner.type === 'negative',
        'bg-info': currentBanner.type === 'info',
        'text-white': true,
      }"
    >
      <q-avatar
        size="1.75rem"
        color="info"
        text-color="white"
        class="q-mr-md-md q-mr-sm-sm"
        >{{ numberOfBanners }}</q-avatar
      >
      {{ currentBanner.message }}

      <template #action>
        <q-btn
          v-if="currentBanner.action?.label ?? false"
          color="white"
          flat
          :label="currentBanner.action?.label ?? ''"
        />
        <q-btn v-if="currentBanner.dismissible" flat round icon="close" />

        <q-btn-group flat round>
          <q-btn
            flat
            round
            icon="navigate_before"
            @click.prevent="showPrevBanner"
          />
          <q-btn
            flat
            round
            icon="navigate_next"
            @click.prevent="showNextBanner"
          />
        </q-btn-group>
        <div>{{ currentBannerIndex + 1 }}/{{ numberOfBanners }}</div>
      </template>
    </q-banner>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { Banner } from '../store/banners/getters';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'AkpohoBanners',
  props: {
    /* routes: {
      type: Array,
      required: true,
    }, */
  },
  setup(/* props */) {
    const store = useStore();
    const route = useRoute();

    const currentRouteName = route.name;

    const currentBannerIndex = ref(0);
    const banners = computed(() => {
      const allVisibleBanners = store.getters[
        'banners/GET_VISIBLE_BANNERS'
      ] as Banner[];
      const bannersForCurrentRoute = allVisibleBanners.filter((banner) => {
        if (banner.visibleOnRoutes === 'all') return true;
        if (Array.isArray(banner.visibleOnRoutes))
          return banner.visibleOnRoutes.some(
            (routeName) => routeName === currentRouteName
          );
        return false;
      });

      return bannersForCurrentRoute;
    });
    const numberOfBanners = computed(() => banners.value.length);
    const currentBanner = computed(
      () => banners.value[currentBannerIndex.value]
    );

    return {
      currentBanner,
      currentBannerIndex,
      numberOfBanners,
      showNextBanner: () => {
        if (currentBannerIndex.value === numberOfBanners.value - 1) return;
        currentBannerIndex.value++;
      },
      showPrevBanner: () => {
        if (currentBannerIndex.value === 0) return;
        currentBannerIndex.value--;
      },
    };
  },
});
</script>