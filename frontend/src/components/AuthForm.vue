<!-- eslint-disable vue/v-slot-style -->
<template>
  <q-card class="container row flex-center">
    <div class="col-md-6 col-sm-8 col-xs-12 col-lg-4 col-xl-3">
      <q-card class="login-card text-white q-pa-lg q-mx-sm-md q-mx-xs-sm">
        <q-card-section>
          <p class="form-logo">Akpoho Invoicing Software</p>
          <span class="form-title q-mb-md q-pb-md">
            <slot name="formTitle"></slot>
          </span>
          <slot
            name="formSection"
            v-bind="{ isSmallScreen: isSmallScreen }"
          ></slot>

          <slot
            name="submitSection"
            v-bind="{ isSmallScreen: isSmallScreen }"
          ></slot>

          <div class="text-center q-py-lg text-white form-footer">
            <slot name="formFooter"></slot>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-card>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useQuasar } from 'quasar';
//const strongPassword = helpers.regex('strongPassword', //)

export default defineComponent({
  name: 'AuthForm',
  components: {},
  setup() {
    const $q = useQuasar();

    const isSmallScreen = computed(() => {
      return $q.screen.lt.sm;
    });

    return {
      isSmallScreen,
    };
  },
});
</script>

<style lang="scss" scoped>
.form-logo {
  font-size: 2rem;
  color: $purple-10;
  display: flex;
  text-align: center;
  display: block;
  text-transform: uppercase;
  margin: 10px auto;
}

.form-title {
  font-size: 1.2rem;
  color: $grey-10;
  line-height: 1.2;
  text-align: center;
  display: block;
}

.login-card {
  background-color: $grey-1;
}

.q-card.container {
  width: 100vw;
  height: 100vh;
  background-color: $purple-2;
}
</style>

<style lang="sass" scoped>
@media (max-width: $breakpoint-xs-max)
  .form-logo
    font-size: 1.4rem
  .form-title
    font-size: 1rem
</style>

<style lang="scss">
.form-footer {
  color: $grey-10;
  a {
    text-decoration: none;
    &:hover {
      border-bottom: 1px dotted $purple-10;
      padding-bottom: 2px;
    }
  }
}
</style>
