<template>
  <q-table
    id="invoice-quotation-table"
    :rows="internalForm.items"
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
        <!-- Use for expanding row -->
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          <span>{{ col.label }}</span>
        </q-th>
      </q-tr>
    </template>

    <template #body="props">
      <q-tr :props="props" class="q-my-auto">
        <q-td class="serial-number-column" auto-width>
          <div>
            {{
              internalForm.useCustomSerialNumbers
                ? internalForm.items[props.rowIndex].customSerialNumber
                : props.rowIndex + 1
            }}
          </div>
        </q-td>
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          :auto-width="col.autoWidth"
          :class="col.columnClass"
        >
          <template v-if="col.name === 'productId'">
            <div
              v-if="
                internalForm.items[props.rowIndex] &&
                internalForm.items[props.rowIndex].productNameType ===
                  'custom_product'
              "
              style="max-width: 300px; margin: auto auto"
            >
              {{ internalForm.items[props.rowIndex].productName }}
            </div>
            <div
              v-if="
                internalForm.items[props.rowIndex] &&
                internalForm.items[props.rowIndex].productNameType ===
                  'real_product'
              "
              style="max-width: 300px; margin: auto auto"
            >
              {{ internalForm.items[props.rowIndex].productId.label }}
            </div>
          </template>
          <template v-else-if="col.name === 'qty'">
            <div v-if="internalForm.simpleQuantities" :class="[col.inputClass]">
              {{ finalNumberToString(internalForm.items[props.rowIndex].qty) }}
            </div>
            <div v-else>
              <span class="text-bold">{{
                finalNumberToString(internalForm.items[props.rowIndex].qty)
              }}</span
              >&nbsp;
              <span>{{
                internalForm.items[props.rowIndex].collectionTypeId
              }}</span>
              of
              <span class="text-bold">{{
                finalNumberToString(internalForm.items[props.rowIndex].groupQty)
              }}</span
              >&nbsp;
              <span>{{ internalForm.items[props.rowIndex].UOM }}</span>
            </div>
          </template>
          <template v-else-if="col.name === 'unitPrice'">
            <div :class="[col.inputClass]">
              {{
                internalForm.items[props.rowIndex].unitPrice > 0
                  ? finalNumberToString(
                      internalForm.items[props.rowIndex].unitPrice
                    )
                  : 0
              }}
            </div>
          </template>
          <template v-else>
            <div
              v-if="col.componentType !== 'computed'"
              :class="[
                col.inputClass,
                col.name === 'description' && 'text-left',
              ]"
            >
              <span v-if="col.name === 'unitDiscount'">
                {{
                  internalForm.items[props.rowIndex].unitDiscount > 0
                    ? finalNumberToString(
                        internalForm.items[props.rowIndex].unitDiscount
                      )
                    : 0
                }}
                {{
                  (internalForm.items[props.rowIndex].discountType ===
                    'number' &&
                    internalForm.setDiscountTypePerLine) ||
                  (internalForm.discountType === 'number' &&
                    !internalForm.setDiscountTypePerLine)
                    ? ''
                    : ' %'
                }}
              </span>
              <span v-else>
                {{ internalForm.items[props.rowIndex][col.name] }}
              </span>
            </div>
            <div
              v-else
              :class="[col.inputClass, col.name === 'total' && 'text-bold']"
            >
              <span v-if="col.name === 'total'"
                >{{ finalNumberToString(itemTotals?.[props.rowIndex] ?? 0) }}
              </span>
              <span v-if="col.name === 'lineDiscount'">
                {{
                  (itemLineDiscounts?.[props.rowIndex] ?? 0) > 0
                    ? '- ' +
                      finalNumberToString(
                        itemLineDiscounts?.[props.rowIndex] ?? 0
                      )
                    : 0
                }}
              </span>
            </div>
          </template>
        </q-td>
      </q-tr>
    </template>
    <template #no-data="{ message }">
      <div class="col col-12 message text-center">
        {{ message }}
      </div>
      <div class="row justify-center q-mt-lg-lg q-mt-sm-md">
        <q-btn label="Add Item" @click.prevent="addItemLines(1)" />
      </div>
    </template>
    <template
      v-if="internalForm.items && !!internalForm.items.length"
      #bottom-row
    >
      <q-tr v-if="internalForm.calculateTotals" class="bottom-row">
        <!-- For showing serials -->
        <q-td auto-width />
        <q-td class="text-right" :colspan="2">
          <div class="bottom-rows-text">Sub-totals</div>
        </q-td>
        <q-td class="text-right total-qty-cell">
          <div
            :class="{
              'row items-center justify-end': true,
            }"
          >
            <div>{{ finalNumberToString(totalQuantities) }}</div>
          </div>
        </q-td>
        <q-td class="text-right" :colspan="internalForm.showDiscounts ? 2 : 1">
          <div class="row flex-center justify-center">&nbsp;</div>
        </q-td>
        <q-td
          v-if="internalForm.showDiscounts"
          class="text-right total-discount-cell"
        >
          <div
            :class="{
              'row items-center justify-end': true,
            }"
          >
            <div>
              {{
                totalDiscounts > 0
                  ? '- ' + finalNumberToString(totalDiscounts)
                  : 0
              }}
            </div>
          </div>
        </q-td>
        <!-- <q-td
                      v-if="internalForm.showDiscounts && !internalForm.setDiscountTypePerLine"
                      :colspan="1"
                    >
                      &nbsp;
                    </q-td> -->
        <q-td
          v-if="
            internalForm.showDiscounts &&
            !internalForm.setDiscountTypePerLine &&
            sameLineDiscountTypes &&
            internalForm.setDiscountTypePerLine
          "
          :colspan="1"
        >
          &nbsp;
        </q-td>
        <q-td class="text-right subtotal-cell">
          <div
            :class="{
              'row items-center justify-end': true,
            }"
          >
            <div>{{ finalNumberToString(subTotal) }}</div>
          </div>
        </q-td>
      </q-tr>
      <q-tr
        v-if="
          internalForm.calculateTotals &&
          internalForm.showAdditionalSubtotalDiscount
        "
        class="bottom-row"
      >
        <!-- For showing serials -->
        <q-td auto-width />
        <q-td class="text-right" :colspan="visibleColumns.length - 1">
          <div class="bottom-rows-text">Additional discount</div>
        </q-td>
        <q-td class="text-right additional-discount-cell">
          <div
            :class="{
              'row items-center justify-end': true,
            }"
          >
            <div>
              {{
                additionalSubtotalDiscount > 0
                  ? '- ' + finalNumberToString(additionalSubtotalDiscount)
                  : finalNumberToString(additionalSubtotalDiscount)
              }}
            </div>
          </div>
        </q-td>
      </q-tr>
      <template v-if="internalForm.showAdditionalFees">
        <q-tr
          v-for="(fee, index) in internalForm.additionalFees"
          :key="'additional_fees__' + index"
          class="bottom-row"
        >
          <!-- For showing serials -->
          <q-td auto-width />
          <q-td class="text-right" :colspan="visibleColumns.length - 3">
            &nbsp;
          </q-td>
          <q-td class="text-right" :colspan="2">
            <div class="bottom-rows-text">
              {{ internalForm.additionalFees[index].name }}
            </div>
          </q-td>
          <q-td class="text-right additional-fee-cell">
            <div>
              {{
                finalNumberToString(internalForm.additionalFees[index].amount)
              }}
            </div>
          </q-td>
        </q-tr>
      </template>

      <q-tr
        v-if="
          !internalForm.amountsAreTaxInclusive && internalForm.calculateTotals
        "
        class="bottom-row"
      >
        <!-- For showing serials -->
        <q-td auto-width />
        <q-td class="text-right" :colspan="visibleColumns.length - 1">
          <div class="bottom-rows-text">Tax</div>
        </q-td>
        <q-td class="text-right tax-cell">
          <div
            :class="{
              'row items-center justify-end': true,
            }"
          >
            <div>{{ finalNumberToString(taxAmount) }}</div>
          </div>
        </q-td>
      </q-tr>
      <q-tr v-if="internalForm.calculateTotals" class="bottom-row">
        <!-- For showing serials -->
        <q-td auto-width />
        <q-td class="text-right" :colspan="visibleColumns.length - 1">
          <div class="bottom-rows-text">
            Grand total
            {{ internalForm.amountsAreTaxInclusive ? '(tax inclusive)' : '' }}
          </div>
        </q-td>
        <q-td class="text-right grand-total-cell">
          <div
            :class="{
              'row items-center justify-end': true,
            }"
          >
            <div>{{ finalNumberToString(grandTotal) }}</div>
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  defineComponent,
  PropType,
  computed,
  ref,
  watch,
  watchEffect,
} from 'vue';
import {
  typeSortFn,
  itemCollectionTypes,
  unitOfMeasurementTypes,
  productNameTypeOptions,
} from '../utils';
import {
  QuotationInvoiceFormShape,
  ProductNameType,
  ItemCollectionType,
  UnitOfMeasurement,
  AdditionalFee,
  QuotationInvoiceItemShape,
} from '../types';
import itemsColumns from './data/table-definitions/quotation_invoice_items';
import {
  discountTypeOptions,
  roundTypeOptions,
  numberOfDecimalOptionValues,
  getTotalArray,
  getLineDiscountArray,
  getRoundedTotal,
} from '../composables/useInvoiceQuotation';
import { useQuasar, format } from 'quasar';
import useThousandSeparator from '../composables/useThousandSeparators';

export default defineComponent({
  name: 'InvoiceQuotationTable',
  components: {},
  props: {
    form: {
      type: Object as PropType<QuotationInvoiceFormShape>,
      required: true,
    },
    viewMode: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  emits: ['form-updated'],
  setup(props, ctx) {
    const $q = useQuasar();
    const { capitalize } = format;
    const useSortable = ref(false);

    const visibleColumns = computed({
      get: () => itemsColumns.filter((column) => column.required),
      set: (value) => value,
    });

    const internalForm = computed({
      get: () => props.form,
      set: (value) => value,
    });

    const getProductNameType = computed(() => (index: number) => {
      const activeProductNameType =
        internalForm.value.items[index].productNameType;
      return productNameTypeOptions.filter(
        (option) => option.value === activeProductNameType
      )[0].label;
    });

    const setProductNameType = function ({
      index,
      type,
    }: {
      index: number;
      type: ProductNameType;
    }) {
      // clear the productId to cleanup the input area
      internalForm.value.items[index].productId = null;
      internalForm.value.items[index].productNameType = type;
    };

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

    const itemTotals = computed({
      get: () => {
        return getTotalArray({
          items: internalForm.value.items,
          roundAmountType: internalForm.value.roundAmountType,
          roundAmounts: internalForm.value.roundAmounts,
          numberOfDecimals: internalForm.value.numberOfDecimals,
          showDiscounts: internalForm.value.showDiscounts,
          discountType: internalForm.value.discountType,
          roundedTotal: getRoundedTotal,
        });
      },
      set: (value) => value,
    });

    const itemLineDiscounts = computed({
      get: () => {
        return getLineDiscountArray({
          items: internalForm.value.items,
          roundingType: internalForm.value.roundAmountType,
          roundAmounts: internalForm.value.roundAmounts,
          numberOfDecimals: internalForm.value.numberOfDecimals,
          showDiscounts: internalForm.value.showDiscounts,
          discountType: internalForm.value.discountType,
          roundedTotal: getRoundedTotal,
          setDiscountTypePerLine: internalForm.value.setDiscountTypePerLine,
        });
      },
      set: (value) => value,
    });

    const finalNumberToString = (input: number) =>
      useThousandSeparator(input, internalForm.value.numberOfDecimals);

    watch(
      internalForm,
      (internalForm) => {
        ctx.emit('form-updated', internalForm);

        itemTotals.value = getTotalArray({
          items: internalForm.items,
          roundAmountType: internalForm.roundAmountType,
          roundAmounts: internalForm.roundAmounts,
          numberOfDecimals: internalForm.numberOfDecimals,
          showDiscounts: internalForm.showDiscounts,
          discountType: internalForm.discountType,
          roundedTotal: getRoundedTotal,
        });
        itemLineDiscounts.value = getLineDiscountArray({
          items: internalForm.items,
          roundingType: internalForm.roundAmountType,
          roundAmounts: internalForm.roundAmounts,
          numberOfDecimals: internalForm.numberOfDecimals,
          showDiscounts: internalForm.showDiscounts,
          discountType: internalForm.discountType,
          roundedTotal: getRoundedTotal,
          setDiscountTypePerLine: internalForm.setDiscountTypePerLine,
        });
      },
      { deep: true }
    );

    const discountColumnHeader = itemsColumns.filter(
      (column) => column.name === 'unitDiscount'
    )[0];
    const unitPriceColumnHeader = itemsColumns.filter(
      (column) => column.name === 'unitPrice'
    )[0];
    const lineDiscountColumnHeader = itemsColumns.filter(
      (column) => column.name === 'lineDiscount'
    )[0];

    watchEffect(
      () => {
        for (const key in props.form) {
          if (Object.prototype.hasOwnProperty.call(props.form, key)) {
            const item: unknown = props.form[key];
            internalForm.value[key] = item;
          }
        }

        discountColumnHeader.required = internalForm.value.showDiscounts;
        lineDiscountColumnHeader.required = internalForm.value.showDiscounts;
        unitPriceColumnHeader.disabled =
          !internalForm.value.changeProductPrices;
        internalForm.value.simpleQuantities
          ? (unitPriceColumnHeader.label = 'Unit Price')
          : (unitPriceColumnHeader.label = 'Price Per Collection');

        // Update visibleColumns
        visibleColumns.value = itemsColumns.filter((column) => column.required);
      },
      { flush: 'pre' }
    );

    // Separated to avoid side-effects from the other
    // properties being watched
    watch(
      () => internalForm.value.showAdditionalFees,
      (showAdditionalFees) => {
        if (showAdditionalFees) {
          if (!internalForm.value.additionalFees.length) {
            void addDefaultAdditionalFees();
          }
        } else {
          $q.dialog({
            message:
              'Disabling this will remove all additional fees. Do you want to proceed?',
            persistent: true,
            noEscDismiss: true,
            cancel: true,
          })
            .onCancel(() => (internalForm.value.showAdditionalFees = true))
            .onOk(() => (internalForm.value.additionalFees.length = 0));
        }
      }
    );

    const totalQuantities = computed(() => {
      return internalForm.value.items
        .map((item) => Number(item.qty))
        .reduce((prevQty, curQty) => prevQty + curQty, 0);
    });

    const subTotal = computed(() => {
      let total = itemTotals.value.reduce(
        (prevTotal, curTotal) => Number(prevTotal) + Number(curTotal),
        0
      );

      return Number(
        getRoundedTotal(
          total,
          internalForm.value.roundAmountType,
          internalForm.value.numberOfDecimals
        )
      );
    });

    const totalDiscounts = computed(() => {
      const discounts = itemLineDiscounts.value.reduce(
        (prevDiscount, curDiscount) =>
          Number(prevDiscount) + Number(curDiscount),
        0
      );

      return Number(
        getRoundedTotal(
          discounts,
          internalForm.value.roundAmountType,
          internalForm.value.numberOfDecimals
        )
      );
    });

    const sameLineDiscountTypes = computed(() => {
      return (
        internalForm.value.items.every(
          (item) => item.discountType === 'number'
        ) ||
        internalForm.value.items.every(
          (item) => item.discountType === 'percentage'
        )
      );
    });

    const additionalSubtotalDiscount = computed(() => {
      let discount = 0;
      if (internalForm.value.additionalDiscountType === 'number') {
        discount = internalForm.value?.additionalDiscountAmount ?? 0;
      } else {
        discount =
          ((internalForm.value?.additionalDiscountAmount ?? 0) / 100) *
          subTotal.value;
      }

      return Number(
        getRoundedTotal(
          discount,
          internalForm.value.roundAmountType,
          internalForm.value.numberOfDecimals
        )
      );
    });

    const totalAdditionalFees = computed(() => {
      if (!internalForm.value.additionalFees.length) return 0;
      return internalForm.value.additionalFees
        .map((fee) => Number(fee.amount))
        .reduce((prevFee, curFee) => prevFee + curFee);
    });

    const grandTotalBeforeTax = computed(
      () =>
        subTotal.value +
        totalAdditionalFees.value -
        additionalSubtotalDiscount.value
    );

    const taxAmount = computed(() => {
      if (internalForm.value.amountsAreTaxInclusive) return 0;
      const tax =
        (grandTotalBeforeTax.value * internalForm.value?.taxPercentage ?? 0) /
        100;
      return Number(
        getRoundedTotal(
          tax,
          internalForm.value.roundAmountType,
          internalForm.value.numberOfDecimals
        )
      );
    });

    const grandTotal = computed(() =>
      Number(
        getRoundedTotal(
          taxAmount.value + grandTotalBeforeTax.value,
          internalForm.value.roundAmountType,
          internalForm.value.numberOfDecimals
        )
      )
    );

    const additionalFeeShape: AdditionalFee = { name: '', amount: 0 };

    const quotationItemShape: QuotationInvoiceItemShape = {
      productId: null,
      productNameType: 'real_product',
      productName: null,
      description: '',
      qty: null,
      UOM: 'kg',
      collectionTypeId: 'set(s)',
      groupQty: null,
      unitPrice: null,
      unitDiscount: null,
      discountType: 'number',
      total: 0,
      files: [],
      customSerialNumber: null,
    };

    const addItemLines = (numberOfLines = 1) => {
      for (let i = 0; i < numberOfLines; i++) {
        // Spread operator used to clone object to avoid
        // object reference issues
        internalForm.value.items.push({ ...quotationItemShape });
      }
    };
    const addAdditionalFee = () => {
      // Spread operator used to clone object to avoid
      // object reference issues
      internalForm.value.additionalFees.push({ ...additionalFeeShape });
    };
    const addDefaultAdditionalFees = () => {
      internalForm.value.additionalFees = [
        { name: 'Shipping Fee', amount: 0 },
        { name: 'Installation Fee', amount: 0 },
      ];
    };
    const removeItem = (index: number) =>
      internalForm.value.items.splice(index, 1);

    const isLastItem = (index: number) =>
      internalForm.value.items.length - 1 === index;

    const removeAdditionalFee = (index: number) =>
      internalForm.value.additionalFees.splice(index, 1);

    const isAdditionalFeeLastItem = (index: number) =>
      internalForm.value.additionalFees.length - 1 === index;

    const addItemsDropdownList = ref([2, 5, 10, 20]);

    const collectionTypeOptions = computed(() => {
      return itemCollectionTypes
        .sort((a, b) => typeSortFn<ItemCollectionType>(a, b))
        .map((type) => ({
          label: capitalize(type),
          value: type,
        }));
    });

    return {
      itemsColumns,
      visibleColumns,
      internalForm,
      getProductNameType,
      setProductNameType,
      productNameTypeOptions,
      UOMTypeOptions,
      discountTypeOptions,
      roundTypeOptions,
      numberOfDecimalOptionValues,
      itemTotals,
      itemLineDiscounts,
      totalQuantities,
      subTotal,
      totalDiscounts,
      sameLineDiscountTypes,
      additionalSubtotalDiscount,
      grandTotal,
      taxAmount,
      addItemLines,
      removeItem,
      addItemsDropdownList,
      addAdditionalFee,
      isAdditionalFeeLastItem,
      removeAdditionalFee,
      isLastItem,
      collectionTypeOptions,
      finalNumberToString,
      useSortable,
    };
  },
});
</script>
