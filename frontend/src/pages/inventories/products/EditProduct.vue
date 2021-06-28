<template>
  <div class="q-pa-md">
    <view-card
      v-if="creationMode || product"
      :title-info="titleInfo"
      show-avatar
      show-title-panel-side
    >
      <template #body-panel="{ isSmallScreen }">
        <form class="q-pa-md" @submit="onSubmit">
          <template v-for="field in form">
            <q-toggle
              v-if="field.componentType === 'toggle' && field.isVisible"
              :key="`field_${field.name}_${field.componentType}`"
              v-model="field.model"
              checked-icon="check"
              color="green"
              unchecked-icon="clear"
              :label="field.label"
              class="q-mb-md"
              :dense="isSmallScreen"
            />

            <q-input
              v-if="field.componentType === 'input' && field.isVisible"
              :key="`field_${field.name}_${field.componentType}`"
              v-model="field.model"
              :type="
                field.inputType !== 'password'
                  ? field.inputType
                  : revealPasswords[field.name]
                  ? 'text'
                  : 'password'
              "
              :for="field.name"
              filled
              clearable
              bottom-slots
              :label="field.label"
              :aria-autocomplete="field?.autocomplete ?? 'off'"
              :autocomplete="field?.autocomplete ?? 'off'"
              :error="!!formErrors?.[field.name]?.length ?? false"
              class="q-mb-sm-sm q-mb-md-md"
              :dense="isSmallScreen"
            >
              <template #error>
                {{ formErrors[field.name] }}
              </template>

              <template #hint></template>
            </q-input>

            <quasar-select
              v-if="field.componentType === 'select' && field.isVisible"
              :key="`field_${field.name}_${field.componentType}`"
              :ref="field.name"
              v-model="field.model"
              filled
              aria-autocomplete="list"
              autocomplete="off"
              :options="field.options"
              :label="field.label"
              :name="field.name"
              :for="field.name"
              clearable
              bottom-slots
              :options-dense="isSmallScreen"
              use-input
              :input-debounce="200"
              class="q-mb-md"
              transition-show="scale"
              transition-hide="scale"
              emit-value
              map-options
              :dense="isSmallScreen"
              :error="!!formErrors?.[field.name]?.length ?? false"
            >
              <template v-if="field?.icon" #before>
                <q-icon :name="field?.icon ?? ''" />
              </template>
              <template #error>
                {{ formErrors[field.name] }}
              </template>
            </quasar-select>
          </template>
        </form>
      </template>

      <template #footer-panel>
        <div class="row justify-center q-mb-xl">
          <q-btn
            type="submit"
            :loading="isSubmitting"
            label="Submit"
            class="q-mt-md"
            icon-right="send"
            @click="onSubmit"
          >
            <!-- eslint-disable-next-line vue/v-slot-style -->
            <template #loading>
              <q-spinner-facebook color="white" />
            </template>
          </q-btn>
        </div>
      </template>

      <template v-if="!creationMode" #title-panel-side>
        <q-btn flat icon="more_vert">
          <q-menu
            anchor="bottom right"
            self="top end"
            transition-show="flip-right"
            transition-hide="flip-left"
          >
            <q-list>
              <q-item
                v-if="resourcePermissions.canView"
                :to="{
                  name: 'view_product',
                  params: { productId: productId }, //productId from route props
                }"
              >
                <q-item-section>
                  <q-btn flat icon="visibility" />
                </q-item-section>
                <q-item-section>View Product</q-item-section>
              </q-item>

              <q-item
                v-if="resourcePermissions.canList"
                :to="{
                  name: 'all_products',
                }"
              >
                <q-item-section>
                  <q-btn flat icon="view_list" />
                </q-item-section>
                <q-item-section>All Products</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>
    </view-card>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  defineComponent,
  ref,
  onBeforeUnmount,
  onMounted,
  watchEffect,
  watch,
  computed,
  unref,
  Ref,
  reactive,
  nextTick,
} from 'vue';

import ViewCard from '../../../components/ViewCard.vue';
import useTitleInfo from '../../../composables/useTitleInfo';
import useResourcePermissions from '../../../composables/useResourcePermissions';
import {
  CurrentlyViewedProduct,
  SelectionOption,
  PERMISSION,
  TitleInfo,
  AttributeSetData,
  ProductFormShape,
  FormSchema,
  SelectOption,
} from '../../../store/types';
import { onBeforeRouteLeave } from 'vue-router';
import QuasarSelect from '../../../components/QuasarSelect';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { isEqual } from 'lodash';

export default defineComponent({
  name: 'EditProduct',

  components: {
    ViewCard,
    QuasarSelect,
  },

  props: {
    productId: {
      type: String,
      required: false,
      default: '',
    },
    creationMode: {
      type: Boolean,
      default: false,
    },
    myAccountMode: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const productCreated = ref(false);
    const store = useStore();
    const $q = useQuasar();

    const initialForm: ProductFormShape = reactive({
      productTypeId: '',
      name: '',
      sku: '',
      price: null,
      isEnabled: true,
      stockStatus: '',
      productHasWeight: true,
      description: '',
      shortDescription: '',
      productImages: '',
      weight: null,
      countryOfManufacture: null,
    });

    const stopFetchCountriesForSelect = watchEffect(() => {
      void store.dispatch('countries_states/FETCH_COUNTRIES_FOR_SELECT');
    });

    const countries = computed(
      () =>
        store.getters[
          'countries_states/GET_COUNTRIES_FOR_SELECT'
        ] as SelectionOption[]
    );

    const attributeSetData = computed({
      get: () =>
        store.getters['attributes/GET_ATTRIBUTE_SET_DATA'] as AttributeSetData,
      set: (value) => value,
    });

    const currentlyEditedProductType = computed(
      () =>
        store.getters[
          'products/GET_CURRENTLY_EDITED_PRODUCT_TYPE'
        ] as SelectOption
    );

    let currentProduct: Ref<CurrentlyViewedProduct | null>;

    currentProduct = !props.creationMode
      ? computed(
          () =>
            store.getters[
              'products/GET_CURRENTLY_VIEWED_PRODUCT'
            ] as CurrentlyViewedProduct
        )
      : ref(null);

    const stockStatusArray = ref([
      'In Stock',
      'Out of Stock',
      'Made to Order',
      'Drop-shipped',
    ]);

    const stockStatusForSelect = computed(() =>
      stockStatusArray.value.map((status) => ({ label: status, value: status }))
    );

    // Valiation section starts

    const formSchema = computed(() =>
      yup.object({
        productTypeId: yup.string().required('Product type is required'),
        name: yup
          .string()
          .required('Name is required')
          .min(6, 'Name should be a minimum of ${min} characters')
          .max(50, 'Name should be a maximum of ${max} characters')
          .nullable(),
        sku: yup
          .string()
          .required('SKU is required')
          .min(4, 'SKU should be a minimum of ${min} characters')
          .max(16, 'SKU should be a maximum of ${max} characters')
          .nullable(),
        price: yup.number().required('Price is required').nullable(),
        isEnabled: yup.boolean().required('Is Enabled is required'),
        stockStatus: yup
          .mixed()
          .oneOf(stockStatusArray.value, 'Stock Status is not valid'),
        productHasWeight: yup
          .boolean()
          .required('Product Has Weight is required'),
        description: yup
          .string()
          .required('Description is required')
          .nullable(),
        shortDescription: yup
          .string()
          .required('Description is required')
          .nullable(),
        weight: yup.number().optional().nullable(),
        countryOfManufacture: yup.number().optional().nullable(),
      })
    );

    const {
      handleSubmit,
      errors: formErrors,
      isSubmitting,
      values,
    } = useForm({
      validationSchema: formSchema.value,
      initialValues: initialForm,
    });

    const { value: productTypeId } = useField('productTypeId');
    const { value: name } = useField('name');
    const { value: sku } = useField('sku');
    const { value: price } = useField('price');
    const { value: isEnabled } = useField('isEnabled');
    const { value: stockStatus } = useField('stockStatus');
    const { value: productHasWeight } = useField('productHasWeight');
    const { value: description } = useField('description');
    const { value: shortDescription } = useField('shortDescription');
    const { value: weight } = useField('weight');
    const { value: countryOfManufacture } = useField('countryOfManufacture');

    // Form schema for form generation
    const form: FormSchema = reactive({
      productTypeId: {
        model: productTypeId,
        name: 'productTypeId',
        componentType: 'input',
        inputType: 'text',
        label: 'Product Type ID',
        default: initialForm['productTypeId'],
        autocomplete: 'off',
        isVisible: false,
      },
      name: {
        model: name,
        name: 'name',
        componentType: 'input',
        inputType: 'text',
        label: 'Name',
        default: initialForm['name'],
        autocomplete: 'off',
        isVisible: true,
      },
      sku: {
        model: sku,
        name: 'sku',
        componentType: 'input',
        inputType: 'text',
        label: 'SKU',
        default: initialForm['sku'],
        autocomplete: 'off',
        isVisible: true,
      },
      price: {
        model: price,
        name: 'price',
        componentType: 'input',
        inputType: 'number',
        label: 'Price',
        default: initialForm['price'],
        autocomplete: 'off',
        isVisible: true,
      },
      isEnabled: {
        model: isEnabled,
        name: 'isEnabled',
        componentType: 'toggle',
        inputType: 'toggle',
        label: 'Is Enabled',
        autocomplete: 'off',
        default: initialForm['isEnabled'],
        isVisible: true,
      },
      stockStatus: {
        model: stockStatus,
        name: 'stockStatus',
        componentType: 'select',
        label: 'Stock Status',
        default: initialForm['stockStatus'],
        autocomplete: 'off',
        isVisible: true,
        options: stockStatusForSelect,
      },
      productHasWeight: {
        model: productHasWeight,
        name: 'productHasWeight',
        componentType: 'toggle',
        label: 'Product Has Weight?',
        default: initialForm['productHasWeight'],
        autocomplete: 'off',
        isVisible: true,
      },
      weight: {
        model: weight,
        name: 'weight',
        componentType: 'input',
        inputType: 'number',
        label: 'Weight',
        default: initialForm['weight'],
        autocomplete: 'off',
        isVisible: productHasWeight,
      },
      description: {
        model: description,
        name: 'description',
        componentType: 'input',
        inputType: 'texarea',
        label: 'Description',
        default: initialForm['description'],
        autocomplete: 'off',
        isVisible: true,
      },
      shortDescription: {
        model: shortDescription,
        name: 'website',
        componentType: 'input',
        inputType: 'text',
        label: 'Short Description',
        default: initialForm['shortDescription'],
        autocomplete: 'off',
        isVisible: true,
      },
      countryOfManufacture: {
        model: countryOfManufacture,
        name: 'countryOfManufacture',
        componentType: 'select',
        label: 'Country of Manufacture',
        default: initialForm['countryOfManufacture'],
        autocomplete: 'off',
        isVisible: true,
        options: countries,
      },
    });

    // Valiation section ends

    const onSubmit = handleSubmit((form) => {
      console.log(form);

      isSubmitting.value = true;
      void nextTick(() => {
        const isCreationMode = props.creationMode;
        void store
          .dispatch(
            `products/${isCreationMode ? 'CREATE_PRODUCT' : 'EDIT_PRODUCT'}`,
            isCreationMode
              ? {
                  form,
                }
              : {
                  form,
                  productId: props.productId,
                }
          )
          .then((id: string) => {
            isSubmitting.value = false;
            productCreated.value = true;
            void store.dispatch('auth/FETCH_AUTH_PROFILE');
            void nextTick(() => {
              /* void router.push({
                name: 'view_product',
                params: { productId: id },
              }); */
            });
          })
          .catch((error) => {
            isSubmitting.value = false;
            console.error(error);
          });
      });
    });

    let titleInfo: Ref<TitleInfo | null> = ref(null);

    watch(
      currentProduct,
      () => {
        const title =
          currentProduct && currentProduct.value
            ? useTitleInfo({
                title: currentProduct.value.name ?? '',
                avatar: undefined,
              })
            : props.creationMode
            ? useTitleInfo({
                title: 'New Product',
                avatar: '',
              })
            : ref(null);

        titleInfo.value = title.value;
      },
      { deep: true }
    );

    const stopFetchCurrentlyViewedProduct = watchEffect(() => {
      if (!props.creationMode) {
        void store
          .dispatch('products/FETCH_CURRENTLY_VIEWED_PRODUCT', {
            productId: props.productId,
          })
          .then(() => {
            currentProduct.value = unref(
              computed(
                () =>
                  store.getters[
                    'products/GET_CURRENTLY_VIEWED_PRODUCT'
                  ] as CurrentlyViewedProduct
              )
            );
          });
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const CAN_EDIT_PRODUCTS = computed(() =>
      store.getters['permissions/GET_USER_PERMISSION']('can_edit_products')
    );

    onMounted(() => {
      form.productTypeId.model = currentlyEditedProductType.value.value;
    });

    onBeforeUnmount(() => {
      stopFetchCurrentlyViewedProduct();
      stopFetchCountriesForSelect();
    });

    onBeforeRouteLeave((to, from, next) => {
      if (productCreated.value) {
        return next();
      }

      const didFormValuesChange = !isEqual(initialForm, values);
      if (didFormValuesChange) {
        $q.dialog({
          message: 'Form has changed. Do you really want to leave this page?',
          title: 'Data loss warning',
          persistent: true,
          cancel: true,
        })
          .onOk(() => {
            return next();
          })
          .onCancel(() => {
            return false;
          });
      } else return next();
    });

    return {
      product: currentProduct,
      text: ref(''),
      ph: ref(''),
      dense: ref(false),
      dismissed: ref(false),
      titleInfo,
      countries,
      attributeSetData,
      resourcePermissions: useResourcePermissions({
        view: PERMISSION.CAN_VIEW_INVENTORIES,
        list: PERMISSION.CAN_LIST_INVENTORIES,
      }),
      CAN_EDIT_PRODUCTS,
      onSubmit,
      isSubmitting,
      formErrors,
      form,
    };
  },
});
</script>
