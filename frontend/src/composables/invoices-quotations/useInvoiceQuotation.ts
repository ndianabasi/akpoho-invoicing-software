import { QuotationInvoiceHeaders } from 'src/components/data/table-definitions/quotation_invoice_items';
import {
  CurrentlyViewedInvoiceQuotation,
  DiscountType,
  ProductNameType,
  QuotationInvoiceFormShape,
  QuotationInvoiceItemShape,
  RoundingType,
} from 'src/store/types';
import { computed, ref } from 'vue';
import { store } from '../../store';

export const currentInvoiceQuotation = computed({
  get: () =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    store.getters[
      'invoices_quotations/GET_CURRENTLY_VIEWED_INVOICE_QUOTATION'
    ] as CurrentlyViewedInvoiceQuotation,
  set: (value) => value,
});

export const getCurrentInvoiceQuotationData = computed(
  () =>
    (
      currentInvoiceQuotationData: CurrentlyViewedInvoiceQuotation,
      tableColumns: QuotationInvoiceHeaders[]
    ): QuotationInvoiceFormShape => {
      const form: QuotationInvoiceFormShape = {} as QuotationInvoiceFormShape;

      try {
        const currentInvoiceQuotationDataNormalised = JSON.parse(
          JSON.stringify(currentInvoiceQuotationData)
        ) as CurrentlyViewedInvoiceQuotation;

        const items = (currentInvoiceQuotationDataNormalised?.items ?? [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((item) => {
            const isRealProduct = item?.product !== null;
            const productIdColumnHeader = tableColumns.filter(
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
              customSerialNumber: item.custom_serial_number,
            };
          });

        form.items = items;

        form.additionalFees =
          currentInvoiceQuotationDataNormalised.additional_fees;
        form.date = currentInvoiceQuotationDataNormalised.date;
        form.code = currentInvoiceQuotationDataNormalised.code;

        form.customerId = {
          label: currentInvoiceQuotationDataNormalised.customer.customer_name,
          value: currentInvoiceQuotationDataNormalised.customer.id,
        };

        form.customerBillingAddressId = {
          label:
            currentInvoiceQuotationDataNormalised.billing_address.full_address,
          value: currentInvoiceQuotationDataNormalised.billing_address.id,
        };

        form.customerShippingAddressId = {
          label:
            currentInvoiceQuotationDataNormalised.shipping_address.full_address,
          value: currentInvoiceQuotationDataNormalised.shipping_address.id,
        };

        form.introduction =
          currentInvoiceQuotationDataNormalised.introduction === 'undefined'
            ? ''
            : currentInvoiceQuotationDataNormalised.introduction;
        form.title = currentInvoiceQuotationDataNormalised.title;
        form.simpleQuantities =
          currentInvoiceQuotationDataNormalised.simple_quantities;
        form.amountsAreTaxInclusive =
          currentInvoiceQuotationDataNormalised.amounts_are_tax_inclusive;
        form.taxPercentage =
          currentInvoiceQuotationDataNormalised.tax_percentage;
        form.roundAmounts = currentInvoiceQuotationDataNormalised.round_amounts;
        form.roundAmountType =
          currentInvoiceQuotationDataNormalised.round_amount_type;
        form.showDiscounts =
          currentInvoiceQuotationDataNormalised.show_discounts;
        form.discountType = currentInvoiceQuotationDataNormalised.discount_type;
        form.setDiscountTypePerLine =
          currentInvoiceQuotationDataNormalised.set_discount_type_per_line;
        form.calculateTotals =
          currentInvoiceQuotationDataNormalised.calculate_totals;
        form.changeProductPrices =
          currentInvoiceQuotationDataNormalised.change_product_prices;
        form.numberOfDecimals =
          currentInvoiceQuotationDataNormalised.number_of_decimals;
        form.useThousandSeparator =
          currentInvoiceQuotationDataNormalised.use_thousand_separator;
        form.thousandSeparatorType =
          currentInvoiceQuotationDataNormalised.thousand_separator_type;
        form.notes =
          currentInvoiceQuotationDataNormalised?.notes === 'undefined'
            ? ''
            : currentInvoiceQuotationDataNormalised?.notes;
        form.showAdditionalSubtotalDiscount =
          currentInvoiceQuotationDataNormalised.show_additional_subtotal_discount;
        form.additionalDiscountType =
          currentInvoiceQuotationDataNormalised.additional_discount_type;
        form.additionalDiscountAmount =
          currentInvoiceQuotationDataNormalised.additional_discount_amount;
        form.showAdditionalFees =
          currentInvoiceQuotationDataNormalised.show_additional_fees;
        form.showImages = currentInvoiceQuotationDataNormalised.show_images;
        form.useCustomSerialNumbers =
          currentInvoiceQuotationDataNormalised.use_custom_serial_numbers;
        form.useEditor = currentInvoiceQuotationDataNormalised.use_editor;
      } catch (error) {
        console.log(error);
      }

      return form;
    }
);

export const getRoundedTotal = function (
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

type GetTotalArrayConfig = {
  items: QuotationInvoiceItemShape[];
  roundAmountType: RoundingType;
  roundAmounts: boolean;
  numberOfDecimals: number;
  showDiscounts: boolean;
  discountType: DiscountType;
  roundedTotal: typeof getRoundedTotal;
};

export const getTotalArray = function ({
  items,
  roundAmountType,
  roundAmounts,
  numberOfDecimals,
  showDiscounts,
  discountType,
  roundedTotal,
}: GetTotalArrayConfig): number[] {
  const totalArray: number[] = [];
  if (items && items.length) {
    items.forEach((item, index) => {
      const unitPrice = Number(item?.unitPrice ?? 0);
      const qty = Number(item?.qty ?? 0);
      //const thousandSeparator = form.thousandSeparatorType;

      if (showDiscounts) {
        const unitDiscount = Number(item?.unitDiscount ?? 0);
        let discountedPrice = 0;
        if (discountType === 'percentage') {
          discountedPrice = (1 - unitDiscount / 100) * unitPrice;
        } else {
          discountedPrice = unitPrice - unitDiscount;
        }

        if (roundAmounts) {
          totalArray[index] = Number(
            roundedTotal(
              qty * discountedPrice,
              roundAmountType,
              numberOfDecimals
            )
          );
        } else {
          totalArray[index] = qty * discountedPrice;
        }
      } else {
        // The effect is the same for when `roundAmounts`
        // is true or false
        totalArray[index] = Number(
          roundedTotal(qty * unitPrice, roundAmountType, numberOfDecimals)
        );
      }
    });
  }
  return totalArray;
};

type GetLineDiscountArrayConfig = {
  items: QuotationInvoiceItemShape[];
  roundingType: RoundingType;
  roundAmounts: boolean;
  numberOfDecimals: number;
  showDiscounts: boolean;
  discountType: DiscountType;
  roundedTotal: typeof getRoundedTotal;
};

export const getLineDiscountArray = function ({
  items,
  roundingType,
  numberOfDecimals,
  showDiscounts,
  discountType,
  roundAmounts,
  roundedTotal,
}: GetLineDiscountArrayConfig): number[] {
  const discountArray: number[] = [];
  if (items && items.length) {
    items.forEach((item, index) => {
      const unitPrice = Number(item?.unitPrice ?? 0);
      const qty = Number(item?.qty ?? 0);
      //const thousandSeparator = form.thousandSeparatorType;

      if (showDiscounts) {
        const unitDiscount = Number(item?.unitDiscount ?? 0);
        let discount = 0;
        if (discountType === 'percentage') {
          discount = (unitDiscount / 100) * unitPrice;
        } else {
          discount = unitDiscount;
        }

        if (roundAmounts) {
          discountArray[index] = Number(
            roundedTotal(qty * discount, roundingType, numberOfDecimals)
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

export const getTotalQuantities = function (
  items: QuotationInvoiceItemShape[]
) {
  return computed(() => {
    return items
      .map((item) => Number(item.qty))
      .reduce((prevQty, curQty) => prevQty + curQty, 0);
  });
};

export const getSubTotal = function (
  itemTotals: number[],
  roundedTotal: typeof getRoundedTotal,
  roundAmountType: RoundingType,
  numberOfDecimals: number
) {
  return computed(() => {
    const total = itemTotals.reduce(
      (prevTotal, curTotal) => Number(prevTotal) + Number(curTotal),
      0
    );

    return Number(roundedTotal(total, roundAmountType, numberOfDecimals));
  });
};

export const discountTypeOptions = ref([
  { label: 'Num', value: 'number' },
  { label: '%', value: 'percentage' },
]);
export const roundTypeOptions = ref([
  { label: 'None', value: 'none' },
  { label: 'Nearest', value: 'nearest' },
  { label: 'Down', value: 'down' },
  { label: 'Up', value: 'up' },
]);
export const numberOfDecimalOptionValues = [0, 1, 2, 3, 4, 5, 6];
