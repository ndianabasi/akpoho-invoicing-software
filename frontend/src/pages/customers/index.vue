<template>
  <q-page>
    <router-view />
    <div class="q-pa-md">
      <q-table
        v-if="rows && rows.length"
        :rows="rows"
        :columns="columns"
        row-key="id"
        :selected-rows-label="getSelectedString"
        selection="multiple"
        v-model:selected="selected"
        :class="{ 'my-sticky-header-column-table': stickyTable }"
        :visible-columns="visibleColumns"
        ><template #top="props">
          <div class="col-2 q-table__title">{{ tableName }}</div>

          <q-space />

          <!--
            Using v-if directive will make the toggle or select dropdown disappear when all columns are unselected
          -->
          <div v-if="$q.screen.gt.xs" class="col">
            <q-toggle
              v-for="column in visibleColumnsObjects"
              :key="column.name"
              v-model="visibleColumns"
              :val="column.name"
              :label="column.label"
            />
          </div>
          <q-select
            v-else
            v-model="visibleColumns"
            multiple
            borderless
            dense
            options-dense
            :display-value="$q.lang.table.columns"
            emit-value
            map-options
            :options="visibleColumns"
            option-value="name"
            style="min-width: 150px"
          />

          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="q-ml-md"
          /> </template
      ></q-table>

      <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div>
    </div>
  </q-page>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  computed,
  watchEffect,
  onBeforeUnmount,
} from 'vue';
import { useStore } from 'vuex';
import { Customer } from '../../store/customers/state';

import customerColumns from '../../components/data/table-definitions/customers';

export default defineComponent({
  name: 'Customers',
  setup() {
    const tableName = ref('All Customers');
    const store = useStore();
    const selected = ref([]);
    const visibleColumnsObjects = ref([
      ...customerColumns
        .filter((column) => !column.required)
        .map((column) => column),
    ]);

    const visibleColumns = ref(
      visibleColumnsObjects.value.map((column) => column.name)
    );

    const fetchCustomers = async function () {
      void (await store.dispatch('customers/FETCH_ALL_CUSTOMERS'));
    };

    const stopfetchCustomerWatchEffect = watchEffect(
      () => void fetchCustomers()
    );

    const customers = computed(
      () => store.getters['customers/GET_ALL_CUSTOMERS']
    );

    const data = reactive({
      columns: customerColumns,
      rows: store.getters['customers/GET_ALL_CUSTOMERS'] as Array<Customer>,
      stickyTable: false,
    });

    onBeforeUnmount(() => {
      stopfetchCustomerWatchEffect();
    });

    return {
      tableName,
      selected,
      visibleColumns,
      visibleColumnsObjects,
      columns: data.columns,
      rows: customers,
      getSelectedString() {
        return selected.value.length === 0
          ? ''
          : `${selected.value.length} record${
              selected.value.length > 1 ? 's' : ''
            } selected of ${data.rows.length}`;
      },
      stickyTable: data.stickyTable,
    };
  },
});
</script>

<style lang="sass">
.my-sticky-header-column-table
  /* height or max-height is important */
  max-height: 80vh

  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 50vw

  td:first-child, td:nth-child(2)
    /* bg color is important for td; just specify one */
    background-color: white !important

  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2
    /* bg color is important; just specify one */
    background: #fff

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 4
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:first-child th:first-child, tr:nth-child(2) th:nth-child(2)
    /* highest z-index */
    z-index: 4

  td:first-child
    z-index: 1

  td:first-child, th:first-child
    position: sticky
    left: 0
  td:nth-child(2), th:nth-child(2)
    position: sticky
    left: 60px
</style>
