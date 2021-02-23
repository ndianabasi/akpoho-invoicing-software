<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions v-if="!dismissed" class="bg-primary text-white">
        Unfortunately, the credit card did not go through, please try again.
        <template #action>
          <q-btn
            @click="dismissed = !dismissed"
            flat
            color="white"
            title="Dismiss"
            icon="close"
            round
          />
        </template>
      </q-banner>
      <div class="row q-mx-auto justify-center">
        <div class="q-gutter-y-md column q-mt-xl-xl q-mt-sm col-12 col-md-6">
          <form @submit.prevent="submitForm" class="q-pa-md">
            <q-input
              filled
              clearable
              bottom-slots
              v-model="form.first_name"
              label="First Name"
              :dense="dense"
              class="q-mb-md"
            >
              <template #before>
                <q-icon name="person" />
              </template>

              <template #hint> Field hint </template>
              <template #error> Sorry! Invalid input </template>
            </q-input>
            <q-input
              filled
              clearable
              bottom-slots
              v-model="form.middle_name"
              label="Middle Name"
              :dense="dense"
              class="q-mb-md"
            >
              <template #before>
                <q-icon name="person" />
              </template>

              <template #hint> Field hint </template>
              <template #error> Sorry! Invalid input </template>
            </q-input>
            <q-input
              filled
              clearable
              bottom-slots
              v-model="form.last_name"
              label="Last Name"
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
              filled
              v-model="form.company"
              :options="companies"
              label="Company"
              clearable
              bottom-slots
              class="q-mb-md"
              transition-show="scale"
              transition-hide="scale"
              ><template #before>
                <q-icon name="business" />
              </template>

              <template #hint> Field hint </template>
              <template #error> Sorry! Invalid input </template>
            </q-select>

            <template
              v-if="!form.company"
              transition-show="slide-down"
              transition-hide="slide-up"
            >
              <q-input
                filled
                clearable
                bottom-slots
                v-model="form.company_name"
                label="Company Name"
                :dense="dense"
                autogrow
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="business" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-input
                filled
                clearable
                bottom-slots
                v-model="form.company_address"
                label="Company Address"
                :dense="dense"
                type="textarea"
                autogrow
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="business" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-input
                filled
                clearable
                bottom-slots
                v-model="form.company_lga"
                label="Company LGA/County"
                :dense="dense"
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="business" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-input
                filled
                clearable
                bottom-slots
                v-model="form.company_postal_code"
                label="Company Postal Code"
                :dense="dense"
                type="textarea"
                autogrow
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="business" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-select
                filled
                v-model="form.company_country"
                :options="countriesList"
                label="Company Country"
                clearable
                bottom-slots
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
                @update:modelValue="processSelect('company_country', $event)"
                emit-value
                map-options
                ><template #before>
                  <q-icon name="business" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-select>

              <q-select
                filled
                :disable="!form.company_country"
                :placeholder="
                  !form.company_country ? 'Please select the country first' : ''
                "
                v-model="form.company_state"
                :options="
                  form.company_country
                    ? countries[`${form.company_country}`]
                    : []
                "
                label="Company State"
                clearable
                bottom-slots
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
                @update:modelValue="processSelect('company_state', $event)"
                emit-value
                map-options
                ><template #before>
                  <q-icon name="business" />
                </template>

                <template #hint> Field hint </template>
                <template #error> <div>Sorry! Invalid input</div> </template>
              </q-select>
            </template>
          </form>
        </div>
      </div>
      <div class="row justify-center q-mb-xl">
        <q-btn
          @click.prevent="submitForm"
          type="submit"
          :loading="submitting"
          label="Submit"
          class="q-mt-md"
          color="primary"
          icon-right="send"
        >
          <!-- eslint-disable-next-line vue/v-slot-style -->
          <template v-slot:loading>
            <q-spinner-facebook color="white" />
          </template>
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
  name: 'NewCustomer',
  components: {},
  setup() {
    const submitting = ref(false);
    const companies = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'];
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

    function processSelect(field: string, modelValue: string) {
      console.log(field, modelValue);
      if (!modelValue) {
        if (field === 'company_country') form.company_state = '';
      }
    }

    const form = reactive({
      first_name: '',
      last_name: '',
      middle_name: '',
      company: null,
      company_name: '',
      company_address: '',
      company_lga: '',
      company_postal_code: '',
      company_state: '',
      company_country: '',
    });

    return {
      ph: ref(''),
      dense: ref(false),
      dismissed: ref(false),
      submitting,
      form,
      submitForm,
      processSelect,
      companies,
      countries,
      countriesList,
    };
  },
});
</script>
