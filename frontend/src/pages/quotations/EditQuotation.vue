<template>
  <div class="q-pa-md">
    <view-card
      :title-info="titleInfo"
      show-avatar
      show-title-panel-side
      card-container-classes="col-12"
    >
      <template #body-panel>
        <form class="q-pa-md" @submit="onSubmit">
          <div class="row q-gutter-sm">
            <div class="col col-md-2 col-lg-2 col-sm-6 col-xs-12">
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
                :options="customersForSelect"
                label="Customer"
                name="customerSelect"
                for="customerSelect"
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
                        ? `${
                            customerAddresses.length === 1
                              ? '1 address'
                              : customerAddresses.length + ' addresses'
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
              >
                <!-- <template #error>
                  {{ formErrors[field.name] }}
                </template> -->

                <template #hint></template>
              </q-input>
            </div>
            <div class="col col-md-6 col-lg-6 col-sm-12 col-xs-12">
              <q-input
                v-model="form.introduction"
                type="textarea"
                for="introduction"
                filled
                clearable
                bottom-slots
                autogrow
                label="Introduction"
                aria-autocomplete="off"
                autocomplete="off"
                class="q-mb-sm-sm q-mb-md-sm"
                dense
              >
                <!-- <template #error>
                  {{ formErrors[field.name] }}
                </template> -->

                <template #hint></template>
              </q-input>
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col col-12">
              <q-table
                :rows="form.items"
                :columns="itemsColumns"
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
                    <q-th auto-width><span>#</span></q-th>
                    <!-- Use for reordering handle -->
                    <!-- <q-th auto-width /> -->
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      <span>{{ col.label }}</span>
                    </q-th>
                    <q-th auto-width />
                  </q-tr>
                </template>

                <template #body="props">
                  <q-tr :props="props" class="q-my-auto">
                    <q-td auto-width>
                      <div>{{ props.rowIndex + 1 }}</div>
                    </q-td>
                    <!-- <q-td auto-width>
                      <q-btn
                        class="drag-handle"
                        size="sm"
                        color="accent"
                        round
                        dense
                        icon="unfold_more"
                        flat
                      />
                    </q-td> -->
                    <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                      :auto-width="col.autoWidth"
                      :class="col.columnClass"
                    >
                      <q-input
                        v-if="
                          col.componentType === 'input' &&
                          form.items[props.rowIndex]
                        "
                        :key="`field_${col.name}_${col.componentType}__index_${props.rowIndex}`"
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
                        class="main-column-input"
                        :input-class="col.inputClass"
                        :input-style="col.inputStyle"
                        :for="col.name + '__index_' + props.rowIndex"
                        filled
                        bottom-slots
                        aria-autocomplete="off"
                        autocomplete="off"
                        dense
                        :aria-disabled="col.disabled"
                        :disable="col.disabled"
                      >
                        <template #append>
                          <div
                            v-if="
                              col.name === 'unitDiscount' &&
                              form.discountType === 'percentage' &&
                              !form.setDiscountTypePerLine
                            "
                            class="text-body2"
                          >
                            %
                          </div>
                        </template>
                        <template
                          v-if="
                            col.name === 'qty' || col.name === 'unitDiscount'
                          "
                          #after
                        >
                          <div
                            v-if="col.name === 'qty' && !form.simpleQuantities"
                            class="
                              row
                              inline
                              justify-center
                              items-center
                              q-gutter-sm
                              composite-qty
                            "
                          >
                            <q-select
                              v-model="
                                form.items[props.rowIndex].collectionType
                              "
                              filled
                              :options="collectionTypeOptions"
                              dense
                              options-dense
                              transition-show="scale"
                              transition-hide="scale"
                              emit-value
                              map-options
                            />
                            <div>of</div>
                            <q-input
                              v-model="form.items[props.rowIndex].groupQty"
                              filled
                              dense
                              class="group-qty-input"
                              autogrow
                            />
                            <q-select
                              v-model="form.items[props.rowIndex].UOM"
                              filled
                              :options="UOMTypeOptions"
                              dense
                              options-dense
                              transition-show="scale"
                              transition-hide="scale"
                              emit-value
                              map-options
                            />
                          </div>
                          <div
                            v-if="col.name === 'qty' && form.simpleQuantities"
                            class="
                              row
                              inline
                              justify-center
                              items-center
                              q-gutter-sm
                              composite-qty
                            "
                          >
                            <q-select
                              v-model="form.items[props.rowIndex].UOM"
                              filled
                              :options="UOMTypeOptions"
                              dense
                              options-dense
                              transition-show="scale"
                              transition-hide="scale"
                              emit-value
                              map-options
                            />
                          </div>
                          <div
                            v-if="
                              col.name === 'unitDiscount' &&
                              form.setDiscountTypePerLine
                            "
                          >
                            <q-select
                              v-model="form.items[props.rowIndex].discountType"
                              filled
                              :options="discountTypeOptions"
                              dense
                              options-dense
                              class="discount-type-select-input"
                              transition-show="scale"
                              transition-hide="scale"
                              emit-value
                              map-options
                            />
                          </div>
                        </template>

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
                        hide-dropdown-icon
                        :input-debounce="200"
                        class=""
                        transition-show="scale"
                        transition-hide="scale"
                        emit-value
                        map-options
                        dense
                        :aria-disabled="col.disabled"
                        :disable="col.disabled"
                        clearable
                        :new-value-mode="
                          form.items[props.rowIndex].productNameType ===
                          'custom_product'
                            ? 'add-unique'
                            : undefined
                        "
                        :async-filter-action="
                          form.items[props.rowIndex].productNameType ===
                          'real_product'
                            ? col.asyncFilterAction
                            : undefined
                        "
                        :async-filter-mode="
                          form.items[props.rowIndex].productNameType ===
                          'real_product'
                            ? col.asyncFilterMode
                            : undefined
                        "
                      >
                        <template #append>
                          <ProductNameTypeSelect
                            v-if="col.name === 'productId'"
                            :label="getProductNameType(props.rowIndex)"
                            :product-name-type-options="productNameTypeOptions"
                            :row-index="props.rowIndex"
                            @typeSelected="setProductNameType"
                          />
                        </template>
                        <template
                          v-if="col.name === 'productId'"
                          #no-option="{ inputValue }"
                        >
                          <div
                            v-if="
                              inputValue &&
                              inputValue.length > 0 &&
                              !form.items[props.rowIndex].productNameType
                            "
                            class="q-ml-sm"
                          >
                            No product found for query: <b>{{ inputValue }}</b>
                          </div>
                          <div
                            v-if="
                              inputValue &&
                              inputValue.length > 0 &&
                              form.items[props.rowIndex].productNameType ===
                                'real_product'
                            "
                            class="q-ml-sm"
                          >
                            No product found for query: <b>{{ inputValue }}</b>
                          </div>
                        </template>
                      </quasar-select>
                      <div
                        v-if="col.componentType === 'computed'"
                        class="filled row flex-center justify-center"
                      >
                        <div>{{ itemTotals?.[props.rowIndex] ?? 0 }}</div>
                      </div>
                    </q-td>
                    <q-td auto-width>
                      <q-btn
                        v-if="!isLastItem(props.rowIndex)"
                        color="negative"
                        round
                        flat
                        dense
                        icon="delete_outline"
                        @click="removeItem(props.rowIndex)"
                      />
                      <q-btn-dropdown
                        v-else
                        class="add-item-dropdown"
                        icon="playlist_add"
                        split
                        flat
                        auto-close
                        unelevated
                        ripple
                        color="positive"
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
          <q-expansion-item
            expand-separator
            icon="settings"
            color="accent"
            label="Settings"
            class="quotation-settings-accordion"
            dense
          >
            <div class="row">
              <div class="col column col-sm-12 col-md-6 col-lg-4">
                <div class="col">
                  <q-toggle
                    v-model="form.simpleQuantities"
                    checked-icon="check"
                    color="positive"
                    label="Use simple quantities"
                    unchecked-icon="clear"
                  />
                </div>
                <div class="col">
                  <q-toggle
                    v-model="form.amountsAreTaxInclusive"
                    checked-icon="check"
                    color="positive"
                    label="Amounts include taxes"
                    unchecked-icon="clear"
                  />
                </div>
                <div class="col">
                  <q-toggle
                    v-model="form.changeProductPrices"
                    checked-icon="check"
                    color="positive"
                    label="Change product prices"
                    unchecked-icon="clear"
                  />
                </div>
                <div class="col">
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
                <div class="col">
                  <q-toggle
                    v-model="form.showTotalAmount"
                    checked-icon="check"
                    color="positive"
                    label="Show total amount"
                    unchecked-icon="clear"
                  />
                </div>
                <div class="col">
                  <div class="row q-gutter-lg">
                    <q-toggle
                      v-model="form.addDiscounts"
                      checked-icon="check"
                      color="positive"
                      label="Show discounts"
                      unchecked-icon="clear"
                    />
                    <q-select
                      v-if="form.addDiscounts"
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
                <div class="col">
                  <q-toggle
                    v-model="form.setDiscountTypePerLine"
                    checked-icon="check"
                    color="positive"
                    label="Set discount type per line"
                    unchecked-icon="clear"
                  />
                </div>
                <div class="col">
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
  RoundingType,
  itemCollectionTypes,
  ItemCollectionType,
  unitOfMeasurementTypes,
  UnitOfMeasurement,
  productNameTypeOptions,
  ProductNameType,
  SelectNewValueCallback,
} from '../../store/types';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import QuasarSelect from '../../components/QuasarSelect';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useStore } from 'vuex';
import { useQuasar, format } from 'quasar';
import { phoneNumberRegex } from '../../helpers/utils';
import { isEqual } from 'lodash';
import itemsColumns from '../../components/data/table-definitions/quotation_invoice_items';
import ProductNameTypeSelect from '../../components/ProductNameTypeSelect.vue';
//import Sortable from 'sortablejs';
//import thousandFormatter from 'format-thousands/index';

const { capitalize } = format;

const typeSortFn = function <T>(a: T, b: T): number {
  {
    if (new String(a).toLocaleLowerCase() > new String(b).toLocaleLowerCase())
      return 1;
    if (new String(a).toLocaleLowerCase() < new String(b).toLocaleLowerCase())
      return -1;
    return 0;
  }
};

export default defineComponent({
  name: 'EditQuotation',

  components: {
    ViewCard,
    QuasarSelect,
    ProductNameTypeSelect,
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
    //const dragging = ref(false);
    const discountTypeOptions = ref([
      { label: 'Num', value: 'number' },
      { label: '%', value: 'percentage' },
    ]);
    const roundTypeOptions = ref([
      { label: 'None', value: 'none' },
      { label: 'Nearest', value: 'nearest' },
      { label: 'Down', value: 'down' },
      { label: 'Up', value: 'up' },
    ]);
    const numberOfDecimalOptionValues = [0, 1, 2, 3, 4, 5, 6];
    const numberOfDecimalOptions = computed(() => {
      return numberOfDecimalOptionValues.map((value) => ({
        label: value,
        value,
      }));
    });
    const collectionTypeOptions = computed(() => {
      return itemCollectionTypes
        .sort((a, b) => typeSortFn<ItemCollectionType>(a, b))
        .map((type) => ({
          label: capitalize(type),
          value: type,
        }));
    });
    const UOMTypeOptions = computed(() => {
      return unitOfMeasurementTypes
        .sort((a, b) =>
          typeSortFn<ItemCollectionType | UnitOfMeasurement>(a, b)
        )
        .map((type) => ({
          label: type,
          value: type,
        }));
    });
    const thousandSeparatorOptions = ref([
      { label: 'None', value: 'none' },
      { label: 'Comma', value: 'comma' },
      { label: 'Period', value: 'period' },
    ]);

    const customerAddresses = computed({
      get: () =>
        store.getters[
          'customers/GET_CUSTOMER_ADDRESSES_FOR_SELECT'
        ] as SelectOption[],
      set: (value) => value,
    });

    const form: QuotationInvoiceFormShape = reactive({
      items: [] as QuotationInvoiceFormShape['items'],
      date: null,
      code: '',
      customerId: null,
      customerAddressId: null,
      introduction: '',
      title: '',
      simpleQuantities: true,
      amountsAreTaxInclusive: false,
      roundAmounts: false,
      roundAmountType: 'none',
      addDiscounts: false,
      discountType: 'number',
      setDiscountTypePerLine: false,
      showTotalAmount: true,
      changeProductPrices: false,
      numberOfDecimals: 2,
      useThousandSeparator: true,
      thousandSeparatorType: 'comma',
      notes: '',
      theme: null,
    });

    const quotationItemShape: QuotationInvoiceItemShape = {
      productId: null,
      productNameType: 'real_product',
      productName: null,
      description: '',
      qty: null,
      UOM: 'kg',
      collectionType: 'set(s)',
      groupQty: null,
      unitPrice: null,
      unitDiscount: null,
      discountType: 'number',
      total: 0,
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
      return itemsColumns.filter((column) => column.required);
    });

    const addItemsDropdownList = ref([2, 5, 10, 20]);

    const getRoundedTotal = function (
      amount: string | number,
      roundingType: RoundingType,
      numberOfDecimals: number
    ) {
      let total: string | number = '';
      switch (roundingType) {
        case 'none':
          total = Number.parseFloat(amount as string).toFixed(numberOfDecimals);
          break;
        case 'nearest':
          total = Math.round(amount as number);
          break;
        case 'down':
          total = Math.floor(amount as number);
          break;
        case 'up':
          total = Math.ceil(amount as number);
          break;
      }
      return total;
    };

    const getTotalArray = function (
      items: QuotationInvoiceItemShape[]
    ): number[] {
      const totalArray: number[] = [];
      if (items && items.length) {
        items.forEach((item, index) => {
          const unitPrice = Number(item?.unitPrice ?? 0);
          const qty = Number(item?.qty ?? 0);
          const roundingType = form.roundAmountType;
          const numberOfDecimals = form.numberOfDecimals;
          //const thousandSeparator = form.thousandSeparatorType;

          if (form.addDiscounts) {
            const unitDiscount = Number(item?.unitDiscount ?? 0);
            let discountedPrice = 0;
            if (form.discountType === 'percentage') {
              discountedPrice = (1 - unitDiscount / 100) * unitPrice;
            } else {
              discountedPrice = unitPrice - unitDiscount;
            }

            if (form.roundAmounts) {
              totalArray[index] = Number(
                getRoundedTotal(
                  qty * discountedPrice,
                  roundingType,
                  numberOfDecimals
                )
              );
            } else {
              totalArray[index] = qty * discountedPrice;
            }
          } else {
            // The effect is the same for when `form.roundAmounts`
            // is true or false
            totalArray[index] = Number(
              getRoundedTotal(qty * unitPrice, roundingType, numberOfDecimals)
            );
          }
        });
      }
      return totalArray;
    };

    const itemTotals = computed({
      get: () => {
        return getTotalArray(form.items);
      },
      set: (value) => value,
    });

    // Watch for changes in quotation settings and items
    // and re-compute (set) the total row
    watch(
      () => form,
      (form) => {
        itemTotals.value = getTotalArray(form.items);
      },
      { deep: true }
    );

    const setProductNameType = function ({
      index,
      type,
    }: {
      index: number;
      type: ProductNameType;
    }) {
      // clear the productId to cleanup the input area
      form.items[index].productId = '';
      form.items[index].productNameType = type;
    };

    const getProductNameType = computed(() => (index: number) => {
      const activeProductNameType = form.items[index].productNameType;
      return productNameTypeOptions.filter(
        (option) => option.value === activeProductNameType
      )[0].label;
    });

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

    watch(
      [
        () => form.showTotalAmount,
        () => form.addDiscounts,
        () => form.changeProductPrices,
        () => form.simpleQuantities,
      ],
      ([
        showTotalAmount,
        addDiscounts,
        changeProductPrices,
        simpleQuantities,
      ]) => {
        const totalColumnHeader = itemsColumns.filter(
          (column) => column.name === 'total'
        )[0];
        const discountColumnHeader = itemsColumns.filter(
          (column) => column.name === 'unitDiscount'
        )[0];
        const unitPriceColumnHeader = itemsColumns.filter(
          (column) => column.name === 'unitPrice'
        )[0];

        totalColumnHeader.required = showTotalAmount;
        discountColumnHeader.required = addDiscounts;
        unitPriceColumnHeader.disabled = !changeProductPrices;
        simpleQuantities
          ? (unitPriceColumnHeader.label = 'Unit Price')
          : (unitPriceColumnHeader.label = 'Price Per Collection');
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
      itemsColumns,
      discountTypeOptions,
      itemTotals,
      roundTypeOptions,
      numberOfDecimalOptions,
      collectionTypeOptions,
      UOMTypeOptions,
      thousandSeparatorOptions,
      productNameTypeOptions,
      setProductNameType,
      getProductNameType,
    };
  },
});
</script>
