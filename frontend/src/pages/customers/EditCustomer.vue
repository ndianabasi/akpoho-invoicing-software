<template>
  <div class="q-pa-md">
    <view-card :title-info="titleInfo" show-avatar show-title-panel-side>
      <template #body-panel>
        <form class="q-pa-md" @submit.prevent="submitForm">
          <div class="row q-mx-auto">
            <div class="column col-6">
              <q-toggle
                v-model="form.is_corporate"
                checked-icon="check"
                color="green"
                unchecked-icon="clear"
                label="This is a corporate customer"
                class="q-ml-lg q-mb-md"
              />
            </div>
            <div v-if="form.is_corporate" class="column col-6">
              <q-toggle
                v-model="form.corporate_has_rep"
                checked-icon="check"
                color="green"
                unchecked-icon="clear"
                label="Corporate customer has a representative"
                class="q-ml-lg q-mb-md"
              />
            </div>
          </div>

          <template v-for="field in customerFormSchema">
            <q-input
              v-if="field.componentType === 'input' && field.isVisible"
              :key="`field_${field.name}_${field.componentType}`"
              v-model="form[field.name]"
              :type="field.inputType"
              filled
              clearable
              bottom-slots
              :label="field.label"
              :dense="dense"
              :error="form$?.[field.name]?.$invalid ?? false"
              class="q-mb-md"
            >
              <template v-if="field?.icon" #before>
                <q-icon :name="field?.icon ?? ''" />
              </template>

              <template #error>
                {{
                  form$ && form$[field.name]
                    ? form$[field.name].$silentErrors
                        .map((error) => error.$message)
                        .join(', ')
                    : ''
                }}
              </template>
            </q-input>

            <quasar-select
              v-if="field.componentType === 'select' && field.isVisible"
              :key="`field_${field.name}_${field.componentType}`"
              :ref="field.name"
              v-model="form[field.name]"
              filled
              aria-autocomplete="off"
              autocomplete="off"
              :options="field.options"
              :label="field.label"
              :name="field.name"
              clearable
              bottom-slots
              options-dense
              use-input
              :input-debounce="200"
              class="q-mb-md"
              transition-show="scale"
              transition-hide="scale"
              emit-value
              map-options
              ><template v-if="field?.icon" #before>
                <q-icon :name="field?.icon ?? ''" />
              </template>
            </quasar-select>
          </template>

          <q-toggle
            v-if="creationMode"
            v-model="form.is_billing_shipping_addresses_same"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
            label="Use billing address as delivery address?"
            class="q-ml-lg q-mb-md"
          />
        </form>
      </template>

      <template #footer-panel>
        <div class="row justify-center q-mb-xl">
          <q-btn
            type="submit"
            :loading="submitting"
            label="Submit"
            class="q-mt-md"
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
                v-if="resourcePermissions.canView"
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
                v-if="resourcePermissions.canList"
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
import { email, helpers, required } from '@vuelidate/validators';
import ViewCard from '../../components/ViewCard.vue';
import useTitleInfo from '../../composables/useTitleInfo';
import { store } from '../../store';
import useResourcePermissions from '../../composables/useResourcePermissions';
import {
  CurrentlyViewedCustomer,
  SelectionOption,
  PERMISSION,
  CustomerFormShape,
} from '../../store/types';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';
import QuasarSelect from '../../components/QuasarSelect';

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
    const submitting = ref(false);
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
        ] as SelectionOption[]
    );

    const countryStates = computed(
      () =>
        store.getters[
          'countries_states/GET_COUNTRY_STATES_FOR_SELECT'
        ] as SelectionOption[]
    );

    const customerTitles = computed(
      () =>
        store.getters[
          'customers/GET_CUSTOMER_TITLES_FOR_SELECT'
        ] as SelectionOption[]
    );

    const form: CustomerFormShape = reactive({
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
      // This is not persisted but used to create an identical billing address
      // from the shipping address
      is_billing_shipping_addresses_same: true,
      billing_address: '',
      billing_lga: '',
      billing_postal_code: '',
      billing_state: null,
      billing_country: null,
    });

    const customerFormSchema = computed(() => [
      {
        name: 'title',
        label: 'Title',
        default: null,
        componentType: 'select',
        options: unref(customerTitles),
        isVisible:
          (form.is_corporate && form.corporate_has_rep) || !form.is_corporate,
      },
      {
        name: 'first_name',
        label: 'First Name',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible:
          (form.is_corporate && form.corporate_has_rep) || !form.is_corporate,
      },
      {
        name: 'middle_name',
        label: 'Middle Name',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible:
          (form.is_corporate && form.corporate_has_rep) || !form.is_corporate,
      },
      {
        name: 'last_name',
        label: 'Last Name',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible:
          (form.is_corporate && form.corporate_has_rep) || !form.is_corporate,
      },
      {
        name: 'email',
        label: 'Personal Email Address',
        default: '',
        componentType: 'input',
        inputType: 'email',
        isVisible:
          (form.is_corporate && form.corporate_has_rep) || !form.is_corporate,
      },
      {
        name: 'phone_number',
        label: 'Personal Phone Number',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible:
          (form.is_corporate && form.corporate_has_rep) || !form.is_corporate,
      },
      {
        name: 'company_name',
        label: 'Company Name',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible: form.is_corporate,
      },
      {
        name: 'company_phone',
        label: 'Company Phone Number',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible: form.is_corporate,
      },
      {
        name: 'company_email',
        label: 'Company Email Address',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible: form.is_corporate,
      },
      {
        name: 'shipping_address',
        label: 'Shipping Street',
        default: '',
        componentType: 'input',
        inputType: 'textarea',
        isVisible: props.creationMode,
      },
      {
        name: 'shipping_lga',
        label: 'Shipping LGA/County',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible: props.creationMode,
      },
      {
        name: 'shipping_postal_code',
        label: 'Shipping Postal Code',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible: props.creationMode,
      },
      {
        name: 'shipping_country',
        label: 'Shipping Country',
        default: null,
        componentType: 'select',
        options: unref(countries),
        isVisible: props.creationMode,
      },
      {
        name: 'shipping_state',
        label: 'Shipping State/Region',
        default: null,
        componentType: 'select',
        options: unref(countryStates),
        isVisible: props.creationMode,
      },
      {
        name: 'billing_address',
        label: 'Billing Street',
        default: '',
        componentType: 'input',
        inputType: 'textarea',
        isVisible:
          !form.is_billing_shipping_addresses_same && props.creationMode,
      },
      {
        name: 'billing_lga',
        label: 'Billing LGA/County',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible:
          !form.is_billing_shipping_addresses_same && props.creationMode,
      },
      {
        name: 'billing_postal_code',
        label: 'Billing Postal Code',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible:
          !form.is_billing_shipping_addresses_same && props.creationMode,
      },
      {
        name: 'billing_country',
        label: 'Billing Country',
        default: null,
        componentType: 'select',
        options: unref(countries),
        isVisible:
          !form.is_billing_shipping_addresses_same && props.creationMode,
      },
      {
        name: 'billing_state',
        label: 'Billing State/Region',
        default: null,
        componentType: 'select',
        options: unref(countryStates),
        isVisible:
          !form.is_billing_shipping_addresses_same && props.creationMode,
      },
    ]);

    const rules = computed(() => ({
      first_name: {
        requird: helpers.withMessage('First Name is required..', required),
      },
      last_name: {
        requird: helpers.withMessage('Last Name is required..', required),
      },
      email: {
        email: helpers.withMessage('Email is not valid.', email),
      },
      company_email: {
        email: helpers.withMessage('Company Email is not valid.', email),
      },
    }));

    const form$: Ref<{ $invalid: boolean }> = useVuelidate(rules, form);

    function submitForm() {
      if (!form$.value.$invalid) {
        submitting.value = true;
        // Try to by-pass issue with object being emitted in QuasarSelect

        try {
          if (!props.creationMode) {
            void store
              .dispatch('customers/EDIT_CUSTOMER', {
                customerId: props.customerId,
                form,
              })
              .then(() => {
                submitting.value = false;
                void router.push({
                  name: 'view_customer',
                  params: { customerId: props.customerId },
                });
                return;
              })
              .catch(() => {
                submitting.value = false;
              });
          } else {
            store
              .dispatch('customers/CREATE_CUSTOMER', {
                form,
              })
              .then((customerId: string) => {
                submitting.value = false;
                void router.push({
                  name: 'view_customer',
                  params: { customerId },
                });
                return;
              })
              .catch(() => {
                submitting.value = false;
              });
          }
        } catch (error: unknown) {
          submitting.value = false;
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

            form.first_name = currentCustomer?.value?.first_name ?? '';
            form.last_name = currentCustomer?.value?.last_name ?? '';
            form.middle_name = currentCustomer?.value?.middle_name ?? '';
            form.phone_number = currentCustomer?.value?.phone_number ?? '';
            form.email = currentCustomer?.value?.email ?? '';
            form.company_email = currentCustomer?.value?.company_email ?? '';
            form.company_name = currentCustomer?.value?.company_name ?? '';
            form.title = currentCustomer?.value?.title?.id ?? null;
            form.is_corporate = Boolean(
              currentCustomer?.value?.is_corporate ?? false
            );
            form.corporate_has_rep = Boolean(
              currentCustomer?.value?.corporate_has_rep ?? false
            );
          });
      }
    });

    const stopFetchCountriesForSelect = watchEffect(() => {
      void store.dispatch('countries_states/FETCH_COUNTRIES_FOR_SELECT');
    });

    const stopFetchCustomerTitlesForSelect = watchEffect(() => {
      void store.dispatch('customers/FETCH_CUSTOMER_TITLES_FOR_SELECT');
    });

    watch(
      () => form.shipping_country,
      (newValue) => {
        form.shipping_state = null;
        if (!newValue) return;
        void store.dispatch(
          'countries_states/FETCH_COUNTRY_STATES_FOR_SELECT',
          { countryId: newValue }
        );
      }
    );
    watch(
      () => form.billing_country,
      (newValue) => {
        form.billing_state = null;
        if (!newValue) return;
        void store.dispatch(
          'countries_states/FETCH_COUNTRY_STATES_FOR_SELECT',
          { countryId: newValue }
        );
      }
    );

    onBeforeMount(() => {
      stopFetchCurrentlyViewedCustomer();
      stopFetchCountriesForSelect();
      stopFetchCustomerTitlesForSelect();
    });

    return {
      customer: currentCustomer,
      text: ref(''),
      ph: ref(''),
      dense: ref(false),
      dismissed: ref(false),
      submitting,
      form,
      submitForm,
      form$,
      customerFormSchema,
      titleInfo,
      customerTitles,
      resourcePermissions: useResourcePermissions({
        view: PERMISSION.CAN_VIEW_CUSTOMERS,
        list: PERMISSION.CAN_LIST_CUSTOMERS,
      }),
    };
  },
});
</script>
