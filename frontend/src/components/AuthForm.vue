<!-- eslint-disable vue/v-slot-style -->
<template>
  <q-card class="container row flex-center AIS__auth_pages__container">
    <div :class="columnClasses">
      <q-card
        class="
          auth-form-card
          text-white
          q-pa-lg-md q-pa-sm-sm q-mx-sm-md q-mx-xs-sm q-my-lg
        "
      >
        <q-card-section>
          <p class="form-logo">Akpoho Invoicing Software</p>
          <span class="form-title q-mb-md q-pb-md">
            <slot name="formTitle"></slot
            ><q-btn flat round @click.prevent="toggleDarkMode">
              <q-icon
                :name="isDarkModeActive ? 'brightness_low' : 'brightness_2'"
              />
              <q-tooltip
                >Switch to
                {{ isDarkModeActive ? 'Light Mode' : 'Dark Mode' }}</q-tooltip
              >
            </q-btn>
          </span>

          <slot
            name="formSection"
            v-bind="{ isSmallScreen: isSmallScreen }"
          ></slot>

          <slot
            name="submitSection"
            v-bind="{ isSmallScreen: isSmallScreen }"
          ></slot>

          <div class="text-center q-py-lg text-white form-footer">
            <slot name="formFooterLink"></slot>
            <div class="form-footer-extras column">
              <slot
                name="formFooterExtras"
                v-bind="{
                  googleClientIdExist,
                  GOOGLE_OAUTH_CLIENT_ID,
                  GOOGLE_SIGN_IN,
                }"
              ></slot>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-card>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { $dark } from '../composables/useDarkMode';
//const strongPassword = helpers.regex('strongPassword', //)

export default defineComponent({
  name: 'AuthForm',
  components: {},
  props: {
    columnClasses: {
      type: [String, Array],
      default: () => 'col-md-6 col-sm-8 col-xs-12 col-lg-4 col-xl-3',
      required: false,
    },
  },
  setup() {
    const $q = useQuasar();
    const { toggleDarkMode, isDarkModeActive } = $dark;

    const isSmallScreen = computed(() => {
      return $q.screen.lt.sm;
    });

    const GOOGLE_OAUTH_CLIENT_ID = ref(process.env.GOOGLE_OAUTH_CLIENT_ID);
    const googleClientIdExist = computed(() => !!GOOGLE_OAUTH_CLIENT_ID.value);

    const ENABLE_GOOGLE_SIGN_IN = ref(process.env.ENABLE_GOOGLE_SIGN_IN);
    const GOOGLE_SIGN_IN = computed(
      () =>
        ENABLE_GOOGLE_SIGN_IN.value && ENABLE_GOOGLE_SIGN_IN.value === 'true'
    );

    if (GOOGLE_SIGN_IN.value && googleClientIdExist) {
      const googleSignInScript = document.createElement('script');
      googleSignInScript.setAttribute(
        'src',
        'https://accounts.google.com/gsi/client'
      );
      googleSignInScript.setAttribute('async', 'true');
      googleSignInScript.setAttribute('defer', 'true');
      document.head.appendChild(googleSignInScript);
    }

    return {
      isSmallScreen,
      googleClientIdExist,
      GOOGLE_OAUTH_CLIENT_ID,
      GOOGLE_SIGN_IN,
      toggleDarkMode,
      isDarkModeActive,
    };
  },
});
</script>

<style lang="scss" scoped>
.form-logo {
  font-size: 2rem;
  display: flex;
  text-align: center;
  display: block;
  text-transform: uppercase;
  margin: 10px auto;
}

.form-title {
  font-size: 1.2rem;
  line-height: 1.2;
  text-align: center;
  display: block;
}

.q-card.container {
  width: 100vw;
  min-height: 100vh;
  overflow-y: auto;
}
</style>

<style lang="sass" scoped>
@media (max-width: $breakpoint-xs-max)
  .form-logo
    font-size: 1.4rem
  .form-title
    font-size: 1rem
</style>

<style lang="scss" scoped>
.form-footer {
  a {
    text-decoration: none;
    &:hover {
      border-bottom: 1px dotted $purple-10;
      padding-bottom: 2px;
    }
  }
}

.half-width {
  min-width: 50% !important;
}

.form-footer-extras {
  margin-top: 1.5rem;
  .col {
    margin-top: 0.5rem;
  }
}

.auth-form-card {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
