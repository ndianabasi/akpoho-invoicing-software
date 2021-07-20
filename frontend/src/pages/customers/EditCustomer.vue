<template>
  <div class="q-pa-md">
    <view-card
      :title-info="titleInfo"
      show-avatar
      show-title-panel-side
      :loading="loading"
    >
      <template #body-panel>
        <form
          class="q-pa-md"
          style="width: 100%; min-height: 50vh"
          @submit.prevent="submitForm"
        >
          <div class="row">
            <div class="col col-xs-12 col-sm-6 col-lg-6 col-xl-4">
              <q-toggle
                v-model="is_corporate"
                checked-icon="check"
                color="green"
                unchecked-icon="clear"
                label="This is a corporate customer"
                class="q-mb-md"
              />
            </div>
            <div
              v-if="is_corporate"
              class="col col-xs-12 col-sm-6 col-lg-6 col-xl-4"
            >
              <q-toggle
                v-model="corporate_has_rep"
                checked-icon="check"
                color="green"
                unchecked-icon="clear"
                label="Corporate customer has a representative"
                class="q-mb-md"
              />
            </div>
            <div
              v-if="creationMode"
              class="col col-xs-12 col-sm-6 col-lg-6 col-xl-4"
            >
              <q-toggle
                v-model="is_billing_shipping_addresses_same"
                checked-icon="check"
                color="green"
                unchecked-icon="clear"
                label="Use billing address as delivery address?"
                class="q-mb-md"
              />
            </div>
          </div>

          <div class="row q-gutter-sm items-center justify-center">
            <template v-for="field in customerFormSchema">
              <q-input
                v-if="field.componentType === 'input' && field.isVisible"
                :key="`field_${field.name}_${field.componentType}`"
                v-model="field.model"
                :type="field.inputType"
                filled
                clearable
                bottom-slots
                :label="field.label"
                :aria-autocomplete="field?.autocomplete ?? 'off'"
                :autocomplete="field?.autocomplete ?? 'off'"
                :dense="$q.screen.lt.sm"
                :error="!!formErrors?.[field.name]?.length ?? false"
                class="col col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"
              >
                <template #error>
                  {{ formErrors[field.name] }}
                </template>
              </q-input>

              <quasar-select
                v-if="field.componentType === 'select' && field.isVisible"
                :key="`field_${field.name}_${field.componentType}`"
                :ref="field.name"
                v-model="field.model"
                filled
                aria-autocomplete="off"
                autocomplete="off"
                :options="field.options"
                :label="field.label"
                :name="field.name"
                clearable
                bottom-slots
                :options-dense="$q.screen.lt.sm"
                :dense="$q.screen.lt.sm"
                use-input
                :input-debounce="200"
                class="col col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"
                transition-show="scale"
                transition-hide="scale"
                :emit-value="false"
                :map-options="false"
                :error="!!formErrors?.[field.name]?.length ?? false"
                ><template v-if="field?.icon" #before>
                  <q-icon :name="field?.icon ?? ''" />
                </template>
                <template #error>
                  {{ formErrors[field.name] }}
                </template>
              </quasar-select>
            </template>
          </div>
        </form>
      </template>

      <template #footer-panel>
        <div class="row justify-center q-mb-xl q-pa-md">
          <q-btn
            type="submit"
            :loading="isSubmitting"
            label="Submit"
            :class="['q-mt-md', $q.screen.lt.md ? 'full-width' : 'half-width']"
            icon-right="send"
            @click.prevent="submitForm"
          >
            <!-- eslint-disable-next-line vue/v-slot-style -->
            <template #loading>
              <q-spinner-facebook color="white" />
            </template>
          </q-btn>
        </div>
      </template>

      <template v-if="!creationMode" #title-panel-side>
        <q-btn flat icon="more_vert">
          <q-menu
            anchor="bottom right"
            self="top end"
            transition-show="flip-right"
            transition-hide="flip-left"
          >
            <q-list>
              <q-item
                v-if="resourcePermissions?.canView ?? false"
                :to="{
                  name: 'view_customer',
                  params: { customerId: customerId }, //customerId from route props
                }"
              >
                <q-item-section>
                  <q-btn flat icon="visibility" />
                </q-item-section>
                <q-item-section>View Customer</q-item-section>
              </q-item>

              <q-item
                v-if="resourcePermissions?.canList ?? false"
                :to="{
                  name: 'customers',
                }"
              >
                <q-item-section>
                  <q-btn flat icon="view_list" />
                </q-item-section>
                <q-item-section>All Customers</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>
    </view-card>
  </div>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import {
  defineComponent,
  ref,
  onBeforeMount,
  watchEffect,
  watch,
  computed,
  unref,
  Ref,
  reactive,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import { email, helpers } from '@vuelidate/validators';
import ViewCard from '../../components/ViewCard.vue';
import useTitleInfo from '../../composables/useTitleInfo';
import { store } from '../../store';
import useResourcePermissions, {
  ResourcePermissions,
} from '../../composables/useResourcePermissions';
import {
  CurrentlyViewedCustomer,
  PERMISSION,
  CustomerFormShapeRaw,
  FormSchema,
  SelectOption,
} from '../../store/types';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';
import QuasarSelect from '../../components/QuasarSelect';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

export default defineComponent({
  name: 'EditCustomer',

  components: {
    ViewCard,
    QuasarSelect,
  },

  props: {
    customerId: {
      type: String,
      required: false,
      default: '',
    },
    customerAddressId: {
      type: String,
      required: false,
      default: '',
    },
    creationMode: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const loading = ref(false);
    const router = useRouter();

    let currentCustomer: Ref<CurrentlyViewedCustomer | null>;

    currentCustomer = !props.creationMode
      ? computed(
          () =>
            store.getters[
              'customers/GET_CURRENTLY_VIEWED_CUSTOMER'
            ] as CurrentlyViewedCustomer
        )
      : ref(null);

    const countries = computed(
      () =>
        store.getters[
          'countries_states/GET_COUNTRIES_FOR_SELECT'
        ] as SelectOption[]
    );

    const countryStates = computed({
      get: () =>
        store.getters[
          'countries_states/GET_COUNTRY_STATES_FOR_SELECT'
        ] as SelectOption[],
      set: (value) => value,
    });

    const customerTitles = computed(
      () =>
        store.getters[
          'customers/GET_CUSTOMER_TITLES_FOR_SELECT'
        ] as SelectOption[]
    );

    const initialForm: CustomerFormShapeRaw = reactive({
      title: null,
      first_name: '',
      last_name: '',
      middle_name: '',
      email: '',
      phone_number: '',
      is_corporate: false,
      corporate_has_rep: false,
      company_name: '',
      company_phone: '',
      company_email: '',
      shipping_address: '',
      shipping_lga: '',
      shipping_postal_code: '',
      shipping_state: null,
      shipping_country: null,
      // `is_billing_shipping_addresses_same` is not persisted to
      // database but used to create an identical billing address
      // from the shipping address
      is_billing_shipping_addresses_same: true,
      billing_address: '',
      billing_lga: '',
      billing_postal_code: '',
      billing_state: null,
      billing_country: null,
    });

    const formSchema = computed(() =>
      yup.object({
        title: yup
          .object({
            label: yup.string(),
            value: yup.number(),
          })
          .nullable()
          .optional()
          .default(null),
        is_corporate: yup.boolean(),
        corporate_has_rep: yup.boolean(),
        first_name: yup
          .string()
          .when(['is_corporate', 'corporate_has_rep'], {
            is: (is_corporate: boolean, corporate_has_rep: boolean) =>
              (!is_corporate && !corporate_has_rep) ||
              (is_corporate && corporate_has_rep),
            then: yup
              .string()
              .required('First Name is required')
              .max(20, 'Maximum length of First Name is $max')
              .nullable(),
          })
          .when(['is_corporate', 'corporate_has_rep'], {
            is: (is_corporate: boolean, corporate_has_rep: boolean) =>
              is_corporate && !corporate_has_rep,
            then: yup
              .string()
              .notRequired()
              .max(20, 'Maximum length of First Name is $max')
              .nullable(),
          }),
        middle_name: yup
          .string()
          .notRequired()
          .nullable()
          .max(20, 'Maximum length of Middle Name is $max'),
        last_name: yup
          .string()
          .when(['is_corporate', 'corporate_has_rep'], {
            is: (is_corporate: boolean, corporate_has_rep: boolean) =>
              (!is_corporate && !corporate_has_rep) ||
              (is_corporate && corporate_has_rep),
            then: yup
              .string()
              .required('Last Name is required')
              .max(20, 'Maximum length of Last Name is $max')
              .nullable(),
          })
          .when(['is_corporate', 'corporate_has_rep'], {
            is: (is_corporate: boolean, corporate_has_rep: boolean) =>
              is_corporate && !corporate_has_rep,
            then: yup
              .string()
              .notRequired()
              .max(20, 'Maximum length of Last Name is $max')
              .nullable(),
          }),
        email: yup.string().notRequired().nullable(),
        phone_number: yup
          .string()
          .notRequired()
          .nullable()
          .max(20, 'Maximum length of phone number is $max'),
        company_name: yup.string().when('is_corporate', {
          is: (is_corporate: boolean) => is_corporate,
          then: yup
            .string()
            .required('Company Name is required')
            .max(50, 'Maximum length of Company Name is $max')
            .nullable(),
          otherwise: yup
            .string()
            .notRequired()
            .max(50, 'Maximum length of Company Name is $max')
            .nullable(),
        }),
        company_email: yup.string().notRequired().nullable(),
        company_phone: yup
          .string()
          .notRequired()
          .nullable()
          .max(20, 'Maximum length of Company Phone Number is $max'),
        shipping_address: yup.string().notRequired().nullable(),
        shipping_lga: yup.string().notRequired().nullable(),
        shipping_postal_code: yup.string().notRequired().nullable(),
        shipping_state: yup
          .object({
            label: yup.string().optional().nullable(),
            value: yup.number().optional().nullable(),
          })
          .nullable()
          .optional()
          .default(null),
        shipping_country: yup
          .object({
            label: yup.string().optional().nullable(),
            value: yup.number().optional().nullable(),
          })
          .nullable()
          .optional()
          .default(null),
        billing_address: yup.string().notRequired().nullable(),
        billing_lga: yup.string().notRequired().nullable(),
        billing_postal_code: yup.string().notRequired().nullable(),
        billing_state: yup
          .object({
            label: yup.string().optional().nullable(),
            value: yup.number().optional().nullable(),
          })
          .nullable()
          .optional()
          .default(null),
        billing_country: yup
          .object({
            label: yup.string().optional().nullable(),
            value: yup.number().optional().nullable(),
          })
          .nullable()
          .optional()
          .default(null),
        is_billing_shipping_addresses_same: yup.boolean(),
      })
    );

    const {
      handleSubmit,
      errors: formErrors,
      isSubmitting,
      values,
    } = useForm({
      validationSchema: formSchema.value,
      initialValues: initialForm,
    });

    const { value: title } = useField<CustomerFormShapeRaw['title']>('title');
    const { value: first_name } =
      useField<CustomerFormShapeRaw['first_name']>('first_name');
    const { value: last_name } =
      useField<CustomerFormShapeRaw['last_name']>('last_name');
    const { value: middle_name } =
      useField<CustomerFormShapeRaw['middle_name']>('middle_name');
    const { value: email } = useField<CustomerFormShapeRaw['email']>('email');
    const { value: phone_number } =
      useField<CustomerFormShapeRaw['phone_number']>('phone_number');
    const { value: is_corporate } =
      useField<CustomerFormShapeRaw['is_corporate']>('is_corporate');
    const { value: corporate_has_rep } =
      useField<CustomerFormShapeRaw['corporate_has_rep']>('corporate_has_rep');
    const { value: company_name } =
      useField<CustomerFormShapeRaw['company_name']>('company_name');
    const { value: company_phone } =
      useField<CustomerFormShapeRaw['company_phone']>('company_phone');
    const { value: company_email } =
      useField<CustomerFormShapeRaw['company_email']>('company_email');
    const { value: shipping_address } =
      useField<CustomerFormShapeRaw['shipping_address']>('shipping_address');
    const { value: shipping_lga } =
      useField<CustomerFormShapeRaw['shipping_lga']>('shipping_lga');
    const { value: shipping_postal_code } = useField<
      CustomerFormShapeRaw['shipping_postal_code']
    >('shipping_postal_code');
    const { value: shipping_state } =
      useField<CustomerFormShapeRaw['shipping_state']>('shipping_state');
    const { value: shipping_country } =
      useField<CustomerFormShapeRaw['shipping_country']>('shipping_country');
    const { value: is_billing_shipping_addresses_same } = useField<
      CustomerFormShapeRaw['is_billing_shipping_addresses_same']
    >('is_billing_shipping_addresses_same');
    const { value: billing_address } =
      useField<CustomerFormShapeRaw['billing_address']>('billing_address');
    const { value: billing_lga } =
      useField<CustomerFormShapeRaw['billing_lga']>('billing_lga');
    const { value: billing_postal_code } = useField<
      CustomerFormShapeRaw['billing_postal_code']
    >('billing_postal_code');
    const { value: billing_state } =
      useField<CustomerFormShapeRaw['billing_state']>('billing_state');
    const { value: billing_country } =
      useField<CustomerFormShapeRaw['billing_country']>('billing_country');

    const arePersonalOrRepDetailsVisible = computed(
      () =>
        (is_corporate.value && corporate_has_rep.value) || !is_corporate.value
    );

    const areAddressDetailsVisible = computed(
      () => !is_billing_shipping_addresses_same.value && props.creationMode
    );

    const customerFormSchema: FormSchema = reactive({
      title: {
        name: 'title',
        label: 'Title',
        default: initialForm.title,
        componentType: 'select',
        options: customerTitles,
        autocomplete: 'honorific-prefix',
        isVisible: arePersonalOrRepDetailsVisible,
        model: title,
      },
      first_name: {
        name: 'first_name',
        label: 'First Name',
        default: initialForm.first_name,
        componentType: 'input',
        autocomplete: 'given-name',
        inputType: 'text',
        isVisible: arePersonalOrRepDetailsVisible,
        model: first_name,
      },
      middle_name: {
        name: 'middle_name',
        label: 'Middle Name',
        default: initialForm.middle_name,
        componentType: 'input',
        inputType: 'text',
        autocomplete: 'additional-name',
        isVisible: arePersonalOrRepDetailsVisible,
        model: middle_name,
      },
      last_name: {
        name: 'last_name',
        label: 'Last Name',
        default: initialForm.last_name,
        componentType: 'input',
        inputType: 'text',
        autocomplete: 'family-name',
        isVisible: arePersonalOrRepDetailsVisible,
        model: last_name,
      },
      email: {
        name: 'email',
        label: 'Personal Email Address',
        default: initialForm.email,
        componentType: 'input',
        inputType: 'email',
        autocomplete: 'email',
        isVisible: arePersonalOrRepDetailsVisible,
        model: email,
      },
      phone_number: {
        name: 'phone_number',
        label: 'Personal Phone Number',
        default: initialForm.phone_number,
        componentType: 'input',
        inputType: 'text',
        autocomplete: 'mobile tel',
        isVisible: arePersonalOrRepDetailsVisible,
        model: phone_number,
      },
      company_name: {
        name: 'company_name',
        label: 'Company Name',
        default: initialForm.company_name,
        componentType: 'input',
        inputType: 'text',
        autocomplete: 'organisation',
        isVisible: is_corporate,
        model: company_name,
      },
      company_phone: {
        name: 'company_phone',
        label: 'Company Phone Number',
        default: initialForm.company_phone,
        componentType: 'input',
        autocomplete: 'work tel',
        inputType: 'text',
        isVisible: is_corporate,
        model: company_phone,
      },
      company_email: {
        name: 'company_email',
        label: 'Company Email Address',
        default: initialForm.company_email,
        componentType: 'input',
        autocomplete: 'work email',
        inputType: 'text',
        isVisible: is_corporate,
        model: company_email,
      },
      shipping_address: {
        name: 'shipping_address',
        label: 'Shipping Street',
        default: initialForm.shipping_address,
        componentType: 'input',
        inputType: 'textarea',
        autocomplete: 'shipping street-address',
        isVisible: props.creationMode,
        model: shipping_address,
      },
      shipping_lga: {
        name: 'shipping_lga',
        label: 'Shipping LGA/County',
        default: initialForm.shipping_lga,
        componentType: 'input',
        inputType: 'text',
        isVisible: props.creationMode,
        autocomplete: 'shipping address-level2',
        model: shipping_lga,
      },
      shipping_postal_code: {
        name: 'shipping_postal_code',
        label: 'Shipping Postal Code',
        default: shipping_postal_code,
        componentType: 'input',
        inputType: 'text',
        isVisible: props.creationMode,
        autocomplete: 'shipping postal-code',
        model: shipping_postal_code,
      },
      shipping_country: {
        name: 'shipping_country',
        label: 'Shipping Country',
        default: initialForm.shipping_country,
        componentType: 'select',
        options: countries,
        isVisible: props.creationMode,
        autocomplete: 'shipping country-name',
        model: shipping_country,
      },
      shipping_state: {
        name: 'shipping_state',
        label: 'Shipping State/Region',
        default: initialForm.shipping_state,
        componentType: 'select',
        options: countryStates,
        isVisible: props.creationMode,
        autocomplete: 'shipping address-level1',
        model: shipping_state,
      },
      billing_address: {
        name: 'billing_address',
        label: 'Billing Street',
        default: initialForm.billing_address,
        componentType: 'input',
        inputType: 'textarea',
        autocomplete: 'billing street-address',
        isVisible: areAddressDetailsVisible,
        model: billing_address,
      },
      billing_lga: {
        name: 'billing_lga',
        label: 'Billing LGA/County',
        default: initialForm.billing_lga,
        componentType: 'input',
        inputType: 'text',
        autocomplete: 'billing address-level2',
        isVisible: areAddressDetailsVisible,
        model: billing_lga,
      },
      billing_postal_code: {
        name: 'billing_postal_code',
        label: 'Billing Postal Code',
        default: initialForm.billing_postal_code,
        componentType: 'input',
        inputType: 'text',
        autocomplete: 'billing postal-code',
        isVisible: areAddressDetailsVisible,
        model: billing_postal_code,
      },
      billing_country: {
        name: 'billing_country',
        label: 'Billing Country',
        default: initialForm.billing_country,
        componentType: 'select',
        options: countries,
        autocomplete: 'billing country-name',
        isVisible: areAddressDetailsVisible,
        model: billing_country,
      },
      billing_state: {
        name: 'billing_state',
        label: 'Billing State/Region',
        default: initialForm.billing_state,
        componentType: 'select',
        options: countryStates,
        autocomplete: 'billing address-level1',
        isVisible: areAddressDetailsVisible,
        model: billing_state,
      },
    });

    const submitForm = handleSubmit((validatedForm) => {
      /* if (!form$.value?.$invalid ?? false) {

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
      } */

      const {
        title,
        shipping_state,
        shipping_country,
        billing_state,
        billing_country,
        ...restOfForm
      } = validatedForm;
      const processedForm = {
        ...restOfForm,
        title: title?.value,
        shipping_state: shipping_state?.value,
        shipping_country: shipping_country?.value,
        billing_state: billing_state?.value,
        billing_country: billing_country?.value,
        is_billing_shipping_addresses_same:
          is_billing_shipping_addresses_same.value,
        is_corporate: is_corporate.value,
        corporate_has_rep: corporate_has_rep.value,
      };

      isSubmitting.value = true;

      try {
        if (!props.creationMode) {
          void store
            .dispatch('customers/EDIT_CUSTOMER', {
              customerId: props.customerId,
              form: processedForm,
            })
            .then(() => {
              isSubmitting.value = false;
              void router.push({
                name: 'view_customer',
                params: { customerId: props.customerId },
              });
              return;
            })
            .catch(() => {
              isSubmitting.value = false;
            });
        } else {
          store
            .dispatch('customers/CREATE_CUSTOMER', {
              form: processedForm,
            })
            .then((customerId: string) => {
              isSubmitting.value = false;
              void router.push({
                name: 'view_customer',
                params: { customerId },
              });
              return;
            })
            .catch(() => {
              isSubmitting.value = false;
            });
        }
      } catch (error: unknown) {
        isSubmitting.value = false;
        console.error(error);

        Notify.create({
          message: 'Unknown error occured',
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
    });

    let titleInfo;
    watchEffect(() => {
      titleInfo =
        currentCustomer && currentCustomer.value
          ? useTitleInfo({
              title: !currentCustomer.value.is_corporate
                ? `${currentCustomer?.value?.title?.name ?? ''} ${
                    currentCustomer.value.first_name ?? ''
                  } ${currentCustomer.value.last_name ?? ''}`
                : `${currentCustomer.value.company_name} (Corporate)`,
            })
          : props.creationMode
          ? useTitleInfo({
              title: 'New Customer',
            })
          : ref(null);
    });

    const stopFetchCurrentlyViewedCustomer = watchEffect(() => {
      if (!props.creationMode) {
        loading.value = true;
        void store
          .dispatch('customers/FETCH_CURRENTLY_VIEWED_CUSTOMER', {
            customerId: props.customerId,
          })
          .then(() => {
            currentCustomer = computed(
              () =>
                store.getters[
                  'customers/GET_CURRENTLY_VIEWED_CUSTOMER'
                ] as CurrentlyViewedCustomer
            );

            first_name.value = currentCustomer?.value?.first_name ?? '';
            last_name.value = currentCustomer?.value?.last_name ?? '';
            middle_name.value = currentCustomer?.value?.middle_name ?? '';
            phone_number.value = currentCustomer?.value?.phone_number ?? '';
            email.value = currentCustomer?.value?.email ?? '';
            company_email.value = currentCustomer?.value?.company_email ?? '';
            company_name.value = currentCustomer?.value?.company_name ?? '';
            title.value = currentCustomer?.value?.title
              ? {
                  label: currentCustomer?.value?.title?.name,
                  value: currentCustomer?.value?.title?.id,
                }
              : null;
            is_corporate.value = Boolean(
              currentCustomer?.value?.is_corporate ?? false
            );
            corporate_has_rep.value = Boolean(
              currentCustomer?.value?.corporate_has_rep ?? false
            );

            loading.value = false;
          });
      }
    });

    const stopFetchCountriesForSelect = watchEffect(() => {
      void store.dispatch('countries_states/FETCH_COUNTRIES_FOR_SELECT');
    });

    const stopFetchCustomerTitlesForSelect = watchEffect(() => {
      void store.dispatch('customers/FETCH_CUSTOMER_TITLES_FOR_SELECT');
    });

    watch(shipping_country, (country) => {
      shipping_state.value = null;
      if (!country?.value) return;
      void store
        .dispatch('countries_states/FETCH_COUNTRY_STATES_FOR_SELECT', {
          countryId: country?.value,
        })
        .then((states: SelectOption[]) => {
          countryStates.value = states;
        });
    });
    watch(billing_country, (country) => {
      billing_state.value = null;
      if (!country?.value) return;
      void store
        .dispatch('countries_states/FETCH_COUNTRY_STATES_FOR_SELECT', {
          countryId: country?.value,
        })
        .then((states: SelectOption[]) => {
          countryStates.value = states;
        });
    });

    onBeforeMount(() => {
      stopFetchCurrentlyViewedCustomer();
      stopFetchCountriesForSelect();
      stopFetchCustomerTitlesForSelect();
    });

    const resourcePermissions: ResourcePermissions | null =
      useResourcePermissions({
        view: PERMISSION.CAN_VIEW_CUSTOMERS,
        list: PERMISSION.CAN_LIST_CUSTOMERS,
      });

    return {
      customer: currentCustomer,
      text: ref(''),
      ph: ref(''),
      dense: ref(false),
      dismissed: ref(false),
      isSubmitting,
      submitForm,
      is_corporate,
      corporate_has_rep,
      is_billing_shipping_addresses_same,
      customerFormSchema,
      titleInfo,
      customerTitles,
      resourcePermissions,
      loading,
      formErrors,
      arePersonalOrRepDetailsVisible,
    };
  },
});
</script>
