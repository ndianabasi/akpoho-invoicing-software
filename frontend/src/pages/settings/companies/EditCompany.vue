<template>
  <div class="q-pa-md">
    <view-card
      v-if="creationMode || company"
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
            <image-cropper
              v-if="field.componentType === 'image_cropper'"
              :key="`field_${field.name}_${field.componentType}`"
              v-model="field.model"
              :input-max-file-size="5 * 1048576"
              input-class="col col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6"
              :use-before-slot="false"
              :input-label="field.label"
            />
            <!-- 5 MB max file size -->
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

      <template v-if="!creationMode && !myAccountMode" #title-panel-side>
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
                  name: 'view_company',
                  params: { companyId: companyId }, //companyId from route props
                }"
              >
                <q-item-section>
                  <q-btn flat icon="visibility" />
                </q-item-section>
                <q-item-section>View Company</q-item-section>
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
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
  nextTick,
} from 'vue';

import ViewCard from '../../../components/ViewCard.vue';
import useTitleInfo from '../../../composables/useTitleInfo';
import useResourcePermissions from '../../../composables/useResourcePermissions';
import {
  CurrentlyViewedCompany,
  PERMISSION,
  TitleInfo,
  FormSchema,
  CompanyFormShapeRaw,
  SelectOption,
} from '../../../store/types';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import QuasarSelect from '../../../components/QuasarSelect';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { phoneNumberRegex } from '../../../helpers/utils';
import { isEqual } from 'lodash';
import ImageCropper from '../../../components/ImageCropper.vue';
import useFormData, { RawObject } from '../../../composables/useFormData';
import MultiFormatPicture from '../../../helpers/MultiFormatPicture';

export default defineComponent({
  name: 'EditCompany',

  components: {
    ViewCard,
    QuasarSelect,
    ImageCropper,
  },

  props: {
    companyId: {
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
    const companyCreated = ref(false);
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();
    const loading = ref(false);
    const logo: Ref<File | null> = ref(null);

    const stopFetchCountriesForSelect = watchEffect(() => {
      void store.dispatch('countries_states/FETCH_COUNTRIES_FOR_SELECT');
    });

    const stopFetchCompanySizesForSelect = watchEffect(() => {
      void store.dispatch('companies/FETCH_COMPANY_SIZES_FOR_SELECT');
    });

    const countries = computed(
      () =>
        store.getters[
          'countries_states/GET_COUNTRIES_FOR_SELECT'
        ] as SelectOption[]
    );

    const countryStates = computed({
      get: () =>
        store.getters[
          'countries_states/GET_COUNTRY_STATES_FOR_SELECT'
        ] as SelectOption[],
      set: (value) => value,
    });

    const companySizes = computed(
      () =>
        store.getters[
          'companies/GET_COMPANY_SIZES_FOR_SELECT'
        ] as SelectOption[]
    );
    let currentCompany: Ref<CurrentlyViewedCompany | null>;

    currentCompany = !props.creationMode
      ? computed(
          () =>
            store.getters[
              'companies/GET_CURRENTLY_VIEWED_COMPANY'
            ] as CurrentlyViewedCompany
        )
      : ref(null);

    // Valiation section starts

    const formSchema = computed(() =>
      yup.object({
        isPersonalBrand: yup.boolean(),
        name: yup.string().required('Name is required').nullable(),
        email: yup
          .string()
          .email('Email is not valid')
          .required('Email is required'),
        phoneNumber: yup
          .string()
          .matches(phoneNumberRegex, 'Please provide a valid phone number')
          .nullable(),
        address: yup.string().optional().nullable(),
        city: yup.string().required('City is required').nullable(),
        size: yup
          .object({ label: yup.string(), value: yup.number() })
          .default(null)
          .nullable(),
        stateId: yup
          .object({ label: yup.string(), value: yup.number() })
          .default(null)
          .nullable(),
        countryId: yup
          .object({ label: yup.string(), value: yup.number() })
          .default(null)
          .nullable(),
        website: yup.string().optional().nullable(),
      })
    );

    const initialValues: Readonly<CompanyFormShapeRaw> = {
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
    };

    const {
      handleSubmit,
      errors: formErrors,
      isSubmitting,
      values,
    } = useForm<CompanyFormShapeRaw>({
      validationSchema: formSchema.value,
      initialValues,
    });

    const { value: isPersonalBrand } =
      useField<CompanyFormShapeRaw['isPersonalBrand']>('isPersonalBrand');
    const { value: name } = useField<CompanyFormShapeRaw['name']>('name');
    const { value: email } = useField<CompanyFormShapeRaw['email']>('email');
    const { value: phoneNumber } =
      useField<CompanyFormShapeRaw['phoneNumber']>('phoneNumber');
    const { value: address } =
      useField<CompanyFormShapeRaw['address']>('address');
    const { value: city } = useField<CompanyFormShapeRaw['city']>('city');
    const { value: size } = useField<CompanyFormShapeRaw['size']>('size');
    const { value: stateId } =
      useField<CompanyFormShapeRaw['stateId']>('stateId');
    const { value: countryId } =
      useField<CompanyFormShapeRaw['countryId']>('countryId');
    const { value: website } =
      useField<CompanyFormShapeRaw['website']>('website');

    // Form schema for form generation
    const form: FormSchema = reactive({
      isPersonalBrand: {
        model: isPersonalBrand,
        name: 'isPersonalBrand',
        componentType: 'toggle',
        label: 'Create as Personal Brand',
        default: false,
        isVisible: computed(() => props.creationMode),
        overrideClasses: true,
        classes: 'col col-12',
      },
      logo: {
        model: logo,
        name: 'logo',
        componentType: 'image_cropper',
        label: 'Company Logo',
        isVisible: true,
      },
      name: {
        model: name,
        name: 'name',
        componentType: 'input',
        inputType: 'text',
        label: 'Name',
        default: '',
        autocomplete: 'organization',
        isVisible: true,
      },
      email: {
        model: email,
        name: 'email',
        componentType: 'input',
        inputType: 'email',
        label: 'Email',
        default: '',
        autocomplete: 'work email',
        isVisible: true,
      },
      phoneNumber: {
        model: phoneNumber,
        name: 'phoneNumber',
        componentType: 'input',
        inputType: 'text',
        label: 'Phone Number',
        default: '',
        autocomplete: 'work tel',
        isVisible: true,
      },
      address: {
        model: address,
        name: 'address',
        componentType: 'input',
        inputType: 'textarea',
        label: 'Address',
        default: '',
        autocomplete: 'work street-address',
        isVisible: true,
      },
      size: {
        model: size,
        name: 'size',
        componentType: 'select',
        label: 'Company Size',
        default: null,
        isVisible: true,
        options: companySizes,
        overrideClasses: true,
        classes: 'col col-xs-12 col-sm-4 col-md-3 col-lg-3 col-xl-3',
      },
      city: {
        model: city,
        name: 'city',
        componentType: 'input',
        inputType: 'text',
        label: 'City',
        default: '',
        autocomplete: 'work address-level2',
        isVisible: true,
        overrideClasses: true,
        classes: 'col col-3',
      },
      countryId: {
        model: countryId,
        name: 'countryId',
        componentType: 'select',
        label: 'Country',
        default: null,
        autocomplete: 'work country-name',
        isVisible: true,
        options: countries,
        overrideClasses: true,
        classes: 'col col-xs-12 col-sm-4 col-md-3 col-lg-3 col-xl-3',
      },
      stateId: {
        model: stateId,
        name: 'stateId',
        componentType: 'select',
        label: 'State',
        default: null,
        autocomplete: 'work address-level1',
        isVisible: true,
        options: countryStates,
        overrideClasses: true,
        classes: 'col col-xs-12 col-sm-4 col-md-3 col-lg-3 col-xl-3',
      },
      website: {
        model: website,
        name: 'website',
        componentType: 'input',
        inputType: 'text',
        label: 'Website',
        default: null,
        autocomplete: 'url',
        isVisible: true,
      },
    });

    // Valiation section ends

    watch(countryId, (newCountry) => {
      stateId.value = null;
      if (newCountry) {
        void store.dispatch(
          'countries_states/FETCH_COUNTRY_STATES_FOR_SELECT',
          { countryId: newCountry.value }
        );

        countryStates.value = store.getters[
          'countries_states/GET_COUNTRY_STATES_FOR_SELECT'
        ] as SelectOption[];
      }
    });

    const onSubmit = handleSubmit((validatedForm) => {
      const processedForm = computed(() => {
        const { size, stateId, countryId, ...restOfForm } = validatedForm;
        return {
          size: size?.value,
          stateId: stateId?.value,
          countryId: countryId?.value,
          ...restOfForm,
          logo: logo.value,
        };
      });

      const getFormData = computed(() =>
        useFormData(processedForm.value as RawObject)
      );
      console.log(getFormData.value);

      void nextTick(() => {
        const isCreationMode = props.creationMode;
        void store
          .dispatch(
            `companies/${isCreationMode ? 'CREATE_COMPANY' : 'EDIT_COMPANY'}`,
            isCreationMode
              ? getFormData.value
              : { form: getFormData.value, companyId: props.companyId }
          )
          .then((id: string) => {
            companyCreated.value = true;
            void store.dispatch('auth/FETCH_AUTH_PROFILE');
            void nextTick(() => {
              void router.push({
                name: 'view_company',
                params: { companyId: id },
              });
            });
          })
          .catch((error) => {
            console.error(error);
          });
      });
    });

    let titleInfo: Ref<TitleInfo | null> = ref(null);

    watch(
      currentCompany,
      () => {
        const title =
          currentCompany && currentCompany.value
            ? useTitleInfo({
                title: currentCompany.value.name ?? '',
                avatar: currentCompany.value?.company_logo
                  ? new MultiFormatPicture(currentCompany.value?.company_logo)
                      .avatarImageUrl
                  : undefined,
              })
            : props.creationMode
            ? useTitleInfo({
                title: 'New Company',
                avatar: '',
              })
            : ref(null);

        titleInfo.value = title.value;
      },
      { deep: true }
    );

    const stopFetchCurrentlyViewedCompany = watchEffect(() => {
      if (!props.creationMode) {
        loading.value = true;
        void store
          .dispatch('companies/FETCH_CURRENTLY_VIEWED_COMPANY', {
            companyId: props.companyId,
          })
          .then(async () => {
            currentCompany.value = unref(
              computed(
                () =>
                  store.getters[
                    'companies/GET_CURRENTLY_VIEWED_COMPANY'
                  ] as CurrentlyViewedCompany
              )
            );

            isPersonalBrand.value = currentCompany?.value?.type === 'personal';
            name.value = currentCompany?.value?.name ?? '';
            email.value = currentCompany?.value?.email ?? '';
            phoneNumber.value = currentCompany?.value?.phone_number ?? '';
            address.value = currentCompany?.value?.address ?? '';
            city.value = currentCompany?.value?.city ?? '';
            size.value = currentCompany?.value?.companySize
              ? {
                  label: currentCompany?.value?.companySize?.size,
                  value: currentCompany?.value?.companySize?.id,
                }
              : null;
            website.value = currentCompany?.value?.website ?? '';
            countryId.value = currentCompany?.value?.country
              ? {
                  label: currentCompany?.value?.country?.name,
                  value: currentCompany?.value?.country?.id,
                }
              : null;
            // Fetch the states for the current country
            if (countryId.value) {
              await store
                .dispatch('countries_states/FETCH_COUNTRY_STATES_FOR_SELECT', {
                  countryId: countryId.value.value,
                })
                .then(() => {
                  // Then update the current state
                  stateId.value = currentCompany?.value?.state?.id
                    ? {
                        label: currentCompany?.value?.state?.name,
                        value: currentCompany?.value?.state?.id,
                      }
                    : null;
                });
            } else {
              // Then update the current state
              countryId.value = currentCompany?.value?.state?.id
                ? {
                    label: currentCompany?.value?.state?.name,
                    value: currentCompany?.value?.state?.id,
                  }
                : null;
            }

            loading.value = false;
          });
      }
    });

    watch(countryId, (country) => {
      if (country?.value) {
        stateId.value = null;
        void store.dispatch(
          'countries_states/FETCH_COUNTRY_STATES_FOR_SELECT',
          { countryId: country?.value }
        );

        countryStates.value = store.getters[
          'countries_states/GET_COUNTRY_STATES_FOR_SELECT'
        ] as SelectOption[];
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const CAN_EDIT_COMPANIES = computed(() =>
      store.getters['permissions/GET_USER_PERMISSION']('can_edit_companies')
    );

    onBeforeMount(() => {
      stopFetchCurrentlyViewedCompany();
      stopFetchCountriesForSelect();
      stopFetchCompanySizesForSelect();
    });

    onBeforeRouteLeave((to, from, next) => {
      if (companyCreated.value) {
        return next();
      }

      const didFormValuesChange = !isEqual(initialValues, values);
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
      company: currentCompany,
      text: ref(''),
      ph: ref(''),
      dense: ref(false),
      dismissed: ref(false),
      form,
      titleInfo,
      countries,
      countryStates,
      resourcePermissions: useResourcePermissions({
        view: PERMISSION.CAN_VIEW_COMPANIES,
        list: PERMISSION.CAN_LIST_COMPANIES,
      }),
      CAN_EDIT_COMPANIES,
      isSubmitting,
      onSubmit,
      formErrors,
      loading,
    };
  },
});
</script>
