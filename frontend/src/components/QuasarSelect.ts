/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineComponent, ref, Ref, PropType, computed, h } from 'vue';
import { QSelect } from 'quasar';
import { useStore } from 'vuex';
import { SelectOption } from 'src/store/types';

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
    optionLabel: {
      type: String,
      default: 'label',
    },
    optionValue: {
      type: String,
      default: 'value',
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
    asyncFilterMode: {
      type: Boolean,
      default: false,
    },
    asyncFilterAction: {
      type: String,
      default: '',
    },
    inputDebounce: {
      type: Number,
      default: 0,
    },
  },

  setup(props, { attrs, slots }) {
    const store = useStore();
    const filter = ref('');
    const filteredOptions: Ref<Array<{ [index: string]: string }>> = ref([]);

    const normalize = (text: string) => {
      if (!text) return '';
      return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
    };

    const selectFilterFn: SelectCallback = async function (val, update) {
      const needle = computed(() => normalize(val));

      if (!needle.value && !props.asyncFilterMode) {
        filteredOptions.value = props.options;
      } else {
        filteredOptions.value = props.options.filter(
          (v) => normalize(v[props.optionLabel]).indexOf(needle.value) > -1
        );
      }

      if (props.asyncFilterMode && needle.value) {
        await store
          .dispatch(props.asyncFilterAction, needle.value)
          .then((options: Array<{ [index: string]: string }>) => {
            filteredOptions.value = options;
          });
      }

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
