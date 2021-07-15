<template>
  <div class="q-pa-md">
    <view-card
      v-if="!loading || creationMode"
      :title-info="!creationMode ? titleInfo : null"
      :show-avatar="false"
      show-title-panel-side
      card-container-classes="col-12"
      :loading="loading && !creationMode"
    >
      <template #body-panel>
        <form class="q-pa-md" @submit="onSubmit">
          <div class="row q-gutter-sm">
            <div class="col col-md-2 col-lg-2 col-sm-6 col-xs-12">
              <q-input
                v-model="form.date"
                label="Quotation Date"
                stack-label
                dense
                filled
                type="date"
                for="date"
              />
            </div>
            <div class="col col-md-2 col-lg-2 col-sm-6 col-xs-12">
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
                class="q-mb-sm-sm q-mb-md-md"
                dense
                :debounce="250"
              >
                <!-- <template #error>
                  {{ formErrors[field.name] }}
                </template> -->

                <template #hint></template>
              </q-input>
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col col-md-4 col-lg-4 col-sm-12 col-xs-12">
              <quasar-select
                ref="customerSelect"
                v-model="form.customerId"
                filled
                aria-autocomplete="list"
                autocomplete="off"
                :options="customersForSelectOptions"
                label="Customer"
                name="customerSelect"
                for="customerSelect"
                clearable
                bottom-slots
                options-dense
                use-input
                :emit-value="false"
                :map-options="false"
                :input-debounce="250"
                class="q-mb-sm-sm q-mb-md-md"
                transition-show="scale"
                transition-hide="scale"
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
                <template #no-option="{ inputValue }">
                  <div v-if="inputValue" class="q-ml-sm">
                    No customer found for query: <b>{{ inputValue }}</b>
                  </div>
                </template>
              </quasar-select>
            </div>
            <div class="col col-md-4 col-lg-4 col-sm-12 col-xs-12">
              <quasar-select
                ref="customerBillingAddressSelect"
                v-model="form.customerBillingAddressId"
                filled
                aria-autocomplete="list"
                autocomplete="off"
                :options="customerBillingAddresses"
                label="Billing Address"
                name="customerBillingAddressSelect"
                for="customerBillingAddressSelect"
                clearable
                bottom-slots
                options-dense
                :use-input="false"
                :input-debounce="250"
                class="q-mb-sm-sm q-mb-md-md"
                transition-show="scale"
                transition-hide="scale"
                :emit-value="false"
                :map-options="false"
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
                      customerBillingAddresses &&
                      customerBillingAddresses.length
                        ? `${
                            customerBillingAddresses.length === 1
                              ? '1 billing address'
                              : customerBillingAddresses.length +
                                ' billing addresses'
                          } available`
                        : ''
                    }}
                  </div>
                </template>
              </quasar-select>
            </div>
            <div class="col col-md-4 col-lg-4 col-sm-12 col-xs-12">
              <quasar-select
                ref="customerShippingAddressSelect"
                v-model="form.customerShippingAddressId"
                filled
                aria-autocomplete="list"
                autocomplete="off"
                :options="customerShippingAddresses"
                label="Shipping Address"
                name="customerShippingAddressSelect"
                for="customerShippingAddressSelect"
                clearable
                bottom-slots
                options-dense
                :use-input="false"
                :input-debounce="250"
                class="q-mb-sm-sm q-mb-md-md"
                transition-show="scale"
                transition-hide="scale"
                :emit-value="false"
                :map-options="false"
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
                      customerShippingAddresses &&
                      customerShippingAddresses.length
                        ? `${
                            customerShippingAddresses.length === 1
                              ? '1 shipping address'
                              : customerShippingAddresses.length +
                                ' shipping addresses'
                          } available`
                        : ''
                    }}
                  </div>
                </template>
              </quasar-select>
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col col-md-6 col-lg-6 col-sm-12 col-xs-12">
              <q-input
                v-model="form.title"
                type="text"
                for="title"
                filled
                clearable
                bottom-slots
                autogrow
                label="Title"
                aria-autocomplete="off"
                autocomplete="off"
                class="q-mb-sm-sm q-mb-md-sm"
                dense
                :debounce="250"
              >
                <!-- <template #error>
                  {{ formErrors[field.name] }}
                </template> -->

                <template #hint></template>
              </q-input>
            </div>
            <div class="col col-md-6 col-lg-6 col-sm-12 col-xs-12">
              <q-input
                v-if="!form.useEditor"
                v-model="form.introduction"
                type="textarea"
                for="introduction"
                filled
                clearable
                bottom-slots
                label="Introduction"
                aria-autocomplete="off"
                autocomplete="off"
                class="q-mb-sm-sm q-mb-md-sm"
                dense
                :debounce="250"
              >
                <!-- <template #error>
                  {{ formErrors[field.name] }}
                </template> -->

                <template #hint></template>
              </q-input>
              <template v-else>
                <label
                  class="q-field__label no-pointer-events text-body2"
                  for="introduction"
                  >Introduction</label
                >
                <q-editor
                  v-model="form.introduction"
                  class="q-mb-lg"
                  min-height="5rem"
                  placeholder="Introduction"
                />
              </template>
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col col-12">
              <InvoiceQuotationTable
                :form="form"
                :enable-image-uploads="enableImageUploads"
                :creation-mode="creationMode"
                @form-updated="updateForm"
              />
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col col-md-9 col-lg-9 col-sm-12 col-xs-12">
              <q-input
                v-if="!form.useEditor"
                v-model="form.notes"
                type="textarea"
                for="notes"
                filled
                clearable
                bottom-slots
                label="Notes"
                aria-autocomplete="off"
                autocomplete="off"
                class="q-mb-sm-sm q-mb-md-sm"
                dense
                :debounce="250"
              >
                <!-- <template #error>
                  {{ formErrors[field.name] }}
                </template> -->

                <template #hint></template>
              </q-input>
              <template v-else>
                <label
                  class="q-field__label no-pointer-events text-body2"
                  for="notes"
                  >Notes</label
                >
                <q-editor
                  v-model="form.notes"
                  class="q-mb-md-lg q-mb-sm-md"
                  min-height="5rem"
                  placeholder="Notes"
                />
              </template>
            </div>
          </div>
          <q-expansion-item
            expand-separator
            icon="settings"
            color="accent"
            label="Settings"
            class="quotation-settings-accordion q-mt-md"
            dense
          >
            <div class="row">
              <div class="col col-12">
                <q-toggle
                  v-model="form.useCustomSerialNumbers"
                  checked-icon="check"
                  color="positive"
                  label="Use custom serial numbers"
                  unchecked-icon="clear"
                />
              </div>
              <div class="col col-12">
                <q-toggle
                  v-model="form.simpleQuantities"
                  checked-icon="check"
                  color="positive"
                  label="Use simple quantities"
                  unchecked-icon="clear"
                />
              </div>
              <div class="col col-12">
                <div class="row q-gutter-lg">
                  <q-toggle
                    v-model="form.amountsAreTaxInclusive"
                    checked-icon="check"
                    color="positive"
                    label="Amounts include taxes"
                    unchecked-icon="clear"
                  />
                  <q-input
                    v-if="!form.amountsAreTaxInclusive"
                    v-model.number="form.taxPercentage"
                    filled
                    dense
                    class="tax-input"
                    input-class=" text-right"
                    stack-label
                    :debounce="250"
                  >
                    <template #append>
                      <div class="text-body2">%</div>
                    </template>
                    <template #prepend>
                      <div class="text-body2">Tax</div>
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="col col-12">
                <q-toggle
                  v-model="form.changeProductPrices"
                  checked-icon="check"
                  color="positive"
                  label="Change product prices"
                  unchecked-icon="clear"
                />
              </div>
              <div class="col col-12">
                <div class="row q-gutter-lg">
                  <q-toggle
                    v-model="form.roundAmounts"
                    checked-icon="check"
                    color="positive"
                    label="Round amounts"
                    unchecked-icon="clear"
                  />
                  <q-select
                    v-if="form.roundAmounts"
                    v-model="form.roundAmountType"
                    filled
                    :options="roundTypeOptions"
                    dense
                    options-dense
                    transition-show="scale"
                    transition-hide="scale"
                    emit-value
                    map-options
                  />
                </div>
              </div>
              <div class="col col-12">
                <q-toggle
                  v-model="form.calculateTotals"
                  checked-icon="check"
                  color="positive"
                  label="Calculate totals"
                  unchecked-icon="clear"
                />
              </div>
              <div class="col col-12">
                <div class="row q-gutter-lg">
                  <q-toggle
                    v-model="form.showDiscounts"
                    checked-icon="check"
                    color="positive"
                    label="Show discounts"
                    unchecked-icon="clear"
                  />
                  <q-select
                    v-if="form.showDiscounts && !form.setDiscountTypePerLine"
                    v-model="form.discountType"
                    filled
                    :options="discountTypeOptions"
                    dense
                    options-dense
                    transition-show="scale"
                    transition-hide="scale"
                    emit-value
                    map-options
                  />
                </div>
              </div>
              <div v-if="form.showDiscounts" class="col col-12">
                <q-toggle
                  v-model="form.setDiscountTypePerLine"
                  checked-icon="check"
                  color="positive"
                  label="Set discount type per line"
                  unchecked-icon="clear"
                />
              </div>
              <div class="col col-12">
                <div class="row">
                  <div class="col col-sm-12 col-md-6">
                    <q-select
                      v-model="form.numberOfDecimals"
                      filled
                      :options="numberOfDecimalOptions"
                      options-dense
                      dense
                      transition-show="scale"
                      transition-hide="scale"
                      emit-value
                      map-options
                    >
                      <template #before>
                        <div
                          class="
                            before-select-label
                            q-pl-sm
                            text-body1 text-weight-regular text-black
                          "
                        >
                          Number of decimals
                        </div>
                      </template>
                    </q-select>
                  </div>
                </div>
              </div>
              <!-- <div class="col q-mt-sm">
                  <div class="row q-gutter-lg">
                    <q-toggle
                      v-model="form.useThousandSeparator"
                      checked-icon="check"
                      color="positive"
                      label="Use thousand separators"
                      unchecked-icon="clear"
                    />
                    <q-select
                      v-if="form.useThousandSeparator"
                      v-model="form.thousandSeparatorType"
                      filled
                      :options="thousandSeparatorOptions"
                      dense
                      options-dense
                      transition-show="scale"
                      transition-hide="scale"
                      emit-value
                      map-options
                    />
                  </div>
                </div> -->
              <div class="col col-12 q-my-sm">
                <div class="row q-gutter-lg">
                  <q-toggle
                    v-model="form.showAdditionalSubtotalDiscount"
                    checked-icon="check"
                    color="positive"
                    label="Show additional subtotal discount"
                    unchecked-icon="clear"
                  />
                  <q-select
                    v-if="form.showAdditionalSubtotalDiscount"
                    v-model="form.additionalDiscountType"
                    filled
                    :options="discountTypeOptions"
                    dense
                    options-dense
                    transition-show="scale"
                    transition-hide="scale"
                    emit-value
                    map-options
                    class="additional-discount-select"
                  />
                  <q-input
                    v-if="form.showAdditionalSubtotalDiscount"
                    v-model.number="form.additionalDiscountAmount"
                    filled
                    dense
                    class="additional-discount-input"
                    autogrow
                    label="Discount amount"
                    stack-label
                    :debounce="250"
                  >
                    <template
                      v-if="form.additionalDiscountType === 'percentage'"
                      #append
                    >
                      <div class="text-body2">%</div>
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="col col-12">
                <q-toggle
                  v-model="form.showAdditionalFees"
                  checked-icon="check"
                  color="positive"
                  label="Set additional fees"
                  unchecked-icon="clear"
                />
              </div>
              <div class="col col-12">
                <q-toggle
                  v-model="form.useEditor"
                  checked-icon="check"
                  color="positive"
                  label="Use WYSIWYG Editor"
                  unchecked-icon="clear"
                />
              </div>
              <div v-if="enableImageUploads" class="col col-12">
                <q-toggle
                  v-model="form.showImages"
                  checked-icon="check"
                  color="positive"
                  label="Show/Add images"
                  unchecked-icon="clear"
                />
              </div>
            </div>
          </q-expansion-item>
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
                  name: 'view_quotation',
                  params: { quotationId: quotationId }, //quotationId from route props
                }"
              >
                <q-item-section>
                  <q-btn flat icon="visibility" />
                </q-item-section>
                <q-item-section>View Quotation</q-item-section>
              </q-item>

              <q-item
                v-if="resourcePermissions?.canCreate ?? false"
                :to="{
                  name: 'create_quotation',
                }"
              >
                <q-item-section>
                  <q-btn flat icon="post_add" />
                </q-item-section>
                <q-item-section>Create Quotation</q-item-section>
              </q-item>

              <q-item
                v-if="resourcePermissions?.canList ?? false"
                :to="{
                  name: 'quotations',
                }"
              >
                <q-item-section>
                  <q-btn flat icon="view_list" />
                </q-item-section>
                <q-item-section>All Quotations</q-item-section>
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
  onBeforeUnmount,
  watchEffect,
  watch,
  computed,
  Ref,
  reactive,
  nextTick,
  onMounted,
  unref,
  PropType,
} from 'vue';

import ViewCard from '../../components/ViewCard.vue';
import useTitleInfo from '../../composables/useTitleInfo';
import useResourcePermissions from '../../composables/useResourcePermissions';
import {
  PERMISSION,
  TitleInfo,
  CustomerAddressType,
  SelectOption,
  QuotationInvoiceFormShape,
  CustomerAddressForSelectPayload,
  CurrentlyViewedInvoiceQuotation,
} from '../../store/types';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import QuasarSelect from '../../components/QuasarSelect';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import itemsColumns from '../../components/data/table-definitions/quotation_invoice_items';
//import Sortable from 'sortablejs';
//import thousandFormatter from 'format-thousands/index';
import {
  currentInvoiceQuotation,
  getCurrentInvoiceQuotationData,
  discountTypeOptions,
  numberOfDecimalOptionValues,
  roundTypeOptions,
} from '../../composables/invoices-quotations/useInvoiceQuotation';
import InvoiceQuotationTable from '../../components/InvoiceQuotationTable.vue';

export default defineComponent({
  name: 'EditQuotation',

  components: {
    ViewCard,
    QuasarSelect,
    InvoiceQuotationTable,
  },

  props: {
    quotationId: {
      type: String as PropType<string>,
      required: false,
      default: '',
    },
    creationMode: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    documentType: {
      type: String as PropType<'quotation' | 'invoice'>,
      required: false,
      default: 'quotation',
    },
  },

  setup(props) {
    const quotationCreated = ref(false);
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();
    const isSubmitting = ref(false);
    const fileObjectUrls: Ref<string[][]> = ref([]);
    const loading = ref(true);
    const enableImageUploads = computed(() => false);
    const hasFormChanged = ref(false);
    let titleInfo: Ref<TitleInfo | null> = ref(null);

    const fileUploadProgress = ref(
      [] as Array<
        { error: boolean; color: string; percent: number; icon: string }[]
      >
    );
    let filesUploading: Ref<null[] | number[]> = ref([]);

    const areFilesUploading = computed(
      () => (index: number) => filesUploading.value[index] !== null
    );
    const canUploadFiles = computed(
      () => (index: number) => form.items[index].files !== null
    );

    const cancelFile = (fileIndex: number, rowIndex: number) => {
      if (fileUploadProgress.value?.[rowIndex]) {
        fileUploadProgress.value[rowIndex][fileIndex] = {
          ...fileUploadProgress.value?.[rowIndex]?.[fileIndex],
          error: true,
          color: 'orange-2',
        };
      }

      form.items[rowIndex]?.files?.splice(fileIndex, 1);
      window.URL.revokeObjectURL(fileObjectUrls.value[rowIndex][fileIndex]);
    };

    const updateFiles = (newFiles: Array<File>, rowIndex: number) => {
      console.log(newFiles, rowIndex);

      if (fileObjectUrls.value?.[rowIndex]?.length) {
        fileObjectUrls.value[rowIndex].forEach((url) =>
          window.URL.revokeObjectURL(url)
        );
      }

      fileObjectUrls.value[rowIndex] = (newFiles || []).map((file) => {
        return window.URL.createObjectURL(file);
      });

      form.items[rowIndex].files = newFiles;
      fileUploadProgress.value[rowIndex] = (newFiles || []).map((file) => ({
        error: false,
        color: 'green-2',
        percent: 0,
        icon:
          file.type.indexOf('video/') === 0
            ? 'movie'
            : file.type.indexOf('image/') === 0
            ? 'photo'
            : file.type.indexOf('audio/') === 0
            ? 'audiotrack'
            : 'insert_drive_file',
      }));
    };

    /* const uploadFiles = (rowIndex: number) => {
      const allDone = fileUploadProgress.value[rowIndex].every(
        (progress) => progress.percent === 1
      );

      fileUploadProgress.value[rowIndex] = fileUploadProgress.value[
        rowIndex
      ].map((progress) => ({
        ...progress,
        error: false,
        color: 'green-2',
        percent: allDone === true ? 0 : progress.percent,
      }));
    }; */

    //const dragging = ref(false);

    const numberOfDecimalOptions = computed(() => {
      return numberOfDecimalOptionValues.map((value) => ({
        label: value,
        value,
      }));
    });

    const thousandSeparatorOptions = ref([
      { label: 'None', value: 'none' },
      { label: 'Comma', value: 'comma' },
      { label: 'Period', value: 'period' },
    ]);

    const customersForSelectOptions: Ref<Array<SelectOption>> = ref([]);

    const customerBillingAddresses = computed({
      get: () =>
        store.getters['customers/GET_CUSTOMER_ADDRESSES_FOR_SELECT']
          ?.billingAddresses ?? ([] as SelectOption[]),
      set: (value) => value,
    });

    const customerShippingAddresses = computed({
      get: () =>
        store.getters['customers/GET_CUSTOMER_ADDRESSES_FOR_SELECT']
          ?.shippingAddresses ?? ([] as SelectOption[]),
      set: (value) => value,
    });

    let form: QuotationInvoiceFormShape = reactive({
      items: [] as QuotationInvoiceFormShape['items'],
      additionalFees: [] as QuotationInvoiceFormShape['additionalFees'],
      date: null,
      code: '',
      customerId: null,
      customerBillingAddressId: null,
      customerShippingAddressId: null,
      introduction: '',
      title: '',
      simpleQuantities: true,
      amountsAreTaxInclusive: false,
      taxPercentage: 0,
      roundAmounts: false,
      roundAmountType: 'none',
      showDiscounts: false,
      discountType: 'number',
      setDiscountTypePerLine: false,
      calculateTotals: true,
      changeProductPrices: false,
      numberOfDecimals: 2,
      useThousandSeparator: true,
      thousandSeparatorType: 'comma',
      notes: '',
      theme: null,
      showAdditionalSubtotalDiscount: false,
      additionalDiscountType: 'percentage',
      additionalDiscountAmount: 0,
      showAdditionalFees: false,
      showImages: true,
      useCustomSerialNumbers: false,
      useEditor: false,
    });

    // Watch for changes in quotation settings and items
    // and re-compute (set) the total row
    watch(
      () => form,
      () => {
        // Indicate that form has changed
        hasFormChanged.value = true;

        // Update vuex store
        //store.commit('invoices_quotations/SET_QUOTATION_FORM', form);
      },
      { deep: true }
    );

    const normalisedForm = computed(() => {
      const {
        customerId,
        customerBillingAddressId,
        customerShippingAddressId,
        items,
        ...restOfForm
      } = form;

      const newItems = items.map((item) => {
        const { productId, ...restOfItem } = item;
        return { productId: productId?.value, ...restOfItem };
      });

      const newForm = {
        customerId: customerId?.value,
        customerBillingAddressId: customerBillingAddressId?.value,
        customerShippingAddressId: customerShippingAddressId?.value,
        items: newItems,
        ...restOfForm,
      };

      return newForm;
    });

    const onSubmit = () => {
      console.log(normalisedForm.value);

      void nextTick(() => {
        const isCreationMode = props.creationMode;
        quotationCreated.value = false;

        void store
          .dispatch(
            `invoices_quotations/${
              isCreationMode ? 'CREATE_QUOTATION' : 'EDIT_QUOTATION'
            }`,
            isCreationMode
              ? { form: normalisedForm.value, type: props.documentType }
              : {
                  form: normalisedForm.value,
                  id: props.quotationId,
                  type: props.documentType,
                }
          )
          .then((id: string) => {
            quotationCreated.value = true;
            void nextTick(() => {
              void router.push({
                name: 'view_quotation',
                params: { quotationId: id },
              });
            });
          })
          .catch((error) => {
            console.error(error);
          });
      });
    };

    watch(
      () => form.customerId,
      async (customerId) => {
        if (!customerId) {
          customerBillingAddresses.value = [];
          customerShippingAddresses.value = [];
          form.customerBillingAddressId = null;
          form.customerShippingAddressId = null;
          return;
        }

        // clear the billing/shipping addresses
        customerBillingAddresses.value = [];
        customerShippingAddresses.value = [];

        await store
          .dispatch('customers/FETCH_CUSTOMER_ADDRESSES_FOR_SELECT', {
            type: 'both' as CustomerAddressType,
            customerId: customerId.value,
          })
          .then(() => {
            const customerAddresses = store.getters[
              'countries_states/GET_CUSTOMER_ADDRESSES_FOR_SELECT'
            ] as CustomerAddressForSelectPayload;

            customerBillingAddresses.value =
              customerAddresses?.billingAddresses ?? [];
            customerShippingAddresses.value =
              customerAddresses?.shippingAddresses ?? [];
          });
      }
    );

    const stopFetchCurrentlyViewedInvoiceQuotation = watchEffect(() => {
      if (!props.creationMode) {
        void store
          .dispatch(
            'invoices_quotations/FETCH_CURRENTLY_VIEWED_INVOICE_QUOTATION',
            {
              id: props.quotationId,
              queryString: { type: 'quotation' },
            }
          )
          .then(() => {
            currentInvoiceQuotation.value = unref(
              computed(
                () =>
                  store.getters[
                    'invoices_quotations/GET_CURRENTLY_VIEWED_INVOICE_QUOTATION'
                  ] as CurrentlyViewedInvoiceQuotation
              )
            );

            const computedForm = getCurrentInvoiceQuotationData.value(
              currentInvoiceQuotation.value,
              itemsColumns
            ) as Record<string, unknown>;

            for (const key in computedForm) {
              if (Object.prototype.hasOwnProperty.call(computedForm, key)) {
                const item: unknown = computedForm[key];
                form[key] = item;
              }
            }

            titleInfo.value = useTitleInfo({
              title: form.title ?? '',
              avatar: undefined,
            }).value;

            loading.value = false;
          })
          .catch(() => {
            loading.value = false;
          });
      }
    });

    const updateForm = function (updatedForm: QuotationInvoiceFormShape) {
      for (const key in updatedForm) {
        if (Object.prototype.hasOwnProperty.call(updatedForm, key)) {
          const item: unknown = updatedForm[key];
          form[key] = item;
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const CAN_EDIT_QUOTATIONS = computed(() =>
      store.getters['permissions/GET_USER_PERMISSION']('can_edit_quotations')
    );

    onMounted(() => {
      /* const sortableListElement = document.querySelector(
        '.quotation-invoice-table tbody'
      );
      const sortable = Sortable.create(sortableListElement as HTMLElement, {
        draggable: 'tr',
        animation: 150,
        sort: true,
        easing: 'cubic-bezier(1, 0, 0, 1)',
        handle: '.drag-handle',
        ghostClass: '.ghost-item',
        onStart: function (evt) {
          dragging.value = true;
        },
        onEnd: function (evt) {
          dragging.value = false;
        },
        onSort: function (evt) {
          const { oldIndex, newIndex } = evt;
          console.log({ oldIndex, newIndex });

          const swapItems = function (
            items: QuotationInvoiceItemShape[],
            oldElementIndex: number | undefined,
            newElementIndex: number | undefined
          ) {
            const unRefItems = [...items];
            if (unRefItems.length === 1) return unRefItems;
            if (oldElementIndex && newElementIndex) {
              unRefItems.splice(
                newElementIndex,
                1,
                unRefItems.splice(
                  oldElementIndex,
                  1,
                  unRefItems[newElementIndex]
                )[0]
              );
              return unRefItems;
            } else return unRefItems;
          };

          form.items = swapItems(form.items, oldIndex, newIndex);
        },
      }); */
    });

    onBeforeMount(() => {
      stopFetchCurrentlyViewedInvoiceQuotation();
    });

    onBeforeUnmount(() => {
      //void cleanUpFiles()
    });

    onBeforeRouteLeave((to, from, next) => {
      if (hasFormChanged.value) {
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
    });

    return {
      form,
      titleInfo,
      customerBillingAddresses,
      customerShippingAddresses,
      resourcePermissions: useResourcePermissions({
        view: PERMISSION.CAN_VIEW_QUOTATIONS,
        list: PERMISSION.CAN_LIST_QUOTATIONS,
        new: PERMISSION.CAN_CREATE_QUOTATIONS,
      }),
      CAN_EDIT_QUOTATIONS,
      isSubmitting,
      onSubmit,
      itemsColumns,
      numberOfDecimalOptions,
      thousandSeparatorOptions,
      areFilesUploading,
      fileUploadProgress,
      canUploadFiles,
      cancelFile,
      updateFiles,
      fileObjectUrls,
      loading,
      customersForSelectOptions,
      enableImageUploads,
      updateForm,
      discountTypeOptions,
      roundTypeOptions,
    };
  },
});
</script>
