<template>
  <quasar-table
    grid-mode
    embed-mode
    :use-multi-filter="false"
    :use-pagination="false"
    :use-visible-columns="false"
    :show-selections="false"
    :table-columns="columns"
    :table-name="tableName"
    :table-data-getter-type="tableDataGetterType"
    no-results-label="Sorry! No addresses were found for this customer"
    entity-name="CustomerAddress"
    :table-data-fetch-end-point="`/${currentCompanyId}/customers/${customerId}/customer-addresses`"
    show-new-route-button
    :resource-action-permissions="resourceActionPermissions"
  >
    <template #topAddNew="{ fetch }">
      <q-btn
        v-if="resourceActionPermissions.new"
        flat
        icon="add_location"
        title="New Address"
        @click.stop.prevent="showCreateAddressDialog()"
        >New Address</q-btn
      >
      <q-dialog
        ref="createAddressDialogRef"
        v-model="createAddressDialog"
        persistent
        position="right"
      >
        <customer-address-edit
          creation-mode
          :customer-id="customerId"
          :current-dialog-ref="createAddressDialogRef"
          :post-update="fetch"
        />
      </q-dialog>
    </template>
    <template
      #gridModeItems="{
        props: {
          row: {
            address_type,
            city,
            country,
            state,
            postal_code,
            street_address,
            id: rowId,
          },
        },
        fetch,
      }"
    >
      <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12">
        <q-list bordered class="rounded-borders">
          <q-item class="q-my-lg">
            <q-item-section avatar middle>
              <q-icon
                :name="
                  address_type === 'shipping_address'
                    ? 'local_shipping'
                    : 'credit_card'
                "
                size="34px"
              />
            </q-item-section>

            <q-item-section middle class="col-2 gt-sm">
              <q-item-label lines="2" class="q-mt-sm">{{
                address_type === 'shipping_address' ? 'Shipping' : 'Billing'
              }}</q-item-label>
            </q-item-section>

            <q-item-section middle>
              <q-item-label lines="2">
                <span class="text-weight-medium">{{ street_address }}</span>
              </q-item-label>
              <q-item-label caption lines="1">
                {{ city }} {{ postal_code }}
              </q-item-label>
              <q-item-label caption lines="1">
                {{ state ? state + ',' : '' }} {{ country }}
              </q-item-label>
            </q-item-section>

            <q-item-section middle side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn
                  size="12px"
                  flat
                  dense
                  round
                  icon="edit"
                  @click.stop.prevent="showAddressDialog(rowId)"
                />
                <q-btn
                  size="12px"
                  flat
                  dense
                  round
                  icon="delete"
                  @click.prevent="deleteAddress(rowId, fetch)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <q-dialog
        :ref="
          (el) => {
            if (el) dialogRefs[rowId] = el;
          }
        "
        v-model="editAddressDialog[`${rowId}`]"
        persistent
        position="right"
      >
        <customer-address-edit
          :customer-id="customerId"
          :customer-address-id="rowId"
          :current-dialog-ref="dialogRefs[rowId]"
          :post-update="fetch"
        />
      </q-dialog>
    </template>
  </quasar-table>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';
import { useStore } from 'vuex';
import customerAddressesColumns from '../../components/data/table-definitions/customer_addresses';
import QuasarTable from '../../components/QuasarTable.vue';
import { PERMISSION, StringIDNameInterface } from '../../store/types';
import { FetchTableDataInterface } from '../../types/table';
import CustomerAddressEdit from './CustomerAddressEdit.vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'CustomerAddresses',
  components: {
    QuasarTable,
    CustomerAddressEdit,
  },

  props: {
    customerId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const $q = useQuasar();

    const tableName = ref('All Users');
    const editAddressDialog: { [index: string]: boolean } = reactive({});
    const createAddressDialog = ref(false);
    const createAddressDialogRef = ref(null);

    const dialogRefs = ref({});
    const store = useStore();

    const tableDataFetchActionType = ref('customers/FETCH_ALL_CUSTOMERS');
    const tableDataGetterType = ref('customers/GET_ALL_CUSTOMERS');

    const customers = computed(
      () => store.getters['customers/GET_ALL_CUSTOMERS']
    );

    const data = reactive({
      columns: customerAddressesColumns,
      stickyTable: false,
    });

    const showAddressDialog = function (id: string) {
      editAddressDialog[id] = true;
    };

    const showCreateAddressDialog = function () {
      createAddressDialog.value = true;
    };

    const deleteAddress = function (
      customerAddressId: string,
      postUpdate: FetchTableDataInterface
    ) {
      $q.dialog({
        title: 'Deletion Warning',
        message:
          "You are about to delete this customer address. Please type 'DELETE' to confirm your action.",
        prompt: {
          model: '',
          isValid: (val: string) => val.trim().toLowerCase() === 'delete',
          type: 'text',
        },
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        const deleteProgressDialog = $q.dialog({
          title: 'Processing',
          message: 'Software at work!',
          progress: true,
          ok: false,
          cancel: false,
          persistent: true,
        });
        await store
          .dispatch('customers/DELETE_CUSTOMER_ADDRESS', {
            customerId: props.customerId,
            customerAddressId: customerAddressId,
          })
          .then(async () => {
            await postUpdate();
            deleteProgressDialog.hide();
            return;
          })
          .catch(() => {
            deleteProgressDialog.hide();
          });
      });
    };

    const currentCompanyId = computed(() => {
      const currentCompany = store.getters[
        'auth/GET_CURRENT_COMPANY'
      ] as StringIDNameInterface;

      return currentCompany.id;
    });

    return {
      tableName,
      columns: data.columns,
      rows: customers,
      stickyTable: data.stickyTable,
      tableDataFetchActionType,
      tableDataGetterType,
      currentCompanyId,
      resourceActionPermissions: ref({
        new: PERMISSION.CAN_CREATE_CUSTOMERS,
        view: PERMISSION.CAN_VIEW_CUSTOMERS,
        edit: PERMISSION.CAN_EDIT_CUSTOMERS,
        delete: PERMISSION.CAN_DELETE_CUSTOMERS,
      }),
      showAddressDialog,
      editAddressDialog,
      dialogRefs,
      createAddressDialog,
      showCreateAddressDialog,
      createAddressDialogRef,
      deleteAddress,
    };
  },
});
</script>
