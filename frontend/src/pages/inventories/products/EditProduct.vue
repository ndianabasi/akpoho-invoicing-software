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
          <QuasarSelect
            ref="attributeSet"
            v-model="form.attributeSetId"
            filled
            aria-autocomplete="off"
            autocomplete="off"
            :options="attributeSets"
            label="Attribute Set"
            name="attribute_set_id"
            clearable
            bottom-slots
            :options-dense="isSmallScreen"
            :dense="isSmallScreen"
            use-input
            :input-debounce="200"
            class="q-mb-md"
            transition-show="scale"
            transition-hide="scale"
            emit-value
            map-options
          >
          </QuasarSelect>

          <template v-for="(field, index) in defaultFormFields">
            <q-input
              v-if="field.componentType === 'input' && isFieldVisible(index)"
              :key="`field_${field.name}_${field.componentType}`"
              v-model="field.model"
              :type="field.inputType"
              filled
              clearable
              bottom-slots
              :label="field.label"
              :aria-autocomplete="field?.autocomplete ?? 'off'"
              :autocomplete="field?.autocomplete ?? 'off'"
              :dense="dense"
              :error="form$?.[field.name]?.$invalid ?? false"
              class="q-mb-md q-mb-sm-sm"
            >
              <template #error>
                {{
                  form$ && form$[field.name]
                    ? form$[field.name].$silentErrors
                        .map((error) => error.$message)
                        .join(', ')
                    : ''
                }}
              </template>
            </q-input>

            <quasar-select
              v-if="field.componentType === 'select' && isFieldVisible(index)"
              :key="`field_${field.name}_${field.componentType}`"
              :ref="field.name"
              v-model="field.model"
              filled
              aria-autocomplete="off"
              autocomplete="off"
              :options="field.options"
              :label="field.label"
              :name="field.name"
              clearable
              bottom-slots
              options-dense
              use-input
              :input-debounce="200"
              class="q-mb-md q-mb-sm-sm"
              transition-show="scale"
              transition-hide="scale"
              emit-value
              map-options
              ><template v-if="field?.icon" #before>
                <q-icon :name="field?.icon ?? ''" />
              </template>
            </quasar-select>

            <q-toggle
              v-if="field.componentType === 'toggle' && isFieldVisible(index)"
              :key="`field_${field.name}_${field.componentType}`"
              v-model="field.model"
              true-value="Yes"
              false-value="No"
              checked-icon="check"
              color="green"
              unchecked-icon="clear"
              :label="field.label"
              :name="field.name"
              class="q-mb-md-md q-mb-sm-sm"
            />
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
                  name: 'all_companies',
                }"
              >
                <q-item-section>
                  <q-btn flat icon="view_list" />
                </q-item-section>
                <q-item-section>All Companies</q-item-section>
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
  onBeforeMount,
  watchEffect,
  watch,
  computed,
  unref,
  Ref,
  reactive,
} from 'vue';

import ViewCard from '../../../components/ViewCard.vue';
import useTitleInfo from '../../../composables/useTitleInfo';
import useResourcePermissions from '../../../composables/useResourcePermissions';
import {
  CurrentlyViewedProduct,
  SelectionOption,
  PERMISSION,
  TitleInfo,
  ProductFormShape,
  AttributeSetData,
  FormSchemaProperties,
} from '../../../store/types';
import { onBeforeRouteLeave } from 'vue-router';
import QuasarSelect from '../../../components/QuasarSelect';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useStore } from 'vuex';
import { useQuasar, QSpinnerFacebook } from 'quasar';

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

    const stopFetchCountriesForSelect = watchEffect(() => {
      void store.dispatch('countries_states/FETCH_COUNTRIES_FOR_SELECT');
    });

    const stopAttributeSetsForSelect = watchEffect(() => {
      void store.dispatch('attributes/FETCH_ATTRIBUTE_SETS_FOR_SELECT');
    });

    const attributeSets = computed(
      () =>
        store.getters[
          'attributes/GET_ATTRIBUTE_SETS_FOR_SELECT'
        ] as SelectionOption[]
    );

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

    let currentProduct: Ref<CurrentlyViewedProduct | null>;

    currentProduct = !props.creationMode
      ? computed(
          () =>
            store.getters[
              'companies/GET_CURRENTLY_VIEWED_PRODUCT'
            ] as CurrentlyViewedProduct
        )
      : ref(null);

    const form: ProductFormShape = reactive({
      attributeSetId: '',
    });

    const defaultFields = computed(
      () =>
        store.getters[
          'attributes/GET_DEFAULT_ATTRIBUTES_SCHEMA'
        ] as Array<FormSchemaProperties>
    );

    const defaultFormFields = reactive([...defaultFields.value]);

    const isFieldVisible = (index: number) => {
      let isVisible = false;
      const attribute = defaultFormFields[index];

      switch (attribute.name) {
        case 'weight':
          isVisible =
            (attribute?.isVisible ?? false) &&
            defaultFormFields?.filter(
              (field) => field.name === 'product_has_weight'
            )?.[0]?.model === 'Yes';
          break;

        default:
          isVisible = attribute?.isVisible ?? false;
          break;
      }
      return Boolean(isVisible);
    };

    // Valiation section starts

    const defaultFieldsSchema = computed(() => {
      const schemaObject = {};

      return yup.object({
        /* isPersonalBrand: yup.boolean(),
        phoneNumber: yup
          .string()
          .matches(phoneNumberRegex, 'Please provide a valid phone number')
          .nullable(), */
      });
    });

    /* const initialValues: Readonly<ProductFormShape> = {
      isPersonalBrand: false,
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      size: null,
      stateId: null,
      countryId: null,
      website: '',
    }; */

    const {
      handleSubmit,
      errors: formErrors,
      isSubmitting,
      values,
    } = useForm<ProductFormShape>(/* {
      validationSchema: defaultFieldsSchema.value,
      //initialValues,
    } */);

    const { value: isPersonalBrand } = useField('isPersonalBrand');
    const { value: name } = useField('name');
    const { value: email } = useField('email');
    const { value: phoneNumber } = useField('phoneNumber');
    const { value: address } = useField('address');
    const { value: city } = useField('city');
    const { value: size } = useField('size');
    const { value: stateId } = useField('stateId');
    const { value: countryId } = useField('countryId');
    const { value: website } = useField('website');

    // Valiation section ends

    const onSubmit = handleSubmit((form) => {
      /* void nextTick(() => {
        const isCreationMode = props.creationMode;
        void store
          .dispatch(
            `companies/${isCreationMode ? 'CREATE_PRODUCT' : 'EDIT_PRODUCT'}`,
            isCreationMode ? form : { form, productId: props.productId }
          )
          .then((id: string) => {
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
            console.error(error);
          });
      }); */
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
          .dispatch('companies/FETCH_CURRENTLY_VIEWED_PRODUCT', {
            productId: props.productId,
          })
          .then(() => {
            currentProduct.value = unref(
              computed(
                () =>
                  store.getters[
                    'companies/GET_CURRENTLY_VIEWED_PRODUCT'
                  ] as CurrentlyViewedProduct
              )
            );
          });
      }
    });

    watch(
      () => form.attributeSetId,
      async (id) => {
        if (id) {
          stateId.value = null;

          $q.loading.show({
            spinner: QSpinnerFacebook,
            spinnerSize: 50,
            message: 'Loading form data',
          });

          await store
            .dispatch('attributes/FETCH_ATTRIBUTE_SET_DATA', {
              id,
              type: 'product',
            })
            .then(() => {
              $q.loading.hide();

              attributeSetData.value = store.getters[
                'attributes/GET_ATTRIBUTE_SET_DATA'
              ] as AttributeSetData;
            })
            .catch(() => {
              $q.loading.hide();
            });

          attributeSetData.value = store.getters[
            'attributes/GET_ATTRIBUTE_SET_DATA'
          ] as AttributeSetData;
        }
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const CAN_EDIT_COMPANIES = computed(() =>
      store.getters['permissions/GET_USER_PERMISSION']('can_edit_companies')
    );

    onBeforeMount(() => {
      stopFetchCurrentlyViewedProduct();
      stopFetchCountriesForSelect();
      stopAttributeSetsForSelect();
    });

    onBeforeRouteLeave((to, from, next) => {
      if (productCreated.value) {
        return next();
      }

      /* const didFormValuesChange = !isEqual(initialValues, values);
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
      } else return next(); */
    });

    return {
      product: currentProduct,
      text: ref(''),
      ph: ref(''),
      dense: ref(false),
      dismissed: ref(false),
      form,
      titleInfo,
      countries,
      attributeSetData,
      resourcePermissions: useResourcePermissions({
        view: PERMISSION.CAN_VIEW_COMPANIES,
        list: PERMISSION.CAN_LIST_COMPANIES,
      }),
      CAN_EDIT_COMPANIES,
      attributeSets,
      onSubmit,
      isSubmitting,
      formErrors,
      defaultFormFields,
      isFieldVisible,
    };
  },
});
</script>
