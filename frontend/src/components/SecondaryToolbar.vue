<template>
  <q-page-sticky
    class="AIS__secondary_toolbar"
    expand
    position="top"
    style="z-index: 10"
  >
    <q-toolbar v-if="!tableSelectionActive" class="q-pl-lg">
      <q-btn
        flat
        round
        dense
        icon="arrow_back"
        class="q-mr-sm"
        @click="$router.go(-1)"
      />

      <q-toolbar-title class="q-ml-lg-xl q-ml-md-md q-ml-sm-sm">{{
        currentRouteLabel
      }}</q-toolbar-title>

      <breadcrumbs v-if="!$q.screen.lt.sm" :routes="breadcrumbsRoutes" />
    </q-toolbar>
    <q-toolbar
      v-else
      class="
        q-pl-lg q-py-sm
        items-center
        justify-center
        q-mx-auto q-gutter-md-md q-gutter-sm-sm
      "
    >
      <q-btn
        v-for="(action, index) in selectionActions"
        :key="action.label"
        flat
        round
        dense
        :icon="action.icon"
        @click.prevent="handleSelectionAction(index)"
      >
        <q-tooltip class="bg-accent">{{ action.label }}</q-tooltip>
      </q-btn>
    </q-toolbar>
  </q-page-sticky>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent, computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumbs from './Breadcrumbs.vue';
import { useMeta } from 'quasar';
import { GenericTableData, SelectionAction } from '../types/table';
import { useStore } from 'vuex';
import useDeleteResource from '../composables/useDeleteResource';
import Emittery from 'emittery';

export default defineComponent({
  name: 'SecondaryToolbar',
  components: {
    Breadcrumbs,
  },
  props: {
    /* routes: {
      type: Array,
      required: true,
    }, */
  },
  setup(/* props */) {
    const route = useRoute();
    const store = useStore();

    const title = ref(''); // we define the "title" prop

    // NOTICE the parameter here is a function
    // Under the covers, it is converted to a Vue computed prop for reactivity
    useMeta(() => {
      return {
        // whenever "title" from above changes, your meta will automatically update
        title: title.value,
        ogTitle: { name: title.value },
      };
    });

    function setPageTitle(newTitle: string) {
      title.value = newTitle; // will automatically trigger a Meta update due to the binding
    }

    const breadcrumbsRoutes = computed(() => {
      return route.matched.map((route) => ({
        meta: route.meta,
        path: route.path,
        name: route.name,
      }));
    });

    const currentRouteLabel = computed(() => {
      return breadcrumbsRoutes.value
        .filter((_route, index, routes) => index === routes.length - 1)
        .reduce((_prev, cur) => `${cur.meta.label as string}`, '');
    });

    watchEffect(() => {
      setPageTitle(currentRouteLabel.value);
    });

    const tableSelections = computed(
      () =>
        store.getters['quasar_tables/GET_SELECTED_ROWS'] as GenericTableData[]
    );

    const tableSelectionActive = computed(
      () => tableSelections.value.length > 0
    );

    const selectionActions = computed(
      () =>
        store.getters['quasar_tables/GET_SELECTION_ACTIONS'] as Readonly<
          SelectionAction[]
        >
    );

    const handleSelectionAction = async function (index: number) {
      const clickedAction = selectionActions.value[0];
      const { resourceName, resourceNamePlural, resourceType } = clickedAction;
      if (clickedAction.actionType === 'delete') {
        await useDeleteResource({
          resource: resourceType,
          resourceName:
            tableSelections.value.length > 1
              ? resourceNamePlural
              : resourceName,
          payload: JSON.parse(JSON.stringify(tableSelections.value)), // convert proxy to object
        }).then(() => {
          /* void emitter.emit('quasar-table::refresh'); */
        });
      }
    };

    return {
      breadcrumbsRoutes,
      currentRouteLabel,
      tableSelectionActive,
      selectionActions,
      handleSelectionAction,
    };
  },
});
</script>
