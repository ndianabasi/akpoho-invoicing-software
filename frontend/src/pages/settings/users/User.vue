<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-list v-if="user" bordered padding>
          <q-item-label header class="text-bold text-h5"
            >User:
            {{
              `${user.profile.first_name} ${user.profile.last_name}`
            }}</q-item-label
          >

          <q-item>
            <q-item-section>
              <q-item-label class="text-uppercase">Id</q-item-label>
              <q-item-label caption lines="2">{{ user.id ?? '' }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="text-uppercase">Email</q-item-label>
              <q-item-label caption lines="2">{{ user.email }}</q-item-label>
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
              <q-item-label class="text-uppercase">Login Status</q-item-label>
              <q-item-label caption lines="2">{{
                user.login_status
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="text-uppercase">Lifetime Login</q-item-label>
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
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import { defineComponent, ref, Ref, watchEffect, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'ViewUser',

  setup() {
    const store = useStore();
    const route = useRoute();
    let currentUser: Ref<unknown> = ref(null);

    const stopFetchCurrentlyViewedUser = watchEffect(() => {
      void store
        .dispatch('users/FETCH_CURRENTLY_VIEW_USER', {
          userId: route.params.userId,
        })
        .then(() => {
          currentUser.value = JSON.parse(
            JSON.stringify(
              store.getters['users/GET_CURRENTLY_VIEWED_USER'] as unknown
            )
          );
        });
    });

    console.log(currentUser);

    onBeforeMount(() => {
      stopFetchCurrentlyViewedUser();
    });

    return {
      user: currentUser,
    };
  },
});
</script>
