<template>
  <q-page>
    <div class="q-ma-md row q-col-gutter-md items-center justify-start">
      <div
        v-for="setting in settings"
        :key="setting.link"
        class="col col-sm-6 col-xs-12 col-lg-3 col-md-4"
      >
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">{{ setting.name }}</div>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            {{ setting.description }}
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn
              :to="{
                name: setting.link,
              }"
              flat
              >View</q-btn
            >
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'AllSettings',
  components: {},
  setup() {
    const settings = ref([
      {
        name: 'Users',
        link: 'all_users',
        description: 'View, edit, and delete users.',
      },
      {
        name: 'Companies',
        link: 'all_companies',
        description: 'View, edit, and delete your companies.',
      },
      {
        name: 'My Personal Settings',
        link: 'all_personal_settings',
        description: 'View and edit your personal settings',
      },
    ]);
    return {
      settings,
    };
  },
});
</script>
