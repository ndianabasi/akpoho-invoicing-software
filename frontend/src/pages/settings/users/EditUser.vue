<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-md-6 col-sm-12 col-xs-12">
        <view-card
          v-if="creationMode || user"
          :title-info="titleInfo"
          show-avatar
          show-title-panel-side
        >
          <template #body-panel>
            <form class="q-pa-md" @submit.prevent="submitForm">
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

              <q-select
                v-model="form.role_id"
                filled
                :options="roles"
                label="Role"
                clearable
                bottom-slots
                options-dense
                use-input
                emit-value
                map-options
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
                :error="form$.role_id.$invalid"
              >
                <template #before>
                  <q-icon name="person" />
                </template>

                <template #error>
                  {{
                    form$.role_id.$silentErrors
                      .map((error) => error.$message)
                      .join(', ')
                  }}
                </template>
              </q-select>

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

              <q-select
                v-model="form.country_id"
                filled
                :options="plainCountries"
                label="Country"
                name="country_id"
                clearable
                bottom-slots
                options-dense
                use-input
                input-debounce="0"
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
                emit-value
                map-options
                @filter="selectFilterFn"
                ><template #before>
                  <q-icon name="business" />
                </template>
              </q-select>

              <q-select
                v-model="form.state_id"
                filled
                :disable="!form.country_id"
                :options="plainCountryStates"
                label="State"
                name="state_id"
                clearable
                bottom-slots
                options-dense
                use-input
                input-debounce="0"
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
                emit-value
                map-options
                @filter="selectFilterFn"
                ><template #before>
                  <q-icon name="business" />
                </template>
              </q-select>

              <q-toggle
                v-model="form.login_status"
                checked-icon="check"
                unchecked-icon="clear"
                color="primary"
                :label="form.login_status ? 'Can login' : 'Cannot login'"
              />
            </form>
          </template>

          <template #footer-panel>
            <div class="row justify-center q-mb-xl">
              <q-btn
                type="submit"
                :loading="submitting"
                label="Submit"
                class="q-mt-md"
                color="primary"
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

          <template v-if="!creationMode" #title-panel-side>
            <q-btn
              :to="{
                name: 'view_user',
                params: { userId: userId }, //userId from route props
              }"
              flat
              round
              color="primary"
              icon="remove_red_eye"
              title="Edit user"
            />
          </template>
        </view-card>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import {
  defineComponent,
  ref,
  onBeforeMount,
  watchEffect,
  watch,
  computed,
  unref,
  Ref,
  ComputedRef,
  reactive,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import ViewCard from '../../../components/ViewCard.vue';
import useTitleInfo from '../../../composables/useTitleInfo';
import { store } from '../../../store';
import {
  CurrentlyViewedUser,
  SelectionOption,
  UserFormShape,
} from '../../../store/types';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'EditUser',

  components: {
    ViewCard,
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
  },

  setup(props) {
    const submitting = ref(false);
    const router = useRouter();

    let currentUser: Ref<CurrentlyViewedUser | null>;

    currentUser = !props.creationMode
      ? computed(
          () =>
            store.getters[
              'users/GET_CURRENTLY_VIEWED_USER'
            ] as CurrentlyViewedUser
        )
      : ref(null);

    const form: UserFormShape = reactive({
      first_name: '',
      last_name: '',
      middle_name: '',
      phone_number: '',
      address: '',
      city: '',
      email: '',
      role_id: '',
      state_id: null,
      country_id: null,
      login_status: false,
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

    const form$: Ref<{ $invalid: boolean }> = useVuelidate(rules, form);

    function submitForm() {
      if (!form$.value.$invalid) {
        submitting.value = true;

        if (!props.creationMode) {
          void store
            .dispatch('users/EDIT_USER', {
              userId: props.userId,
              form: form,
            })
            .then(() => {
              submitting.value = false;
              void router.push({
                name: 'view_user',
                params: { userId: props.userId },
              });
              return;
            })
            .catch(() => {
              submitting.value = false;
            });
        } else {
          store
            .dispatch('users/CREATE_USER', {
              form: form,
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
      },
      {
        name: 'middle_name',
        label: 'Middle Name',
      },
      {
        name: 'last_name',
        label: 'Last Name',
      },
      {
        name: 'phone_number',
        label: 'Phone Number',
      },
      {
        name: 'address',
        label: 'Address',
      },
      {
        name: 'city',
        label: 'City',
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

    const titleInfo =
      currentUser && currentUser.value
        ? useTitleInfo({
            title: `${currentUser.value.profile?.first_name ?? ''} ${
              currentUser.value.profile?.last_name ?? ''
            }`,
            avatar: currentUser.value.profile?.profile_picture ?? '',
          })
        : props.creationMode
        ? useTitleInfo({
            title: 'New User',
            avatar: '',
          })
        : ref(null);

    const stopFetchCurrentlyViewedUser = watchEffect(() => {
      if (!props.creationMode) {
        void store
          .dispatch('users/FETCH_CURRENTLY_VIEW_USER', {
            userId: props.userId,
          })
          .then(() => {
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
            form.role_id = currentUser?.value.role.id;
            form.state_id = currentUser?.value?.profile.userState?.id ?? null;
            form.country_id =
              currentUser?.value?.profile.userCountry?.id ?? null;
            form.login_status = Boolean(currentUser?.value.login_status);
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
        if (country) {
          form.state_id = null;
          void store.dispatch(
            'countries_states/FETCH_COUNTRY_STATES_FOR_SELECT',
            { countryId: country }
          );
        }
      }
    );

    onBeforeMount(() => {
      stopFetchCurrentlyViewedUser();
      stopFetchCountriesForSelect();
      stopFetchRolesForSelect();
    });

    interface SelectCallback {
      (
        val: string,
        update: (fn: () => void, ref?: (ref: { name: string }) => void) => void
      ): void;
    }

    const plainCountries = ref(unref(countries));
    const plainCountryStates = ref(unref(countryStates));

    const selectFilterFn: SelectCallback = function (val, update) {
      let plainOptions: Ref<SelectionOption[]>;
      let computedOptions: ComputedRef<SelectionOption[]>;

      update(
        () => {
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        },
        (ref) => {
          const refName = ref.name;
          if (refName === 'country_id') {
            plainOptions = plainCountries;
            computedOptions = countries;
          } else if (refName === 'state_id') {
            plainOptions = plainCountryStates;
            computedOptions = countryStates;
          }

          if (val === '') plainOptions.value = computedOptions.value;
          else {
            const needle = val.toLowerCase();
            plainOptions.value = computedOptions.value.filter(
              (v) => v.label.toLowerCase().indexOf(needle) > -1
            );
          }
        }
      );

      return;
    };

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
      plainCountries,
      plainCountryStates,
      selectFilterFn,
      roles,
    };
  },
});
</script>
