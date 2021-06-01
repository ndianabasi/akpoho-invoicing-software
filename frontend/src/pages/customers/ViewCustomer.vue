<template>
  <div class="q-pa-md">
    <view-card
      v-if="customer"
      :title-info="titleInfo"
      show-avatar
      show-title-panel-side
    >
      <template #body-panel>
        <q-tabs v-model="tab" align="justify" narrow-indicator class="q-mb-lg">
          <q-tab
            class="text-purple"
            name="customer_details"
            label="Customer Details"
          />
          <q-tab
            class="text-orange"
            name="customer_addresses"
            label="Customer Addresses"
          />
        </q-tabs>

        <div class="q-gutter-y-sm">
          <q-tab-panels
            v-model="tab"
            animated
            transition-prev="scale"
            transition-next="scale"
          >
            <q-tab-panel name="customer_details">
              <q-list padding>
                <template
                  v-if="
                    !customer.is_corporate ||
                    (customer.is_corporate && customer.corporate_has_rep)
                  "
                >
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-uppercase">ID</q-item-label>
                      <q-item-label caption lines="2">{{
                        customer.id
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-uppercase">Title</q-item-label>
                      <q-item-label caption lines="2">{{
                        customer.title?.name ?? ''
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-uppercase"
                        >First Name</q-item-label
                      >
                      <q-item-label caption lines="2">{{
                        customer.first_name
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-uppercase"
                        >Middle Name</q-item-label
                      >
                      <q-item-label caption lines="2">{{
                        customer.middle_name
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-uppercase"
                        >Last Name</q-item-label
                      >
                      <q-item-label caption lines="2">{{
                        customer.last_name
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-uppercase"
                        >Personal Email Address</q-item-label
                      >
                      <q-item-label caption lines="2">{{
                        customer.email
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-uppercase"
                        >Personal Phone Number</q-item-label
                      >
                      <q-item-label caption lines="2">{{
                        customer.phone_number
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>

                <template v-if="customer.is_corporate">
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-uppercase"
                        >Company Name</q-item-label
                      >
                      <q-item-label caption lines="2">{{
                        customer.company_name
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-uppercase"
                        >Company Phone Number</q-item-label
                      >
                      <q-item-label caption lines="2">{{
                        customer.company_phone
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-uppercase"
                        >Company Email Address</q-item-label
                      >
                      <q-item-label caption lines="2">{{
                        customer.company_email
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Customer Creation Date</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      customer.created_at
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Customer Last Update Date</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      customer.updated_at
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="customer_addresses">
              <!-- Customer Addresses -->
              <customer-addresses :customer-id="customerId" />
            </q-tab-panel>
          </q-tab-panels>

          <q-tab-panels
            v-model="tab"
            animated
            transition-prev="fade"
            transition-next="fade"
            class="bg-orange text-white text-center"
          >
            <q-tab-panel name="mails">
              <div class="text-h6">Mails</div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>

            <q-tab-panel name="alarms">
              <div class="text-h6">Alarms</div>
              Ad molestiae non facere animi nobis, similique nemo velit
              reiciendis corporis impedit nam in.
            </q-tab-panel>

            <q-tab-panel name="movies">
              <div class="text-h6">Movies</div>
              Nostrum necessitatibus expedita dolores? Voluptatem repudiandae
              magni ea.
            </q-tab-panel>
          </q-tab-panels>

          <q-tab-panels
            v-model="tab"
            animated
            transition-prev="jump-up"
            transition-next="jump-down"
            class="bg-teal text-white text-center"
          >
            <q-tab-panel name="mails">
              <div class="text-h6">Mails</div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>

            <q-tab-panel name="alarms">
              <div class="text-h6">Alarms</div>
              Ad molestiae non facere animi nobis, similique nemo velit
              reiciendis corporis impedit nam in.
            </q-tab-panel>

            <q-tab-panel name="movies">
              <div class="text-h6">Movies</div>
              Nostrum necessitatibus expedita dolores? Voluptatem repudiandae
              magni ea.
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </template>

      <template #title-panel-side>
        <q-btn flat color="primary" icon="more_vert">
          <q-menu
            anchor="bottom right"
            self="top end"
            transition-show="flip-right"
            transition-hide="flip-left"
          >
            <q-list class="text-primary">
              <q-item
                v-if="resourcePermissions.canEdit"
                :to="{
                  name: 'edit_customer',
                  params: { customerId: customerId }, //customerId from route props
                }"
              >
                <q-item-section>
                  <q-btn flat icon="edit" />
                </q-item-section>
                <q-item-section>Edit</q-item-section>
              </q-item>

              <q-item
                v-if="resourcePermissions.canList"
                :to="{
                  name: 'customers',
                }"
              >
                <q-item-section>
                  <q-btn flat icon="view_list" />
                </q-item-section>
                <q-item-section>All Customers</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>
    </view-card>
  </div>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import {
  defineComponent,
  ref,
  onBeforeMount,
  watchEffect,
  computed,
} from 'vue';
import ViewCard from '../../components/ViewCard.vue';
import CustomerAddresses from '../../pages/customers/CustomerAddresses.vue';
import useTitleInfo from '../../composables/useTitleInfo';
import useResourcePermissions from '../../composables/useResourcePermissions';
import { CurrentlyViewedCustomer, PERMISSION } from '../../store/types';
import { store } from '../../store';

export default defineComponent({
  name: 'ViewCustomer',

  components: {
    ViewCard,
    CustomerAddresses,
  },

  props: {
    customerId: {
      type: String,
      required: false,
      default: '',
    },
  },

  setup(props) {
    const currentCustomer = computed(
      () =>
        store.getters[
          'customers/GET_CURRENTLY_VIEWED_CUSTOMER'
        ] as CurrentlyViewedCustomer
    );

    const titleInfo = useTitleInfo({
      title: !currentCustomer.value.is_corporate
        ? `${currentCustomer?.value?.title?.name ?? ''} ${
            currentCustomer.value.first_name ?? ''
          } ${currentCustomer.value.last_name ?? ''}`
        : `${currentCustomer.value.company_name} (Corporate)`,
    });

    const stopFetchCurrentlyViewedCustomer = watchEffect(() => {
      void store.dispatch('customers/FETCH_CURRENTLY_VIEWED_CUSTOMER', {
        customerId: props.customerId,
      });
    });

    onBeforeMount(() => {
      stopFetchCurrentlyViewedCustomer();
    });

    return {
      customer: currentCustomer,
      tab: ref('customer_details'),
      titleInfo,
      resourcePermissions: useResourcePermissions({
        edit: PERMISSION.CAN_EDIT_CUSTOMERS,
        list: PERMISSION.CAN_LIST_CUSTOMERS,
      }),
    };
  },
});
</script>
