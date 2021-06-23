<!-- eslint-disable vue/v-slot-style -->
<template>
  <auth-form>
    <template
      v-if="!showEmailVerificationError && !validationInProgresss"
      #formTitle
      >Email Verification</template
    >

    <template #formSection>
      <div
        v-if="validationInProgresss"
        class="q-gutter-md column flex-center"
        style="font-size: 5rem"
      >
        <q-spinner-oval color="warning" />
        <p class="text-center text-warning" style="font-size: 1rem">
          Verification in progress
        </p>
      </div>
      <q-banner
        v-if="!validationInProgresss"
        rounded
        :class="[
          'bg-light-solid',
          showEmailVerificationSuccess
            ? 'text-positive'
            : showEmailVerificationError
            ? 'text-negative'
            : '',
        ]"
      >
        <span v-if="showEmailVerificationSuccess">{{ responseMessage }}</span>
        <span v-if="showEmailVerificationError">{{ responseMessage }}</span>

        <template v-slot:action>
          <q-btn
            color="primary"
            flat
            label="Go to dashboard"
            :to="{ name: 'Dashboard' }"
          />
        </template>
      </q-banner>
    </template>

    <template v-if="!validationInProgresss" #formFooterLink>
      <span>
        <router-link :to="{ name: 'Register' }">Register</router-link>
        /
        <router-link :to="{ name: 'Login' }">Login instead? </router-link>
        /
        <a jref="#">Need support? </a>
      </span>
    </template>
  </auth-form>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-misused-promises */
import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import AuthForm from '../../components/AuthForm.vue';

export default defineComponent({
  name: 'VerifyNewAccountEmail',

  components: { AuthForm },

  props: {
    verificationKey: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const submitting = ref(false);
    const showEmailVerificationError = ref(false);
    const showEmailVerificationSuccess = ref(false);
    const validationInProgresss = ref(true);
    const responseMessage = ref('');

    const store = useStore();

    const validateVerificationKey = async (key: string) => {
      console.log(key);

      await store
        .dispatch('auth/NEW_ACCOUNT_EMAIL_VERIFICATION', key)
        .then((message: string) => {
          console.log(message);

          responseMessage.value = message;
          validationInProgresss.value = false;
          showEmailVerificationSuccess.value = true;
          return;
        })
        .catch((message: string) => {
          console.log(message);

          responseMessage.value = message;
          validationInProgresss.value = false;
          showEmailVerificationError.value = true;
          return;
        });
    };

    onMounted(() => {
      setTimeout(async () => {
        await validateVerificationKey(props.verificationKey);
      }, 1000);
    });

    return {
      dismissed: ref(false),
      submitting,
      showEmailVerificationError,
      validationInProgresss,
      responseMessage,
      showEmailVerificationSuccess,
    };
  },
});
</script>

<style lang="scss" scoped></style>
