<template>
  <q-toolbar
    :class="{ AIS__toolbar: true, dark: isDarkModeActive }"
    style="height: 64px"
  >
    <q-btn
      flat
      dense
      round
      aria-label="Menu"
      icon="menu"
      class="q-mx-md"
      @click="SHOW_LEFT_DRAWER"
    />

    <router-link class="cursor-point no-underline" :to="{ name: 'Dashboard' }"
      ><q-toolbar-title
        v-if="$q.screen.gt.sm"
        shrink
        class="row items-center no-wrap"
      >
        <!-- <img
            src="https://cdn.quasar.dev/img/layout-gallery/logo-google.svg"
          /> -->
        <span class="q-ml-sm">Akpoho</span>
      </q-toolbar-title></router-link
    >

    <q-space />

    <q-input
      v-model="search"
      class="AIS__toolbar-input"
      dense
      standout="bg-primary"
      placeholder="Search"
      aria-autocomplete="off"
      autocomplete="off"
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

    <create-menu v-if="$q.screen.gt.sm" />

    <q-space />

    <div class="q-gutter-sm row items-center no-wrap">
      <q-btn round dense flat color="grey-8" icon="notifications">
        <q-badge color="red" text-color="white" floating> 2 </q-badge>
        <q-tooltip v-if="$q.screen.gt.xs">Notifications</q-tooltip>
        <q-menu :fit="$q.screen.lt.md">
          <q-list bordered class="rounded-borders" style="max-width: 95vw">
            <q-item-label header>Notifications</q-item-label>

            <q-item v-ripple clickable>
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

            <q-item v-ripple clickable>
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
        <q-avatar
          v-bind="
            userHasProfilePicture
              ? {}
              : { color: 'accent', textColor: 'grey-3' }
          "
          size="26px"
        >
          <img v-if="userHasProfilePicture" :src="userHasProfilePicture" />
          <template v-else>
            {{ getUserInitials }}
          </template>
        </q-avatar>
        <q-tooltip v-if="$q.screen.gt.xs">Account</q-tooltip>
        <q-menu>
          <div class="row no-wrap q-py-md" style="min-width: 200px">
            <div class="col-12 column items-center q-px-md">
              <q-avatar
                v-bind="
                  userHasProfilePicture
                    ? {}
                    : { color: 'accent', textColor: 'grey-3' }
                "
                size="72px"
              >
                <img
                  v-if="userHasProfilePicture"
                  :src="userHasProfilePicture"
                />
                <template v-else>
                  {{ getUserInitials }}
                </template>
              </q-avatar>

              <div class="text-subtitle1 text-center q-mt-md q-mb-xs">
                {{ userFullName }}
                <q-badge align="middle">{{ authRole }}</q-badge
                ><br /><span class="text-caption text-weight-light">{{
                  userSummary.email
                }}</span>
              </div>

              <q-btn
                v-close-popup
                label="Logout"
                push
                size="sm"
                class="logout-btn"
                @click.prevent="handleLogout"
              />

              <q-list class="q-mt-md">
                <q-item v-ripple clickable :to="{ name: 'all_settings' }">
                  <q-item-section avatar>
                    <q-icon name="settings" />
                  </q-item-section>

                  <q-item-section>Settings</q-item-section>
                </q-item>

                <q-item v-ripple clickable @click.prevent="toggleDarkMode">
                  <q-item-section avatar>
                    <q-icon
                      :name="
                        isDarkModeActive ? 'brightness_low' : 'brightness_2'
                      "
                    />
                  </q-item-section>

                  <q-item-section
                    >Switch to
                    {{
                      isDarkModeActive ? 'Bright Mode' : 'Dark Moe'
                    }}</q-item-section
                  >
                </q-item>

                <q-item v-ripple clickable @click="link = 'help'">
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
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import CreateMenu from './CreateMenu.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
  UserProfileSummary,
  StringIDNameInterface,
} from '../store/types/index';
import { $dark } from '../composables/useDarkMode';

export default defineComponent({
  name: 'PrimaryToolbar',
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

  setup(props, ctx) {
    const store = useStore();
    const leftDrawerOpen = ref(false);
    const link = ref('');
    const search = ref('');
    const router = useRouter();
    const emit = ctx.emit;

    const { toggleDarkMode, isDarkModeActive } = $dark;

    const SHOW_LEFT_DRAWER = () => {
      leftDrawerOpen.value = true;
      emit('update:leftDrawerOpen', leftDrawerOpen);
    };

    const handleLogout = function () {
      void store
        .dispatch('auth/LOGOUT_USER')
        .then(() => router.push({ name: 'Login' }))
        .catch(() => {
          void router.push({ name: 'Login' });
        });
    };

    const userProfile = store.getters[
      'auth/GET_USER_PROFILE'
    ] as UserProfileSummary;

    const userSummary = store.getters[
      'auth/GET_USER_SUMMARY'
    ] as UserProfileSummary;

    const userHasProfilePicture = computed(
      () => store.getters['auth/GET_AUTH_USER_PROFILE_PICTURE'] as string
    );

    const authRole = store.getters[
      'auth/GET_AUTH_ROLE'
    ] as StringIDNameInterface['name'];

    const userFullName = `${userProfile.first_name} ${
      userProfile.last_name ? userProfile.last_name : ''
    }`;

    return {
      SHOW_LEFT_DRAWER,
      search,
      handleLogout,
      userProfile: ref(userProfile),
      userFullName: ref(userFullName),
      userSummary: ref(userSummary),
      link,
      authRole: ref(authRole),
      toggleDarkMode,
      isDarkModeActive,
      getUserInitials: computed(() => {
        const [firstName, lastName] = userFullName.split(' ');
        return firstName[0] + lastName?.[0] ?? firstName[1];
      }),
      userHasProfilePicture,
    };
  },
});
</script>
