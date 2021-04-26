<template>
  <q-toolbar class="AGIS__toolbar" style="height: 64px">
    <q-btn
      flat
      dense
      round
      @click="
        TOGGLE_LEFT_DRAWER();
        $emit('update:leftDrawerOpen', leftDrawerOpen);
      "
      aria-label="Menu"
      icon="menu"
      class="q-mx-md"
    />

    <router-link class="cursor-point no-underline" :to="{ name: 'Home' }"
      ><q-toolbar-title
        v-if="$q.screen.gt.sm"
        shrink
        class="row items-center no-wrap"
      >
        <!-- <img
            src="https://cdn.quasar.dev/img/layout-gallery/logo-google.svg"
          /> -->
        <span class="q-ml-sm">Agboho</span>
      </q-toolbar-title></router-link
    >

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

    <q-space />

    <div class="q-gutter-sm row items-center no-wrap">
      <q-btn round dense flat color="grey-8" icon="notifications">
        <q-badge color="red" text-color="white" floating> 2 </q-badge>
        <q-tooltip v-if="$q.screen.gt.xs">Notifications</q-tooltip>
        <q-menu :fit="$q.screen.lt.md">
          <q-list bordered class="rounded-borders" style="max-width: 95vw">
            <q-item-label header>Notifications</q-item-label>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">Brunch this weekend?</q-item-label>
                <q-item-label caption lines="2">
                  <span class="text-weight-bold">Janet</span>
                  -- I'll be in your neighborhood doing errands this weekend. Do
                  you want to grab brunch?
                </q-item-label>
              </q-item-section>

              <q-item-section side top> 1 min ago </q-item-section>
            </q-item>

            <q-separator inset="item" />

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">Linear Project</q-item-label>
                <q-item-label caption lines="2">
                  <span class="text-weight-bold">John</span>
                  -- Can we schedule a call for tomorrow?
                </q-item-label>
              </q-item-section>

              <q-item-section side top> 1 min ago </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <q-btn round flat>
        <q-avatar size="26px">
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
        <q-tooltip v-if="$q.screen.gt.xs">Account</q-tooltip>
        <q-menu>
          <div class="row no-wrap q-py-md" style="min-width: 200px">
            <div class="col-12 column items-center">
              <q-avatar size="72px">
                <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

              <q-btn
                @click.prevent="handleLogout"
                color="primary"
                label="Logout"
                push
                size="sm"
                v-close-popup
              />

              <q-list class="text-primary q-mt-md">
                <q-item
                  clickable
                  v-ripple
                  :active="link === 'inbox'"
                  @click="link = 'inbox'"
                  active-class="my-menu-link"
                >
                  <q-item-section avatar class="q-pr-none">
                    <q-icon name="inbox" />
                  </q-item-section>

                  <q-item-section>Inbox Inbox Inbox Inbox</q-item-section>
                </q-item>

                <q-item
                  clickable
                  v-ripple
                  :active="link === 'outbox'"
                  @click="link = 'outbox'"
                  active-class="my-menu-link"
                >
                  <q-item-section avatar>
                    <q-icon name="send" />
                  </q-item-section>

                  <q-item-section>Outbox</q-item-section>
                </q-item>

                <q-item
                  clickable
                  v-ripple
                  :active="link === 'trash'"
                  @click="link = 'trash'"
                  active-class="my-menu-link"
                >
                  <q-item-section avatar>
                    <q-icon name="delete" />
                  </q-item-section>

                  <q-item-section>Trash</q-item-section>
                </q-item>

                <q-separator spaced />

                <q-item
                  clickable
                  v-ripple
                  :active="link === 'settings'"
                  @click="link = 'settings'"
                  active-class="my-menu-link"
                >
                  <q-item-section avatar>
                    <q-icon name="settings" />
                  </q-item-section>

                  <q-item-section>Settings</q-item-section>
                </q-item>

                <q-item
                  clickable
                  v-ripple
                  :active="link === 'help'"
                  @click="link = 'help'"
                  active-class="my-menu-link"
                >
                  <q-item-section avatar>
                    <q-icon name="help" />
                  </q-item-section>

                  <q-item-section>Help</q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-menu>
      </q-btn>
    </div>
  </q-toolbar>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-call -->
<script lang="ts">
import { defineComponent, ref } from 'vue';
import CreateMenu from './CreateMenu.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'SecondaryToolbar',
  components: {
    CreateMenu,
  },

  props: {
    /* leftDrawerOpen: {
      type: Boolean,
      required: true,
    }, */
  },

  emits: ['update:leftDrawerOpen'],

  setup(/* props */) {
    const store = useStore();
    const leftDrawerOpen = ref(false);
    const search = ref('');
    const router = useRouter();

    const TOGGLE_LEFT_DRAWER = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const handleLogout = function () {
      void store
        .dispatch('auth/LOGOUT_USER')
        .then(() => router.push({ name: 'Login' }));
    };

    return {
      TOGGLE_LEFT_DRAWER,
      search,
      handleLogout,
    };
  },
});
</script>

<style lang="scss">
.no-underline {
  text-decoration: none;
}
</style>
