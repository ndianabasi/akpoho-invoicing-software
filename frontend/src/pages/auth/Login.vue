<!-- eslint-disable vue/v-slot-style -->
<template>
  <auth-form class="AIS__login-page">
    <template #formTitle> Log into your account </template>

    <template #formSection="{ isSmallScreen }">
      <q-expansion-item
        v-if="isDemoMode && demoCredentials"
        :dense="isSmallScreen"
        :dense-toggle="isSmallScreen"
        expand-separator
        icon="security"
        label="Demo Credentials"
        class="q-mb-md demo-credentials"
        header-class="demo-credentials-header"
        expand-icon-class="demo-credentials-icon"
        :dark="$q.dark"
      >
        <q-card>
          <q-card-section>
            <q-list bordered padding class="no-border">
              <q-item
                v-for="(value, key) of demoCredentials"
                :key="'demo_' + key"
              >
                <q-item-section>
                  <q-item-label class="text-uppercase" lines="1">{{
                    key
                  }}</q-item-label>
                  <q-item-label caption>{{ value }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn
                    flat
                    ripple
                    round
                    label="use"
                    color="green"
                    @click.prevent="useCredential(value)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <form class="form validate-form" @submit.prevent="handleLogin">
        <q-input
          v-model="form.email"
          :dense="isSmallScreen"
          filled
          bottom-slots
          clearable
          type="email"
          aria-autocomplete="email"
          autocomplete="email"
          :error="form$.email.$invalid"
          label="Email"
          autofocus
        >
          <template v-slot:hint> </template>
          <template v-slot:error>
            {{
              form$.email.$silentErrors
                .map((error) => error.$message)
                .join(', ')
            }}
          </template>
        </q-input>
        <q-input
          v-if="!isDemoMode"
          v-model="form.password"
          :dense="isSmallScreen"
          filled
          bottom-slots
          counter
          clearable
          aria-autocomplete="current-password"
          autocomplete="current-password"
          :error="form$.password.$invalid"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          class="q-mt-md"
        >
          <template v-slot:hint> </template>
          <template v-slot:error>
            {{
              form$.password.$silentErrors
                .map((error) => error.$message)
                .join(', ')
            }}
          </template>
          <template v-slot:append>
            <q-icon
              v-if="form.password"
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
      </form>
    </template>

    <template #submitSection="{ isSmallScreen }">
      <q-btn
        :loading="submitting"
        :class="{
          'full-width': isSmallScreen,
          'text-center flex align-center q-mt-lg q-mx-auto q-px-xl half-width': true,
        }"
        color="accent"
        icon-right="send"
        label="Submit"
        @click.prevent="handleLogin"
      >
        <template v-slot:loading> Logging In... </template>
      </q-btn>
    </template>

    <template #formFooterLink>
      <span>
        <router-link :to="{ name: 'Register' }">Register</router-link>
        /
        <router-link :to="{ name: 'forgot_password' }"
          >Forgot Password?
        </router-link>
      </span>
    </template>

    <template
      #formFooterExtras="{
        googleClientIdExist,
        GOOGLE_OAUTH_CLIENT_ID,
        GOOGLE_SIGN_IN,
      }"
    >
      <template v-if="googleClientIdExist && GOOGLE_SIGN_IN">
        <div
          id="g_id_onload"
          :data-client_id="GOOGLE_OAUTH_CLIENT_ID"
          data-context="signin"
          data-ux_mode="popup"
          data-callback="handleCredentialResponse"
          data-nonce=""
          data-auto_prompt="false"
        ></div>

        <div
          class="g_id_signin q-mx-auto"
          data-type="standard"
          data-shape="rectangular"
          data-theme="outline"
          data-text="continue_with"
          data-size="large"
          data-logo_alignment="left"
        ></div>
      </template>

      <!-- <div class="col items-center">
        <q-btn color="blue-6" icon-right="send" label="Log in with Twitter" />
      </div>
      <div class="col items-center">
        <q-btn color="blue-10" icon-right="send" label="Log in with Facebook" />
      </div> -->
    </template>
  </auth-form>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  nextTick,
  Ref,
  watchEffect,
  onBeforeUnmount,
  computed,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import {
  required,
  email,
  minLength,
  helpers,
  maxLength,
  requiredIf,
} from '@vuelidate/validators';
import { useStore } from 'vuex';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';
import AuthForm from '../../components/AuthForm.vue';

type DemoCredentials = {
  admin: string;
  editor: string;
  staff: string;
};

export default defineComponent({
  name: 'Login',
  components: { AuthForm },
  setup() {
    const submitting = ref(false);
    const store = useStore();
    const router = useRouter();
    const demoCredentials: Ref<DemoCredentials | null> = ref(null);

    const isDemoMode = computed(() => process.env.DEMO_MODE === 'true');

    const form = isDemoMode.value
      ? reactive({
          email: '',
        })
      : reactive({
          email: '',
          password: '',
        });

    type MinMaxParams = {
      $params: {
        min?: number;
        max?: number;
      };
    };

    const rules = {
      email: {
        email: helpers.withMessage('Provide a valid email address.', email),
        required: helpers.withMessage('Email address is required.', required),
      },
      password: {
        required: helpers.withMessage(
          'Password is required.',
          requiredIf(() => !isDemoMode.value)
        ),
        minLength: helpers.withMessage(
          ({ $params }: MinMaxParams) =>
            `Password should maximum of ${$params.min} character`,
          minLength(6)
        ),
        maxLength: helpers.withMessage(
          ({ $params }: MinMaxParams) =>
            `Password should maximum of ${$params.max} character`,
          maxLength(32)
        ),
      },
    };

    const form$: Ref<{ $invalid: boolean }> = useVuelidate(rules, form);

    async function handleLogin() {
      if (!form$.value.$invalid) {
        submitting.value = true;

        await nextTick(() => {
          void store
            .dispatch('auth/LOGIN_USER', form)
            .then(() => {
              submitting.value = false;
              void nextTick(() => {
                const isLoggedIn = store.getters['auth/isLoggedIn'] as boolean;

                if (isLoggedIn) {
                  void router.push({ name: 'Dashboard' });
                }
              });
            })
            .catch(() => {
              submitting.value = false;
            });
        });
      } else {
        Notify.create({
          message: 'Errors exist on the form!',
          type: 'negative',
          position: 'bottom',
          progress: true,
          timeout: 2500,
          actions: [
            {
              label: 'Dismiss',
              color: 'white',
            },
          ],
        });
      }
    }

    const handleCredentialResponse = function (response: unknown) {
      console.log(response);
    };

    const stopFetchDemoLoginCredentials = watchEffect(() => {
      if (isDemoMode.value) {
        void store
          .dispatch('auth/FETCH_DEMO_LOGIN_CREDENTIALS')
          .then((credentials: DemoCredentials) => {
            demoCredentials.value = credentials;
          });
      }
    });

    onBeforeUnmount(() => {
      stopFetchDemoLoginCredentials();
    });

    return {
      dismissed: ref(false),
      submitting,
      form,
      handleLogin,
      form$,
      showPassword: ref(false),
      handleCredentialResponse,
      demoCredentials,
      isDemoMode,
      useCredential: (email: typeof form['email']) => (form.email = email),
    };
  },
});
</script>

<style lang="scss" scoped></style>
