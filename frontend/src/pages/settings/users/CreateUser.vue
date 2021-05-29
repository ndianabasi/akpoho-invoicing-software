<template>
  <edit-user creation-mode />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EditUser from './EditUser.vue';

export default defineComponent({
  name: 'CreateUser',
  components: { EditUser },
  setup() {
    return {};
  },
});
</script>

<style></style>
