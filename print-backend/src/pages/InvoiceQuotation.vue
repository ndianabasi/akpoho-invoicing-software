<template>
  <q-page class="row items-start justify-center q-mt-md">
    <div
      :class="'col-md-12 col-lg-10 col-xl-10 col-sm-12 col-xs-12 invoice-quotation-body'"
    >
      <q-card flat bordered class="no-border">
        <q-card-section>
          <div class="row q-gutter-sm q-my-lg-md q-my-sm-sm company-logo">
            <div class="col items-center justify-center col-12 column">
              <img
                v-if="companyInformation?.logoUrl"
                :src="companyInformation?.logoUrl"
                style="height: 100px"
              />
              <q-avatar
                v-else
                square
                size="100px"
                color="deep-purple-8"
                text-color="white"
                >{{ companyInformation?.logoInitials }}</q-avatar
              >
              <div class="text-h5 text-deep-purple-8 q-mt-sm">
                {{ companyInformation?.name }}
              </div>
            </div>
          </div>
          <div
            class="
              q-mx-xl-xl q-mx-lg-xl q-mx-md-lg q-mx-sm-md
              row
              items-center
              justify-start
              q-gutter-sm q-my-lg-md q-my-sm-sm
            "
          >
            <div class="col col-12">
              <div class="text-body2 text-bold text-deep-purple-8 q-mt-sm">
                {{ documentDate }}
              </div>
              <div class="text-body2 text-deep-purple-8 q-mt-md text-bold">
                ATTENTION:
              </div>
              <div
                v-if="customerInformation.isIndividualCustomerOrRepAvailable"
                class="text-bold text-deep-purple-8"
              >
                <span
                  v-if="
                    customerInformation.individualCustomerOrRepDetails
                      .customerHasTitle
                  "
                  >{{
                    customerInformation.individualCustomerOrRepDetails.title
                  }}&nbsp;</span
                >{{ customerInformation.individualCustomerOrRepDetails.name }},
              </div>
              <div
                v-if="customerInformation.isCorporateCustomer"
                class="text-bold text-deep-purple-8"
              >
                {{ customerInformation.corporateCustomerDetails.name }}.
              </div>
              <div class="text-body2">
                <span class="text-bold">EMAIL ADDRESS:</span>&nbsp;
                <span v-if="customerInformation.isCorporateCustomer"
                  >{{
                    customerInformation.corporateCustomerDetails.email
                  }} </span
                ><span
                  v-if="customerInformation.isIndividualCustomerOrRepAvailable"
                  >;
                  {{
                    customerInformation.individualCustomerOrRepDetails.email
                  }}</span
                >
              </div>
              <div class="text-body2 q-mb-sm">
                <span class="text-bold">PHONE NUMBER:</span>&nbsp;
                <span v-if="customerInformation.isCorporateCustomer"
                  >{{
                    customerInformation.corporateCustomerDetails.phoneNumber
                  }} </span
                ><span
                  v-if="customerInformation.isIndividualCustomerOrRepAvailable"
                  >;
                  {{
                    customerInformation.individualCustomerOrRepDetails
                      .phoneNumber
                  }}</span
                >
              </div>
              <div class="row q-gutter-xs-none q-mt-md">
                <div
                  v-if="customerInformation.isBillingAddressAvailable"
                  class="col col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3"
                >
                  <div class="text-body2 text-deep-purple-8 text-bold">
                    BILLING ADDRESS:
                  </div>
                  <div class="text-body2">
                    {{ customerInformation.billingAddress.streetAddress }},
                  </div>
                  <div class="text-body2">
                    {{ customerInformation.billingAddress.addressLine2 }},
                  </div>
                  <div class="text-body2">
                    {{ customerInformation.billingAddress.addressLine3 }}
                  </div>
                </div>
                <div
                  v-if="customerInformation.isShippingAddressAvailable"
                  class="col col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3"
                >
                  <div
                    class="text-body2 text-deep-purple-8 text-bold q-mt-xs-sm"
                  >
                    SHIPPING ADDRESS:
                  </div>
                  <div class="text-body2">
                    {{ customerInformation.shippingAddress.streetAddress }},
                  </div>
                  <div class="text-body2">
                    {{ customerInformation.shippingAddress.addressLine2 }},
                  </div>
                  <div class="text-body2">
                    {{ customerInformation.shippingAddress.addressLine3 }}
                  </div>
                </div>
              </div>
              <div class="text-body2 q-mt-lg">
                Dear {{ customerInformation.customerTitle }},
              </div>
              <div class="row justify-center items-center">
                <div
                  v-if="customerInformation.documentTitle"
                  class="text-h5 text-uppercase q-mt-lg self-center"
                >
                  {{ customerInformation.documentTitle }}
                </div>
              </div>
              <div
                v-if="customerInformation.documentIntroduction"
                class="q-my-md"
                v-html="customerInformation.documentIntroduction"
              ></div>
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col col-12">
              <InvoiceQuotationTable
                class="invoice-quotation-view-table q-mx-auto"
                :form="form"
                :creation-mode="false"
                :view-mode="true"
              />
            </div>
          </div>
          <div
            class="
              q-mx-xl-xl q-mx-lg-xl q-mx-md-lg q-mx-sm-md
              column
              q-gutter-sm q-my-lg-md q-my-sm-sm
            "
          >
            <div class="col text-body2 text-deep-purple-8 text-bold">
              NOTES:
            </div>
            <div
              v-if="customerInformation.documentNotes"
              class="col"
              v-html="customerInformation.documentNotes"
            ></div>
          </div>
          <div
            class="
              column
              items-center
              justify-center
              q-gutter-sm q-my-lg-md q-my-sm-sm
              footer
            "
          >
            <div class="text-body2 text-center text-bold text-deep-purple-8">
              {{ companyInformation?.name }}
            </div>
            <div class="text-body2 text-center">
              {{ companyInformation?.fullAddress }}
            </div>
            <div class="text-body2 text-center">
              <span v-if="companyInformation.email"
                ><span class="text-bold">EMAIL:</span>&nbsp;
                {{ companyInformation?.email }} | </span
              ><span v-if="companyInformation.phoneNumber"
                ><span class="text-bold">PHONE NUMBER:</span>&nbsp;
                {{ companyInformation?.phoneNumber }}</span
              >
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent, ref, computed, PropType } from 'vue';
import {
  CurrentlyViewedInvoiceQuotation,
  InvoiceQuotationType,
  QuotationInvoiceFormShape,
} from '../types';
import { useStore } from '../store';
import InvoiceQuotationTable from '../components/InvoiceQuotationTable.vue';
import {
  currentInvoiceQuotation,
  getCurrentInvoiceQuotationData,
  fullDate,
  getCustomerInformation,
  getCompanyInformation,
} from '../composables/useInvoiceQuotation';
import itemsColumns from '../components/data/table-definitions/quotation_invoice_items';

export default defineComponent({
  name: 'ViewInvoiceQuotation',

  components: {
    InvoiceQuotationTable,
  },

  props: {
    quotationId: {
      type: String,
      required: false,
      default: '',
    },
    documentType: {
      type: String as PropType<InvoiceQuotationType>,
      required: false,
      default: 'quotation',
    },
  },

  preFetch({
    store,
    currentRoute /* previousRoute, redirect, ssrContext, urlPath, publicPath */,
  }) {
    return store.dispatch(
      'invoices_quotations/FETCH_CURRENTLY_VIEWED_INVOICE_QUOTATION',
      {
        id: currentRoute.params.invoiceQuotationId,
        type: currentRoute.params.documentType,
      }
    );
  },

  setup(/* props */) {
    const $store = useStore();
    const form: QuotationInvoiceFormShape = {} as QuotationInvoiceFormShape;

    currentInvoiceQuotation.value = computed(
      () =>
        $store?.getters[
          'invoices_quotations/GET_CURRENTLY_VIEWED_INVOICE_QUOTATION'
        ] as CurrentlyViewedInvoiceQuotation
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

    const customerInformation = computed(() =>
      getCustomerInformation(currentInvoiceQuotation.value)
    );

    const companyInformation = computed(() =>
      getCompanyInformation(currentInvoiceQuotation.value)
    );

    return {
      form,
      companyImageUrl: ref(
        `https://placeimg.com/500/300/nature?t=${Math.random()}`
      ),
      documentDate: computed(() => fullDate(form.date)),
      customerInformation,
      companyInformation,
    };
  },
});
</script>
