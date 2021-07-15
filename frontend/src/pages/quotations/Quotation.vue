<template>
  <div class="q-pa-md">
    <view-card
      :title-info="null"
      show-avatar
      show-title-panel-side
      card-container-classes="col-12"
      :loading="loading"
    >
      <template #body-panel>
        <div class="row q-gutter-sm">
          <div class="col col-12">
            <InvoiceQuotationTable
              class="invoice-quotation-view-table"
              :form="form"
              :creation-mode="false"
              :view-mode="true"
            />
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
  watch,
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
    };
  },
});
</script>
