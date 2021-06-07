<!-- eslint-disable vue/v-slot-style -->
<template>
  <auth-form>
    <template #formTitle> Log into your account </template>

    <template #formSection="{ isSmallScreen }">
      <form class="form validate-form" @submit.prevent="handleLogin">
        <q-input
          v-model="form.email"
          :dense="isSmallScreen"
          filled
          bottom-slots
          clearable
          type="email"
          :error="form$.email.$invalid"
          label="Email"
          color="purple-10"
          label-color="purple-10"
          bg-color="purple-1"
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
          v-model="form.password"
          :dense="isSmallScreen"
          filled
          bottom-slots
          counter
          clearable
          :error="form$.password.$invalid"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          color="purple-10"
          label-color="purple-10"
          bg-color="purple-1"
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
      <router-link :to="{ name: 'reset_password' }"
        >Forgot Password?
      </router-link>
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
import { defineComponent, reactive, ref, nextTick, Ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import {
  required,
  email,
  minLength,
  helpers,
  maxLength,
} from '@vuelidate/validators';
import { useStore } from 'vuex';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';
import AuthForm from '../../components/AuthForm.vue';
//const strongPassword = helpers.regex('strongPassword', //)

export default defineComponent({
  name: 'Login',
  components: { AuthForm },
  setup() {
    const submitting = ref(false);
    const store = useStore();
    const router = useRouter();

    const form = reactive({
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
        required: helpers.withMessage('Password is required.', required),
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
      console.log('handling login');
      if (!form$.value.$invalid) {
        submitting.value = true;

        await nextTick(() => {
          void store
            .dispatch('auth/LOGIN_USER', form)
            .then(() => {
              submitting.value = false;
              void nextTick(() => {
                const isLoggedIn = store.getters['auth/isLoggedIn'] as boolean;
                console.log(isLoggedIn);

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

    return {
      dismissed: ref(false),
      submitting,
      form,
      handleLogin,
      form$,
      showPassword: ref(false),
      handleCredentialResponse,
    };
  },
});
</script>

<style lang="scss" scoped></style>
