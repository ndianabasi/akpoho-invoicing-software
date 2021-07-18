<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="q-pa-md">
    <view-card
      :title-info="null"
      show-avatar
      show-title-panel-side
      card-container-classes="col-md-12 col-lg-10 col-xl-10 col-sm-12 col-xs-12 invoice-quotation-body"
      :loading="loading"
    >
      <template #body-panel>
        <div class="row q-gutter-sm q-my-lg-md q-my-sm-sm company-logo">
          <div class="col items-center justify-center col-12 column">
            <q-img
              :src="companyImageUrl"
              spinner-color="white"
              style="height: 140px; max-width: 150px"
            />
            <div class="text-h5 text-deep-purple-8 q-mt-sm">
              {{ customerInformation.documentCompany.name }}
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
                >{{ customerInformation.corporateCustomerDetails.email }} </span
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
                  customerInformation.individualCustomerOrRepDetails.phoneNumber
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
                <div class="text-body2 text-deep-purple-8 text-bold q-mt-xs-sm">
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
          <div class="col text-body2 text-deep-purple-8 text-bold">NOTES:</div>
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
            {{ customerInformation.documentCompany.name }}
          </div>
          <div class="text-body2 text-center">
            {{ customerInformation.documentCompany.fullAddress }}
          </div>
          <div class="text-body2 text-center">
            <span v-if="customerInformation.documentCompany.email"
              ><span class="text-bold">EMAIL:</span>&nbsp;
              {{ customerInformation.documentCompany.email }} | </span
            ><span v-if="customerInformation.documentCompany.phoneNumber"
              ><span class="text-bold">PHONE NUMBER:</span>&nbsp;
              {{ customerInformation.documentCompany.phoneNumber }}</span
            >
          </div>
        </div>
      </template>

      <template #title-panel-side>
        <q-btn flat icon="more_vert">
          <q-menu
            anchor="bottom right"
            self="top end"
            transition-show="flip-right"
            transition-hide="flip-left"
          >
            <q-list>
              <q-item
                v-if="resourcePermissions.canEdit"
                :to="{
                  name: 'edit_quotation',
                  params: { quotationId: quotationId }, //quotationId from route props
                }"
              >
                <q-item-section>
                  <q-btn flat icon="edit" />
                </q-item-section>
                <q-item-section>Edit Quotation</q-item-section>
              </q-item>

              <q-item
                v-if="resourcePermissions.canDelete"
                clickable
                @click.prevent="handleDeletion"
              >
                <q-item-section>
                  <q-btn flat icon="delete" />
                </q-item-section>
                <q-item-section>Delete Quotation</q-item-section>
              </q-item>

              <q-item
                v-if="resourcePermissions.canList"
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
  watchEffect,
  computed,
  Ref,
  PropType,
  unref,
} from 'vue';
import ViewCard from '../../components/ViewCard.vue';
import useTitleInfo from '../../composables/useTitleInfo';
import useResourcePermissions from '../../composables/useResourcePermissions';
import useDeleteResource from '../../composables/useDeleteResource';
import {
  CurrentlyViewedInvoiceQuotation,
  PERMISSION,
  QuotationInvoiceFormShape,
  TitleInfo,
} from '../../store/types';
import { store } from '../../store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import InvoiceQuotationTable from '../../components/InvoiceQuotationTable.vue';
import {
  currentInvoiceQuotation,
  getCurrentInvoiceQuotationData,
  fullDate,
  getCustomerInformation,
} from '../../composables/invoices-quotations/useInvoiceQuotation';
import itemsColumns from '../../components/data/table-definitions/quotation_invoice_items';

export default defineComponent({
  name: 'ViewQuotation',

  components: {
    ViewCard,
    InvoiceQuotationTable,
  },

  props: {
    quotationId: {
      type: String,
      required: false,
      default: '',
    },
    documentType: {
      type: String as PropType<'quotation' | 'invoice'>,
      required: false,
      default: 'quotation',
    },
  },

  setup(props) {
    const router = useRouter();
    const $q = useQuasar();
    const loading = ref(false);
    let titleInfo: Ref<TitleInfo | null> = ref(null);
    const form: QuotationInvoiceFormShape = {} as QuotationInvoiceFormShape;

    const handleDeletion = async function () {
      await useDeleteResource({
        resource: 'company',
        resourceName: 'Company',
        payload: props.quotationId,
      })
        .then(() => {
          const postDeletionAction = {
            routeName: 'all_invoices_quotations',
            routeParams: undefined,
          };

          void router.push({
            name: postDeletionAction?.routeName,
            params: postDeletionAction?.routeParams,
          });
        })
        .catch((error) => {
          $q.notify({
            type: 'negative',
            message: JSON.stringify(error),
            timeout: 5000,
            position: 'top',
          });
        });
    };

    const stopFetchCurrentlyViewedInvoiceQuotation = watchEffect(() => {
      loading.value = true;

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
    });

    const customerInformation = computed(() =>
      getCustomerInformation(currentInvoiceQuotation.value)
    );

    onBeforeMount(() => {
      stopFetchCurrentlyViewedInvoiceQuotation();
    });

    return {
      tab: ref('user_account'),
      titleInfo,
      resourcePermissions: useResourcePermissions({
        edit: PERMISSION.CAN_EDIT_QUOTATIONS,
        list: PERMISSION.CAN_LIST_QUOTATIONS,
        delete: PERMISSION.CAN_DELETE_QUOTATIONS,
        new: PERMISSION.CAN_DELETE_QUOTATIONS,
      }),
      handleDeletion,
      loading,
      form,
      companyImageUrl: ref(
        `https://placeimg.com/500/300/nature?t=${Math.random()}`
      ),
      documentDate: computed(() => fullDate(form.date)),
      customerInformation,
    };
  },
});
</script>
