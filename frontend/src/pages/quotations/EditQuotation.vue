<template>
  <div class="q-pa-md">
    <q-inner-loading :showing="loading && !creationMode">
      <q-spinner-oval size="100px" color="accent" />
    </q-inner-loading>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <view-card
        v-if="!loading || creationMode"
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
                      <!-- Use for expanding row -->
                      <q-th
                        v-if="enableImageUploads && form.showImages"
                        auto-width
                      />
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
                        v-if="enableImageUploads && form.showImages"
                        auto-width
                      >
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
                            form.items[props.rowIndex] &&
                            col.name === 'productId'
                          "
                        >
                          <q-input
                            v-if="
                              form.items[props.rowIndex] &&
                              form.items[props.rowIndex].productNameType ===
                                'custom_product'
                            "
                            v-model="form.items[props.rowIndex].productName"
                            type="text"
                            autogrow
                            :hint="col.hint"
                            class="
                              main-column-input
                              product-id-custom-product-input
                            "
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
                                :product-name-type-options="
                                  productNameTypeOptions
                                "
                                :row-index="props.rowIndex"
                                @typeSelected="setProductNameType"
                              />
                            </template>
                          </q-input>
                          <quasar-select
                            v-else
                            v-model="form.items[props.rowIndex].productId"
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
                              form.items[props.rowIndex].productId
                                ? ''
                                : 'Search for product'
                            "
                          >
                            <template #no-option="{ inputValue }">
                              <div
                                v-if="inputValue && inputValue.length > 0"
                                class="q-ml-sm"
                              >
                                No product found for query:
                                <b>{{ inputValue }}</b>
                              </div>
                            </template>
                            <template #append>
                              <ProductNameTypeSelect
                                :label="getProductNameType(props.rowIndex)"
                                :product-name-type-options="
                                  productNameTypeOptions
                                "
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
                              form.items[props.rowIndex]
                            "
                            :key="`field_${col.name}_${col.componentType}__index_${props.rowIndex}`"
                            v-model="form.items[props.rowIndex][col.name]"
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
                              <div
                                v-if="col.name === 'unitDiscount'"
                                class="text-body2"
                              >
                                {{
                                  form.items[props.rowIndex].unitDiscount &&
                                  form.items[props.rowIndex].unitDiscount > 0
                                    ? '-'
                                    : ''
                                }}
                              </div>
                            </template>
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
                                col.name === 'qty' ||
                                col.name === 'unitDiscount'
                              "
                              #after
                            >
                              <div
                                v-if="
                                  col.name === 'qty' && !form.simpleQuantities
                                "
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
                                    form.items[props.rowIndex].collectionTypeId
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
                                  :debounce="250"
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
                                v-if="
                                  col.name === 'qty' && form.simpleQuantities
                                "
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
                                  v-model="
                                    form.items[props.rowIndex].discountType
                                  "
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
                            :multiple="
                              col.componentTypeVariant === 'multi-select'
                            "
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
                                  !form.items[props.rowIndex].productNameType
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
                                  form.items[props.rowIndex].productNameType ===
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
                                  ? '- ' +
                                      itemLineDiscounts?.[props.rowIndex] ?? 0
                                  : 0
                              }}
                            </div>
                          </div>
                        </template>
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
                              v-for="(
                                number, listIndex
                              ) in addItemsDropdownList"
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
                    <q-tr v-show="props.expand" :props="props">
                      <q-td auto-width />
                      <q-td v-if="form.showImages" auto-width />
                      <q-td :colspan="2">
                        <div class="row q-pb-lg">
                          <div class="col col-12">
                            <q-file
                              :model-value="form.items[props.rowIndex].files"
                              label="Pick files"
                              outlined
                              multiple
                              append
                              counter
                              accept="image/*"
                              :max-file-size="1024 * 1024"
                              :clearable="!areFilesUploading(props.rowIndex)"
                              @update:model-value="
                                updateFiles($event, props.rowIndex)
                              "
                            >
                              <template #file="{ index }">
                                <q-avatar class="q-ma-sm" square size="100px">
                                  <img
                                    :src="fileObjectUrls[props.rowIndex][index]"
                                  />
                                  <q-badge floating transparent rounded
                                    ><q-btn
                                      size="sm"
                                      round
                                      flat
                                      color="white"
                                      icon="remove_circle_outline"
                                      @click.prevent="
                                        cancelFile(index, props.rowIndex)
                                      "
                                  /></q-badge>
                                </q-avatar>
                              </template>
                            </q-file>
                          </div>
                        </div>
                      </q-td>
                      <q-td :colspan="props.cols.length - 1" />
                    </q-tr>
                  </template>
                  <template #no-data="{ message }">
                    <div>{{ message }}</div>
                  </template>
                  <template #bottom-row>
                    <q-tr v-if="form.calculateTotals" class="bottom-row">
                      <q-td auto-width />
                      <q-td
                        v-if="enableImageUploads && form.showImages"
                        auto-width
                      />
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
                          form.setDiscountTypePerLine ||
                          !form.showDiscounts ||
                          (form.showDiscounts && !form.setDiscountTypePerLine)
                        "
                        class="text-right"
                        :colspan="
                          form.showDiscounts &&
                          sameLineDiscountTypes &&
                          form.setDiscountTypePerLine
                            ? 2
                            : form.showDiscounts && !form.setDiscountTypePerLine
                            ? 2
                            : 1
                        "
                      >
                        <div class="row flex-center justify-center">&nbsp;</div>
                      </q-td>
                      <q-td
                        v-if="
                          form.showDiscounts &&
                          (!form.setDiscountTypePerLine ||
                            sameLineDiscountTypes)
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
                      v-if="form.showDiscounts && !form.setDiscountTypePerLine"
                      :colspan="1"
                    >
                      &nbsp;
                    </q-td> -->
                      <q-td
                        v-if="
                          form.showDiscounts &&
                          !form.setDiscountTypePerLine &&
                          sameLineDiscountTypes &&
                          form.setDiscountTypePerLine
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
                        form.calculateTotals &&
                        form.showAdditionalSubtotalDiscount
                      "
                      class="bottom-row"
                    >
                      <q-td auto-width />
                      <q-td
                        v-if="enableImageUploads && form.showImages"
                        auto-width
                      />
                      <q-td
                        class="text-right"
                        :colspan="visibleColumns.length - 1"
                      >
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
                    <template v-if="form.showAdditionalFees">
                      <q-tr
                        v-for="(fee, index) in form.additionalFees"
                        :key="'additional_fees__' + index"
                        class="bottom-row"
                      >
                        <q-td auto-width />
                        <q-td
                          v-if="enableImageUploads && form.showImages"
                          auto-width
                        />
                        <q-td
                          class="text-right"
                          :colspan="visibleColumns.length - 3"
                        >
                          &nbsp;
                        </q-td>
                        <q-td class="text-right" :colspan="2">
                          <q-input
                            v-model="form.additionalFees[index].name"
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
                            v-model="form.additionalFees[index].amount"
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
                            v-if="!isAdditionalFeeLastItem(index)"
                            color="negative"
                            round
                            flat
                            dense
                            icon="delete_outline"
                            @click="removeAdditionalFee(index)"
                          />
                          <q-btn
                            v-else
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
                        !form.amountsAreTaxInclusive && form.calculateTotals
                      "
                      class="bottom-row"
                    >
                      <q-td auto-width />
                      <q-td
                        v-if="enableImageUploads && form.showImages"
                        auto-width
                      />
                      <q-td
                        class="text-right"
                        :colspan="visibleColumns.length - 1"
                      >
                        <div class="">Tax</div>
                      </q-td>
                      <q-td class="text-right grand-total-cell">
                        <div class="filled row items-center justify-end">
                          <div>{{ taxAmount }}</div>
                        </div>
                      </q-td>
                      <q-td auto-width> &nbsp; </q-td>
                    </q-tr>
                    <q-tr v-if="form.calculateTotals" class="bottom-row">
                      <q-td auto-width />
                      <q-td
                        v-if="enableImageUploads && form.showImages"
                        auto-width
                      />
                      <q-td
                        class="text-right"
                        :colspan="visibleColumns.length - 1"
                      >
                        <div class="">
                          Grand total
                          {{
                            form.amountsAreTaxInclusive ? '(tax inclusive)' : ''
                          }}
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
                <div class="col column col-sm-12 col-md-6 col-lg-6">
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
                        v-model="form.taxPercentage"
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
                      v-model="form.calculateTotals"
                      checked-icon="check"
                      color="positive"
                      label="Calculate totals"
                      unchecked-icon="clear"
                    />
                  </div>
                  <div class="col">
                    <div class="row q-gutter-lg">
                      <q-toggle
                        v-model="form.showDiscounts"
                        checked-icon="check"
                        color="positive"
                        label="Show discounts"
                        unchecked-icon="clear"
                      />
                      <q-select
                        v-if="
                          form.showDiscounts && !form.setDiscountTypePerLine
                        "
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
                  <div v-if="form.showDiscounts" class="col">
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
                  <div class="col q-my-sm">
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
                        v-model="form.additionalDiscountAmount"
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
                  <div class="col">
                    <q-toggle
                      v-model="form.showAdditionalFees"
                      checked-icon="check"
                      color="positive"
                      label="Set additional fees"
                      unchecked-icon="clear"
                    />
                  </div>
                  <div v-if="enableImageUploads" class="col">
                    <q-toggle
                      v-model="form.showImages"
                      checked-icon="check"
                      color="positive"
                      label="Show/Add images"
                      unchecked-icon="clear"
                    />
                  </div>
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
    </transition>
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
} from 'vue';

import ViewCard from '../../components/ViewCard.vue';
import useTitleInfo from '../../composables/useTitleInfo';
import useResourcePermissions from '../../composables/useResourcePermissions';
import {
  PERMISSION,
  TitleInfo,
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
  AdditionalFee,
  CustomerAddressForSelectPayload,
  CurrentlyViewedInvoiceQuotation,
} from '../../store/types';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import QuasarSelect, {
  QuasarSelectInterface,
} from '../../components/QuasarSelect';
import { useStore } from 'vuex';
import { useQuasar, format, QSelect } from 'quasar';
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
    quotationId: {
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
    const quotationCreated = ref(false);
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();
    const isSubmitting = ref(false);
    const fileObjectUrls: Ref<string[][]> = ref([]);
    const loading = ref(true);
    const enableImageUploads = computed(() => false);
    const hasFormChanged = ref(false);

    const customerSelect: Ref<QuasarSelectInterface | null> = ref(null);
    const customerBillingAddressSelect: Ref<QuasarSelectInterface | null> =
      ref(null);
    const customerShippingAddressSelect: Ref<QuasarSelectInterface | null> =
      ref(null);

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

    const uploadFiles = (rowIndex: number) => {
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
    };

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

    const customersForSelectOptions: Ref<Array<SelectOption>> = ref([]);

    const currentInvoiceQuotation = computed({
      get: () =>
        store.getters[
          'invoices_quotations/GET_CURRENTLY_VIEWED_INVOICE_QUOTATION'
        ] as CurrentlyViewedInvoiceQuotation,
      set: (value) => value,
    });

    const customerBillingAddresses = computed({
      get: () =>
        store.getters['customers/GET_CUSTOMER_ADDRESSES_FOR_SELECT']
          .billingAddresses as SelectOption[],
      set: (value) => value,
    });

    const customerShippingAddresses = computed({
      get: () =>
        store.getters['customers/GET_CUSTOMER_ADDRESSES_FOR_SELECT']
          .shippingAddresses as SelectOption[],
      set: (value) => value,
    });

    const form: QuotationInvoiceFormShape = reactive({
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
    });

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
    };

    const additionalFeeShape: AdditionalFee = { name: '', amount: 0 };

    const addItemLines = (numberOfLines = 1) => {
      for (let i = 0; i < numberOfLines; i++) {
        // Spread operator used to clone object to avoid
        // object reference issues
        form.items.push({ ...quotationItemShape });
      }
    };

    const addAdditionalFee = () => {
      // Spread operator used to clone object to avoid
      // object reference issues
      form.additionalFees.push({ ...additionalFeeShape });
    };

    const addDefaultAdditionalFees = () => {
      form.additionalFees = [
        { name: 'Shipping Fee', amount: 0 },
        { name: 'Installation Fee', amount: 0 },
      ];
    };

    const removeItem = (index: number) => form.items.splice(index, 1);

    const isLastItem = (index: number) => form.items.length - 1 === index;

    const removeAdditionalFee = (index: number) =>
      form.additionalFees.splice(index, 1);

    const isAdditionalFeeLastItem = (index: number) =>
      form.additionalFees.length - 1 === index;

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

          if (form.showDiscounts) {
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

    const getLineDiscountArray = function (
      items: QuotationInvoiceItemShape[]
    ): number[] {
      const discountArray: number[] = [];
      if (items && items.length) {
        items.forEach((item, index) => {
          const unitPrice = Number(item?.unitPrice ?? 0);
          const qty = Number(item?.qty ?? 0);
          const roundingType = form.roundAmountType;
          const numberOfDecimals = form.numberOfDecimals;
          //const thousandSeparator = form.thousandSeparatorType;

          if (form.showDiscounts) {
            const unitDiscount = Number(item?.unitDiscount ?? 0);
            let discount = 0;
            if (form.discountType === 'percentage') {
              discount = (unitDiscount / 100) * unitPrice;
            } else {
              discount = unitDiscount;
            }

            if (form.roundAmounts) {
              discountArray[index] = Number(
                getRoundedTotal(qty * discount, roundingType, numberOfDecimals)
              );
            } else {
              discountArray[index] = qty * discount;
            }
          } else {
            discountArray[index] = 0;
          }
        });
      }
      return discountArray;
    };

    const itemTotals = computed({
      get: () => {
        return getTotalArray(form.items);
      },
      set: (value) => value,
    });

    const itemLineDiscounts = computed({
      get: () => {
        return getLineDiscountArray(form.items);
      },
      set: (value) => value,
    });

    // Watch for changes in quotation settings and items
    // and re-compute (set) the total row
    watch(
      () => form,
      (form) => {
        // Indicate that form has changed
        hasFormChanged.value = true;

        itemTotals.value = getTotalArray(form.items);
        itemLineDiscounts.value = getLineDiscountArray(form.items);

        // Update vuex store
        //store.commit('invoices_quotations/SET_QUOTATION_FORM', form);
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
      form.items[index].productId = null;
      form.items[index].productNameType = type;
    };

    const getProductNameType = computed(() => (index: number) => {
      const activeProductNameType = form.items[index].productNameType;
      return productNameTypeOptions.filter(
        (option) => option.value === activeProductNameType
      )[0].label;
    });

    const totalQuantities = computed(() => {
      return form.items
        .map((item) => Number(item.qty))
        .reduce((prevQty, curQty) => prevQty + curQty, 0);
    });

    const subTotal = computed(() => {
      let total = itemTotals.value.reduce(
        (prevTotal, curTotal) => Number(prevTotal) + Number(curTotal),
        0
      );

      return Number(
        getRoundedTotal(total, form.roundAmountType, form.numberOfDecimals)
      );
    });

    const totalDiscounts = computed(() => {
      const discounts = itemLineDiscounts.value.reduce(
        (prevDiscount, curDiscount) =>
          Number(prevDiscount) + Number(curDiscount),
        0
      );

      return Number(
        getRoundedTotal(discounts, form.roundAmountType, form.numberOfDecimals)
      );
    });

    const sameLineDiscountTypes = computed(() => {
      return (
        form.items.every((item) => item.discountType === 'number') ||
        form.items.every((item) => item.discountType === 'percentage')
      );
    });

    const additionalSubtotalDiscount = computed(() => {
      let discount = 0;
      if (form.additionalDiscountType === 'number') {
        discount = form?.additionalDiscountAmount ?? 0;
      } else {
        discount =
          ((form?.additionalDiscountAmount ?? 0) / 100) * subTotal.value;
      }

      return Number(
        getRoundedTotal(discount, form.roundAmountType, form.numberOfDecimals)
      );
    });

    const totalAdditionalFees = computed(() => {
      if (!form.additionalFees.length) return 0;
      return form.additionalFees
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
      if (form.amountsAreTaxInclusive) return 0;
      const tax = (grandTotalBeforeTax.value * form?.taxPercentage ?? 0) / 100;
      return Number(
        getRoundedTotal(tax, form.roundAmountType, form.numberOfDecimals)
      );
    });

    const grandTotal = computed(() =>
      Number(
        getRoundedTotal(
          taxAmount.value + grandTotalBeforeTax.value,
          form.roundAmountType,
          form.numberOfDecimals
        )
      )
    );

    let currentQuotation: Ref<QuotationInvoiceFormShape | null>;

    currentQuotation = !props.creationMode
      ? computed(
          () =>
            store.getters[
              'quotations/GET_CURRENTLY_VIEWED_QUOTATION'
            ] as QuotationInvoiceFormShape
        )
      : ref(null);

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
        void store
          .dispatch(
            `invoices_quotations/${
              isCreationMode ? 'CREATE_QUOTATION' : 'EDIT_QUOTATION'
            }`,
            isCreationMode
              ? { form: normalisedForm.value }
              : { form: normalisedForm.value, quotationId: props.quotationId }
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

    let titleInfo: Ref<TitleInfo | null> = ref(null);

    watch(
      currentQuotation,
      () => {
        const title =
          currentQuotation && currentQuotation.value
            ? useTitleInfo({
                title: currentQuotation.value.title ?? '',
                avatar: undefined,
              })
            : props.creationMode
            ? useTitleInfo({
                title: 'New Quotation',
                avatar: '',
              })
            : ref(null);

        titleInfo.value = title.value;
      },
      { deep: true }
    );

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

    watch(
      [
        () => form.showDiscounts,
        () => form.changeProductPrices,
        () => form.simpleQuantities,
      ],
      ([showDiscounts, changeProductPrices, simpleQuantities]) => {
        const discountColumnHeader = itemsColumns.filter(
          (column) => column.name === 'unitDiscount'
        )[0];
        const unitPriceColumnHeader = itemsColumns.filter(
          (column) => column.name === 'unitPrice'
        )[0];
        const lineDiscountColumnHeader = itemsColumns.filter(
          (column) => column.name === 'lineDiscount'
        )[0];

        discountColumnHeader.required = showDiscounts;
        lineDiscountColumnHeader.required = showDiscounts;
        unitPriceColumnHeader.disabled = !changeProductPrices;
        simpleQuantities
          ? (unitPriceColumnHeader.label = 'Unit Price')
          : (unitPriceColumnHeader.label = 'Price Per Collection');
      }
    );

    // Separated to avoid side-effects from the other
    // properties being watched
    watch(
      () => form.showAdditionalFees,
      (showAdditionalFees) => {
        if (showAdditionalFees) {
          if (props.creationMode) {
            if (!form.additionalFees.length) {
              void addDefaultAdditionalFees();
            }
          } else {
            if (!form.additionalFees.length) {
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
            .onCancel(() => (form.showAdditionalFees = true))
            .onOk(() => (form.additionalFees.length = 0));
        }
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

            form.items = (currentInvoiceQuotation.value?.items ?? [])
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((item) => {
                const isRealProduct = item?.product !== null;
                const productIdColumnHeader = itemsColumns.filter(
                  (column) => column.name === 'productId'
                )[0];

                if (isRealProduct) {
                  productIdColumnHeader.options?.push({
                    label: item?.product?.name ?? '',
                    value: item?.product?.id ?? '',
                  });
                }

                return {
                  productId: isRealProduct
                    ? {
                        label: item?.product?.name ?? '',
                        value: item?.product?.id ?? null,
                      }
                    : null,
                  productName: !isRealProduct ? item.product_name : '',
                  productNameType: isRealProduct
                    ? ('real_product' as ProductNameType)
                    : ('custom_product' as ProductNameType),
                  description: item.description,
                  qty: item.qty,
                  UOM: item.unitOfMeasurement.name,
                  collectionTypeId: item.collectionType.name,
                  groupQty: item.group_qty,
                  unitPrice: item.unit_price,
                  unitDiscount: item.unit_discount,
                  discountType: item.discount_type,
                };
              });

            form.additionalFees = currentInvoiceQuotation.value.additional_fees;
            form.date = currentInvoiceQuotation.value.date;
            form.code = currentInvoiceQuotation.value.code;

            form.customerId = {
              label: currentInvoiceQuotation.value.customer.customer_name,
              value: currentInvoiceQuotation.value.customer.id,
            };
            customersForSelectOptions.value.push({
              label: currentInvoiceQuotation.value.customer.customer_name,
              value: currentInvoiceQuotation.value.customer.id,
            });

            form.customerBillingAddressId = {
              label: currentInvoiceQuotation.value.billing_address.full_address,
              value: currentInvoiceQuotation.value.billing_address.id,
            };

            form.customerShippingAddressId = {
              label:
                currentInvoiceQuotation.value.shipping_address.full_address,
              value: currentInvoiceQuotation.value.shipping_address.id,
            };

            form.introduction = currentInvoiceQuotation.value.introduction;
            form.title = currentInvoiceQuotation.value.title;
            form.simpleQuantities =
              currentInvoiceQuotation.value.simple_quantities;
            form.amountsAreTaxInclusive =
              currentInvoiceQuotation.value.amounts_are_tax_inclusive;
            form.taxPercentage = currentInvoiceQuotation.value.tax_percentage;
            form.roundAmounts = currentInvoiceQuotation.value.round_amounts;
            form.roundAmountType =
              currentInvoiceQuotation.value.round_amount_type;
            form.showDiscounts = currentInvoiceQuotation.value.show_discounts;
            form.discountType = currentInvoiceQuotation.value.discount_type;
            form.setDiscountTypePerLine =
              currentInvoiceQuotation.value.set_discount_type_per_line;
            form.calculateTotals =
              currentInvoiceQuotation.value.calculate_totals;
            form.changeProductPrices =
              currentInvoiceQuotation.value.change_product_prices;
            form.numberOfDecimals =
              currentInvoiceQuotation.value.number_of_decimals;
            form.useThousandSeparator =
              currentInvoiceQuotation.value.use_thousand_separator;
            form.thousandSeparatorType =
              currentInvoiceQuotation.value.thousand_separator_type;
            form.notes = currentInvoiceQuotation.value.notes;
            form.showAdditionalSubtotalDiscount =
              currentInvoiceQuotation.value.show_additional_subtotal_discount;
            form.additionalDiscountType =
              currentInvoiceQuotation.value.additional_discount_type;
            form.additionalDiscountAmount =
              currentInvoiceQuotation.value.additional_discount_amount;
            form.showAdditionalFees =
              currentInvoiceQuotation.value.show_additional_fees;
            form.showImages = currentInvoiceQuotation.value.show_images;

            loading.value = false;
          })
          .catch(() => {
            loading.value = false;
          });
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const CAN_EDIT_QUOTATIONS = computed(() =>
      store.getters['permissions/GET_USER_PERMISSION']('can_edit_quotations')
    );

    onMounted(() => {
      if (props.creationMode) void addItemLines(3);

      console.log(customerSelect.value);
      customerSelect.value?.focus();
      customerBillingAddressSelect.value?.focus();
      customerShippingAddressSelect.value?.focus();

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
      quotation: currentQuotation,
      form,
      titleInfo,
      customerBillingAddresses,
      customerShippingAddresses,
      resourcePermissions: useResourcePermissions({
        view: PERMISSION.CAN_VIEW_COMPANIES,
        list: PERMISSION.CAN_LIST_COMPANIES,
      }),
      CAN_EDIT_QUOTATIONS,
      isSubmitting,
      onSubmit,
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
      totalQuantities,
      subTotal,
      totalDiscounts,
      itemLineDiscounts,
      sameLineDiscountTypes,
      additionalSubtotalDiscount,
      grandTotal,
      taxAmount,
      addAdditionalFee,
      isAdditionalFeeLastItem,
      removeAdditionalFee,
      areFilesUploading,
      fileUploadProgress,
      canUploadFiles,
      cancelFile,
      updateFiles,
      fileObjectUrls,
      loading,
      customersForSelectOptions,
      enableImageUploads,
    };
  },
});
</script>
