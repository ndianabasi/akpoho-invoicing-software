<!-- eslint-disable vue/v-slot-style -->
<template>
  <div class="row q-mx-auto justify-center items-center container">
    <div
      class="
        q-gutter-y-md
        column
        q-mt-xl-xl q-mt-sm
        col-md-4 col-sm-12 col-xs-12 col-lg-4 col-xl-3
      "
    >
      <q-card class="login-card text-white q-pa-lg">
        <q-card-section>
          <form class="form validate-form" @submit.prevent="handleLogin">
            <span class="form-logo">
              <p class="text-center">Akpoho Invoicing Software</p>
              <!-- <q-img
                :src="'https://placeimg.com/1000/800/nature'"
                spinner-color="white"
                style="height: 100px; max-width: 150px"
              /> -->
            </span>
            <span class="form-title q-mb-md q-pb-md"> Log In </span>
            <q-input
              v-model="form.email"
              dark
              bottom-slots
              clearable
              :error="form$.email.$invalid"
              label="Email"
              color="white"
              label-color="white"
              bg-color="transparent"
              autofocus
            >
              <template v-slot:hint> Field hint </template>
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
              dark
              bottom-slots
              counter
              clearable
              :error="form$.password.$invalid"
              label="Password"
              type="password"
              color="white"
              label-color="white"
              bg-color="transparent"
              class="q-mt-md"
            >
              <template v-slot:hint> Field hint </template>
              <template v-slot:error>
                {{
                  form$.password.$silentErrors
                    .map((error) => error.$message)
                    .join(', ')
                }}
              </template>
            </q-input>
            <div class="q-gutter-sm q-mt-lg">
              <q-checkbox
                v-model="form.remember_me"
                color="green"
                label="Remember me"
              />
            </div>
            <div class="q-gutter-sm flex justify-center q-mt-md">
              <q-btn
                :loading="submitting"
                color="accent"
                icon-right="send"
                label="Submit"
                @click.prevent="handleLogin"
              >
                <template v-slot:loading> Logging In... </template>
              </q-btn>
            </div>

            <div class="text-center q-py-lg text-white form-footer">
              <router-link class="text-white" to="#"
                >Forgot Password?
              </router-link>
            </div>
          </form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import { defineComponent, reactive, ref, nextTick } from 'vue';
import useVuelidate from '@vuelidate/core';
import {
  required,
  email,
  minLength,
  helpers,
  maxLength,
} from '@vuelidate/validators';
import { useStore } from 'vuex';
//import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
//const strongPassword = helpers.regex('strongPassword', //)

export default defineComponent({
  name: 'Login',
  components: {},
  setup() {
    const submitting = ref(false);
    const store = useStore();
    const router = useRouter();

    const form = reactive({
      remember_me: false,
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

    const form$ = useVuelidate(rules, form);

    async function handleLogin() {
      console.log('handling login');
      submitting.value = true;

      await nextTick(() => {
        void store
          .dispatch('auth/LOGIN_USER', form)
          .catch(() => {
            submitting.value = false;
          })
          .then(() => {
            submitting.value = false;
            void nextTick(() => {
              const isLoggedIn = store.getters['auth/isLoggedIn'] as boolean;
              console.log(isLoggedIn);

              if (isLoggedIn) {
                void router.push({ name: 'Home' });
              }
            });
          });
      });
    }

    return {
      ph: ref(''),
      dense: ref(false),
      dismissed: ref(false),
      submitting,
      form,
      handleLogin,
      form$,
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background: url('/cosmic-blue.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    display: block;
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.5);
  }
}

.form-logo {
  font-size: 30px;
  color: white;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  margin: 0 auto;
}

.form-title {
  font-size: 20px;
  color: #fff;
  line-height: 1.2;
  text-align: center;
  display: block;
}

.login-card {
  background: -webkit-linear-gradient(to top, #7579ff 10%, #b224ef 60%);
  background: -o-linear-gradient(to top, #7579ff 10%, #b224ef 60%);
  background: -moz-linear-gradient(to top, #7579ff 10%, #b224ef 60%);
  background: linear-gradient(to top, #7579ff 10%, #b224ef 60%);
}

.form-footer a {
  text-decoration: none;
  &:hover {
    border-bottom: 1px dotted white;
    padding-bottom: 2px;
  }
}
</style>
