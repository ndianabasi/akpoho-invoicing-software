<template>
  <div class="q-pa-md">
    <view-card
      v-if="creationMode || company"
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
              class="q-ml-lg q-mb-md"
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
  SelectionOption,
  PERMISSION,
  TitleInfo,
  CompanyFormShape,
  FormSchema,
} from '../../../store/types';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import QuasarSelect from '../../../components/QuasarSelect';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { phoneNumberRegex } from '../../../helpers/utils';
import { isEqual } from 'lodash';

export default defineComponent({
  name: 'EditCompany',

  components: {
    ViewCard,
    QuasarSelect,
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
        ] as SelectionOption[]
    );

    const countryStates = computed({
      get: () =>
        store.getters[
          'countries_states/GET_COUNTRY_STATES_FOR_SELECT'
        ] as SelectionOption[],
      set: (value) => value,
    });

    const companySizes = computed(
      () =>
        store.getters[
          'companies/GET_COMPANY_SIZES_FOR_SELECT'
        ] as SelectionOption[]
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
        size: yup.number().required('Company Size is required').nullable(),
        stateId: yup.number().required('State is required').nullable(),
        countryId: yup.number().required('Country is required').nullable(),
        website: yup.string().optional().nullable(),
      })
    );

    const initialValues: Readonly<CompanyFormShape> = {
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
    } = useForm<CompanyFormShape>({
      validationSchema: formSchema.value,
      initialValues,
    });

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

    // Form schema for form generation
    const form: FormSchema = reactive({
      isPersonalBrand: {
        model: isPersonalBrand,
        name: 'isPersonalBrand',
        componentType: 'toggle',
        label: 'Create as Personal Brand',
        default: false,
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
        inputType: 'work email',
        label: 'Email',
        default: '',
        autocomplete: 'email',
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
      city: {
        model: city,
        name: 'city',
        componentType: 'input',
        inputType: 'text',
        label: 'City',
        default: '',
        autocomplete: 'work address-level2',
        isVisible: true,
      },
      size: {
        model: size,
        name: 'size',
        componentType: 'select',
        label: 'Company Size',
        default: null,
        isVisible: true,
        options: computed(() => companySizes.value),
      },
      countryId: {
        model: countryId,
        name: 'countryId',
        componentType: 'select',
        label: 'Country',
        default: null,
        autocomplete: 'work country-name',
        isVisible: true,
        options: unref(countries),
      },
      stateId: {
        model: stateId,
        name: 'stateId',
        componentType: 'select',
        label: 'State',
        default: null,
        autocomplete: 'work address-level1',
        isVisible: true,
        options: computed(() => countryStates.value),
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

    watch(
      () => form.countryId.model,
      (newCountry) => {
        stateId.value = null;
        if (newCountry) {
          void store.dispatch(
            'countries_states/FETCH_COUNTRY_STATES_FOR_SELECT',
            { countryId: newCountry }
          );

          countryStates.value = store.getters[
            'countries_states/GET_COUNTRY_STATES_FOR_SELECT'
          ] as SelectionOption[];
        }
      }
    );

    const onSubmit = handleSubmit((form) => {
      void nextTick(() => {
        const isCreationMode = props.creationMode;
        void store
          .dispatch(
            `companies/${isCreationMode ? 'CREATE_COMPANY' : 'EDIT_COMPANY'}`,
            isCreationMode ? form : { form, companyId: props.companyId }
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
                avatar: undefined,
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
            size.value = currentCompany?.value?.companySize?.id ?? null;
            website.value = currentCompany?.value?.website ?? '';
            countryId.value = currentCompany?.value?.country?.id ?? null;
            // Fetch the states for the current country
            if (countryId.value) {
              await store
                .dispatch('countries_states/FETCH_COUNTRY_STATES_FOR_SELECT', {
                  countryId: countryId.value,
                })
                .then(() => {
                  // Then update the current state
                  stateId.value = currentCompany?.value?.state?.id ?? null;
                });
            } else {
              // Then update the current state
              countryId.value = currentCompany?.value?.state?.id ?? null;
            }
          });
      }
    });

    watch(
      () => countryId.value,
      (country) => {
        if (country) {
          stateId.value = null;
          void store.dispatch(
            'countries_states/FETCH_COUNTRY_STATES_FOR_SELECT',
            { countryId: country }
          );

          countryStates.value = store.getters[
            'countries_states/GET_COUNTRY_STATES_FOR_SELECT'
          ] as SelectionOption[];
        }
      }
    );

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
    };
  },
});
</script>
