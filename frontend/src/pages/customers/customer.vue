<template>
  <q-page>
    <div class="q-pa-md">
      <div class="q-mt-md">Customer view</div>
    </div>
  </q-page>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Customer',

  props: {
    customerId: {
      type: [String, Number],
      required: true,
    },
  },

  setup() {
    return {};
  },
});
</script>
