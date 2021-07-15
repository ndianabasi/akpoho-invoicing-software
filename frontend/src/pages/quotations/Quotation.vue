<template>
  <div class="q-pa-md">
    <view-card
      v-if="!!companyProperties.length"
      :title-info="titleInfo"
      show-avatar
      show-title-panel-side
      card-container-classes="col-12"
    >
      <template #body-panel>
        <div class="q-gutter-y-sm">
          <q-list padding>
            <q-item v-for="property in companyProperties" :key="property.name">
              <q-item-section>
                <q-item-label class="text-uppercase">{{
                  property.name
                }}</q-item-label>
                <q-item-label caption lines="2">{{
                  property.value
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
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
                <q-item-section>Edit</q-item-section>
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

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import {
  defineComponent,
  ref,
  onBeforeMount,
  watchEffect,
  watch,
  computed,
  Ref,
  PropType,
} from 'vue';
import ViewCard from '../../components/ViewCard.vue';
import useTitleInfo from '../../composables/useTitleInfo';
import useResourcePermissions from '../../composables/useResourcePermissions';
import useDeleteResource from '../../composables/useDeleteResource';
import {
  CurrentlyViewedInvoiceQuotation,
  PERMISSION,
  TitleInfo,
} from '../../store/types';
import { store } from '../../store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'ViewQuotation',

  components: {
    ViewCard,
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

    const currentInvoiceQuotation = computed(
      () =>
        store.getters[
          'invoices_quotations/GET_CURRENTLY_VIEWED_INVOICE_QUOTATION'
        ] as CurrentlyViewedInvoiceQuotation
    );

    let titleInfo: Ref<TitleInfo | null> = ref(null);

    const stopFetchCurrentlyViewedInvoiceQuotation = watchEffect(() => {
      void store
        .dispatch(
          'invoices_quotations/FETCH_CURRENTLY_VIEWED_INVOICE_QUOTATION',
          {
            id: props.quotationId,
            queryString: { type: props.documentType },
          }
        )
        .then(() => {
          //
        });
    });

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
    };
  },
});
</script>
