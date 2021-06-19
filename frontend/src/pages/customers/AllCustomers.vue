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
    :table-data-fetch-end-point="allCustomersEndpoint"
    show-selections
    route-param="customerId"
    :selection-actions="selectionActions"
  ></quasar-table>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { defineComponent, reactive, ref, computed, Ref } from 'vue';
import { useStore } from 'vuex';
import {
  PERMISSION,
  ResourceName,
  ResourceNamePlural,
  ResourceType,
  StringIDNameInterface,
} from '../../store/types';
import customerColumns from '../../components/data/table-definitions/customers';
import QuasarTable from '../../components/QuasarTable.vue';
import { SelectionAction } from '../../types/table';

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

    const allCustomersEndpoint = computed(() => {
      const currentCompany = store.getters[
        'auth/GET_CURRENT_COMPANY'
      ] as StringIDNameInterface;

      return `/${currentCompany.id}/customers`;
    });

    const selectionActions: Ref<SelectionAction[]> = ref([
      {
        label: 'Delete',
        icon: 'delete',
        actionType: 'delete',
        resourceType: 'customer' as ResourceType,
        resourceName: 'Customer' as ResourceName,
        resourceNamePlural: 'Customers' as ResourceNamePlural,
      },
    ]);

    return {
      tableName,
      columns: data.columns,
      rows: customers,
      stickyTable: data.stickyTable,
      tableDataFetchActionType,
      tableDataGetterType,
      defaultSort,
      allCustomersEndpoint,
      resourceActionPermissions: ref({
        new: PERMISSION.CAN_CREATE_CUSTOMERS,
        view: PERMISSION.CAN_VIEW_CUSTOMERS,
        edit: PERMISSION.CAN_EDIT_CUSTOMERS,
        delete: PERMISSION.CAN_DELETE_CUSTOMERS,
      }),
      selectionActions,
    };
  },
});
</script>
