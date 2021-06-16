<!-- eslint-disable vue/v-slot-style -->
<template>
  <auth-form>
    <template
      v-if="!showResetValidationError && !validationInProgresss"
      #formTitle
      >Reset your password</template
    >

    <template #formSection="{ isSmallScreen }">
      <div
        v-if="validationInProgresss"
        class="q-gutter-md column flex-center"
        style="font-size: 5rem"
      >
        <q-spinner-oval color="warning" />
        <p class="text-center text-warning" style="font-size: 1rem">
          Validation in progress
        </p>
      </div>
      <form
        v-if="!showResetValidationError && !validationInProgresss"
        class="form validate-form column q-gutter-lg-lg q-gutter-sm-md"
        @submit.prevent="handleReset"
      >
        <q-input
          v-model="form$.email"
          type="email"
          aria-autocomplete="email"
          autocomplete="email"
          :hidden="true"
          :aria-hidden="true"
          class="hidden"
        />

        <q-input
          v-model="form$.newPassword"
          :dense="isSmallScreen"
          filled
          bottom-slots
          clearable
          type="password"
          aria-autocomplete="new-password"
          autocomplete="new-password"
          :error="form$.newPasswordErrors && !!form$.newPasswordErrors.length"
          label="New Password"
          color="purple-10"
          label-color="purple-10"
          bg-color="purple-1"
          autofocus
          @input="form$.newPasswordHandleInput"
        >
          <template v-slot:hint>
            <q-btn style="font-size: 0.75rem" flat color="primary" label="Hint">
              <q-tooltip
                class="bg-primary"
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                <div>
                  Password should contain at least:
                  <ul>
                    <li>One (1) uppercase letter,</li>
                    <li>One (1) lowercase letter,</li>
                    <li>One (1) number,</li>
                    <li>Must be at least 8 characters long.</li>
                  </ul>
                </div>
              </q-tooltip>
            </q-btn>
          </template>
          <template v-slot:error>
            {{ form$.newPasswordErrors.join(', ') }}
          </template>
        </q-input>

        <q-input
          v-model="form$.confirmNewPassword"
          :dense="isSmallScreen"
          filled
          bottom-slots
          clearable
          type="password"
          aria-autocomplete="new-password"
          autocomplete="new-password"
          :error="
            form$.confirmNewPasswordErrors &&
            !!form$.confirmNewPasswordErrors.length
          "
          label="Confirm New Password"
          color="purple-10"
          label-color="purple-10"
          bg-color="purple-1"
          autofocus
          @input="form$.confirmNewPasswordHandleInput"
        >
          <template v-slot:hint> </template>
          <template v-slot:error>
            {{ form$.confirmNewPasswordErrors.join(', ') }}
          </template>
        </q-input>
      </form>
      <q-banner
        v-if="showResetValidationError && !validationInProgresss"
        rounded
        class="bg-light-solid text-negative"
      >
        The password-reset link could not be verified. This could be due to the
        link expiring or being invalid.

        <template v-slot:action>
          <q-btn
            color="primary"
            flat
            label="Request again"
            :to="{ name: 'forgot_password' }"
          />
        </template>
      </q-banner>
    </template>

    <template
      v-if="!showResetValidationError && !validationInProgresss"
      #submitSection="{ isSmallScreen }"
    >
      <q-btn
        :loading="submitting"
        :class="{
          'full-width': isSmallScreen,
          'text-center flex align-center q-mt-lg q-mx-auto q-px-xl half-width': true,
        }"
        color="accent"
        icon-right="send"
        label="Submit"
        @click.prevent="handleReset"
      >
        <template v-slot:loading> Logging In... </template>
      </q-btn>
    </template>

    <template
      v-if="!showResetValidationError && !validationInProgresss"
      #formFooterLink
    >
      <router-link :to="{ name: 'Login' }">Login instead? </router-link>
    </template>
  </auth-form>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-misused-promises */
import { defineComponent, ref, nextTick, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { Notify } from 'quasar';
import AuthForm from '../../components/AuthForm.vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useRouter } from 'vue-router';
import { passwordRegex } from '../../helpers/utils';

export default defineComponent({
  name: 'RequestPasswordReset',

  components: { AuthForm },

  props: {
    verificationKey: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const submitting = ref(false);
    const showResetValidationError = ref(false);
    const validationInProgresss = ref(true);

    const store = useStore();
    const router = useRouter();

    const formSchema = computed(() =>
      yup.object({
        email: yup.string().email('Email is not valid').optional(),
        newPassword: yup
          .string()
          .required('New Password is required')
          .matches(passwordRegex, 'Please provide a strong password')
          .nullable(),
        confirmNewPassword: yup
          .mixed()
          .nullable()
          .equals(
            [yup.ref('newPassword')],
            'Both passwords should be the same'
          ),
      })
    );

    const { meta: formMeta } = useForm({ validationSchema: formSchema.value });

    const { value: email } = useField('email');
    const {
      value: newPassword,
      errors: newPasswordErrors,
      meta: newPasswordMeta,
      handleInput: newPasswordHandleInput,
    } = useField('newPassword');
    const {
      value: confirmNewPassword,
      errors: confirmNewPasswordErrors,
      meta: confirmNewPasswordMeta,
      handleInput: confirmNewPasswordHandleInput,
    } = useField('confirmNewPassword');

    const form$ = ref({
      email,
      newPassword,
      newPasswordErrors,
      confirmNewPassword,
      confirmNewPasswordErrors,
      newPasswordMeta,
      confirmNewPasswordMeta,
      newPasswordHandleInput,
      confirmNewPasswordHandleInput,
    });

    async function handleReset() {
      try {
        console.log('handling login');
        if (formMeta.value.valid) {
          submitting.value = true;

          await nextTick(async () => {
            await store
              .dispatch('auth/RESET_PASSWORD', {
                email: email.value,
                newPassword: newPassword.value,
                confirmNewPassword: confirmNewPassword.value,
              })
              .then(() => {
                void router.push({ name: 'home' });
                return;
              })
              .catch(() => {
                submitting.value = false;
                return;
              });
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
      } catch (error: unknown) {
        submitting.value = false;
        Notify.create({
          message: String(error),
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

    const validateResetKey = async (key: string) => {
      console.log(key);

      await store
        .dispatch('auth/VERIFY_PASSWORD_RESET', key)
        .then((email: string) => {
          validationInProgresss.value = false;
          form$.value.email = email;
          return;
        })
        .catch(() => {
          validationInProgresss.value = false;
          showResetValidationError.value = true;
          return;
        });
    };

    onMounted(() => {
      setTimeout(async () => {
        await validateResetKey(props.verificationKey);
      }, 1000);
    });

    return {
      dismissed: ref(false),
      submitting,
      handleReset,
      showResetValidationError,
      validationInProgresss,
      form$,
    };
  },
});
</script>

<style lang="scss" scoped></style>
