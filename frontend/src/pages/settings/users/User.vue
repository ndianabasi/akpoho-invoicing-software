<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-card v-if="user" class="my-card" flat bordered>
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img :src="user.profile.profile_picture" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-h6">{{
                `${user.profile.first_name} ${user.profile.last_name}`
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-card-section>
            <q-tabs
              v-model="tab"
              align="justify"
              narrow-indicator
              class="q-mb-lg"
            >
              <q-tab
                class="text-purple"
                name="user_account"
                label="User Account"
              />
              <q-tab
                class="text-orange"
                name="user_profile"
                label="User Profile"
              />
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
                        <q-item-label class="text-uppercase"
                          >Email</q-item-label
                        >
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
                        <q-item-label class="text-uppercase">City</q-item-label>
                        <q-item-label caption lines="2">{{
                          user.profile.city
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
                  Nostrum necessitatibus expedita dolores? Voluptatem
                  repudiandae magni ea.
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
                  Nostrum necessitatibus expedita dolores? Voluptatem
                  repudiandae magni ea.
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </q-card-section>
        </q-card>
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
      tab: ref('user_account'),
    };
  },
});
</script>
