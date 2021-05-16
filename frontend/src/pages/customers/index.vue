<template>
  <q-page>
    <router-view />

    <quasar-table
      :table-columns="columns"
      :table-name="tableName"
      :table-data-getter-type="tableDataGetterType"
      :default-sort="defaultSort"
      no-results-label="Sorry! No customers were found. Please check your filters too."
      row-view-route-name="view_customer"
      row-edit-route-name="edit_customer"
      row-delete-action-type="customers/DELETE_CUSTOMER"
      entity-name="Customer"
      table-data-fetch-end-point="customers"
      show-selections
    ></quasar-table>
  </q-page>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { Customer } from '../../store/customers/state';

import customerColumns from '../../components/data/table-definitions/customers';

import QuasarTable from '../../components/QuasarTable.vue';

export default defineComponent({
  name: 'Customers',
  components: {
    QuasarTable,
  },
  setup() {
    const tableName = ref('All Customers');
    const store = useStore();

    const defaultSort = {
      sortBy: 'first_name',
      descending: false,
    };

    const tableDataFetchActionType = ref('customers/FETCH_ALL_CUSTOMERS');
    const tableDataGetterType = ref('customers/GET_ALL_CUSTOMERS');

    const customers = computed(
      () => store.getters['customers/GET_ALL_CUSTOMERS']
    );

    const data = reactive({
      columns: customerColumns,
      rows: store.getters['customers/GET_ALL_CUSTOMERS'] as Array<Customer>,
      stickyTable: false,
    });

    return {
      tableName,
      columns: data.columns,
      rows: customers,
      stickyTable: data.stickyTable,
      tableDataFetchActionType,
      tableDataGetterType,
      defaultSort,
    };
  },
});
</script>
