<template>
  <q-page>
    <router-view />
    <div class="q-pa-md">
      <q-table
        v-if="rows && rows.length"
        :rows="rows"
        :columns="columns"
        row-key="id"
        selection="multiple"
        v-model:selected="selected"
        :class="{ 'my-sticky-header-column-table': stickyTable }"
        :visible-columns="visibleColumns"
        v-model:pagination="pagination"
      >
        <template #top="props">
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
          />
        </template>

        <template #header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template #body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                size="sm"
                color="accent"
                round
                dense
                @click="props.expand = !props.expand"
                :icon="props.expand ? 'remove' : 'add'"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">
                <q-list bordered separator>
                  <q-item
                    v-for="(v, k) in props.row"
                    :key="k"
                    clickable
                    v-ripple
                  >
                    <q-item-section>
                      <q-item-label overline>{{ k }}</q-item-label>
                      <q-item-label>{{ v }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
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
import { TableRow } from '../../src/types/table';

type Props = {
  tableColumns: TableRow[];
  tableRows: unknown[];
};

export default defineComponent({
  name: 'QuasarTable',

  props: {
    tableColumns: {
      type: Array,
      required: true,
    },
    tableRows: {
      type: Array,
      required: true,
    },
  },

  setup(props) {
    const filter = ref('');
    const loading = ref(false);
    const tableName = ref('All Customers');
    const store = useStore();
    const selected = ref([]);
    console.log(props);

    const visibleColumnsObjects = function () {
      const columns = props.tableColumns as TableRow[];
      return ref([
        ...columns.filter((column) => !column.required).map((column) => column),
      ]);
    };

    const pagination = {
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 5,
    };

    const visibleColumns = ref(
      visibleColumnsObjects().value.map((column) => column.name)
    );

    const customers = computed(
      () => store.getters['customers/GET_ALL_CUSTOMERS']
    );

    const data = reactive({
      columns: props.tableColumns,
      rows: props.tableRows,
      stickyTable: false,
    });

    return {
      tableName,
      selected,
      visibleColumns,
      visibleColumnsObjects,
      columns: data.columns,
      pagination,
      pagesNumber: computed(() => {
        return Math.ceil(data.rows.length / pagination.rowsPerPage);
      }),
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
