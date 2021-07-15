<template>
  <q-table
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
        <!-- Use for reordering handle -->
        <!-- <q-th auto-width /> -->
        <!-- Use for expanding row -->
        <q-th v-if="enableImageUploads && internalForm.showImages" auto-width />
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          <span>{{ col.label }}</span>
        </q-th>
        <q-th auto-width />
      </q-tr>
    </template>

    <template #body="props">
      <q-tr :props="props" class="q-my-auto">
        <q-td class="serial-number-column" auto-width>
          <q-input
            v-if="internalForm.useCustomSerialNumbers"
            v-model="internalForm.items[props.rowIndex].customSerialNumber"
            filled
            dense
            class="custom-serial-input"
            input-class=" text-center"
            stack-label
            :debounce="250"
          />
          <div v-else>{{ props.rowIndex + 1 }}</div>
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
        <q-td v-if="enableImageUploads && internalForm.showImages" auto-width>
          <q-btn
            size="sm"
            color="accent"
            round
            dense
            :icon="props.expand ? 'remove' : 'add'"
            @click="props.expand = !props.expand"
          />
        </q-td>
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          :auto-width="col.autoWidth"
          :class="col.columnClass"
        >
          <template
            v-if="
              internalForm.items[props.rowIndex] && col.name === 'productId'
            "
          >
            <q-input
              v-if="
                internalForm.items[props.rowIndex] &&
                internalForm.items[props.rowIndex].productNameType ===
                  'custom_product'
              "
              v-model="internalForm.items[props.rowIndex].productName"
              type="text"
              autogrow
              :hint="col.hint"
              class="main-column-input product-id-custom-product-input"
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
              :debounce="250"
            >
              <template #append>
                <ProductNameTypeSelect
                  :label="getProductNameType(props.rowIndex)"
                  :product-name-type-options="productNameTypeOptions"
                  :row-index="props.rowIndex"
                  @typeSelected="setProductNameType"
                />
              </template>
            </q-input>
            <quasar-select
              v-else
              v-model="internalForm.items[props.rowIndex].productId"
              :multiple="false"
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
              :emit-value="false"
              :map-options="false"
              dense
              :aria-disabled="col.disabled"
              :disable="col.disabled"
              clearable
              :async-filter-action="col.asyncFilterAction"
              async-filter-mode
              :placeholder="
                internalForm.items[props.rowIndex].productId
                  ? ''
                  : 'Search for product'
              "
            >
              <template #no-option="{ inputValue }">
                <div v-if="inputValue && inputValue.length > 0" class="q-ml-sm">
                  No product found for query:
                  <b>{{ inputValue }}</b>
                </div>
              </template>
              <template #append>
                <ProductNameTypeSelect
                  :label="getProductNameType(props.rowIndex)"
                  :product-name-type-options="productNameTypeOptions"
                  :row-index="props.rowIndex"
                  @typeSelected="setProductNameType"
                />
              </template>
            </quasar-select>
          </template>
          <template v-else>
            <q-input
              v-if="
                col.componentType === 'input' &&
                internalForm.items[props.rowIndex]
              "
              :key="`field_${col.name}_${col.componentType}__index_${props.rowIndex}`"
              v-model="internalForm.items[props.rowIndex][col.name]"
              :type="col.componentTypeVariant"
              :autogrow="col.autogrow"
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
              :debounce="250"
            >
              <template #prepend>
                <div v-if="col.name === 'unitDiscount'" class="text-body2">
                  {{
                    internalForm.items[props.rowIndex].unitDiscount &&
                    internalForm.items[props.rowIndex].unitDiscount > 0
                      ? '-'
                      : ''
                  }}
                </div>
              </template>
              <template #append>
                <div
                  v-if="
                    col.name === 'unitDiscount' &&
                    internalForm.discountType === 'percentage' &&
                    !internalForm.setDiscountTypePerLine
                  "
                  class="text-body2"
                >
                  %
                </div>
              </template>
              <template
                v-if="col.name === 'qty' || col.name === 'unitDiscount'"
                #after
              >
                <div
                  v-if="col.name === 'qty' && !internalForm.simpleQuantities"
                  class="
                    row
                    no-wrap
                    inline
                    justify-center
                    items-center
                    q-gutter-sm
                    composite-qty
                  "
                >
                  <q-select
                    v-model="
                      internalForm.items[props.rowIndex].collectionTypeId
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
                    v-model="internalForm.items[props.rowIndex].groupQty"
                    filled
                    dense
                    class="group-qty-input"
                    autogrow
                    :debounce="250"
                  />
                  <q-select
                    v-model="internalForm.items[props.rowIndex].UOM"
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
                  v-if="col.name === 'qty' && internalForm.simpleQuantities"
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
                    v-model="internalForm.items[props.rowIndex].UOM"
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
                    internalForm.setDiscountTypePerLine
                  "
                >
                  <q-select
                    v-model="internalForm.items[props.rowIndex].discountType"
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
                internalForm.items[props.rowIndex]
              "
              :key="`field_${col.name}_${col.componentType}__index_${props.rowIndex}`"
              v-model="internalForm.items[props.rowIndex][col.name]"
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
                internalForm.items[props.rowIndex].productNameType ===
                'custom_product'
                  ? 'add-unique'
                  : undefined
              "
              :async-filter-action="
                internalForm.items[props.rowIndex].productNameType ===
                'real_product'
                  ? col.asyncFilterAction
                  : undefined
              "
              :async-filter-mode="
                internalForm.items[props.rowIndex].productNameType ===
                'real_product'
              "
            >
              <template
                v-if="col.name === 'productId'"
                #no-option="{ inputValue }"
              >
                <div
                  v-if="
                    inputValue &&
                    inputValue.length > 0 &&
                    !internalForm.items[props.rowIndex].productNameType
                  "
                  class="q-ml-sm"
                >
                  No product found for query:
                  <b>{{ inputValue }}</b>
                </div>
                <div
                  v-if="
                    inputValue &&
                    inputValue.length > 0 &&
                    internalForm.items[props.rowIndex].productNameType ===
                      'real_product'
                  "
                  class="q-ml-sm"
                >
                  No product found for query:
                  <b>{{ inputValue }}</b>
                </div>
              </template>
            </quasar-select>
            <div
              v-if="col.componentType === 'computed'"
              class="filled row items-center justify-end"
            >
              <div v-if="col.name === 'total'">
                {{ itemTotals?.[props.rowIndex] ?? 0 }}
              </div>
              <div v-if="col.name === 'lineDiscount'">
                {{
                  (itemLineDiscounts?.[props.rowIndex] ?? 0) > 0
                    ? '- ' + itemLineDiscounts?.[props.rowIndex] ?? 0
                    : 0
                }}
              </div>
            </div>
          </template>
        </q-td>
        <q-td auto-width>
          <q-btn
            color="negative"
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
            color="positive"
            @click="addItemLines(1)"
          >
            <q-list>
              <q-item
                v-for="(number, listIndex) in addItemsDropdownList"
                :key="'add_' + number + 'items'"
                clickable
                @click="addItemLines(addItemsDropdownList[listIndex])"
              >
                <q-item-section>
                  <q-item-label>Add {{ number }} lines</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td auto-width />
        <q-td v-if="internalForm.showImages" auto-width />
        <q-td :colspan="2">
          <div class="row q-pb-lg">
            <div class="col col-12">
              <!-- <q-file
                :model-value="internalForm.items[props.rowIndex].files"
                label="Pick files"
                outlined
                multiple
                append
                counter
                accept="image/*"
                :max-file-size="1024 * 1024"
                :clearable="!areFilesUploading(props.rowIndex)"
                @update:model-value="updateFiles($event, props.rowIndex)"
              >
                <template #file="{ index }">
                  <q-avatar class="q-ma-sm" square size="100px">
                    <img :src="fileObjectUrls[props.rowIndex][index]" />
                    <q-badge floating transparent rounded
                      ><q-btn
                        size="sm"
                        round
                        flat
                        color="white"
                        icon="remove_circle_outline"
                        @click.prevent="cancelFile(index, props.rowIndex)"
                    /></q-badge>
                  </q-avatar>
                </template>
              </q-file> -->
            </div>
          </div>
        </q-td>
        <q-td :colspan="props.cols.length - 1" />
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
        <q-td auto-width />
        <q-td v-if="enableImageUploads && internalForm.showImages" auto-width />
        <q-td class="text-right" :colspan="2">
          <div class="">Sub-totals</div>
        </q-td>
        <q-td class="text-right total-qty-cell">
          <div class="filled row flex-center justify-center">
            <div>{{ totalQuantities }}</div>
          </div>
        </q-td>
        <q-td
          v-if="
            internalForm.setDiscountTypePerLine ||
            !internalForm.showDiscounts ||
            (internalForm.showDiscounts && !internalForm.setDiscountTypePerLine)
          "
          class="text-right"
          :colspan="
            internalForm.showDiscounts &&
            sameLineDiscountTypes &&
            internalForm.setDiscountTypePerLine
              ? 2
              : internalForm.showDiscounts &&
                !internalForm.setDiscountTypePerLine
              ? 2
              : 1
          "
        >
          <div class="row flex-center justify-center">&nbsp;</div>
        </q-td>
        <q-td
          v-if="
            internalForm.showDiscounts &&
            (!internalForm.setDiscountTypePerLine || sameLineDiscountTypes)
          "
          class="text-right total-discount-cell"
        >
          <div class="filled row items-center justify-end">
            <div>
              {{ totalDiscounts > 0 ? '- ' + totalDiscounts : 0 }}
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
          <div class="filled row items-center justify-end">
            <div>{{ subTotal }}</div>
          </div>
        </q-td>
        <q-td auto-width> &nbsp; </q-td>
      </q-tr>
      <q-tr
        v-if="
          internalForm.calculateTotals &&
          internalForm.showAdditionalSubtotalDiscount
        "
        class="bottom-row"
      >
        <q-td auto-width />
        <q-td v-if="enableImageUploads && internalForm.showImages" auto-width />
        <q-td class="text-right" :colspan="visibleColumns.length - 1">
          <div class="">Additional discount</div>
        </q-td>
        <q-td class="text-right additional-discount-cell">
          <div class="filled row items-center justify-end">
            <div>
              {{
                additionalSubtotalDiscount > 0
                  ? '- ' + additionalSubtotalDiscount
                  : 0
              }}
            </div>
          </div>
        </q-td>
        <q-td auto-width> &nbsp; </q-td>
      </q-tr>
      <template v-if="internalForm.showAdditionalFees">
        <q-tr
          v-for="(fee, index) in internalForm.additionalFees"
          :key="'additional_fees__' + index"
          class="bottom-row"
        >
          <q-td auto-width />
          <q-td
            v-if="enableImageUploads && internalForm.showImages"
            auto-width
          />
          <q-td class="text-right" :colspan="visibleColumns.length - 3">
            &nbsp;
          </q-td>
          <q-td class="text-right" :colspan="2">
            <q-input
              v-model="internalForm.additionalFees[index].name"
              filled
              dense
              class="additional-fee-input"
              input-class=" text-right"
              stack-label
              autogrow
              :debounce="250"
            />
          </q-td>
          <q-td class="text-right additional-fee-cell">
            <q-input
              v-model="internalForm.additionalFees[index].amount"
              filled
              dense
              class="additional-fee-input"
              input-class=" text-right"
              stack-label
              autogrow
              :debounce="250"
            />
          </q-td>
          <q-td auto-width>
            <q-btn
              color="negative"
              round
              flat
              dense
              icon="delete_outline"
              @click="removeAdditionalFee(index)"
            />
            <q-btn
              v-if="isAdditionalFeeLastItem(index)"
              color="positive"
              round
              flat
              dense
              icon="library_add"
              @click="addAdditionalFee(index)"
            />
          </q-td>
        </q-tr>
      </template>

      <q-tr
        v-if="
          !internalForm.amountsAreTaxInclusive && internalForm.calculateTotals
        "
        class="bottom-row"
      >
        <q-td auto-width />
        <q-td v-if="enableImageUploads && internalForm.showImages" auto-width />
        <q-td class="text-right" :colspan="visibleColumns.length - 1">
          <div class="">Tax</div>
        </q-td>
        <q-td class="text-right grand-total-cell">
          <div class="filled row items-center justify-end">
            <div>{{ taxAmount }}</div>
          </div>
        </q-td>
        <q-td auto-width> &nbsp; </q-td>
      </q-tr>
      <q-tr v-if="internalForm.calculateTotals" class="bottom-row">
        <q-td auto-width />
        <q-td v-if="enableImageUploads && internalForm.showImages" auto-width />
        <q-td class="text-right" :colspan="visibleColumns.length - 1">
          <div class="">
            Grand total
            {{ internalForm.amountsAreTaxInclusive ? '(tax inclusive)' : '' }}
          </div>
        </q-td>
        <q-td class="text-right grand-total-cell">
          <div class="filled row items-center justify-end">
            <div>{{ grandTotal }}</div>
          </div>
        </q-td>
        <q-td auto-width> &nbsp; </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  ref,
  watch,
  watchEffect,
  onMounted,
} from 'vue';
import { typeSortFn } from '../helpers/utils';
import {
  QuotationInvoiceFormShape,
  productNameTypeOptions,
  ProductNameType,
  unitOfMeasurementTypes,
  ItemCollectionType,
  UnitOfMeasurement,
  AdditionalFee,
  QuotationInvoiceItemShape,
  itemCollectionTypes,
} from '../store/types';
import itemsColumns from './data/table-definitions/quotation_invoice_items';
import ProductNameTypeSelect from './ProductNameTypeSelect.vue';
import QuasarSelect from './QuasarSelect';
import {
  discountTypeOptions,
  roundTypeOptions,
  numberOfDecimalOptionValues,
  getTotalArray,
  getLineDiscountArray,
  getRoundedTotal,
} from '../composables/invoices-quotations/useInvoiceQuotation';
import { useQuasar, format } from 'quasar';

export default defineComponent({
  name: 'InvoiceQuotationTable',
  components: {
    ProductNameTypeSelect,
    QuasarSelect,
  },
  props: {
    form: {
      type: Object as PropType<QuotationInvoiceFormShape>,
      required: true,
    },
    enableImageUploads: {
      type: Boolean,
      required: true,
    },
    creationMode: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  emits: ['form-updated'],
  setup(props, ctx) {
    const $q = useQuasar();
    const { capitalize } = format;

    const visibleColumns = computed(() => {
      return itemsColumns.filter((column) => column.required);
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
        });
      },
      set: (value) => value,
    });

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
        discountColumnHeader.required = internalForm.value.showDiscounts;
        lineDiscountColumnHeader.required = internalForm.value.showDiscounts;
        unitPriceColumnHeader.disabled =
          !internalForm.value.changeProductPrices;
        internalForm.value.simpleQuantities
          ? (unitPriceColumnHeader.label = 'Unit Price')
          : (unitPriceColumnHeader.label = 'Price Per Collection');
      },
      { flush: 'pre' }
    );

    // Separated to avoid side-effects from the other
    // properties being watched
    watch(
      () => internalForm.value.showAdditionalFees,
      (showAdditionalFees) => {
        if (showAdditionalFees) {
          if (props.creationMode) {
            if (!internalForm.value.additionalFees.length) {
              void addDefaultAdditionalFees();
            }
          } else {
            if (!internalForm.value.additionalFees.length) {
              void addDefaultAdditionalFees();
            }
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

    onMounted(() => {
      if (props.creationMode) void addItemLines(3);
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
    };
  },
});
</script>
