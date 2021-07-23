<template>
  <div class="q-pa-md">
    <view-card
      v-if="creationMode || product"
      :title-info="titleInfo"
      show-avatar
      show-title-panel-side
      :loading="loading"
    >
      <template #body-panel="{ isSmallScreen }">
        <form
          class="row q-col-gutter-sm items-start justify-start q-pa-md"
          @submit="onSubmit"
        >
          <template v-for="field in form">
            <q-toggle
              v-if="field.componentType === 'toggle' && field.isVisible"
              :key="`field_${field.name}_${field.componentType}`"
              v-model="field.model"
              checked-icon="check"
              color="green"
              unchecked-icon="clear"
              :label="field.label"
              :class="
                field.overrideClasses
                  ? field.classes
                  : [
                      'col col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6',
                      field.classes,
                    ]
              "
              :dense="isSmallScreen"
            />

            <q-input
              v-if="field.componentType === 'input' && field.isVisible"
              :key="`field_${field.name}_${field.componentType}`"
              v-model="field.model"
              :type="field.inputType"
              :for="field.name"
              filled
              clearable
              bottom-slots
              :label="field.label"
              :aria-autocomplete="field?.autocomplete ?? 'off'"
              :autocomplete="field?.autocomplete ?? 'off'"
              :error="!!formErrors?.[field.name]?.length ?? false"
              :class="
                field.overrideClasses
                  ? field.classes
                  : [
                      'col col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6',
                      field.classes,
                    ]
              "
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
              :class="
                field.overrideClasses
                  ? field.classes
                  : [
                      'col col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6',
                      field.classes,
                    ]
              "
              transition-show="scale"
              transition-hide="scale"
              :emit-value="false"
              :map-options="false"
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
            :class="['q-mt-sm', $q.screen.lt.sm ? 'full-width' : 'half-width']"
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
  PERMISSION,
  TitleInfo,
  AttributeSetData,
  FormSchema,
  SelectOption,
  ProductResultRowInterface,
  ProductFormShapeRaw,
} from '../../../store/types';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import QuasarSelect from '../../../components/QuasarSelect';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { isEqual } from 'lodash';
import { stockStatusArray, stockStatusForSelect } from '../../../helpers/utils';

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
    const router = useRouter();
    const loading = ref(false);

    const initialForm: ProductFormShapeRaw = reactive({
      productTypeId: '',
      productName: '',
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
        ] as SelectOption[]
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

    let currentProduct: Ref<ProductResultRowInterface | null>;

    currentProduct = !props.creationMode
      ? computed(
          () =>
            store.getters[
              'products/GET_CURRENTLY_VIEWED_PRODUCT'
            ] as ProductResultRowInterface
        )
      : ref(null);

    // Valiation section starts

    const formSchema = computed(() =>
      yup.object({
        productTypeId: yup.string().required('Product type is required'),
        productName: yup
          .string()
          .required('Product Name is required')
          .min(6, 'Product Name should be a minimum of ${min} characters')
          .max(50, 'Product Name should be a maximum of ${max} characters')
          .nullable(),
        sku: yup
          .string()
          .min(4, 'SKU should be a minimum of ${min} characters')
          .max(16, 'SKU should be a maximum of ${max} characters')
          .nullable(),
        price: yup.number().required('Price is required').nullable(),
        isEnabled: yup.boolean().required('Is Enabled is required'),
        stockStatus: yup
          .mixed()
          .oneOf(stockStatusArray, 'Stock Status is not valid'),
        productHasWeight: yup
          .boolean()
          .required('Product Has Weight is required'),
        description: yup.string().optional().nullable(),
        shortDescription: yup.string().optional().nullable(),
        weight: yup.number().optional().nullable(),
        countryOfManufacture: yup
          .object({
            label: yup.string().nullable(),
            value: yup.number().nullable(),
          })
          .nullable(),
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

    const { value: productTypeId } = useField<string | undefined>(
      'productTypeId'
    );
    const { value: productName } = useField('productName');
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
      isEnabled: {
        model: isEnabled,
        name: 'isEnabled',
        componentType: 'toggle',
        inputType: 'toggle',
        label: 'Is Enabled',
        autocomplete: 'off',
        default: initialForm['isEnabled'],
        isVisible: true,
        overrideClasses: true,
        classes: 'col col-12',
      },
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
      productName: {
        model: productName,
        name: 'productName',
        componentType: 'input',
        inputType: 'text',
        label: 'Product Name',
        default: initialForm['productName'],
        autocomplete: 'off',
        isVisible: true,
        //classes: 'offset-sm-6 offset-md-6 offset-lg-6 offset-xl-6',
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
        overrideClasses: true,
        classes: 'col col-12',
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
        inputType: 'textarea',
        label: 'Description',
        default: initialForm['description'],
        autocomplete: 'off',
        isVisible: true,
      },
      shortDescription: {
        model: shortDescription,
        name: 'website',
        componentType: 'input',
        inputType: 'textarea',
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
        options: countries.value,
      },
    });

    // Valiation section ends

    const onSubmit = handleSubmit((form) => {
      isSubmitting.value = true;
      const { countryOfManufacture, ...restOfForm } = form;
      const processedForm = {
        ...restOfForm,
        countryOfManufacture: countryOfManufacture?.value,
      };

      void nextTick(() => {
        const isCreationMode = props.creationMode;
        void store
          .dispatch(
            `products/${isCreationMode ? 'CREATE_PRODUCT' : 'EDIT_PRODUCT'}`,
            isCreationMode
              ? {
                  form: processedForm,
                }
              : {
                  form: processedForm,
                  productId: props.productId,
                }
          )
          .then((id: string) => {
            isSubmitting.value = false;
            productCreated.value = true;
            void store.dispatch('auth/FETCH_AUTH_PROFILE');
            void nextTick(() => {
              void router.push({
                name: 'view_product',
                params: { productId: id },
              });
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

    const stopFetchProductResultRowInterface = watchEffect(() => {
      if (!props.creationMode) {
        loading.value = true;
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
                  ] as ProductResultRowInterface
              )
            );

            productTypeId.value = currentProduct?.value?.type?.id;
            productName.value = currentProduct?.value?.name;
            sku.value = currentProduct?.value?.sku;
            price.value = currentProduct?.value?.price;
            isEnabled.value = Boolean(currentProduct?.value?.is_enabled);
            stockStatus.value = currentProduct?.value?.stock_status;
            productHasWeight.value = Boolean(
              currentProduct?.value?.product_has_weight
            );
            description.value = currentProduct?.value?.description;
            shortDescription.value = currentProduct?.value?.short_description;
            weight.value = currentProduct?.value?.weight;
            countryOfManufacture.value = currentProduct?.value?.country
              ? {
                  label: currentProduct?.value?.country?.name,
                  value: currentProduct?.value?.country?.id,
                }
              : null;

            loading.value = false;
          });
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const CAN_EDIT_PRODUCTS = computed(() =>
      store.getters['permissions/GET_USER_PERMISSION']('can_edit_products')
    );

    onMounted(() => {
      form.productTypeId.model = currentlyEditedProductType.value?.value ?? '';
    });

    onBeforeUnmount(() => {
      stopFetchProductResultRowInterface();
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
      loading,
    };
  },
});
</script>
