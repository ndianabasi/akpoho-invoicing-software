<template>
  <div class="q-pa-md">
    <view-card
      v-if="user"
      :title-info="titleInfo"
      show-avatar
      show-title-panel-side
      :loading="loading"
      use-title-panel-menu
      :title-panel-menu-data="titlePanelMenuData"
    >
      <template #body-panel>
        <q-tabs v-model="tab" align="justify" narrow-indicator class="q-mb-lg">
          <q-tab class="text-purple" name="user_account" label="User Account" />
          <q-tab class="text-orange" name="user_profile" label="User Profile" />
        </q-tabs>

        <div class="q-gutter-y-sm">
          <q-tab-panels
            v-model="tab"
            animated
            transition-prev="scale"
            transition-next="scale"
          >
            <q-tab-panel name="user_account">
              <q-list padding>
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase">Id</q-item-label>
                    <q-item-label caption lines="2">{{
                      user.id ?? ''
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase">Email</q-item-label>
                    <q-item-label caption lines="2">{{
                      user.email
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase">Role</q-item-label>
                    <q-item-label caption lines="2">{{
                      user.role?.name ?? ''
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Login Status</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      user.login_status
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Lifetime Login</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      user.lifetime_login
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Last Login Time</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      user.last_login_time
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Account Activation Status</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      user.is_account_activated
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Account Activation Date</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      user.account_activated_at
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Email Verification Status</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      user.is_email_verified
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Email Verification Date</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      user.email_verified_at
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Last Password Change Date</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      user.password_last_changed_at
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Account Creation Date</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      user.created_at
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Last Update Date</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      user.updated_at
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="user_profile">
              <q-list padding>
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >First Name</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      user.profile.first_name
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Middle Name</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      user.profile.middle_name
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Last Name</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      user.profile.last_name
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Phone Number</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      user.profile.phone_number
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Street Address</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      user.profile.address
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase">City</q-item-label>
                    <q-item-label caption lines="2">{{
                      user.profile.city
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase">State</q-item-label>
                    <q-item-label caption lines="2">{{
                      user.profile.userState?.name ?? ''
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase">Country</q-item-label>
                    <q-item-label caption lines="2">{{
                      user.profile.userCountry?.name ?? ''
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Profile Creation Date</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      user.profile.created_at
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-uppercase"
                      >Last Update Date</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      user.profile.updated_at
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
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
  CurrentlyViewedUser,
  PERMISSION,
  TitleInfo,
  TitlePanelMenuData,
} from '../../../store/types';
import { store } from '../../../store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'ViewUser',

  components: {
    ViewCard,
  },

  props: {
    userId: {
      type: String,
      required: false,
      default: '',
    },
  },

  setup(props) {
    const router = useRouter();
    const $q = useQuasar();
    const loading = ref(false);

    const currentUser = computed(
      () =>
        store.getters['users/GET_CURRENTLY_VIEWED_USER'] as CurrentlyViewedUser
    );

    let titleInfo: Ref<TitleInfo | null> = ref(null);

    watch(
      currentUser,
      () => {
        const profilePictureFileBase =
          currentUser?.value?.profile?.profilePictureFile;

        const title = useTitleInfo({
          title: `${currentUser?.value?.profile?.first_name ?? ''} ${
            currentUser?.value?.profile?.last_name ?? ''
          }`,
          avatar:
            profilePictureFileBase?.formats?.thumbnail?.url ??
            profilePictureFileBase?.formats?.small?.url ??
            profilePictureFileBase?.url ??
            '',
        });

        titleInfo.value = title.value;
      },
      { deep: true }
    );

    const stopFetchCurrentlyViewedUser = watchEffect(() => {
      loading.value = true;
      void store
        .dispatch('users/FETCH_CURRENTLY_VIEW_USER', {
          userId: props.userId,
        })
        .then(() => {
          loading.value = false;
        });
    });

    const handleDeletion = async function () {
      await useDeleteResource({
        resource: 'user',
        resourceName: 'User',
        payload: props.userId,
      })
        .then(() => {
          const postDeletionAction = {
            routeName: 'all_users',
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

    const resourcePermissions = useResourcePermissions({
      edit: PERMISSION.CAN_EDIT_USERS,
      list: PERMISSION.CAN_LIST_USERS,
      delete: PERMISSION.CAN_DELETE_USERS,
    });

    const titlePanelMenuData = computed((): TitlePanelMenuData[] => {
      return [
        {
          label: 'Edit User',
          icon: 'edit',
          type: 'router-navigation',
          permitted: resourcePermissions?.canEdit ?? false,
          routeObject: {
            name: 'edit_user',
            params: { userId: props.userId },
          },
        },
        {
          label: 'Delete User',
          icon: 'delete',
          type: 'click-action',
          permitted: resourcePermissions?.canDelete ?? false,
          action: () => handleDeletion(),
        },
        {
          label: 'All Users',
          icon: 'view_list',
          type: 'router-navigation',
          permitted: resourcePermissions?.canList ?? false,
          routeObject: { name: 'all_users' },
        },
      ];
    });

    onBeforeMount(() => {
      stopFetchCurrentlyViewedUser();
    });

    return {
      user: currentUser,
      tab: ref('user_account'),
      titleInfo,
      resourcePermissions,
      loading,
      titlePanelMenuData,
    };
  },
});
</script>
