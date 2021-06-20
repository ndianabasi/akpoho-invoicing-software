<template>
  <q-page-sticky
    v-if="$q.screen.gt.sm"
    expand
    position="left"
    class="sticky-sidebar"
  >
    <div class="fit q-pt-xl q-px-sm column">
      <q-list>
        <q-item
          v-for="item in links1"
          :key="`links1_${item.title}`"
          :to="{ name: item.link }"
          active-class="AIS__sticky-sidebar-item__active"
          class="AIS__sticky-sidebar-item"
        >
          <q-btn round flat stack no-caps size="26px" class="AIS__side-btn">
            <q-icon size="22px" :name="item.icon" />
            <q-item-label class="AIS__side-btn__label">{{
              item.title
            }}</q-item-label>
          </q-btn>
        </q-item>
      </q-list>
    </div>
  </q-page-sticky>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'StickySidebar',
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

    const isActive = (link: string) => link === route.name;

    return {
      links1: computed(() => store.getters['menus/GET_LINKS1']),
      isActive,
    };
  },
});
</script>
