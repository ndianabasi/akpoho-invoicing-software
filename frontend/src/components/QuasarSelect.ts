/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  defineComponent,
  ref,
  Ref,
  PropType,
  computed,
  h,
  getCurrentInstance,
} from 'vue';
import { QSelect } from 'quasar';
import { useStore } from 'vuex';

interface QSelectExtra extends QSelect {
  optionIndex: number;
}

export interface QuasarSelectInterface {
  focus: () => void;
}

export interface CustomVm {
  proxy: {
    $refs: {
      root: QSelectExtra;
    };
  };
}

/**
 * A function which is called when user wants to filter a value
 */
interface FilterFnInterface {
  (
    /**
     * What the user typed
     */
    inputValue: string,
    /**
     * Supply a function which makes the necessary updates
     * @param {Function} callbackFn Callback to call to make the actual updates
     * @param {Function} [afterFn] Callback to call at the end after
     * the update has been fully processed by QSelect
     * @param {QSelectExtra} afterFn.ref Reference to the QSelect which
     * triggered the filtering
     */
    doneFn: (
      callbackFn?: () => void,
      afterFn?: (ref: QSelectExtra) => void
    ) => void,
    /**
     * Call this function if something went wrong
     */
    abortFn?: () => void
  ): void;
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
    optionsDense: {
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

    const selectFilterFn: FilterFnInterface = function (val, update) {
      const needle = computed(() => normalize(val));

      update(
        () => {
          if (!needle.value) {
            filteredOptions.value = props.options;
            return;
          }

          if (!props.asyncFilterMode) {
            filteredOptions.value = props.options.filter(
              (v) => normalize(v[props.optionLabel]).indexOf(needle.value) > -1
            );
            return;
          } else {
            void store
              .dispatch(props.asyncFilterAction, needle.value)
              .then((options: Array<{ [index: string]: string }>) => {
                filteredOptions.value = options;
              });
            return;
          }
        },
        // "ref" is the Vue reference to the QSelect
        (ref) => {
          if (
            needle.value !== '' &&
            (ref?.options?.length ?? 0 > 0) &&
            (ref?.optionIndex ?? -1 === -1)
          ) {
            ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
            ref.toggleOption(ref?.options?.[ref?.optionIndex], true); // toggle the focused option
          }
        }
      );
    };

    const vm = getCurrentInstance() as unknown as CustomVm;
    Object.assign(vm?.proxy, {
      focus() {
        vm?.proxy.$refs.root.focus();
      },
    });

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
