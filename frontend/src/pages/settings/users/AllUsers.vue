<template>
  <quasar-table
    :table-columns="columns"
    :table-name="tableName"
    :table-data-getter-type="tableDataGetterType"
    :default-sort="defaultSort"
    no-results-label="Sorry! No users were found. Please check your filters too."
    row-view-route-name="view_user"
    row-edit-route-name="edit_user"
    route-param="userId"
    row-delete-action-type="users/DELETE_USER"
    entity-name="User"
    :table-data-fetch-end-point="allUsersEndpoint"
    show-new-route-button
    :new-route-object="{
      routeName: 'add_user',
      icon: 'person_add_alt',
      title: 'New User',
    }"
    :resource-action-permissions="resourceActionPermissions"
    :show-expanded-row="false"
  ></quasar-table>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { defineComponent, reactive, ref, computed } from 'vue';
import { useStore } from 'vuex';
import userColumns from '../../../components/data/table-definitions/users';
import QuasarTable from '../../../components/QuasarTable.vue';
import { PERMISSION, StringIDNameInterface } from '../../../store/types';

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

    const allUsersEndpoint = computed(() => {
      const currentCompany = store.getters[
        'auth/GET_CURRENT_COMPANY'
      ] as StringIDNameInterface;

      return `/${currentCompany.id}/users`;
    });

    const data = reactive({
      columns: userColumns,
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
      allUsersEndpoint,
      resourceActionPermissions: ref({
        new: PERMISSION.CAN_CREATE_USERS,
        view: PERMISSION.CAN_VIEW_USERS,
        edit: PERMISSION.CAN_EDIT_USERS,
        delete: PERMISSION.CAN_DELETE_USERS,
      }),
    };
  },
});
</script>
