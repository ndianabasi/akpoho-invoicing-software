<template>
  <div class="q-pa-md">
    <view-card
      v-if="!!companyProperties.length"
      :title-info="titleInfo"
      show-avatar
      show-title-panel-side
      :loading="loading"
    >
      <template #body-panel>
        <div class="q-gutter-y-sm">
          <q-list padding>
            <q-item v-for="property in companyProperties" :key="property.name">
              <q-item-section>
                <q-item-label class="text-uppercase">{{
                  property.name
                }}</q-item-label>
                <q-item-label caption lines="2">{{
                  property.value
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </template>

      <template #title-panel-side>
        <q-btn flat icon="more_vert">
          <q-menu
            anchor="bottom right"
            self="top end"
            transition-show="flip-right"
            transition-hide="flip-left"
          >
            <q-list>
              <q-item
                v-if="resourcePermissions.canEdit"
                :to="{
                  name: 'edit_company',
                  params: { companyId: companyId }, //companyId from route props
                }"
              >
                <q-item-section>
                  <q-btn flat icon="edit" />
                </q-item-section>
                <q-item-section>Edit</q-item-section>
              </q-item>

              <q-item
                v-if="resourcePermissions.canDelete"
                clickable
                @click.prevent="handleDeletion"
              >
                <q-item-section>
                  <q-btn flat icon="delete" />
                </q-item-section>
                <q-item-section>Delete Company</q-item-section>
              </q-item>

              <q-item
                v-if="resourcePermissions.canList"
                :to="{
                  name: 'all_companies',
                }"
              >
                <q-item-section>
                  <q-btn flat icon="view_list" />
                </q-item-section>
                <q-item-section>All Companies</q-item-section>
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
  watch,
  computed,
  Ref,
} from 'vue';
import ViewCard from '../../../components/ViewCard.vue';
import useTitleInfo from '../../../composables/useTitleInfo';
import useResourcePermissions from '../../../composables/useResourcePermissions';
import useDeleteResource from '../../../composables/useDeleteResource';
import {
  CurrentlyViewedCompany,
  PERMISSION,
  TitleInfo,
} from '../../../store/types';
import { store } from '../../../store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'ViewCompany',

  components: {
    ViewCard,
  },

  props: {
    companyId: {
      type: String,
      required: false,
      default: '',
    },
  },

  setup(props) {
    const router = useRouter();
    const $q = useQuasar();
    const loading = ref(false);

    const currentCompany = computed(
      () =>
        store.getters[
          'companies/GET_CURRENTLY_VIEWED_COMPANY'
        ] as CurrentlyViewedCompany
    );

    let titleInfo: Ref<TitleInfo | null> = ref(null);

    watch(
      currentCompany,
      () => {
        const title = useTitleInfo({
          title: currentCompany?.value?.name ?? '',
          avatar: undefined,
        });

        titleInfo.value = title.value;
      },
      { deep: true }
    );

    const stopFetchCurrentlyViewedCompany = watchEffect(() => {
      loading.value = true;
      void store
        .dispatch('companies/FETCH_CURRENTLY_VIEWED_COMPANY', {
          companyId: props.companyId,
        })
        .then(() => {
          loading.value = false;
        });
    });

    const companyProperties = computed(() => {
      const company = currentCompany.value;
      return [
        { name: 'ID', value: company?.id },
        { name: 'Name', value: company?.name },
        { name: 'Type', value: company?.type?.toUpperCase() ?? '' },
        { name: 'Email', value: company?.email },
        { name: 'Phone Number', value: company?.phone_number ?? '' },
        { name: 'Address', value: company?.address },
        { name: 'Website', value: company?.website ?? '' },
        { name: 'Company Size', value: company?.companySize?.size ?? '' },
        { name: 'City', value: company?.city ?? '' },
        { name: 'Country', value: company?.country?.name ?? '' },
        { name: 'State', value: company?.state?.name ?? '' },
        { name: 'Slug', value: company?.slug },
        {
          name: 'Is Company Approved',
          value: company?.is_approved ? true : false,
        },
        { name: 'Approved At', value: company?.approved_at },
        { name: 'Created At', value: company?.created_at },
        { name: 'Updated At', value: company?.updated_at },
      ];
    });

    const handleDeletion = async function () {
      await useDeleteResource({
        resource: 'company',
        resourceName: 'Company',
        payload: props.companyId,
      })
        .then(() => {
          const postDeletionAction = {
            routeName: 'all_companies',
            routeParams: undefined,
          };

          void router.push({
            name: postDeletionAction?.routeName,
            params: postDeletionAction?.routeParams,
          });
        })
        .catch((error) => {
          $q.notify({
            type: 'negative',
            message: JSON.stringify(error),
            timeout: 5000,
            position: 'top',
          });
        });
    };

    onBeforeMount(() => {
      stopFetchCurrentlyViewedCompany();
    });

    return {
      tab: ref('user_account'),
      titleInfo,
      resourcePermissions: useResourcePermissions({
        edit: PERMISSION.CAN_EDIT_COMPANIES,
        list: PERMISSION.CAN_LIST_COMPANIES,
        delete: PERMISSION.CAN_DELETE_COMPANIES,
      }),
      handleDeletion,
      companyProperties,
      loading,
    };
  },
});
</script>
