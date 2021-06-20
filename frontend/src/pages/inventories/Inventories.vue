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
  ></quasar-table>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';
import { useStore } from 'vuex';
import companyColumns from '../../components/data/table-definitions/companies';
import QuasarTable from '../../components/QuasarTable.vue';
import { PERMISSION } from '../../store/types';

export default defineComponent({
  name: 'AllCompanies',
  components: {
    QuasarTable,
  },
  setup() {
    const tableName = ref('All Companies');
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
      columns: companyColumns,
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
        new: PERMISSION.CAN_CREATE_COMPANIES,
        view: PERMISSION.CAN_VIEW_COMPANIES,
        edit: PERMISSION.CAN_EDIT_COMPANIES,
        delete: PERMISSION.CAN_DELETE_COMPANIES,
      }),
    };
  },
});
</script>
