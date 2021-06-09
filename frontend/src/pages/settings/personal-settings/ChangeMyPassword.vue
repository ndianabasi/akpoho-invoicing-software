<template>
  <div class="q-pa-md">
    <view-card :show-title-panel="false">
      <template #body-panel>
        <form>
          <q-input
            v-model="form.email"
            type="email"
            aria-autocomplete="email"
            autocomplete="email"
            :hidden="true"
            :aria-hidden="true"
            class="hidden"
          />

          <q-stepper
            ref="stepper"
            v-model="step"
            vertical
            :dark="$q.dark.isActive"
            animated
            class="no-border no-shadow"
          >
            <q-step
              :name="1"
              title="Enter current password"
              icon="lock"
              :done="step > 1"
              done-color="positive"
              done-icon="positive"
              :caption="
                'Password was last changed at: ' + dateOfLastPasswordChange
              "
            >
              <q-input
                v-model="form.currentPassword"
                filled
                clearable
                bottom-slots
                :type="revealPasswords.currentPassword ? 'text' : 'password'"
                aria-autocomplete="current-password"
                autocomplete="current-password"
                label="Current Password"
                :dense="$q.screen.lt.sm"
                :error="
                  form.currentPasswordErrors &&
                  !!form.currentPasswordErrors.length
                "
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="lock" />
                </template>

                <template #append>
                  <q-icon
                    v-if="form.currentPassword"
                    :name="
                      form.currentPassword ? 'visibility_off' : 'visibility'
                    "
                    class="cursor-pointer"
                    @click="
                      revealPasswords.currentPassword =
                        !revealPasswords.currentPassword
                    "
                  />
                </template>

                <template #error>
                  {{
                    currentPasswordErrors && !!currentPasswordErrors.length
                      ? currentPasswordErrors.join(', ')
                      : ''
                  }}
                </template>
              </q-input>

              <q-stepper-navigation>
                <q-btn
                  color="primary"
                  label="Continue"
                  @click.prevent="submitCurrentPassword"
                />
              </q-stepper-navigation>
            </q-step>

            <q-step
              :name="2"
              title="Enter code"
              icon="security"
              :done="step > 2"
            >
              An ad group contains one or more ads which target a shared set of
              keywords.

              <q-stepper-navigation>
                <q-btn color="primary" label="Continue" @click="step = 4" />
              </q-stepper-navigation>
            </q-step>

            <q-step :name="4" title="Enter new password" icon="lock">
              Try out different ad text to see what brings in the most
              customers, and learn how to enhance your ads using features like
              ad extensions. If you run into any problems with your ads, find
              out how to tell if they're running and how to resolve approval
              issues.

              <q-stepper-navigation>
                <q-btn color="primary" label="Finish" />
                <q-btn
                  flat
                  color="primary"
                  label="Back"
                  class="q-ml-sm"
                  @click="step = 2"
                />
              </q-stepper-navigation>
            </q-step>
          </q-stepper>
        </form>
      </template>
    </view-card>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { defineComponent, ref, computed, reactive } from 'vue';
import ViewCard from '../../../components/ViewCard.vue';
import { store } from '../../../store';
import { Notify } from 'quasar';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
const sixDigitCodeRegex = /^(\d){6}$/;

export default defineComponent({
  name: 'EditUser',

  components: {
    ViewCard,
  },

  setup() {
    const submitting = ref(false);
    const step = ref(1);
    const stepper = ref(null);
    const revealPasswords = reactive({
      currentPassword: false,
      newPassword: false,
      confirmNewPassword: false,
    });

    const formSchema = computed(() =>
      yup.object({
        email: yup.string().email().optional(),
        currentPassword: yup
          .string()
          .required('Current password is required')
          .nullable(),
        changePasswordCode: yup
          .string()
          .required('Code is required')
          .matches(sixDigitCodeRegex, 'Please provie valid code')
          .nullable(),
        newPassword: yup
          .string()
          .required('New Password is required')
          .matches(passwordRegex, 'Please provide a strong password')
          .nullable(),
        confirmNewPassword: yup
          .mixed()
          .nullable()
          .equals([yup.ref('newPassword')], 'Both passwords must be the same'),
      })
    );

    const { meta: formMeta } = useForm({ validationSchema: formSchema.value });

    const { value: email } = useField('email');

    const {
      value: currentPassword,
      meta: currentPasswordMeta,
      errors: currentPasswordErrors,
      handleInput: currentPasswordHandleInput,
    } = useField('currentPassword');

    const {
      value: changePasswordCode,
      meta: changePasswordCodeMeta,
      errors: changePasswordCodeErrors,
      handleInput: changePasswordCodeHandleInput,
    } = useField('changePasswordCode');

    const {
      value: newPassword,
      meta: newPasswordMeta,
      errors: newPasswordErrors,
      handleInput: newPasswordHandleInput,
    } = useField('newPassword');

    const {
      value: confirmNewPassword,
      meta: confirmNewPasswordMeta,
      errors: confirmNewPasswordErrors,
      handleInput: confirmNewPasswordHandleInput,
    } = useField('confirmNewPassword');

    function submitCurrentPassword() {
      if (currentPasswordMeta.valid) {
        submitting.value = true;

        void store
          .dispatch('auth/CONFIRM_CURRENT_PASSWORD_FOR_PASSWORD_CHANGE', {
            currentPassword,
          })
          .then(() => {
            submitting.value = false;
            // programmatically move to next step

            return;
          })
          .catch(() => {
            submitting.value = false;
          });
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

    const dateOfLastPasswordChange = '';

    /* onBeforeMount(() => {
    }); */

    return {
      submitting,
      step,
      stepper,
      form: reactive({
        currentPassword,
        currentPasswordErrors,
        currentPasswordHandleInput,
        changePasswordCode,
        changePasswordCodeErrors,
        changePasswordCodeHandleInput,
        newPassword,
        newPasswordErrors,
        newPasswordHandleInput,
        confirmNewPassword,
        confirmNewPasswordErrors,
        confirmNewPasswordHandleInput,
      }),
      submitCurrentPassword,
      revealPasswords,
      dateOfLastPasswordChange,
    };
  },
});
</script>
