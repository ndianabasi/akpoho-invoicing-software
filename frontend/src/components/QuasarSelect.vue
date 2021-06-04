<template>
  <q-select
    v-model="model"
    :value="modelValue"
    :filled="filled"
    :options="filteredOptions"
    :label="label"
    :clearable="clearable"
    :bottom-slots="bottomSlots"
    :options-dense="optionDense"
    :use-input="useInput"
    :input-debounce="inputDebounce"
    :class="classes"
    :transition-show="transitionShow"
    :transition-hide="transitionHide"
    :emit-value="emitValue"
    :map-options="mapOptions"
    v-bind="attrsToBeBound"
    @filter="selectFilterFn"
  >
    <template v-for="(_, slot) of slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </q-select>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineComponent, ref, Ref, PropType, computed } from 'vue';
import { SelectOption } from '../store/types';

export default defineComponent({
  name: 'QuasarSelect',

  props: {
    label: {
      type: String,
      required: false,
      default: '',
    },
    name: {
      type: String,
      required: false,
      default: '',
    },
    ref: {
      type: Object as PropType<Ref>,
      required: false,
      default: () => ref({}),
    },
    transitionShow: {
      type: String,
      required: false,
      default: 'scale',
    },
    transitionHide: {
      type: String,
      required: false,
      default: 'scale',
    },
    modelValue: {
      type: [Number, String, Boolean],
      required: false,
      default: null,
    },
    classes: {
      type: Array as PropType<Array<string> | string>,
      required: false,
      default: null,
    },
    filled: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Array as PropType<Array<SelectOption>>,
      default: () => [],
    },
    emitValue: {
      type: Boolean,
      default: true,
    },
    mapOptions: {
      type: Boolean,
      default: true,
    },
    optionValue: {
      type: String,
      default: 'id',
    },
    optionLabel: {
      type: String,
      default: 'description',
    },
    useInput: {
      type: Boolean,
      default: true,
    },
    optionDense: {
      type: Boolean,
      default: true,
    },
    bottomSlots: {
      type: Boolean,
      default: true,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    inputDebounce: {
      type: Number,
      default: 0,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { attrs, slots, emit }) {
    interface SelectCallback {
      (val: string, update: (fn?: () => void) => void): void;
    }

    const filter = ref('');

    const attrsToBeBound = computed(() => {
      const {
        modelValue,
        'onUpdate:modelValue': onUpdateModalValue,
        options,
        onFilter,
        classes,
        ...restOfAttrs
      } = attrs;
      return restOfAttrs;
    });

    const normalize = (text: string) => {
      if (!text) return '';
      return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
    };

    const needle = computed(() => normalize(filter.value));

    const filteredOptions = computed(() => {
      if (!needle.value) {
        return props.options;
      }
      return props.options.filter(
        (v) => normalize(v[props.optionLabel]).indexOf(needle.value) > -1
      );
    });

    const model = computed({
      get: () => props.modelValue,
      set: (value: unknown) => {
        emit('update:modelValue', value);
      },
    });

    const selectFilterFn: SelectCallback = function (val, update) {
      console.log(val);
      filter.value = val;
      update();
      return;
    };

    return {
      selectFilterFn,
      filteredOptions,
      model,
      attrsToBeBound,
      slots,
      filter,
    };
  },
});
</script>
