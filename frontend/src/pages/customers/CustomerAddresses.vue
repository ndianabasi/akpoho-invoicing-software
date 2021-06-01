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
    :default-sort="defaultSort"
    no-results-label="Sorry! No addresses were found for this customer"
    entity-name="CustomerAddress"
    :table-data-fetch-end-point="`customers/${customerId}/customer-addresses`"
    show-new-route-button
    :resource-action-permissions="resourceActionPermissions"
  >
    <template #topAddNew>
      <q-btn
        v-if="resourceActionPermissions.new"
        flat
        round
        color="primary"
        icon="add_location"
        title="New Customer Address"
        >New Address</q-btn
      >
    </template>
    <template
      #grideModeItems="{
        row: {
          address_type,
          city,
          country,
          state,
          postal_code,
          street_address,
        },
      }"
    >
      <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12">
        <!-- <q-card>
            <q-card-section class="text-center">
              Calories for
              <br />
              <strong>{{ props.row.first_name }}</strong>
            </q-card-section>
            <q-separator />
            <q-card-section
              class="flex flex-center"
              :style="{ fontSize: props.row.last_name + 'px' }"
            >
              <div>{{ props.row.last_name }} g</div>
            </q-card-section>
          </q-card> -->
        <q-list bordered class="rounded-borders">
          <q-item class="q-my-lg">
            <q-item-section avatar middle>
              <q-icon
                :name="
                  address_type === 'shipping_address'
                    ? 'local_shipping'
                    : 'credit_card'
                "
                color="black"
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
                <q-btn class="gt-xs" size="12px" flat dense round icon="edit" />
                <q-btn
                  class="gt-xs"
                  size="12px"
                  flat
                  dense
                  round
                  icon="delete"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
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
import { PERMISSION } from '../../store/types';

export default defineComponent({
  name: 'CustomerAddresses',
  components: {
    QuasarTable,
  },

  props: {
    customerId: {
      type: String,
      required: true,
    },
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
      columns: customerAddressesColumns,
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
