<template>
  <auth-form :column-classes="'col-md-6 col-sm-9 col-xs-12 col-lg-6 col-xl-4'">
    <template #formTitle> Create an account </template>

    <template #formSection="{ isSmallScreen }">
      <form class="form validate-form" @submit="onSubmit">
        <template v-for="field in form">
          <q-input
            v-if="field.componentType === 'input' && field.isVisible"
            :key="`field_${field.name}_${field.componentType}`"
            v-model="field.model"
            :type="
              field.inputType !== 'password'
                ? field.inputType
                : revealPasswords[field.name]
                ? 'text'
                : 'password'
            "
            :for="field.name"
            filled
            clearable
            bottom-slots
            :label="field.label"
            :aria-autocomplete="field?.autocomplete ?? 'off'"
            :autocomplete="field?.autocomplete ?? 'off'"
            :error="!!formErrors?.[field.name]?.length ?? false"
            class="q-mb-sm-sm q-mb-md-md"
            :dense="isSmallScreen"
          >
            <template #error>
              {{ formErrors[field.name] }}
            </template>

            <template #hint></template>
            <template
              v-if="field.name === 'newPassword' && formErrors.newPassword"
              #after
            >
              <q-btn
                style="font-size: 0.75rem"
                flat
                color="primary"
                label="Hint"
                class="q-mx-none q-px-none"
              >
                <q-tooltip
                  class="bg-primary"
                  transition-show="flip-right"
                  transition-hide="flip-left"
                  anchor="bottom right"
                  self="top right"
                >
                  <div>
                    Password should contain at least:
                    <ul>
                      <li>One (1) uppercase letter,</li>
                      <li>One (1) lowercase letter,</li>
                      <li>One (1) number,</li>
                      <li>Must be at least 8 characters long.</li>
                    </ul>
                  </div>
                </q-tooltip>
              </q-btn>
            </template>

            <template v-if="field.inputType === 'password'" #append>
              <q-icon
                v-if="field.model"
                :name="
                  revealPasswords[field.name] ? 'visibility_off' : 'visibility'
                "
                class="cursor-pointer"
                @click="
                  revealPasswords[field.name] = !revealPasswords[field.name]
                "
              />
            </template>
          </q-input>

          <quasar-select
            v-if="field.componentType === 'select' && field.isVisible"
            :key="`field_${field.name}_${field.componentType}`"
            :ref="field.name"
            v-model="field.model"
            filled
            aria-autocomplete="list"
            autocomplete="off"
            :options="field.options"
            :label="field.label"
            :name="field.name"
            :for="field.name"
            clearable
            bottom-slots
            :options-dense="isSmallScreen"
            use-input
            :input-debounce="200"
            class="q-mb-md"
            transition-show="scale"
            transition-hide="scale"
            emit-value
            map-options
            :dense="isSmallScreen"
            :error="!!formErrors?.[field.name]?.length ?? false"
          >
            <template v-if="field?.icon" #before>
              <q-icon :name="field?.icon ?? ''" />
            </template>
            <template #error>
              {{ formErrors[field.name] }}
            </template>
          </quasar-select>
        </template>
      </form>
    </template>

    <template #submitSection>
      <q-btn
        :loading="isSubmitting"
        class="full-width q-mt-lg q-mx-auto q-px-xl"
        color="accent"
        icon-right="send"
        label="Submit"
        @click.prevent="onSubmit"
      >
        <template #loading> Registering... </template>
      </q-btn>
    </template>

    <template #formFooterLink>
      <span>
        <router-link :to="{ name: 'Login' }">Login</router-link>
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
    </template>
  </auth-form>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  defineComponent,
  reactive,
  ref,
  nextTick,
  computed,
  watch,
  watchEffect,
  onBeforeMount,
  unref,
} from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import AuthForm from '../../components/AuthForm.vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { passwordRegex, phoneNumberRegex } from '../../helpers/utils';
import QuasarSelect from '../../components/QuasarSelect';
import { FormSchemaProperties, SelectionOption } from '../../store/types';
import { isEqual } from 'lodash';

interface RegisterFormInterface {
  email: string | null | undefined;
  firstName: string | null | undefined;
  middleName: string | null | undefined;
  lastName: string | null | undefined;
  newPassword: string | null | undefined;
  confirmNewPassword: string | null | undefined;
  phoneNumber: string | null | undefined;
  address: string | null | undefined;
  city: string | null | undefined;
  stateId: number | null | undefined;
  countryId: number | null | undefined;
}

type FormSchema = Record<string, FormSchemaProperties>;

export default defineComponent({
  name: 'Register',
  components: { AuthForm, QuasarSelect },
  setup() {
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();

    const stopFetchCountriesForSelect = watchEffect(() => {
      void store.dispatch('countries_states/FETCH_COUNTRIES_FOR_SELECT');
    });

    const countries = computed(
      () =>
        store.getters[
          'countries_states/GET_COUNTRIES_FOR_SELECT'
        ] as SelectionOption[]
    );

    const countryStates = computed({
      get: () =>
        store.getters[
          'countries_states/GET_COUNTRY_STATES_FOR_SELECT'
        ] as SelectionOption[],
      set: (value) => value,
    });

    // Valiation section starts

    const formSchema = computed(() =>
      yup.object({
        email: yup
          .string()
          .email('Email is not valid')
          .required('Email is required'),
        firstName: yup
          .string()
          .min(2, 'Minimum characters is 2')
          .required('First Name is required')
          .nullable(),
        middleName: yup.string().optional().nullable(),
        lastName: yup
          .string()
          .min(2, 'Minimum characters is 2')
          .required('First Name is required')
          .nullable(),
        newPassword: yup
          .string()
          .required('Password is required')
          .matches(passwordRegex, 'Please provide a strong password')
          .nullable(),
        confirmNewPassword: yup
          .mixed()
          .required('Password confirmation is required')
          .nullable()
          .equals(
            [yup.ref('newPassword')],
            'Both passwords should be the same'
          ),
        phoneNumber: yup
          .string()
          .matches(phoneNumberRegex, 'Please provide a valid phone number')
          .nullable(),
        address: yup.string().nullable(),
        city: yup.string().nullable(),
        stateId: yup.number().required('State is required').nullable(),
        countryId: yup.number().required('Country is required').nullable(),
      })
    );

    const initialValues: Readonly<RegisterFormInterface> = {
      email: '',
      firstName: '',
      middleName: '',
      lastName: '',
      newPassword: '',
      confirmNewPassword: '',
      phoneNumber: '',
      address: '',
      city: '',
      stateId: null,
      countryId: null,
    };

    const {
      handleSubmit,
      errors: formErrors,
      isSubmitting,
      values,
    } = useForm<RegisterFormInterface>({
      validationSchema: formSchema.value,
      initialValues,
    });

    const { value: email } = useField('email');
    const { value: newPassword } = useField('newPassword');
    const { value: confirmNewPassword } = useField('confirmNewPassword');
    const { value: firstName } = useField('firstName');
    const { value: middleName } = useField('middleName');
    const { value: lastName } = useField('lastName');
    const { value: phoneNumber } = useField('phoneNumber');
    const { value: address } = useField('address');
    const { value: city } = useField('city');
    const { value: stateId } = useField('stateId');
    const { value: countryId } = useField('countryId');

    // Form schema for form generation
    const form: FormSchema = reactive({
      email: {
        model: email,
        name: 'email',
        componentType: 'input',
        inputType: 'text',
        label: 'Email Address',
        default: '',
        autocomplete: 'email',
        isVisible: true,
      },
      newPassword: {
        model: newPassword,
        name: 'newPassword',
        componentType: 'input',
        inputType: 'password',
        label: 'New Password',
        default: '',
        autocomplete: 'new-password',
        isVisible: true,
      },
      confirmNewPassword: {
        model: confirmNewPassword,
        name: 'confirmNewPassword',
        componentType: 'input',
        inputType: 'password',
        label: 'Confirm Password',
        default: '',
        autocomplete: 'new-password',
        isVisible: true,
      },
      firstName: {
        model: firstName,
        name: 'firstName',
        componentType: 'input',
        inputType: 'text',
        label: 'First Name',
        default: '',
        autocomplete: 'given-name',
        isVisible: true,
      },
      middleName: {
        model: middleName,
        name: 'middleName',
        componentType: 'input',
        inputType: 'text',
        label: 'Middle Name',
        default: '',
        autocomplete: 'additional-name',
        isVisible: true,
      },
      lastName: {
        model: lastName,
        name: 'lastName',
        componentType: 'input',
        inputType: 'text',
        label: 'Last Name',
        default: '',
        autocomplete: 'family-name',
        isVisible: true,
      },
      phoneNumber: {
        model: phoneNumber,
        name: 'phoneNumber',
        componentType: 'input',
        inputType: 'text',
        label: 'Phone Number',
        default: '',
        autocomplete: 'mobile tel',
        isVisible: true,
      },
      address: {
        model: address,
        name: 'address',
        componentType: 'input',
        inputType: 'textarea',
        label: 'Address',
        default: '',
        autocomplete: 'street-address',
        isVisible: true,
      },
      city: {
        model: city,
        name: 'city',
        componentType: 'input',
        inputType: 'text',
        label: 'City/LGA',
        default: '',
        autocomplete: 'address-level-2',
        isVisible: true,
      },
      countryId: {
        model: countryId,
        name: 'countryId',
        componentType: 'select',
        inputType: '',
        label: 'Country',
        default: null,
        autocomplete: 'country-name',
        isVisible: true,
        options: unref(countries),
      },
      stateId: {
        model: stateId,
        name: 'stateId',
        componentType: 'select',
        inputType: '',
        label: 'State/Region',
        default: null,
        autocomplete: 'address-level1',
        isVisible: true,
        options: computed(() => countryStates.value),
      },
    });

    // Valiation section ends

    watch(
      () => form.countryId.model,
      (newCountry) => {
        stateId.value = null;
        if (newCountry) {
          void store.dispatch(
            'countries_states/FETCH_COUNTRY_STATES_FOR_SELECT',
            { countryId: newCountry }
          );

          countryStates.value = store.getters[
            'countries_states/GET_COUNTRY_STATES_FOR_SELECT'
          ] as SelectionOption[];
        }
      }
    );

    const onSubmit = handleSubmit((form) => {
      void nextTick(() => {
        void store
          .dispatch('auth/REGISTER_USER', form)
          .then(() => {
            $q.notify({
              message:
                'Registration was successful. You will be logged in 5 seconds.',
              type: 'positive',
              position: 'top',
              timeout: 2500,
              actions: [
                {
                  label: 'Dismiss',
                  color: 'white',
                },
              ],
            });

            setTimeout(() => {
              const isLoggedIn = store.getters['auth/isLoggedIn'] as boolean;

              if (isLoggedIn) {
                void router.push({ name: 'Dashboard' });
              }
            }, 5000);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    });

    onBeforeMount(() => {
      stopFetchCountriesForSelect();
    });

    onBeforeRouteLeave((to, from, next) => {
      const didFormValuesChange = !isEqual(initialValues, values);
      if (didFormValuesChange) {
        $q.dialog({
          message: 'Form has changed. Do you really want to leave this page?',
          title: 'Data loss warning',
          persistent: true,
          cancel: true,
        })
          .onOk(() => {
            next();
          })
          .onCancel(() => {
            return false;
          });
      } else next();
    });

    const revealPasswords: Record<string, boolean> = reactive({
      newPassword: false,
      confirmPassword: false,
    });

    return {
      dismissed: ref(false),
      isSubmitting,
      form,
      onSubmit,
      showPassword: ref(false),
      formErrors,
      revealPasswords,
    };
  },
});
</script>

<style lang="scss" scoped></style>
