<template>
  <quasar-table
    :table-columns="columns"
    :table-name="tableName"
    :table-data-getter-type="tableDataGetterType"
    :default-sort="defaultSort"
    no-results-label="Sorry! No companies were found. Please check your filters too."
    row-view-route-name="view_company"
    row-edit-route-name="edit_company"
    route-param="companyId"
    row-delete-action-type="companies/DELETE_COMPANY"
    entity-name="Company"
    table-data-fetch-end-point="companies"
    show-new-route-button
    :new-route-object="{
      routeName: 'add_company',
      icon: 'person_add_alt',
      title: 'New Company',
    }"
    :resource-action-permissions="resourceActionPermissions"
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
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import companyColumns from '../../../components/data/table-definitions/companies';
import QuasarTable from '../../../components/QuasarTable.vue';
import { PERMISSION, SelectOption } from '../../../store/types';

export default defineComponent({
  name: 'AllCompanies',
  components: {
    QuasarTable,
  },
  setup() {
    const tableName = ref('All Companies');
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
      columns: companyColumns,
      stickyTable: false,
    });

    const onNewProductDropdownMainClick = () => {
      // console.log('Clicked on main button')
    };

    const onNewProductDropdownItemClick = (name: SelectOption['label']) => {
      console.log(name);
      if (name === 'Simple Product')
        void router.push({ name: 'create_simple_product' });
    };

    const stopFetchProductTypesEffect = watchEffect(
      () => void store.dispatch('products/FETCH_PRODUCT_TYPES_FOR_SELECT')
    );

    const productTypesForSelect = computed(
      () =>
        store.getters['products/GET_PRODUCT_TYPES_FOR_SELECT'] as SelectOption[]
    );

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
        new: PERMISSION.CAN_CREATE_COMPANIES,
        view: PERMISSION.CAN_VIEW_COMPANIES,
        edit: PERMISSION.CAN_EDIT_COMPANIES,
        delete: PERMISSION.CAN_DELETE_COMPANIES,
      }),
      onNewProductDropdownMainClick,
      onNewProductDropdownItemClick,
      productTypesForSelect,
    };
  },
});
</script>
