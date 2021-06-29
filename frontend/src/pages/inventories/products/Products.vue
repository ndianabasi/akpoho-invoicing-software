<template>
  <quasar-table
    :table-columns="columns"
    :table-name="tableName"
    :table-data-getter-type="tableDataGetterType"
    :default-sort="defaultSort"
    no-results-label="Sorry! No products were found. Please check your filters too."
    row-view-route-name="view_product"
    row-edit-route-name="edit_product"
    route-param="productId"
    row-delete-action-type="products/DELETE_PRODUCT"
    entity-name="Product"
    table-data-fetch-end-point="products"
    show-new-route-button
    :new-route-object="{
      routeName: 'add_product',
      icon: 'library_add',
      title: 'New Product',
    }"
    :resource-action-permissions="resourceActionPermissions"
    is-company-specific
  >
    <template #topAddNew>
      <q-btn-dropdown
        split
        unelevated
        ripple
        class="q-ml-md-md q-ml-sm-sm"
        color="accent"
        label="New Product"
        @click="onNewProductDropdownMainClick"
      >
        <q-list
          v-for="type in productTypesForSelect"
          :key="'product_type_' + type.value"
        >
          <q-item
            v-close-popup
            clickable
            @click="onNewProductDropdownItemClick(type.label)"
          >
            <q-item-section>
              <q-item-label>{{ type.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </template>
  </quasar-table>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  computed,
  watchEffect,
  onBeforeUnmount,
  nextTick,
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import productColumns from '../../../components/data/table-definitions/products';
import QuasarTable from '../../../components/QuasarTable.vue';
import { PERMISSION, SelectOption } from '../../../store/types';

export default defineComponent({
  name: 'AllProducts',
  components: {
    QuasarTable,
  },
  setup() {
    const tableName = ref('All Products');
    const store = useStore();
    const router = useRouter();

    const defaultSort = {
      sortBy: 'email',
      descending: false,
    };

    const tableDataFetchActionType = ref('customers/FETCH_ALL_CUSTOMERS');
    const tableDataGetterType = ref('customers/GET_ALL_CUSTOMERS');

    const customers = computed(
      () => store.getters['customers/GET_ALL_CUSTOMERS']
    );

    const data = reactive({
      columns: productColumns,
      stickyTable: false,
    });

    const onNewProductDropdownMainClick = () => {
      // console.log('Clicked on main button')
    };

    const stopFetchProductTypesEffect = watchEffect(
      () => void store.dispatch('products/FETCH_PRODUCT_TYPES_FOR_SELECT')
    );

    const productTypesForSelect = computed(
      () =>
        store.getters['products/GET_PRODUCT_TYPES_FOR_SELECT'] as SelectOption[]
    );

    const onNewProductDropdownItemClick = (name: SelectOption['label']) => {
      const selectedProductType = productTypesForSelect.value.filter(
        (type) => type.label === name
      )[0];
      store.commit(
        'products/SET_CURRENTLY_EDITED_PRODUCT_TYPE',
        selectedProductType
      );
      void nextTick(() => {
        if (name === 'Simple Product') {
          void router.push({ name: 'create_simple_product' });
        }
      });
    };

    onBeforeUnmount(() => {
      stopFetchProductTypesEffect();
    });

    return {
      tableName,
      columns: data.columns,
      rows: customers,
      stickyTable: data.stickyTable,
      tableDataFetchActionType,
      tableDataGetterType,
      defaultSort,
      resourceActionPermissions: ref({
        new: PERMISSION.CAN_CREATE_INVENTORIES,
        view: PERMISSION.CAN_VIEW_INVENTORIES,
        edit: PERMISSION.CAN_EDIT_INVENTORIES,
        delete: PERMISSION.CAN_DELETE_INVENTORIES,
      }),
      onNewProductDropdownMainClick,
      onNewProductDropdownItemClick,
      productTypesForSelect,
    };
  },
});
</script>
