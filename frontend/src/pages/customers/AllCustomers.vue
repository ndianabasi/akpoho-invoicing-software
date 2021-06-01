<template>
  <quasar-table
    :table-columns="columns"
    :table-name="tableName"
    :table-data-getter-type="tableDataGetterType"
    :default-sort="defaultSort"
    show-new-route-button
    :new-route-object="{
      routeName: 'create_customer',
      icon: 'person_add',
      title: 'New Customer',
    }"
    :resource-action-permissions="resourceActionPermissions"
    no-results-label="Sorry! No customers were found. Please check your filters too."
    row-view-route-name="view_customer"
    row-edit-route-name="edit_customer"
    row-delete-action-type="customers/DELETE_CUSTOMER"
    entity-name="Customer"
    table-data-fetch-end-point="customers"
    show-selections
    route-param="customerId"
  ></quasar-table>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { PERMISSION } from '../../store/types';
import customerColumns from '../../components/data/table-definitions/customers';
import QuasarTable from '../../components/QuasarTable.vue';

export default defineComponent({
  name: 'AllCustomers',
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
      resourceActionPermissions: ref({
        new: PERMISSION.CAN_CREATE_CUSTOMERS,
        view: PERMISSION.CAN_VIEW_CUSTOMERS,
        edit: PERMISSION.CAN_EDIT_CUSTOMERS,
        delete: PERMISSION.CAN_DELETE_CUSTOMERS,
      }),
    };
  },
});
</script>
