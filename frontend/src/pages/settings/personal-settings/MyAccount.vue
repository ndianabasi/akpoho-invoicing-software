<template>
  <edit-user my-account-mode :user-id="userId" />
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent } from 'vue';
import EditUser from '../users/EditUser.vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'MyAccount',
  components: { EditUser },
  setup() {
    const store = useStore();

    return {
      userId: store.getters['auth/GET_USER_ID'] as string,
    };
  },
});
</script>

<style></style>
