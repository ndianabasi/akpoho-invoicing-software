<!-- eslint-disable vue/v-slot-style -->
<template>
  <auth-form>
    <template #formTitle>Reset your password</template>

    <template #formSection="{ isSmallScreen }">
      <form
        v-if="!showResetAlert"
        class="form validate-form"
        @submit.prevent="handleReset"
      >
        <q-input
          v-model="form.email"
          :dense="isSmallScreen"
          filled
          bottom-slots
          clearable
          type="email"
          aria-autocomplete="email"
          autocomplete="email"
          :error="form$.email.$invalid"
          label="Email"
          autofocus
        >
          <template v-slot:hint> </template>
          <template v-slot:error>
            {{
              form$.email.$silentErrors
                .map((error) => error.$message)
                .join(', ')
            }}
          </template>
        </q-input>
      </form>
      <q-banner v-else rounded class="bg-light-solid text-positive">
        A password reset email has been sent. Email could take a couple of
        minutes to be delivered. The reset link is only valid for 2 hours.

        <template v-slot:action>
          <q-btn
            color="primary"
            flat
            label="I didn't get the email"
            @click.prevent="showResetAlert = !showResetAlert"
          />
        </template>
      </q-banner>
    </template>

    <template #submitSection="{ isSmallScreen }">
      <q-btn
        v-if="!showResetAlert"
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

    <template #formFooterLink>
      <span>
        <router-link :to="{ name: 'Register' }">Register</router-link> /
        <router-link :to="{ name: 'Login' }">Login instead?</router-link>
      </span>
    </template>
  </auth-form>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-misused-promises */
import { defineComponent, reactive, ref, nextTick, Ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import { useStore } from 'vuex';
import { Notify } from 'quasar';
import AuthForm from '../../components/AuthForm.vue';
//const strongPassword = helpers.regex('strongPassword', //)

export default defineComponent({
  name: 'ForgotPasswordForm',
  components: { AuthForm },
  setup() {
    const submitting = ref(false);
    const showResetAlert = ref(false);

    const store = useStore();

    const form = reactive({
      email: '',
    });

    const rules = {
      email: {
        email: helpers.withMessage('Provide a valid email address.', email),
        required: helpers.withMessage('Email address is required.', required),
      },
    };

    const form$: Ref<{ $invalid: boolean }> = useVuelidate(rules, form);

    async function handleReset() {
      try {
        console.log('handling login');
        if (!form$.value.$invalid) {
          submitting.value = true;

          await nextTick(async () => {
            await store
              .dispatch('auth/REQUEST_PASSWORD_RESET', form)
              .then(() => {
                submitting.value = false;
                showResetAlert.value = true;
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

    return {
      dismissed: ref(false),
      submitting,
      form,
      handleReset,
      form$,
      showResetAlert,
    };
  },
});
</script>

<style lang="scss" scoped></style>
