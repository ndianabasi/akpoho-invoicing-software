<!-- eslint-disable vue/v-slot-style -->
<template>
  <div class="row q-mx-auto justify-center items-center container">
    <div
      class="q-gutter-y-md column q-mt-xl-xl q-mt-sm col-12 col-md-4 col-sm-10 col-xs-12 col-lg-4 col-xl-3"
    >
      <q-card
        class="my-card text-white"
        style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
      >
        <q-card-section>
          <form class="form validate-form">
            <span class="form-logo">
              <q-img
                :src="'https://placeimg.com/500/300/nature'"
                spinner-color="white"
                style="height: 100px; max-width: 150px"
              />
            </span>
            <span class="form-title q-mb-md q-pb-md"> Log in </span>
            <q-input
              dark
              bottom-slots
              v-model="form.username"
              label="Username"
              color="white"
              label-color="white"
              bg-color="transparent"
            >
              <template v-slot:hint> Field hint </template>
            </q-input>
            <q-input
              dark
              bottom-slots
              v-model="form.password"
              label="Password"
              type="password"
              color="white"
              label-color="white"
              bg-color="transparent"
              class="q-mt-md"
            >
              <template v-slot:hint> Field hint </template>
            </q-input>
            <div class="q-gutter-sm q-mt-lg">
              <q-checkbox v-model="form.remember_me" label="Remember me" />
            </div>
            <div class="q-gutter-sm flex justify-center q-mt-md">
              <q-btn color="accent" icon-right="send" label="Submit" />
            </div>

            <div class="text-center q-py-lg text-white">
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
import { defineComponent, reactive, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';

export default defineComponent({
  name: 'NewCustomer',
  components: {},
  setup() {
    const submitting = ref(false);
    const companies = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'];
    const titles = ['Mr', 'Mrs', 'Miss', 'Dr', 'Prof', 'Chief', 'Sir'];
    const countriesList = ref([
      { value: 'google', label: 'Google' },
      { value: 'facebook', label: 'Facebook' },
      { value: 'twitter', label: 'Twitter' },
      { value: 'apple', label: 'Apple' },
      { value: 'oracle', label: 'Oracle' },
    ]);

    const countries_ = {};
    countriesList.value.forEach((country) => {
      Object.defineProperty(countries_, country.value, {
        value: [
          { value: 'google', label: 'Google' },
          { value: 'facebook', label: 'Facebook' },
          { value: 'twitter', label: 'Twitter' },
          { value: 'apple', label: 'Apple' },
          { value: 'oracle', label: 'Oracle' },
        ],
        writable: true,
      });
    });

    const countries = reactive(countries_);

    function submitForm() {
      submitting.value = true;

      // Simulating a delay here.
      // When we are done, we reset "submitting"
      // Boolean to false to restore the
      // initial state.
      setTimeout(() => {
        // delay simulated, we are done,
        // now restoring submit to its initial state
        submitting.value = false;
      }, 3000);
    }

    const form = reactive({
      remember_me: false,
      email: '',
      password: '',
    });

    const rules = {
      email: { email, required },
      password: { required },
    };

    const v$ = useVuelidate(rules, form);

    return {
      ph: ref(''),
      dense: ref(false),
      dismissed: ref(false),
      submitting,
      form,
      submitForm,
      companies,
      countries,
      countriesList,
      v$,
      titles,
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
    background-color: rgba(255, 255, 255, 0.9);
  }
}

.form-logo {
  font-size: 60px;
  color: #333333;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.form-title {
  font-size: 30px;
  color: #fff;
  line-height: 1.2;
  text-align: center;
  display: block;
}
</style>
