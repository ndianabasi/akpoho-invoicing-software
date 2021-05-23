<!-- eslint-disable vue/no-v-html -->
<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div class="q-pa-md">
    <q-table
      v-model:selected="selected"
      v-model:pagination="pagination"
      :rows="tableDataRows"
      :columns="columns"
      row-key="id"
      selection="multiple"
      :class="{ 'my-sticky-header-column-table': stickyTable }"
      :visible-columns="visibleColumns"
      :loading="loading"
      :filter="filter"
      binary-state-sort
      :hide-no-data="false"
      :no-data-label="noResultsLabel_"
      :no-results-label="noResultsLabel_"
      :rows-per-page-options="rosPerPageOptions"
      @request="processTableRequest"
    >
      <template #top-right>
        <q-input
          v-model="filter"
          borderless
          dense
          debounce="300"
          placeholder="Search"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template #top="props">
        <div class="col-2 q-table__title">{{ nameOfTable }}</div>

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
          class="q-ml-md"
          @click="props.toggleFullscreen"
        />
      </template>

      <template #header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-if="showSelections_" auto-width>
            <q-checkbox v-model="props.selected" />
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th v-if="showActions_" auto-width> Actions </q-th>
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
              :icon="props.expand ? 'remove' : 'add'"
              @click="props.expand = !props.expand"
            />
          </q-td>
          <q-td v-if="showSelections_" auto-width>
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td v-if="showActions_">
            <q-btn-dropdown split class="glossy" color="accent" label="Actions">
              <q-list>
                <q-item
                  v-close-popup
                  clickable
                  @click="onActionItemClick(props, 'view')"
                >
                  <q-item-section avatar>
                    <q-avatar
                      icon="remove_red_eye"
                      color="primary"
                      text-color="white"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>View</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item
                  v-close-popup
                  clickable
                  @click="onActionItemClick(props, 'edit')"
                >
                  <q-item-section avatar>
                    <q-avatar icon="edit" color="primary" text-color="white" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Edit</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item
                  v-close-popup
                  clickable
                  @click="onActionItemClick(props, 'delete')"
                >
                  <q-item-section avatar>
                    <q-avatar
                      icon="delete_forever"
                      color="warning"
                      text-color="white"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Delete</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="info" color="amber" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">
              <q-list bordered separator>
                <q-item v-for="(v, k) in props.row" :key="k" v-ripple clickable>
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
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<!-- eslint-disable  @typescript-eslint/no-unsafe-assignment -->
<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  computed,
  onBeforeUnmount,
  nextTick,
  Ref,
  onMounted,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import {
  TableRow,
  GenericTableData,
  TableRequestInterface,
  RequestParams,
  RowProps,
} from '../../src/types/table';
import { useQuasar } from 'quasar';
import { ResponseData } from '../store/types';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'QuasarTable',

  props: {
    tableColumns: {
      type: Array,
      required: true,
    },
    showSelections: {
      type: Boolean,
      default: false,
    },
    showActions: {
      type: Boolean,
      default: true,
    },
    tableName: {
      type: String,
      required: true,
    },
    tableDataFetchEndPoint: {
      type: String,
      required: true,
    },
    rowViewRouteName: {
      type: String,
      required: false,
      default: '',
    },
    rowEditRouteName: {
      type: String,
      required: false,
      default: '',
    },
    rowDeleteActionType: {
      type: String,
      required: false,
      default: '',
    },
    entityName: {
      type: String,
      required: false,
      default: 'Resource',
    },
    noResultsLabel: {
      type: String,
      required: true,
    },
    tableDataGetterType: {
      type: String,
      required: true,
    },
    defaultSort: {
      type: Object,
      required: true,
    },
    rosPerPageOptions: {
      type: Array,
      default: () => [5, 10, 15, 20, 30, 50, 100],
    },
  },

  setup(props) {
    const $q = useQuasar();
    const filter = ref('');
    const loading = ref(false);
    const store = useStore();
    const router = useRouter();
    const selected = ref([]);
    const tableRows: Ref<GenericTableData> = ref([]);
    const pagination = ref({
      sortBy: props.defaultSort.sortBy || '',
      descending: props.defaultSort.descending || false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 10,
    });

    const visibleColumnsObjects = function () {
      const columns = props.tableColumns as TableRow[];
      return ref(
        [...columns]
          .filter((column) => !column.required)
          .map((column) => column)
      );
    };

    const visibleColumns = ref([]);

    const processTableRequest = async function (
      requestProps: TableRequestInterface
    ) {
      console.log(requestProps);
      const { page, rowsPerPage, sortBy, descending } = requestProps.pagination;
      const filter = requestProps.filter;

      await fetchTableData({
        search: filter,
        page,
        descending,
        perPage: rowsPerPage,
        sortBy,
      });
    };

    const fetchTableData = async function (
      requestParams?: RequestParams
    ): Promise<void> {
      loading.value = true;
      await store
        .dispatch('quasar_tables/FETCH_TABLE_DATA', {
          requestParams: {
            search: requestParams?.search ?? '',
            page: requestParams?.page ?? null,
            descending: requestParams?.descending ?? false,
            perPage: requestParams?.perPage ?? null,
            sortBy: requestParams?.sortBy ?? '',
          },
          entityEndPoint: props.tableDataFetchEndPoint,
        })
        .then((response: ResponseData) => {
          void nextTick(() => {
            // The value from the getter is actually a Proxy which does not work with the Quasar table. So stringify and parse the Proxy first.
            const data: unknown[] = JSON.parse(
              JSON.stringify(
                store.getters['quasar_tables/GET_TABLE_ROWS'] as unknown[]
              )
            );

            tableRows.value = [];
            tableRows.value = data;

            const meta = response?.data?.meta;
            console.log(response.data);

            if (meta) {
              pagination.value.page = meta.current_page;
              pagination.value.rowsPerPage = meta.per_page;
              pagination.value.rowsNumber = meta.total;
            } else {
              pagination.value.page =
                requestParams?.page || pagination.value.page;
              pagination.value.rowsPerPage =
                requestParams?.perPage || pagination.value.rowsPerPage;
            }
            pagination.value.sortBy =
              requestParams?.sortBy || pagination.value.sortBy;
            pagination.value.descending = requestParams?.descending;

            loading.value = false;
          });
          return;
        })
        .catch(() => {
          loading.value = false;
          tableRows.value.length = 0;
          return {};
        });
    };

    const data = reactive({
      columns: props.tableColumns,
      stickyTable: false,
    });

    const onActionItemClick = (rowProps: RowProps, action: string) => {
      const id = rowProps.row.id;
      //console.log(id);
      if (action === 'view') {
        void router.push({
          name: props.rowViewRouteName,
          params: { userId: id },
        });
      }

      if (action === 'edit') {
        void router.push({
          name: props.rowEditRouteName,
          params: { userId: id },
        });
      }

      if (action === 'delete') {
        $q.dialog({
          title: 'Deletion Warning',
          message: `You are about to delete this ${props.entityName}. Please type 'DELETE' to confirm your action.`,
          prompt: {
            model: '',
            isValid: (val: string) => val.trim().toLowerCase() === 'delete',
            type: 'text',
          },
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          const deleteProgressDialog = $q.dialog({
            title: 'In Progress',
            message: 'Software at work!',
            progress: true,
            ok: false,
            cancel: false,
            persistent: true,
          });
          await store
            .dispatch(props.rowDeleteActionType, id)
            .then(() => {
              deleteProgressDialog.hide();

              $q.notify({
                type: 'positive',
                message: 'Customer was successfully deleted!',
                position: 'top',
              });
            })
            .catch(() => {
              deleteProgressDialog.hide();
            });
        });
      }
    };

    onBeforeUnmount(() => {
      //stopFetchActionWatchEffect();
    });

    onMounted(async () => {
      await fetchTableData();
    });

    const currentCompany = computed(
      () => store.getters['auth/GET_CURRENT_COMPANY']
    );

    // Reactively watch for changes in the currentCompany and update the table
    watch(currentCompany, async () => {
      await fetchTableData();
    });

    return {
      nameOfTable: ref(props.tableName),
      selected,
      visibleColumns,
      visibleColumnsObjects: visibleColumnsObjects(),
      columns: ref(props.tableColumns),
      pagination,
      pagesNumber: computed(() => {
        return Math.ceil(
          tableRows?.value?.length ?? 1 / pagination.value.rowsPerPage
        );
      }),
      tableDataRows: tableRows,
      stickyTable: data.stickyTable,
      loading,
      processTableRequest,
      filter,
      noResultsLabel_: ref(props.noResultsLabel),
      showSelections_: ref(props.showSelections),
      showActions_: ref(props.showActions),
      onActionItemClick,
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
