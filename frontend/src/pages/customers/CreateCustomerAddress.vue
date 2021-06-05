<template>
  <customer-address-edit
    creation-mode
    :customer-id="customerId"
    :current-dialog-ref="currentDialogRef"
    :post-update="postUpdate"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FetchTableDataInterface } from '../../types/table';
import CustomerAddressEdit from './CustomerAddressEdit.vue';

export default defineComponent({
  name: 'CreateCustomer',
  components: { CustomerAddressEdit },

  props: {
    customerId: {
      type: String,
      required: false,
      default: '',
    },
    postUpdate: {
      type: Function as PropType<FetchTableDataInterface>,
      default: () => {
        return () => {
          /** */
        };
      },
    },
    currentDialogRef: {
      type: Object as PropType<{ hide: () => void }>,
      default: () => ({}),
    },
  },

  setup() {
    return {};
  },
});
</script>

<style></style>
