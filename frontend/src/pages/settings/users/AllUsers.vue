<template>
  <quasar-table
    :table-columns="columns"
    :table-name="tableName"
    :table-data-getter-type="tableDataGetterType"
    :default-sort="defaultSort"
    no-results-label="Sorry! No users were found. Please check your filters too."
    row-view-route-name="view_user"
    row-edit-route-name="edit_user"
    row-delete-action-type="users/DELETE_USER"
    entity-name="User"
    table-data-fetch-end-point="users"
    show-new-route-button
    :new-route-object="{
      routeName: 'add_user',
      icon: 'person_add_alt',
      title: 'New User',
    }"
  ></quasar-table>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { Customer } from '../../../store/customers/state';

import userColumns from '../../../components/data/table-definitions/users';

import QuasarTable from '../../../components/QuasarTable.vue';

export default defineComponent({
  name: 'AllUsers',
  components: {
    QuasarTable,
  },
  setup() {
    const tableName = ref('All Users');
    const store = useStore();

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
      columns: userColumns,
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
