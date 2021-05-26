<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-card v-if="user" class="my-card" flat bordered>
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img :src="user.profile.profile_picture" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-h6">{{
                `${user.profile.first_name} ${user.profile.last_name}`
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-card-section>
            <form class="q-pa-md" @submit.prevent="submitForm">
              <q-input
                v-model="v$.email.$model"
                filled
                clearable
                bottom-slots
                label="Email Address"
                :dense="dense"
                class="q-mb-md"
                type="email"
                :error="v$.email.$error"
              >
                <template #before>
                  <q-icon name="email" />
                </template>

                <template #error
                  ><small
                    v-for="(error, index) in v$.email.$errors"
                    :key="'email_error_' + index"
                    >{{ error.$message }}</small
                  ></template
                >
              </q-input>

              <q-select
                v-model="form.role_id"
                filled
                :options="titles"
                label="Role"
                clearable
                bottom-slots
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
                ><template #before>
                  <q-icon name="person" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-select>

              <q-input
                v-for="field in profileTextFields"
                :key="'profileTextField_' + field.name"
                v-model="form[field.name]"
                filled
                clearable
                bottom-slots
                :label="field.label"
                :dense="dense"
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="person" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-select
                v-model="form.country_id"
                filled
                :options="countriesList"
                label="Country"
                clearable
                bottom-slots
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
                emit-value
                map-options
                @update:modelValue="processSelect('country_id', $event)"
                ><template #before>
                  <q-icon name="business" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-select>

              <q-select
                v-model="form.state_id"
                filled
                :disable="!form.country_id"
                :placeholder="
                  !form.company_country ? 'Please select the country first' : ''
                "
                :options="
                  form.company_country ? countries[`${form.country_id}`] : []
                "
                label="State"
                clearable
                bottom-slots
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
                emit-value
                map-options
                @update:modelValue="processSelect('company_state', $event)"
                ><template #before>
                  <q-icon name="business" />
                </template>

                <template #hint> Field hint </template>
                <template #error> <div>Sorry! Invalid input</div> </template>
              </q-select>
            </form>
            <div class="row justify-center q-mb-xl">
              <q-btn
                type="submit"
                :loading="submitting"
                label="Submit"
                class="q-mt-md"
                color="primary"
                icon-right="send"
                @click.prevent="submitForm"
              >
                <!-- eslint-disable-next-line vue/v-slot-style -->
                <template v-slot:loading>
                  <q-spinner-facebook color="white" />
                </template>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import { defineComponent, ref, onBeforeMount, reactive } from 'vue';
import {
  stopFetchCurrentlyViewedUser,
  currentUser,
} from '../../../composables/useFetchCurrentlyViewedUser';
import useVuelidate from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';

export default defineComponent({
  name: 'EditUser',

  props: {
    userId: {
      type: String,
      required: false,
      default: '',
    },
  },

  setup(props) {
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

    const countries_: { [index: string]: typeof countriesList.value } = {};
    countriesList.value.forEach((country) => {
      countries_[country.value] = [
        { value: 'google', label: 'Google' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'twitter', label: 'Twitter' },
        { value: 'apple', label: 'Apple' },
        { value: 'oracle', label: 'Oracle' },
      ];
    });

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

    function processSelect(field: string, modelValue: string) {
      if (!modelValue) {
        if (field === 'role_id') form.value.role_id = '';
        if (field === 'country_id') form.value.country_id = '';
        if (field === 'state_id') form.value.state_id = '';
      }
    }

    const profileTextFields = ref([
      {
        name: 'first_name',
        label: 'First Name',
      },
      {
        name: 'last_name',
        label: 'Last Name',
      },
      {
        name: 'middle_name',
        label: 'Middle Name',
      },
      {
        name: 'phone_number',
        label: 'Phone Number',
      },
      {
        name: 'address',
        label: 'Address',
      },
      {
        name: 'city',
        label: 'City',
      },
    ]);

    const form = ref({
      first_name: currentUser?.value?.profile.first_name,
      last_name: currentUser?.value?.profile.last_name,
      middle_name: currentUser?.value?.profile.middle_name,
      phone_number: currentUser?.value?.profile.phone_number,
      address: currentUser?.value?.profile.address,
      city: currentUser?.value?.profile.city,
      email: currentUser?.value?.email,
      role_id: '',
      state_id: '',
      country_id: '',
    });

    const rules = {
      first_name: { required },
      last_name: { required },
      role_id: { required },
      email: { email, required },
    };

    const v$ = useVuelidate(rules, form);

    onBeforeMount(() => {
      stopFetchCurrentlyViewedUser(props.userId);
    });

    return {
      user: currentUser,
      text: ref(''),
      ph: ref(''),
      dense: ref(false),
      dismissed: ref(false),
      submitting,
      form,
      submitForm,
      processSelect,
      companies,
      countries: ref(countries_),
      countriesList,
      v$,
      titles,
      profileTextFields,
    };
  },
});
</script>
