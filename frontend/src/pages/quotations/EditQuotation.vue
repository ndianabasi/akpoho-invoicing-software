<template>
  <div class="q-pa-md">
    <view-card
      :title-info="titleInfo"
      show-avatar
      show-title-panel-side
      card-container-classes="col-md-10 col-xl-9 col-sm-12 col-xs-12"
    >
      <template #body-panel>
        <form class="q-pa-md" @submit="onSubmit">
          <div class="row">
            <div class="col col-md-4 col-lg-3 col-sm-6 col-xs-12">
              <q-input
                v-model="form.date"
                label="Quotation Date"
                filled
                fill-mask
                mask="####-##-##"
                dense
                class="q-mb-sm-sm q-mb-md-md"
              >
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="form.date"
                        today-btn
                        minimal
                        mask="YYYY-MM-DD"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col col-md-4 col-lg-3 col-sm-6 col-xs-12">
              <q-input
                v-model="form.code"
                type="text"
                for="quotationCode"
                filled
                clearable
                bottom-slots
                label="Quotation Code"
                aria-autocomplete="off"
                autocomplete="off"
                class="q-ml-sm-sm q-ml-md-md q-mb-sm-sm q-mb-md-md"
                dense
              >
                <!-- <template #error>
                  {{ formErrors[field.name] }}
                </template> -->

                <template #hint></template>
              </q-input>
            </div>
            <div class="col col-md-6 col-lg-6 col-sm-12 col-xs-12">
              <quasar-select
                ref="customerSelect"
                v-model="form.customerId"
                filled
                aria-autocomplete="list"
                autocomplete="off"
                :options="customersForSelect"
                label="Customer"
                name="customerSelect"
                for="customerSelect"
                clearable
                bottom-slots
                options-dense
                use-input
                :input-debounce="250"
                class="q-ml-sm-sm q-ml-md-md q-mb-sm-sm q-mb-md-md"
                transition-show="scale"
                transition-hide="scale"
                emit-value
                map-options
                dense
                async-filter-action="customers/FETCH_CUSTOMERS_FOR_SELECT"
                async-filter-mode
              >
                <!-- <template v-if="field?.icon" #before>
                <q-icon :name="field?.icon ?? ''" />
              </template>
              <template #error>
                {{ formErrors[field.name] }}
              </template> -->
                <template #hint> Search for customer </template>
              </quasar-select>
            </div>
          </div>
          <div class="row q-gutter-lg-md q-gutter-md-sm">
            <div class="col col-md-6 col-lg-6 col-sm-12 col-xs-12">
              <quasar-select
                ref="customerAddressSelect"
                v-model="form.customerAddressId"
                filled
                aria-autocomplete="list"
                autocomplete="off"
                :options="customerAddresses"
                label="Billing Address"
                name="customerAddressSelect"
                for="customerAddressSelect"
                clearable
                bottom-slots
                options-dense
                use-input
                :input-debounce="250"
                class="q-mb-sm-sm q-mb-md-md"
                transition-show="scale"
                transition-hide="scale"
                emit-value
                map-options
                dense
                :disable="!form.customerId"
              >
                <!-- <template v-if="field?.icon" #before>
                <q-icon :name="field?.icon ?? ''" />
              </template>
              <template #error>
                {{ formErrors[field.name] }}
              </template> -->
                <template #hint>
                  <div v-if="!form.customerId">Select customer first</div>
                  <div v-else>
                    {{
                      customerAddresses && customerAddresses.length
                        ? `${customerAddresses.length} address(es) available`
                        : ''
                    }}
                  </div>
                </template>
              </quasar-select>
            </div>
            <div class="col col-md-6 col-lg-6 col-sm-12 col-xs-12">
              <q-input
                v-model="form.description"
                type="text"
                for="description"
                filled
                clearable
                bottom-slots
                label="Description"
                aria-autocomplete="off"
                autocomplete="off"
                class="q-mb-sm-sm q-mb-md-md"
                dense
              >
                <!-- <template #error>
                  {{ formErrors[field.name] }}
                </template> -->

                <template #hint></template>
              </q-input>
            </div>
          </div>
          <div class="row">
            <div class="col col-12">
              <q-table
                :rows="form.items"
                :columns="ItemsColumns"
                :visible-columns="visibleColumns"
                row-key="productId"
                dense
                flat
                table-class="quotation-invoice-table"
                table-header-class="quotation-invoice-table-header"
                no-data-label="No items added yet"
                :rows-per-page-options="[0]"
              >
                <template #header="props">
                  <q-tr :props="props">
                    <!-- Use for auto-numbering -->
                    <q-th auto-width />
                    <!-- Use for reordering handle -->
                    <q-th auto-width />
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      {{ col.label }}
                    </q-th>
                    <q-th auto-width />
                  </q-tr>
                </template>

                <template #body="props">
                  <q-tr :props="props" class="q-my-auto">
                    <q-td auto-width>
                      <div>{{ props.rowIndex + 1 }}</div>
                    </q-td>
                    <q-td auto-width>
                      <q-btn
                        class="drag-handle"
                        size="sm"
                        color="accent"
                        round
                        dense
                        icon="unfold_more"
                        flat
                      />
                    </q-td>
                    <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                      :auto-width="col.autoWidth"
                    >
                      <q-input
                        v-if="
                          col.componentType === 'input' &&
                          form.items[props.rowIndex]
                        "
                        :key="`field_${col.name}_${col.componentType}__index_${props.rowIndex}`"
                        :ref="col.name + '__index_' + props.rowIndex"
                        v-model="form.items[props.rowIndex][col.name]"
                        :type="col.componentTypeVariant"
                        :autogrow="
                          col.componentTypeVariant === 'textarea' ||
                          col.componentTypeVariant === 'text'
                        "
                        :mask="col.mask"
                        :fill-mask="col.fillMask"
                        :reverse-fill-mask="col.reverseFillMask"
                        :hint="col.hint"
                        :input-class="col.inputClass"
                        :for="col.name + '__index_' + props.rowIndex"
                        filled
                        bottom-slots
                        aria-autocomplete="off"
                        autocomplete="off"
                        class=""
                        dense
                        :aria-disabled="col.disabled"
                        :disable="col.disabled"
                        :min="col.min"
                      >
                        <!-- <template #error>
                          {{ formErrors[col.name] }}
                        </template>

                        <template #hint></template> -->
                      </q-input>

                      <quasar-select
                        v-if="
                          col.componentType === 'select' &&
                          form.items[props.rowIndex]
                        "
                        :key="`field_${col.name}_${col.componentType}__index_${props.rowIndex}`"
                        :ref="col.name + '__index_' + props.rowIndex"
                        v-model="form.items[props.rowIndex][col.name]"
                        :multiple="col.componentTypeVariant === 'multi-select'"
                        filled
                        aria-autocomplete="list"
                        autocomplete="off"
                        :options="col.options"
                        :name="col.name + '__index_' + props.rowIndex"
                        :for="col.name + '__index_' + props.rowIndex"
                        bottom-slots
                        options-dense
                        use-input
                        :input-debounce="200"
                        class=""
                        transition-show="scale"
                        transition-hide="scale"
                        emit-value
                        map-options
                        dense
                        :aria-disabled="col.disabled"
                        :disable="col.disabled"
                        :clearable="false"
                        :async-filter-action="col.asyncFilterAction"
                        :async-filter-mode="col.asyncFilterMode"
                      >
                        <!-- <template v-if="col?.icon" #before>
                          <q-icon :name="col?.icon ?? ''" />
                        </template>
                        <template #error>
                          {{ formErrors[col.name] }}
                        </template> -->
                      </quasar-select>
                    </q-td>
                    <q-td auto-width>
                      <q-btn
                        v-if="!isLastItem(props.rowIndex)"
                        color="danger"
                        round
                        flat
                        dense
                        icon="delete_outline"
                        @click="removeItem(props.rowIndex)"
                      />
                      <q-btn-dropdown
                        v-if="isLastItem(props.rowIndex)"
                        class="add-item-dropdown"
                        icon="playlist_add"
                        split
                        flat
                        auto-close
                        unelevated
                        ripple
                        :color="$q.dark ? 'accent' : 'primary'"
                        @click="addItemLines(1)"
                      >
                        <q-list>
                          <q-item
                            v-for="(number, listIndex) in addItemsDropdownList"
                            :key="'add_' + number + 'items'"
                            clickable
                            @click="
                              addItemLines(addItemsDropdownList[listIndex])
                            "
                          >
                            <q-item-section>
                              <q-item-label
                                >Add {{ number }} lines</q-item-label
                              >
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
        </form>
      </template>

      <template #footer-panel>
        <div class="row justify-center q-my-xl">
          <q-btn
            type="submit"
            :loading="isSubmitting"
            label="Submit"
            class="q-mt-md"
            icon-right="send"
            @click="onSubmit"
          >
            <!-- eslint-disable-next-line vue/v-slot-style -->
            <template #loading>
              <q-spinner-facebook color="white" />
            </template>
          </q-btn>
        </div>
      </template>

      <template v-if="!creationMode && !myAccountMode" #title-panel-side>
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
                  name: 'view_company',
                  params: { companyId: companyId }, //companyId from route props
                }"
              >
                <q-item-section>
                  <q-btn flat icon="visibility" />
                </q-item-section>
                <q-item-section>View Company</q-item-section>
              </q-item>

              <q-item
                v-if="resourcePermissions.canList"
                :to="{
                  name: 'all_companies',
                }"
              >
                <q-item-section>
                  <q-btn flat icon="view_list" />
                </q-item-section>
                <q-item-section>All Companies</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>
    </view-card>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
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
  nextTick,
  onMounted,
} from 'vue';

import ViewCard from '../../components/ViewCard.vue';
import useTitleInfo from '../../composables/useTitleInfo';
import useResourcePermissions from '../../composables/useResourcePermissions';
import {
  CurrentlyViewedCompany,
  SelectionOption,
  PERMISSION,
  TitleInfo,
  CompanyFormShape,
  FormSchema,
  CustomerAddressType,
  SelectOption,
  QuotationInvoiceItemShape,
  QuotationInvoiceFormShape,
} from '../../store/types';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import QuasarSelect from '../../components/QuasarSelect';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { phoneNumberRegex } from '../../helpers/utils';
import { isEqual } from 'lodash';
import ItemsColumns from '../../components/data/table-definitions/quotation_invoice_items';

export default defineComponent({
  name: 'EditQuotation',

  components: {
    ViewCard,
    QuasarSelect,
  },

  props: {
    companyId: {
      type: String,
      required: false,
      default: '',
    },
    creationMode: {
      type: Boolean,
      default: false,
    },
    myAccountMode: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const companyCreated = ref(false);
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();

    const customerAddresses = computed({
      get: () =>
        store.getters[
          'customers/GET_CUSTOMER_ADDRESSES_FOR_SELECT'
        ] as SelectOption[],
      set: (value) => value,
    });

    const form: QuotationInvoiceFormShape = reactive({
      date: null,
      code: '',
      customerId: null,
      customerAddressId: null,
      description: '',
      items: [],
    });

    const quotationItemShape: QuotationInvoiceItemShape = {
      productId: null,
      description: '',
      qty: null,
      UOM: 'set',
      unitPrice: null,
      unitDiscount: null,
      discountType: 'number',
    };

    const addItemLines = (numberOfLines = 1) => {
      for (let i = 0; i < numberOfLines; i++) {
        // Spread operator used to clone object to avoid
        // object reference issues
        form.items.push({ ...quotationItemShape });
      }
    };

    const removeItem = (index: number) => form.items.splice(index, 1);

    const isLastItem = (index: number) => form.items.length - 1 === index;

    const visibleColumns = computed(() => {
      return ItemsColumns.filter((column) => column.required);
    });

    const addItemsDropdownList = ref([2, 5, 10, 20]);

    // Valiation section starts

    const formSchema = computed(() =>
      yup.object({
        isPersonalBrand: yup.boolean(),
        name: yup.string().required('Name is required').nullable(),
        email: yup
          .string()
          .email('Email is not valid')
          .required('Email is required'),
        phoneNumber: yup
          .string()
          .matches(phoneNumberRegex, 'Please provide a valid phone number')
          .nullable(),
        address: yup.string().optional().nullable(),
        city: yup.string().required('City is required').nullable(),
        size: yup.number().required('Company Size is required').nullable(),
        stateId: yup.number().required('State is required').nullable(),
        countryId: yup.number().required('Country is required').nullable(),
        website: yup.string().optional().nullable(),
      })
    );

    const {
      handleSubmit,
      errors: formErrors,
      isSubmitting,
      values,
    } = useForm<CompanyFormShape>({
      /* validationSchema: formSchema.value,
      initialValues, */
    });

    /* const { value: isPersonalBrand } = useField('isPersonalBrand'); */

    // Form schema for form generation

    // Valiation section ends

    /* watch(
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
    ); */

    const onSubmit = handleSubmit((form) => {
      void nextTick(() => {
        const isCreationMode = props.creationMode;
        void store
          .dispatch(
            `companies/${isCreationMode ? 'CREATE_COMPANY' : 'EDIT_COMPANY'}`,
            isCreationMode ? form : { form, companyId: props.companyId }
          )
          .then((id: string) => {
            companyCreated.value = true;
            void store.dispatch('auth/FETCH_AUTH_PROFILE');
            void nextTick(() => {
              void router.push({
                name: 'view_company',
                params: { companyId: id },
              });
            });
          })
          .catch((error) => {
            console.error(error);
          });
      });
    });

    let titleInfo: Ref<TitleInfo | null> = ref(null);

    /* watch(
      currentCompany,
      () => {
        const title =
          currentCompany && currentCompany.value
            ? useTitleInfo({
                title: currentCompany.value.name ?? '',
                avatar: undefined,
              })
            : props.creationMode
            ? useTitleInfo({
                title: 'New Company',
                avatar: '',
              })
            : ref(null);

        titleInfo.value = title.value;
      },
      { deep: true }
    ); */

    watch(
      () => form.customerId,
      async (customerId) => {
        if (!customerId) {
          customerAddresses.value = [];
          form.customerAddressId = null;
          return;
        }

        await store
          .dispatch('customers/FETCH_CUSTOMER_ADDRESSES_FOR_SELECT', {
            type: 'billing_address' as CustomerAddressType,
            customerId,
          })
          .then(() => {
            customerAddresses.value = store.getters[
              'countries_states/GET_CUSTOMER_ADDRESSES_FOR_SELECT'
            ] as SelectionOption[];
          });
      }
    );

    /* const stopFetchCurrentlyViewedCompany = watchEffect(() => {
      if (!props.creationMode) {
        void store
          .dispatch('companies/FETCH_CURRENTLY_VIEWED_COMPANY', {
            companyId: props.companyId,
          })
          .then(async () => {
            currentCompany.value = unref(
              computed(
                () =>
                  store.getters[
                    'companies/GET_CURRENTLY_VIEWED_COMPANY'
                  ] as CurrentlyViewedCompany
              )
            );

            isPersonalBrand.value = currentCompany?.value?.type === 'personal';
            name.value = currentCompany?.value?.name ?? '';
            email.value = currentCompany?.value?.email ?? '';
            phoneNumber.value = currentCompany?.value?.phone_number ?? '';
            address.value = currentCompany?.value?.address ?? '';
            city.value = currentCompany?.value?.city ?? '';
            size.value = currentCompany?.value?.companySize?.id ?? null;
            website.value = currentCompany?.value?.website ?? '';
            countryId.value = currentCompany?.value?.country?.id ?? null;
            // Fetch the states for the current country
            if (countryId.value) {
              await store
                .dispatch('countries_states/FETCH_COUNTRY_STATES_FOR_SELECT', {
                  countryId: countryId.value,
                })
                .then(() => {
                  // Then update the current state
                  stateId.value = currentCompany?.value?.state?.id ?? null;
                });
            } else {
              // Then update the current state
              countryId.value = currentCompany?.value?.state?.id ?? null;
            }
          });
      }
    }); */

    /* watch(
      () => countryId.value,
      (country) => {
        if (country) {
          stateId.value = null;
          void store.dispatch(
            'countries_states/FETCH_COUNTRY_STATES_FOR_SELECT',
            { countryId: country }
          );

          countryStates.value = store.getters[
            'countries_states/GET_COUNTRY_STATES_FOR_SELECT'
          ] as SelectionOption[];
        }
      }
    ); */

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const CAN_EDIT_COMPANIES = computed(() =>
      store.getters['permissions/GET_USER_PERMISSION']('can_edit_companies')
    );

    onMounted(() => {
      /* if (props.creationMode)  */
      void addItemLines(3);
    });

    onBeforeMount(() => {
      //stopFetchCurrentlyViewedCompany();
      /* stopFetchCountriesForSelect();
      stopFetchCompanySizesForSelect(); */
    });

    /*onBeforeRouteLeave((to, from, next) => {
      if (companyCreated.value) {
        return next();
      }

      const didFormValuesChange = !isEqual(initialValues , values);
       if (didFormValuesChange) {
        $q.dialog({
          message: 'Form has changed. Do you really want to leave this page?',
          title: 'Data loss warning',
          persistent: true,
          cancel: true,
        })
          .onOk(() => {
            return next();
          })
          .onCancel(() => {
            return false;
          });
      } else return next();
    });*/

    return {
      //quotation: currentQuotation,
      text: ref(''),
      ph: ref(''),
      dense: ref(false),
      dismissed: ref(false),
      form,
      titleInfo,
      customerAddresses,
      resourcePermissions: useResourcePermissions({
        view: PERMISSION.CAN_VIEW_COMPANIES,
        list: PERMISSION.CAN_LIST_COMPANIES,
      }),
      CAN_EDIT_COMPANIES,
      isSubmitting,
      onSubmit,
      formErrors,
      addItemLines,
      removeItem,
      isLastItem,
      addItemsDropdownList,
      visibleColumns,
      ItemsColumns,
    };
  },
});
</script>
