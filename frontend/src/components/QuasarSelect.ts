/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineComponent, ref, PropType, Ref, computed, h } from 'vue';
import { QSelect } from 'quasar';

interface SelectCallback {
  (val: string, update: (fn?: () => void) => void): void;
}

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
      type: [Number, String, Boolean, Object],
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
      type: Array as PropType<Array<{ [index: string]: string }>>,
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
      default: 'label',
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

  setup(props, { attrs, slots, emit }) {
    const filter = ref('');

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

    const selectFilterFn: SelectCallback = function (val, update) {
      console.log(val);
      filter.value = val;
      update();
    };

    return () => {
      const options = {
        ...props,
        ...attrs,
        options: filteredOptions.value,
        onFilter: selectFilterFn,
      };
      return h(QSelect, options, slots);
    };
  },
});
