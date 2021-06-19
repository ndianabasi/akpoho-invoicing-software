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
              done-icon="done"
              :caption="
                lastPasswordChangeDate
                  ? 'Password was last changed at: ' + lastPasswordChangeDate
                  : 'Password yet to be changed'
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
              done-color="positive"
              done-icon="done"
            >
              <q-input
                v-model="form.changePasswordCode"
                filled
                clearable
                bottom-slots
                type="number"
                aria-autocomplete="one-time-code"
                autocomplete="one-time-code"
                label="Enter code"
                :dense="$q.screen.lt.sm"
                :error="
                  form.changePasswordCodeErrors &&
                  !!form.changePasswordCodeErrors.length
                "
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="security" />
                </template>

                <template #error>
                  {{
                    changePasswordCodeErrors &&
                    !!changePasswordCodeErrors.length
                      ? changePasswordCodeErrors.join(', ')
                      : ''
                  }}
                </template>
              </q-input>

              <q-stepper-navigation>
                <q-btn
                  color="primary"
                  label="Continue"
                  @click.prevent="submitPasswordChangeCode"
                />
              </q-stepper-navigation>
            </q-step>

            <q-step
              :name="3"
              title="Provide new password"
              icon="lock"
              :done="passwordChangeCompleted"
              done-color="positive"
              done-icon="done"
            >
              <q-input
                v-model="form.newPassword"
                filled
                clearable
                bottom-slots
                :type="revealPasswords.newPassword ? 'text' : 'password'"
                aria-autocomplete="new-password"
                autocomplete="new-password"
                label="Enter New Password"
                :dense="$q.screen.lt.sm"
                :error="
                  form.newPasswordErrors && !!form.newPasswordErrors.length
                "
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="lock" />
                </template>

                <template #append>
                  <q-icon
                    v-if="form.newPassword"
                    :name="form.newPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="
                      revealPasswords.newPassword = !revealPasswords.newPassword
                    "
                  />
                </template>

                <template #error>
                  {{
                    newPasswordErrors && !!newPasswordErrors.length
                      ? newPasswordErrors.join(', ')
                      : ''
                  }}
                </template>
              </q-input>
              <q-input
                v-model="form.confirmNewPassword"
                filled
                clearable
                bottom-slots
                :type="revealPasswords.confirmNewPassword ? 'text' : 'password'"
                aria-autocomplete="new-password"
                autocomplete="new-password"
                label="Confirm New Password"
                :dense="$q.screen.lt.sm"
                :error="
                  form.confirmNewPasswordErrors &&
                  !!form.confirmNewPasswordErrors.length
                "
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="lock" />
                </template>

                <template #append>
                  <q-icon
                    v-if="form.confirmNewPassword"
                    :name="
                      form.confirmNewPassword ? 'visibility_off' : 'visibility'
                    "
                    class="cursor-pointer"
                    @click="
                      revealPasswords.confirmNewPassword =
                        !revealPasswords.confirmNewPassword
                    "
                  />
                </template>

                <template #error>
                  {{
                    confirmNewPasswordErrors &&
                    !!confirmNewPasswordErrors.length
                      ? confirmNewPasswordErrors.join(', ')
                      : ''
                  }}
                </template>
              </q-input>

              <q-stepper-navigation>
                <q-btn
                  color="primary"
                  label="Finish"
                  @click.prevent="submitNewPassword"
                />
              </q-stepper-navigation>
            </q-step>

            <q-step
              :name="4"
              title="Success"
              icon="done_all"
              :done="passwordChangeCompleted"
              done-color="positive"
              done-icon="done_all"
            >
              <q-banner class="bg-positive text-white">
                Congratulations your password was successfully changed
              </q-banner>
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
import { defineComponent, ref, computed, reactive, Ref } from 'vue';
import ViewCard from '../../../components/ViewCard.vue';
import { store } from '../../../store';
import { Notify, QStepper } from 'quasar';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
const sixDigitCodeRegex = /^(\d){6}$/;

export default defineComponent({
  name: 'ChangeMyPassword',

  components: {
    ViewCard,
  },

  setup() {
    const submitting = ref(false);
    const step = ref(1);
    const stepper: Ref<QStepper | null> = ref(null);
    const revealPasswords = reactive({
      currentPassword: false,
      newPassword: false,
      confirmNewPassword: false,
    });
    const passwordChangeCompleted = ref(false);

    const formSchema = computed(() =>
      yup.object({
        email: yup.string().email().optional(),
        secret: yup.string().optional(),
        currentPassword: yup
          .string()
          .required('Current password is required')
          .nullable(),
        changePasswordCode: yup
          .string()
          .required('Code is required')
          .matches(sixDigitCodeRegex, 'Please provide valid code')
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

    useForm({ validationSchema: formSchema.value });

    let { value: email } = useField('email');
    let { value: secret } = useField('secret');

    let {
      value: currentPassword,
      meta: currentPasswordMeta,
      errors: currentPasswordErrors,
      handleInput: currentPasswordHandleInput,
    } = useField('currentPassword');

    let {
      value: changePasswordCode,
      meta: changePasswordCodeMeta,
      errors: changePasswordCodeErrors,
      handleInput: changePasswordCodeHandleInput,
    } = useField('changePasswordCode');

    let {
      value: newPassword,
      meta: newPasswordMeta,
      errors: newPasswordErrors,
      handleInput: newPasswordHandleInput,
    } = useField('newPassword');

    let {
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
            currentPassword: currentPassword.value,
          })
          .then(({ secret: passwordChangeSecret }: { secret: string }) => {
            submitting.value = false;
            secret.value = passwordChangeSecret;
            // programmatically move to next step
            stepper?.value?.next();
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

    function submitPasswordChangeCode() {
      if (changePasswordCodeMeta.valid) {
        submitting.value = true;

        void store
          .dispatch('auth/CONFIRM_CODE_FOR_PASSWORD_CHANGE', {
            code: changePasswordCode.value,
            secret: secret.value,
          })
          .then(() => {
            submitting.value = false;
            // programmatically move to next step
            stepper?.value?.next();
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

    function submitNewPassword() {
      if (newPasswordMeta.valid && confirmNewPasswordMeta.valid) {
        submitting.value = true;

        void store
          .dispatch('auth/SUBMIT_NEW_PASSWORD', {
            newPassword: newPassword.value,
            confirmNewPassword: confirmNewPassword.value,
            secret: secret.value,
          })
          .then(() => {
            submitting.value = false;
            passwordChangeCompleted.value = true;
            stepper?.value?.next();
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
        secret,
        email,
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
      submitPasswordChangeCode,
      passwordChangeCompleted,
      submitNewPassword,
      lastPasswordChangeDate: computed(
        () => store.getters['auth/GET_LAST_PASSWORD_HISTORY']
      ),
    };
  },
});
</script>
