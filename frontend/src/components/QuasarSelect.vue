<template>
  <q-select
    v-model="quasarModel"
    :value="modelValue"
    filled
    :options="readonlyOptions"
    :label="label"
    clearable
    bottom-slots
    options-dense
    use-input
    input-debounce="0"
    class="q-mb-md"
    transition-show="scale"
    transition-hide="scale"
    emit-value
    map-options
    @update:modelValue="$emit('update:modelValue', $event)"
    @filter="selectFilterFn"
  >
    <template v-if="beforeSlotIcon" #before>
      <q-icon :name="beforeSlotIcon" />
    </template>

    <template #hint> Field hint </template>
    <template #error> Sorry! Invalid input </template>
  </q-select>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, PropType, computed, readonly } from 'vue';
import { SelectionOption } from '../store/types';

interface Props {
  options: SelectionOption[];
}

export default defineComponent({
  name: 'QuasarSelect',

  props: {
    options: {
      type: Object as PropType<Props['options']>,
      required: true,
    },

    beforeSlotIcon: {
      type: String,
      required: false,
      default: '',
    },

    label: {
      type: String,
      required: false,
      default: '',
    },

    modelValue: {
      type: Number,
      required: false,
      default: null,
    },
  },

  emits: ['update:modelValue'],

  setup(props) {
    interface SelectCallback {
      (val: string, update: (fn: () => void) => void): void;
    }

    const quasarModel = computed(() => props.modelValue);

    const plainOptions = ref(JSON.parse(JSON.stringify(props.options))) as Ref<
      SelectionOption[]
    >;

    const readonlyOptions = readonly(plainOptions);

    const selectFilterFn: SelectCallback = function (val, update) {
      console.log(val);

      if (val === '') {
        update(() => {
          plainOptions.value = JSON.parse(
            JSON.stringify(props.options)
          ) as SelectionOption[];
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        plainOptions.value = props.options.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    };

    return { selectFilterFn, quasarModel, plainOptions, readonlyOptions };
  },
});
</script>
