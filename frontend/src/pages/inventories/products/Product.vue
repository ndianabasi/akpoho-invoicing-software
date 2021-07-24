<template>
  <div class="q-pa-md">
    <view-card
      v-if="!!productProperties.length"
      :title-info="titleInfo"
      show-avatar
      show-title-panel-side
      :loading="loading"
      use-title-panel-menu
      :title-panel-menu-data="titlePanelMenuData"
    >
      <template #body-panel>
        <div class="q-gutter-y-sm">
          <q-list padding>
            <q-item v-for="property in productProperties" :key="property.name">
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
} from 'vue';
import ViewCard from '../../../components/ViewCard.vue';
import useTitleInfo from '../../../composables/useTitleInfo';
import useResourcePermissions from '../../../composables/useResourcePermissions';
import useDeleteResource from '../../../composables/useDeleteResource';
import {
  PERMISSION,
  ProductResultRowInterface,
  TitleInfo,
  TitlePanelMenuData,
} from '../../../store/types';
import { store } from '../../../store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'ViewProduct',

  components: {
    ViewCard,
  },

  props: {
    productId: {
      type: String,
      required: false,
      default: '',
    },
  },

  setup(props) {
    const router = useRouter();
    const $q = useQuasar();
    const loading = ref(false);

    const currentProduct = computed(
      () =>
        store.getters[
          'products/GET_CURRENTLY_VIEWED_PRODUCT'
        ] as ProductResultRowInterface
    );

    let titleInfo: Ref<TitleInfo | null> = ref(null);

    watch(
      currentProduct,
      () => {
        const title = useTitleInfo({
          title: currentProduct?.value?.name ?? '',
          avatar: undefined,
        });

        titleInfo.value = title.value;
      },
      { deep: true }
    );

    const stopFetchCurrentlyViewedProduct = watchEffect(() => {
      loading.value = true;
      void store
        .dispatch('products/FETCH_CURRENTLY_VIEWED_PRODUCT', {
          productId: props.productId,
        })
        .then(() => {
          loading.value = false;
        });
    });

    const productProperties = computed(() => {
      const product = currentProduct.value;
      return [
        { name: 'ID', value: product?.id },
        { name: 'Name', value: product?.name },
        { name: 'Type', value: product?.type?.name },
        { name: 'SKU', value: product?.sku },
        { name: 'Price', value: product?.price },
        { name: 'Stock Status', value: product?.stock_status },
        { name: 'Is Enabled', value: Boolean(product?.is_enabled) },
        {
          name: 'Product Has Weight?',
          value: Boolean(product?.product_has_weight),
        },
        {
          name: 'Weight',
          value: `${product?.weight} ${product?.meta?.weight_unit}`,
        },
        { name: 'Country of Manufacture', value: product?.country?.name },
        { name: 'Short Description', value: product?.short_description },
        { name: 'Description', value: product?.description },
        { name: 'Created At', value: product?.created_at },
        { name: 'Updated At', value: product?.updated_at },
      ];
    });

    const handleDeletion = async function () {
      await useDeleteResource({
        resource: 'product',
        resourceName: 'Product',
        payload: props.productId,
      })
        .then(() => {
          const postDeletionAction = {
            routeName: 'all_products',
            routeParams: undefined,
          };

          void router.push({
            name: postDeletionAction?.routeName,
            params: postDeletionAction?.routeParams,
          });
        })
        .catch((error: Error) => {
          $q.notify({
            type: 'negative',
            message: JSON.stringify(error),
            timeout: 5000,
            position: 'top',
          });
        });
    };

    const resourcePermissions = useResourcePermissions({
      edit: PERMISSION.CAN_EDIT_INVENTORIES,
      list: PERMISSION.CAN_LIST_INVENTORIES,
      delete: PERMISSION.CAN_DELETE_INVENTORIES,
    });

    const titlePanelMenuData = computed((): TitlePanelMenuData[] => {
      return [
        {
          label: 'Edit Product',
          icon: 'edit',
          type: 'router-navigation',
          permitted: resourcePermissions?.canEdit ?? false,
          routeObject: {
            name: 'edit_product',
            params: { productId: props.productId },
          },
        },
        {
          label: 'Delete Product',
          icon: 'delete',
          type: 'click-action',
          permitted: resourcePermissions?.canDelete ?? false,
          action: () => handleDeletion(),
        },
        {
          label: 'All Products',
          icon: 'view_list',
          type: 'router-navigation',
          permitted: resourcePermissions?.canList ?? false,
          routeObject: { name: 'all_products' },
        },
      ];
    });

    onBeforeMount(() => {
      stopFetchCurrentlyViewedProduct();
    });

    return {
      loading,
      tab: ref('user_account'),
      titleInfo,
      resourcePermissions,
      handleDeletion,
      productProperties,
      titlePanelMenuData,
    };
  },
});
</script>
