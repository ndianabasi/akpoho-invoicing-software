<template>
  <div class="q-pa-md">
    <view-card
      v-if="creationMode || user"
      :title-info="titleInfo"
      show-avatar
      show-title-panel-side
      :loading="loading"
    >
      <template #body-panel>
        <form class="q-pa-md" @submit.prevent="submitForm">
          <image-cropper
            :input-max-file-size="5 * 1048576"
            @finish-cropper="handleCropperFinish"
          />
          <!-- 5 MB max file size -->

          <q-input
            v-model="form$.email.$model"
            filled
            clearable
            bottom-slots
            label="Email Address"
            :dense="dense"
            class="q-mb-md"
            type="email"
            :error="form$.email.$invalid"
            aria-autocomplete="email"
            autocomplete="email"
          >
            <template #before>
              <q-icon name="email" />
            </template>

            <template #error>
              {{
                form$.email.$silentErrors
                  .map((error) => error.$message)
                  .join(', ')
              }}
            </template>
          </q-input>

          <quasar-select
            v-if="CAN_EDIT_USERS"
            v-model="form.role_id"
            filled
            :options="roles"
            label="Role"
            aria-autocomplete="off"
            autocomplete="off"
            clearable
            bottom-slots
            options-dense
            use-input
            :emit-value="false"
            :map-options="false"
            class="q-mb-md"
            transition-show="scale"
            transition-hide="scale"
            :error="form$.role_id.$invalid"
          >
            <template #before>
              <q-icon name="person" />
            </template>

            <template #hint>
              <div
                v-if="CAN_EDIT_USERS && myAccountMode"
                class="q-mb-sm text-warning"
              >
                <q-icon name="warning" color="warning" /> Be care and don't
                downgrade your role, unless that is what you really want to do!
              </div>
            </template>

            <template #error>
              {{
                form$.role_id.$silentErrors
                  .map((error) => error.$message)
                  .join(', ')
              }}
            </template>
          </quasar-select>

          <q-input
            v-for="field in profileTextFields"
            :key="'profileTextField_' + field.name"
            v-model="form[field.name]"
            filled
            clearable
            bottom-slots
            :label="field.label"
            :dense="dense"
            :error="form$?.[field.name]?.$invalid ?? false"
            class="q-mb-md"
            :aria-autocomplete="form?.[field.name]?.autocomplete ?? 'off'"
            :autocomplete="form?.[field.name]?.autocomplete ?? 'off'"
          >
            <template #before>
              <q-icon name="person" />
            </template>

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
            v-model="form.country_id"
            filled
            :options="countries"
            label="Country"
            name="country_id"
            aria-autocomplete="country-name"
            autocomplete="country-name"
            clearable
            bottom-slots
            options-dense
            use-input
            :input-debounce="0"
            class="q-mb-md"
            transition-show="scale"
            transition-hide="scale"
            :emit-value="false"
            :map-options="false"
            ><template #before>
              <q-icon name="business" />
            </template>
          </quasar-select>

          <quasar-select
            v-model="form.state_id"
            filled
            :disable="!form.country_id"
            :options="countryStates"
            label="State"
            name="state_id"
            aria-autocomplete="address-level1"
            autocomplete="address-level1"
            clearable
            bottom-slots
            options-dense
            use-input
            :input-debounce="0"
            class="q-mb-md"
            transition-show="scale"
            transition-hide="scale"
            :emit-value="false"
            :map-options="false"
            ><template #before>
              <q-icon name="business" />
            </template>
          </quasar-select>

          <q-toggle
            v-if="CAN_EDIT_USERS"
            v-model="form.login_status"
            checked-icon="check"
            unchecked-icon="clear"
            :label="form.login_status ? 'Can login' : 'Cannot login'"
          />
          <div
            v-if="CAN_EDIT_USERS && myAccountMode"
            class="q-mb-sm text-warning"
            style="font-size: 0.75rem"
          >
            <q-icon name="warning" color="warning" /> Be care and don't disable
            your login access, unless that is what you really want to do!
          </div>
        </form>
      </template>

      <template #footer-panel>
        <div class="row justify-center q-mb-xl">
          <q-btn
            type="submit"
            :loading="submitting"
            label="Submit"
            class="q-mt-md"
            icon-right="send"
            @click.prevent="submitForm"
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
                  name: 'view_user',
                  params: { userId: userId }, //userId from route props
                }"
              >
                <q-item-section>
                  <q-btn flat icon="visibility" />
                </q-item-section>
                <q-item-section>View User</q-item-section>
              </q-item>

              <q-item
                v-if="resourcePermissions.canList"
                :to="{
                  name: 'all_users',
                }"
              >
                <q-item-section>
                  <q-btn flat icon="view_list" />
                </q-item-section>
                <q-item-section>All Users</q-item-section>
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
  ComputedRef,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import ViewCard from '../../../components/ViewCard.vue';
import useTitleInfo from '../../../composables/useTitleInfo';
import { store } from '../../../store';
import useResourcePermissions from '../../../composables/useResourcePermissions';
import {
  CurrentlyViewedUser,
  SelectionOption,
  UserFormShape,
  PERMISSION,
  TitleInfo,
  UserFormShapeProcessed,
} from '../../../store/types';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';
import QuasarSelect from '../../../components/QuasarSelect';
/* import { useForm, useField } from 'vee-validate';
import * as yup from 'yup'; */
import ImageCropper from '../../../components/ImageCropper.vue';

export default defineComponent({
  name: 'EditUser',

  components: {
    ViewCard,
    QuasarSelect,
    ImageCropper,
  },

  props: {
    userId: {
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
    const submitting = ref(false);
    const router = useRouter();
    const loading = ref(false);

    let currentUser: Ref<CurrentlyViewedUser | null>;

    currentUser = !props.creationMode
      ? computed(
          () =>
            store.getters[
              'users/GET_CURRENTLY_VIEWED_USER'
            ] as CurrentlyViewedUser
        )
      : ref(null);

    let form: UserFormShape = reactive({
      first_name: '',
      last_name: '',
      middle_name: '',
      phone_number: '',
      address: '',
      city: '',
      email: '',
      role_id: null,
      state_id: null,
      country_id: null,
      login_status: false,
      profile_picture: null,
    });

    const processedForm = computed((): Record<string, unknown> => {
      const { role_id, state_id, country_id, ...restOfForm } = form;
      return {
        role_id: role_id?.value ?? '',
        state_id: state_id?.value ?? null,
        country_id: country_id?.value ?? null,
        ...restOfForm,
      };
    });

    const getFormData: ComputedRef<FormData> = computed(() => {
      const formData = new FormData();

      for (const key in processedForm.value) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const value = processedForm.value[key];
        if (key === 'profile_picture' && value !== null) {
          formData.append(
            'profile_picture',
            processedForm.value.profile_picture as Blob
          );
        } else {
          formData.append(key, value as string);
        }
      }

      return formData;
    });

    const rules = {
      first_name: {
        required: helpers.withMessage('First name is required.', required),
      },
      last_name: {
        required: helpers.withMessage('Last name is required.', required),
      },
      role_id: { required: helpers.withMessage('Role is required.', required) },
      email: {
        email: helpers.withMessage('Email is not valid.', email),
        required: helpers.withMessage('Email is required.', required),
      },
    };

    let form$: Ref<{ $invalid: boolean }> = useVuelidate(rules, form);

    function submitForm() {
      if (!form$.value.$invalid) {
        submitting.value = true;

        if (!props.creationMode) {
          void store
            .dispatch('users/EDIT_USER', {
              userId: props.userId,
              formData: getFormData.value,
            })
            .then(() => {
              submitting.value = false;
              if (!props.myAccountMode) {
                void router.push({
                  name: 'view_user',
                  params: { userId: props.userId },
                });
              }

              return;
            })
            .catch(() => {
              submitting.value = false;
            });
        } else {
          store
            .dispatch('users/CREATE_USER', {
              formData: getFormData.value,
            })
            .then((userId: string) => {
              submitting.value = false;
              void router.push({
                name: 'view_user',
                params: { userId },
              });
              return;
            })
            .catch(() => {
              submitting.value = false;
            });
        }
      } else {
        Notify.create({
          message: 'Errors exist on the form!',
          type: 'negative',
          position: 'bottom',
          progress: true,
          timeout: 2500,
          actions: [
            {
              label: 'Dismiss',
              color: 'white',
            },
          ],
        });
      }
    }

    const profileTextFields = ref([
      {
        name: 'first_name',
        label: 'First Name',
        autocomplete: 'given-name',
      },
      {
        name: 'middle_name',
        label: 'Middle Name',
        autocomplete: 'additional-name',
      },
      {
        name: 'last_name',
        label: 'Last Name',
        autocomplete: 'last-name',
      },
      {
        name: 'phone_number',
        label: 'Phone Number',
        autocomplete: 'mobile tel',
      },
      {
        name: 'address',
        label: 'Address',
        autocomplete: 'street-address',
      },
      {
        name: 'city',
        label: 'City',
        autocomplete: 'address-level2',
      },
    ]);

    const countries = computed(
      () =>
        store.getters[
          'countries_states/GET_COUNTRIES_FOR_SELECT'
        ] as SelectionOption[]
    );

    const countryStates = computed(
      () =>
        store.getters[
          'countries_states/GET_COUNTRY_STATES_FOR_SELECT'
        ] as SelectionOption[]
    );

    const roles = computed(
      () => store.getters['roles/GET_ROLES_FOR_SELECT'] as SelectionOption[]
    );

    let titleInfo: Ref<TitleInfo | null> = ref(null);

    watch(
      currentUser,
      () => {
        const profilePictureFileBase =
          currentUser?.value?.profile?.profilePictureFile;

        const title =
          currentUser && currentUser.value
            ? useTitleInfo({
                title: `${currentUser.value.profile?.first_name ?? ''} ${
                  currentUser.value.profile?.last_name ?? ''
                }`,
                avatar:
                  profilePictureFileBase?.formats?.thumbnail?.url ??
                  profilePictureFileBase?.formats?.small?.url ??
                  profilePictureFileBase?.url ??
                  '',
              })
            : props.creationMode
            ? useTitleInfo({
                title: 'New User',
                avatar: '',
              })
            : ref(null);

        titleInfo.value = title.value;
      },
      { deep: true }
    );

    const stopFetchCurrentlyViewedUser = watchEffect(() => {
      if (!props.creationMode) {
        loading.value = true;
        void store
          .dispatch('users/FETCH_CURRENTLY_VIEW_USER', {
            userId: props.userId,
          })
          .then(async () => {
            currentUser.value = unref(
              computed(
                () =>
                  store.getters[
                    'users/GET_CURRENTLY_VIEWED_USER'
                  ] as CurrentlyViewedUser
              )
            );

            form.first_name = currentUser?.value?.profile.first_name;
            form.last_name = currentUser?.value?.profile.last_name;
            form.middle_name = currentUser?.value?.profile.middle_name;
            form.phone_number = currentUser?.value?.profile.phone_number;
            form.address = currentUser?.value?.profile.address;
            form.city = currentUser?.value?.profile.city;
            form.email = currentUser?.value?.email;
            form.role_id = currentUser?.value.role
              ? {
                  label: currentUser?.value.role.name,
                  value: currentUser?.value.role.id,
                }
              : null;
            form.country_id = currentUser?.value?.profile.userCountry
              ? {
                  label: currentUser?.value?.profile.userCountry?.name,
                  value: currentUser?.value?.profile.userCountry?.id,
                }
              : null;
            // Fetch the states for the current country
            if (form.country_id) {
              await store
                .dispatch('countries_states/FETCH_COUNTRY_STATES_FOR_SELECT', {
                  countryId: form.country_id?.value,
                })
                .then(() => {
                  // Then update the current state
                  form.state_id = currentUser?.value?.profile.userState
                    ? {
                        label: currentUser?.value?.profile.userState?.name,
                        value: currentUser?.value?.profile.userState?.id,
                      }
                    : null;
                });
            } else {
              // Then update the current state
              form.state_id = currentUser?.value?.profile.userState
                ? {
                    label: currentUser?.value?.profile.userState?.name,
                    value: currentUser?.value?.profile.userState?.id,
                  }
                : null;
            }
            form.login_status = Boolean(currentUser?.value.login_status);

            loading.value = false;
          });
      }
    });

    const stopFetchCountriesForSelect = watchEffect(() => {
      void store.dispatch('countries_states/FETCH_COUNTRIES_FOR_SELECT');
    });

    const stopFetchRolesForSelect = watchEffect(() => {
      void store.dispatch('roles/FETCH_ROLES_FOR_SELECT');
    });

    watch(
      () => form.country_id,
      (country) => {
        if (country?.value) {
          form.state_id = null;
          void store.dispatch(
            'countries_states/FETCH_COUNTRY_STATES_FOR_SELECT',
            { countryId: country?.value }
          );
        }
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const CAN_EDIT_USERS = computed(() =>
      store.getters['permissions/GET_USER_PERMISSION']('can_edit_users')
    );

    const handleCropperFinish = function ({ file }: { file: File }) {
      form.profile_picture = file;
    };

    onBeforeMount(() => {
      stopFetchCurrentlyViewedUser();
      stopFetchCountriesForSelect();
      stopFetchRolesForSelect();
    });

    return {
      user: currentUser,
      text: ref(''),
      ph: ref(''),
      dense: ref(false),
      dismissed: ref(false),
      submitting,
      form,
      submitForm,
      form$,
      profileTextFields,
      titleInfo,
      countries,
      countryStates,
      roles,
      resourcePermissions: useResourcePermissions({
        view: PERMISSION.CAN_VIEW_USERS,
        list: PERMISSION.CAN_LIST_USERS,
      }),
      CAN_EDIT_USERS,
      handleCropperFinish,
      getFormData,
      loading,
    };
  },
});
</script>
