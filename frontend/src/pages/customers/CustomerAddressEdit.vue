<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h6 q-mb-md">Edit Address</div>
      <form
        style="width: 500px; max-width: 90vw; min-height: 500px"
        @submit.prevent="submitForm"
      >
        <q-inner-loading :showing="loading">
          <q-spinner-oval size="100px" color="accent" />
        </q-inner-loading>
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <div v-if="!loading">
            <template v-for="field in customerFormSchema">
              <q-input
                v-if="field.componentType === 'input' && field.isVisible"
                :key="`field_${field.name}_${field.componentType}`"
                v-model="form[field.name]"
                :error="form$?.[field.name]?.$invalid ?? false"
                :type="field.inputType"
                :autogrow="field.inputType === 'textarea'"
                filled
                :aria-autocomplete="field.autocomplete"
                :autocomplete="field.autocomplete"
                clearable
                bottom-slots
                :label="field.label"
                :dense="dense"
                class="q-mb-md"
              >
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
                :error="form$?.[field.name]?.$invalid ?? false"
                filled
                :options="field.options"
                :label="field.label"
                :name="field.name"
                aria-autocomplete="off"
                autocomplete="off"
                clearable
                bottom-slots
                options-dense
                use-input
                :input-debounce="200"
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
                :emit-value="false"
                :map-options="false"
              >
                <template #error>
                  {{
                    form$ && form$[field.name]
                      ? form$[field.name].$silentErrors
                          .map((error) => error.$message)
                          .join(', ')
                      : ''
                  }}
                </template>
              </quasar-select>
            </template>
          </div>
        </transition>
      </form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Submit" @click.prevent="submitForm" />
      <q-btn v-close-popup flat color="negative" label="Cancel" />
    </q-card-actions>
  </q-card>
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
  ComputedRef,
  reactive,
  PropType,
} from 'vue';
import { store } from '../../store';
import useResourcePermissions from '../../composables/useResourcePermissions';
import {
  CurrentlyViewedAddress,
  SelectionOption,
  PERMISSION,
  FormSchemaProperties,
  CustomerAddressInterfaceRaw,
} from '../../store/types';
import { Notify } from 'quasar';
import { FetchTableDataInterface } from '../../types/table';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import QuasarSelect from '../../components/QuasarSelect';

export default defineComponent({
  name: 'EditCustomerAddress',

  components: { QuasarSelect },

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
    postUpdate: {
      type: Function as PropType<FetchTableDataInterface>,
      default: () => {
        return () => {
          /** */
        };
      },
    },
    currentDialogRef: {
      type: Object as PropType<{ hide: () => void }>,
      default: () => ({}),
    },
  },

  setup(props) {
    const submitting = ref(false);
    const loading = ref(false);

    let currentAddress: Ref<CurrentlyViewedAddress | null>;

    currentAddress = !props.creationMode
      ? computed(
          () =>
            store.getters[
              'customers/GET_CURRENTLY_VIEWED_ADDRESS'
            ] as CurrentlyViewedAddress
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

    const form: CustomerAddressInterfaceRaw = reactive({
      address: '',
      lga: '',
      postal_code: '',
      state: null,
      country: null,
      type: null,
    });

    const addressTypeOptions = computed(() => {
      return props.creationMode
        ? [
            { label: 'Billing', value: 'billing_address' },
            { label: 'Shipping', value: 'shipping_address' },
            { label: 'Both', value: 'both' },
          ]
        : [
            { label: 'Billing', value: 'billing_address' },
            { label: 'Shipping', value: 'shipping_address' },
          ];
    });

    const customerFormSchema: ComputedRef<FormSchemaProperties[]> = computed(
      () => [
        {
          name: 'type',
          label: 'Address Type',
          default: null,
          componentType: 'select',
          options: addressTypeOptions.value,
          isVisible: true,
          autocomplete: 'off',
        },
        {
          name: 'address',
          label: 'Address Line',
          default: '',
          componentType: 'input',
          inputType: 'textarea',
          isVisible: true,
          autocomplete: 'street-address',
        },
        {
          name: 'lga',
          label: 'LGA/County',
          default: '',
          componentType: 'input',
          inputType: 'text',
          isVisible: true,
          autocomplete: 'address-level2',
        },
        {
          name: 'postal_code',
          label: 'Postal Code',
          default: '',
          componentType: 'input',
          inputType: 'text',
          isVisible: true,
          autocomplete: 'postal-code',
        },
        {
          name: 'country',
          label: 'Country',
          default: null,
          componentType: 'select',
          options: unref(countries),
          isVisible: true,
          autocomplete: 'country',
        },
        {
          name: 'state',
          label: 'State/Region',
          default: null,
          componentType: 'select',
          options: unref(countryStates),
          isVisible: true,
          autocomplete: 'address-level1',
        },
      ]
    );

    const rules = computed(() => ({
      address: {
        required: helpers.withMessage('Address is required', required),
      },
      lga: {
        required: helpers.withMessage('City/LGA is required', required),
      },
      type: {
        required: helpers.withMessage('Address type is required', required),
      },
      country: {
        required: helpers.withMessage('Country is required', required),
      },
    }));

    const form$: Ref<{ $invalid: boolean }> = useVuelidate(rules, form);

    const processedForm = computed(() => {
      const { type, country, state, ...restOfForm } = form;
      return {
        type: type?.value,
        country: country?.value,
        state: state?.value,
        ...restOfForm,
      };
    });

    function submitForm() {
      if (!form$.value.$invalid) {
        submitting.value = true;

        try {
          if (!props.creationMode) {
            void store
              .dispatch('customers/EDIT_CUSTOMER_ADDRESS', {
                customerId: props.customerId,
                customerAddressId: props.customerAddressId,
                form: processedForm.value,
              })
              .then(async () => {
                submitting.value = false;
                await props.postUpdate();
                props.currentDialogRef.hide();
                return;
              })
              .catch(() => {
                submitting.value = false;
              });
          } else {
            store
              .dispatch('customers/CREATE_CUSTOMER_ADDRESS', {
                customerId: props.customerId,
                form: processedForm.value,
              })
              .then(async () => {
                submitting.value = false;
                await props.postUpdate();
                props.currentDialogRef.hide();
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

    const stopFetchCurrentlyViewedAddress = watchEffect(() => {
      if (!props.creationMode && props.customerId && props.customerAddressId) {
        loading.value = true;
        void store
          .dispatch('customers/FETCH_CURRENTLY_VIEWED_ADDRESS', {
            customerId: props.customerId,
            customerAddressId: props.customerAddressId,
          })
          .then(async () => {
            currentAddress = computed(
              () =>
                store.getters[
                  'customers/GET_CURRENTLY_VIEWED_ADDRESS'
                ] as CurrentlyViewedAddress
            );

            form.address = currentAddress?.value?.street_address ?? '';
            form.type = addressTypeOptions.value.filter(
              (type) => type.value === currentAddress?.value?.address_type
            )[0];
            form.lga = currentAddress?.value?.city ?? '';
            form.postal_code = currentAddress?.value?.postal_code ?? '';
            form.country = currentAddress?.value?.addressCountry
              ? {
                  label: currentAddress?.value?.addressCountry?.name ?? '',
                  value: currentAddress?.value?.addressCountry?.id ?? null,
                }
              : null;
            // Fetch the states for the current country
            if (form.country) {
              await store
                .dispatch('countries_states/FETCH_COUNTRY_STATES_FOR_SELECT', {
                  countryId: form.country?.value,
                })
                .then(() => {
                  // Then update the current state
                  form.state = currentAddress?.value?.addressState
                    ? {
                        label: currentAddress?.value?.addressState?.name ?? '',
                        value: currentAddress?.value?.addressState?.id ?? null,
                      }
                    : null;
                });
            } else {
              // Attempt to update the state, irrespective
              form.state = currentAddress?.value?.addressState
                ? {
                    label: currentAddress?.value?.addressState?.name ?? '',
                    value: currentAddress?.value?.addressState?.id ?? null,
                  }
                : null;
            }

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

    watch(
      () => form.country,
      (country) => {
        form.state = null;
        if (country?.value) {
          void store.dispatch(
            'countries_states/FETCH_COUNTRY_STATES_FOR_SELECT',
            { countryId: country?.value }
          );
        }
      }
    );

    onBeforeMount(() => {
      stopFetchCurrentlyViewedAddress();
      stopFetchCountriesForSelect();
      stopFetchCustomerTitlesForSelect();
    });

    return {
      loading,
      customer: currentAddress,
      text: ref(''),
      ph: ref(''),
      dense: ref(false),
      dismissed: ref(false),
      submitting,
      form,
      submitForm,
      customerFormSchema,
      customerTitles,
      form$,
      resourcePermissions: useResourcePermissions({
        view: PERMISSION.CAN_VIEW_CUSTOMERS,
        list: PERMISSION.CAN_LIST_CUSTOMERS,
      }),
    };
  },
});
</script>
