<template>
  <q-card class="my-card">
    <q-card-section>
      <form style="width: 500px; max-width: 90vw" @submit.prevent="submitForm">
        <div class="text-h6 q-mb-md">Edit Address</div>
        <template v-for="field in customerFormSchema">
          <q-input
            v-if="field.componentType === 'input' && field.isVisible"
            :key="`field_${field.name}_${field.componentType}`"
            v-model="form[field.name]"
            :type="field.inputType"
            :autogrow="field.inputType === 'textarea'"
            filled
            clearable
            bottom-slots
            :label="field.label"
            :dense="dense"
            class="q-mb-md"
          >
          </q-input>

          <q-select
            v-if="field.componentType === 'select' && field.isVisible"
            :key="`field_${field.name}_${field.componentType}`"
            :ref="field.name"
            v-model="form[field.name]"
            filled
            :options="field.options"
            :label="field.label"
            :name="field.name"
            clearable
            bottom-slots
            options-dense
            use-input
            input-debounce="0"
            class="q-mb-md"
            transition-show="scale"
            transition-hide="scale"
            emit-value
            map-options
            @filter="selectFilterFn"
          >
          </q-select>
        </template>
      </form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat color="primary" label="Submit" @click.prevent="submitForm" />
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
  CustomerAddressInterface,
} from '../../store/types';
import { Notify } from 'quasar';
import { FetchTableDataInterface } from '../../types/table';

export default defineComponent({
  name: 'EditCustomerAddress',

  components: {},

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

    const form: CustomerAddressInterface = reactive({
      address: '',
      lga: '',
      postal_code: '',
      state: null,
      country: null,
      type: null,
    });

    interface SelectCallback {
      (
        val: string,
        update: (fn: () => void, ref?: (ref: { name: string }) => void) => void
      ): void;
    }

    const plainCountries = ref(unref(countries));
    const plainCountryStates = ref(unref(countryStates));

    const selectFilterFn: SelectCallback = function (val, update) {
      let plainOptions: Ref<SelectionOption[]>;
      let computedOptions: ComputedRef<SelectionOption[]>;

      update(
        () => {
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        },
        (ref) => {
          const refName = ref.name;
          if (refName === 'country') {
            plainOptions = plainCountries;
            computedOptions = countries;
          } else if (refName === 'state') {
            plainOptions = plainCountryStates;
            computedOptions = countryStates;
          }

          if (val === '') plainOptions.value = computedOptions.value;
          else {
            const needle = val.toLowerCase();
            plainOptions.value = computedOptions.value.filter(
              (v) => v.label.toLowerCase().indexOf(needle) > -1
            );
          }
        }
      );

      return;
    };

    const customerFormSchema = computed(() => [
      {
        name: 'type',
        label: 'Address Type',
        default: null,
        componentType: 'select',
        options: [
          { label: 'Billing', value: 'billing_address' },
          { label: 'Shipping', value: 'shipping_address' },
        ],
        isVisible: true,
      },
      {
        name: 'address',
        label: 'Address Line',
        default: '',
        componentType: 'input',
        inputType: 'textarea',
        isVisible: true,
      },
      {
        name: 'lga',
        label: 'LGA/County',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible: true,
      },
      {
        name: 'postal_code',
        label: 'Postal Code',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible: true,
      },
      {
        name: 'country',
        label: 'Country',
        default: null,
        componentType: 'select',
        options: unref(plainCountries),
        isVisible: true,
      },
      {
        name: 'state',
        label: 'State/Region',
        default: null,
        componentType: 'select',
        options: unref(plainCountryStates),
        isVisible: true,
      },
    ]);

    function submitForm() {
      submitting.value = true;

      try {
        if (!props.creationMode) {
          void store
            .dispatch('customers/EDIT_CUSTOMER_ADDRESS', {
              customerId: props.customerId,
              customerAddressId: props.customerAddressId,
              form: form,
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
              form: form,
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
    }

    const stopFetchCurrentlyViewedAddress = watchEffect(() => {
      if (!props.creationMode && props.customerId && props.customerAddressId) {
        void store
          .dispatch('customers/FETCH_CURRENTLY_VIEWED_ADDRESS', {
            customerId: props.customerId,
            customerAddressId: props.customerAddressId,
          })
          .then(() => {
            currentAddress = computed(
              () =>
                store.getters[
                  'customers/GET_CURRENTLY_VIEWED_ADDRESS'
                ] as CurrentlyViewedAddress
            );

            form.address = currentAddress?.value?.street_address ?? '';
            form.type = currentAddress?.value?.address_type ?? '';
            form.lga = currentAddress?.value?.city ?? '';
            form.postal_code = currentAddress?.value?.postal_code ?? '';
            form.country = currentAddress?.value?.addressCountry?.id ?? null;
            // Fetch the states for the current country
            void store
              .dispatch('countries_states/FETCH_COUNTRY_STATES_FOR_SELECT', {
                countryId: form.country,
              })
              .then(() => {
                // Then update the current state
                form.state = currentAddress?.value?.addressState?.id ?? null;
              });
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
      (newValue) => {
        form.state = null;
        if (newValue) {
          void store.dispatch(
            'countries_states/FETCH_COUNTRY_STATES_FOR_SELECT',
            { countryId: newValue }
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
      customer: currentAddress,
      text: ref(''),
      ph: ref(''),
      dense: ref(false),
      dismissed: ref(false),
      submitting,
      form,
      submitForm,
      customerFormSchema,
      selectFilterFn,
      customerTitles,
      resourcePermissions: useResourcePermissions({
        view: PERMISSION.CAN_VIEW_CUSTOMERS,
        list: PERMISSION.CAN_LIST_CUSTOMERS,
      }),
    };
  },
});
</script>
