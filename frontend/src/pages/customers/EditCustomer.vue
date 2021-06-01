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
              <div class="row q-mx-auto">
                <div class="column col-6">
                  <q-toggle
                    v-model="form.is_corporate"
                    checked-icon="check"
                    color="green"
                    unchecked-icon="clear"
                    label="This is a corporate customer"
                    class="q-ml-lg q-mb-md"
                  />
                </div>
                <div v-if="form.is_corporate" class="column col-6">
                  <q-toggle
                    v-model="form.corporate_has_rep"
                    checked-icon="check"
                    color="green"
                    unchecked-icon="clear"
                    label="Corporate customer has a rep."
                    class="q-ml-lg q-mb-md"
                  />
                </div>
              </div>
              <template v-if="form.corporate_has_rep || !form.is_corporate">
                <q-select
                  v-model="form.title"
                  filled
                  :options="titles"
                  label="Title"
                  clearable
                  bottom-slots
                  class="q-mb-md"
                  transition-show="scale"
                  transition-hide="scale"
                  ><template #before>
                    <q-icon name="person" />
                  </template>

                  <template #hint> Field hint </template>
                  <template #error> Sorry! Invalid input </template>
                </q-select>

                <q-input
                  v-model="form.first_name"
                  filled
                  clearable
                  bottom-slots
                  label="First Name"
                  :dense="dense"
                  class="q-mb-md"
                >
                  <template #before>
                    <q-icon name="person" />
                  </template>

                  <template #hint> Field hint </template>
                  <template #error> Sorry! Invalid input </template>
                </q-input>
                <q-input
                  v-model="form.middle_name"
                  filled
                  clearable
                  bottom-slots
                  label="Middle Name"
                  :dense="dense"
                  class="q-mb-md"
                >
                  <template #before>
                    <q-icon name="person" />
                  </template>

                  <template #hint> Field hint </template>
                  <template #error> Sorry! Invalid input </template>
                </q-input>

                <q-input
                  v-model="form.last_name"
                  filled
                  clearable
                  bottom-slots
                  label="Last Name"
                  :dense="dense"
                  class="q-mb-md"
                >
                  <template #before>
                    <q-icon name="person" />
                  </template>

                  <template #hint> Field hint </template>
                </q-input>

                <q-input
                  v-model="form.phone_number"
                  filled
                  clearable
                  bottom-slots
                  label="Phone Number"
                  :dense="dense"
                  class="q-mb-md"
                  type="tel"
                >
                  <template #before>
                    <q-icon name="smartphone" />
                  </template>
                </q-input>

                <q-input
                  v-model="form$.email.$model"
                  filled
                  clearable
                  bottom-slots
                  label="Email Address"
                  :dense="dense"
                  class="q-mb-md"
                  type="email"
                  :error="form$.email.$error"
                >
                  <template #before>
                    <q-icon name="email" />
                  </template>

                  <template #error
                    ><small
                      v-for="(error, index) in form$.email.$errors"
                      :key="'email_addresses_error_' + index"
                      >{{ error.$message }}</small
                    ></template
                  >
                </q-input>
              </template>

              <template
                v-if="form.is_corporate"
                transition-show="slide-down"
                transition-hide="slide-up"
              >
                <q-input
                  v-model="form.company_name"
                  filled
                  clearable
                  bottom-slots
                  label="Company Name"
                  :dense="dense"
                  autogrow
                  class="q-mb-md"
                >
                  <template #before>
                    <q-icon name="business" />
                  </template>

                  <template #hint> Field hint </template>
                  <template #error> Sorry! Invalid input </template>
                </q-input>

                <q-input
                  v-model="form.company_email"
                  filled
                  clearable
                  bottom-slots
                  label="Company Email Address"
                  :dense="dense"
                  class="q-mb-md"
                  type="email"
                >
                  <template #before>
                    <q-icon name="email" />
                  </template>

                  <template #hint> Field hint </template>
                  <template #error> Sorry! Invalid input </template>
                </q-input>

                <q-input
                  v-model="form.company_phone"
                  filled
                  clearable
                  bottom-slots
                  label="Company Phone Number"
                  :dense="dense"
                  class="q-mb-md"
                  type="email"
                >
                  <template #before>
                    <q-icon name="email" />
                  </template>

                  <template #hint> Field hint </template>
                  <template #error> Sorry! Invalid input </template>
                </q-input>
              </template>

              <q-input
                v-model="form.billing_address"
                filled
                clearable
                bottom-slots
                label="Billing Address"
                :dense="dense"
                type="textarea"
                autogrow
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="local_shipping" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-input
                v-model="form.billing_lga"
                filled
                clearable
                bottom-slots
                label="Billing LGA/County"
                :dense="dense"
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="local_shipping" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-input
                v-model="form.billing_postal_code"
                filled
                clearable
                bottom-slots
                label="Billing Postal Code"
                :dense="dense"
                type="textarea"
                autogrow
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="local_shipping" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-select
                v-model="form.billing_country"
                filled
                :options="countriesList"
                label="Billing Country"
                clearable
                bottom-slots
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
                emit-value
                map-options
                @update:modelValue="processSelect('billing_country', $event)"
                ><template #before>
                  <q-icon name="local_shipping" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-select>

              <q-select
                v-model="form.billing_state"
                filled
                :disable="!form.billing_country"
                :placeholder="
                  !form.billing_country ? 'Please select the country first' : ''
                "
                :options="
                  form.billing_country
                    ? countries[`${form.billing_country}`]
                    : []
                "
                label="Billing State"
                clearable
                bottom-slots
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
                emit-value
                map-options
                @update:modelValue="processSelect('billing_state', $event)"
                ><template #before>
                  <q-icon name="local_shipping" />
                </template>

                <template #hint> Field hint </template>
                <template #error><div>Sorry! Invalid input</div></template>
              </q-select>

              <q-toggle
                v-model="form.is_billing_shipping_addresses_same"
                checked-icon="check"
                color="green"
                unchecked-icon="clear"
                label="Use billing address as delivery address?"
                class="q-ml-lg q-mb-md"
              />

              <template v-if="!form.is_billing_shipping_addresses_same">
                <q-input
                  v-model="form.shipping_address"
                  filled
                  clearable
                  bottom-slots
                  label="Shipping Address"
                  :dense="dense"
                  type="textarea"
                  autogrow
                  class="q-mb-md"
                >
                  <template #before>
                    <q-icon name="local_shipping" />
                  </template>

                  <template #hint> Field hint </template>
                  <template #error> Sorry! Invalid input </template>
                </q-input>

                <q-input
                  v-model="form.shipping_lga"
                  filled
                  clearable
                  bottom-slots
                  label="Shipping LGA/County"
                  :dense="dense"
                  class="q-mb-md"
                >
                  <template #before>
                    <q-icon name="local_shipping" />
                  </template>

                  <template #hint> Field hint </template>
                  <template #error> Sorry! Invalid input </template>
                </q-input>

                <q-input
                  v-model="form.shipping_postal_code"
                  filled
                  clearable
                  bottom-slots
                  label="Shipping Postal Code"
                  :dense="dense"
                  type="textarea"
                  autogrow
                  class="q-mb-md"
                >
                  <template #before>
                    <q-icon name="local_shipping" />
                  </template>

                  <template #hint> Field hint </template>
                  <template #error> Sorry! Invalid input </template>
                </q-input>

                <q-select
                  v-model="form.shipping_country"
                  filled
                  :options="countriesList"
                  label="Shipping Country"
                  clearable
                  bottom-slots
                  class="q-mb-md"
                  transition-show="scale"
                  transition-hide="scale"
                  emit-value
                  map-options
                  @update:modelValue="processSelect('shipping_country', $event)"
                  ><template #before>
                    <q-icon name="local_shipping" />
                  </template>

                  <template #hint> Field hint </template>
                  <template #error> Sorry! Invalid input </template>
                </q-select>

                <q-select
                  v-model="form.shipping_state"
                  filled
                  :disable="!form.shipping_country"
                  :placeholder="
                    !form.shipping_country
                      ? 'Please select the country first'
                      : ''
                  "
                  :options="
                    form.shipping_country
                      ? countries[`${form.shipping_country}`]
                      : []
                  "
                  label="Shipping State"
                  clearable
                  bottom-slots
                  class="q-mb-md"
                  transition-show="scale"
                  transition-hide="scale"
                  emit-value
                  map-options
                  @update:modelValue="processSelect('shipping_state', $event)"
                  ><template #before>
                    <q-icon name="local_shipping" />
                  </template>

                  <template #hint> Field hint </template>
                  <template #error><div>Sorry! Invalid input</div></template>
                </q-select>
              </template>
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
            <q-btn flat color="primary" icon="more_vert">
              <q-menu
                anchor="bottom right"
                self="top end"
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                <q-list class="text-primary">
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
import ViewCard from '../../components/ViewCard.vue';
import useTitleInfo from '../../composables/useTitleInfo';
import { store } from '../../store';
import useResourcePermissions from '../../composables/useResourcePermissions';
import {
  CurrentlyViewedUser,
  SelectionOption,
  UserFormShape,
  PERMISSION,
} from '../../store/types';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'EditCustomer',

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

    const form = reactive({
      title: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      email: '',
      phone_number: '',
      is_corporate: false,
      corporate_has_rep: false,
      company_name: '',
      company_phone: '',
      company_email: '',
      shipping_address: '',
      shipping_lga: '',
      shipping_postal_code: '',
      shipping_state: '',
      shipping_country: '',
      // This is not persisted but used to create an identical billing address
      // from the shipping address
      is_billing_shipping_addresses_same: true,
      billing_address: '',
      billing_lga: '',
      billing_postal_code: '',
      billing_state: '',
      billing_country: '',
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
      company_email: {
        email: helpers.withMessage('Company Email is not valid.', email),
        required: helpers.withMessage('Company Email is required.', required),
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
            title: 'New Customer',
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
          });
      }
    });

    const stopFetchCountriesForSelect = watchEffect(() => {
      void store.dispatch('countries_states/FETCH_COUNTRIES_FOR_SELECT');
    });

    const stopFetchRolesForSelect = watchEffect(() => {
      void store.dispatch('roles/FETCH_ROLES_FOR_SELECT');
    });

    /* watch(
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
    ); */

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
      resourcePermissions: useResourcePermissions({
        view: PERMISSION.CAN_VIEW_USERS,
        list: PERMISSION.CAN_LIST_USERS,
      }),
    };
  },
});
</script>
