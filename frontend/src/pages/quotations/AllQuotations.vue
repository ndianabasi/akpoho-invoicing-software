<template>
  <quasar-table
    :table-columns="columns"
    :table-name="tableName"
    :table-data-getter-type="tableDataGetterType"
    :default-sort="defaultSort"
    no-results-label="Sorry! No quotations were found. Please check your filters too."
    row-view-route-name="view_quotation"
    row-edit-route-name="edit_quotation"
    route-param="quotationId"
    row-delete-action-type="quotations/DELETE_QUOTATION"
    entity-name="Quotation"
    table-data-fetch-end-point="invoices-quotations"
    is-company-specific
    show-new-route-button
    :new-route-object="{
      routeName: 'create_quotation',
      icon: 'person_add_alt',
      title: 'New Quotation',
    }"
    :resource-action-permissions="resourceActionPermissions"
    :extra-query-strings="{ type: 'quotation' }"
  ></quasar-table>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import quotationColumns from '../../components/data/table-definitions/quotations';
import QuasarTable from '../../components/QuasarTable.vue';
import { PERMISSION } from '../../store/types';

export default defineComponent({
  name: 'AllQuotations',
  components: {
    QuasarTable,
  },
  setup() {
    const tableName = ref('All Quotations');

    const defaultSort = {
      sortBy: 'date',
      descending: true,
    };

    const data = reactive({
      columns: quotationColumns,
      stickyTable: false,
    });

    return {
      tableName,
      columns: data.columns,
      stickyTable: data.stickyTable,
      defaultSort,
      resourceActionPermissions: ref({
        new: PERMISSION.CAN_CREATE_QUOTATIONS,
        view: PERMISSION.CAN_VIEW_QUOTATIONS,
        edit: PERMISSION.CAN_EDIT_QUOTATIONS,
        delete: PERMISSION.CAN_DELETE_QUOTATIONS,
      }),
    };
  },
});
</script>
