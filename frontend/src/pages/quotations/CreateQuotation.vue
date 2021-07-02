<template>
  <q-page>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column" style="max-width: 300px">
        <q-toggle v-model="dense" label="Dense QInput" />

        <q-input v-model="text" filled :dense="dense" />

        <q-input
          v-model="text"
          filled
          label="Label (stacked)"
          stack-label
          :dense="dense"
        />

        <q-input v-model="text" filled label="Label" :dense="dense" />

        <q-input
          v-model="ph"
          filled
          label="Label"
          placeholder="Placeholder"
          hint="With placeholder"
          :dense="dense"
        />

        <q-input
          v-model="ph"
          filled
          placeholder="Placeholder"
          hint="With placeholder"
          :dense="dense"
        />

        <q-input
          v-model="text"
          filled
          square
          hint="With perfect square borders"
          :dense="dense"
        />

        <q-input v-model="text" filled :dense="dense">
          <template #prepend>
            <q-icon name="event" />
          </template>
        </q-input>

        <q-input v-model="text" filled :dense="dense">
          <template #append>
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
            </q-avatar>
          </template>
        </q-input>

        <q-input
          v-model="text"
          filled
          bottom-slots
          label="Label"
          counter
          :dense="dense"
        >
          <template #prepend>
            <q-icon name="place" />
          </template>
          <template #append>
            <q-icon name="close" class="cursor-pointer" @click="text = ''" />
          </template>

          <template #hint> Field hint </template>
        </q-input>

        <q-input
          v-model="text"
          filled
          bottom-slots
          label="Label"
          counter
          maxlength="12"
          :dense="dense"
        >
          <template #before>
            <q-icon name="flight_takeoff" />
          </template>

          <template #append>
            <q-icon
              v-if="text !== ''"
              name="close"
              class="cursor-pointer"
              @click="text = ''"
            />
            <q-icon name="search" />
          </template>

          <template #hint> Field hint </template>
        </q-input>

        <q-input
          v-model="text"
          filled
          bottom-slots
          label="Label"
          counter
          maxlength="12"
          :dense="dense"
        >
          <template #before>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
            </q-avatar>
          </template>

          <template #append>
            <q-icon
              v-if="text !== ''"
              name="close"
              class="cursor-pointer"
              @click="text = ''"
            />
            <q-icon name="schedule" />
          </template>

          <template #hint> Field hint </template>

          <template #after>
            <q-btn round dense flat icon="send" />
          </template>
        </q-input>

        <q-input
          v-model="text"
          filled
          bottom-slots
          label="Label"
          counter
          maxlength="12"
          :dense="dense"
        >
          <template #before>
            <q-icon name="event" />
          </template>

          <template #hint> Field hint </template>

          <template #append>
            <q-btn round dense flat icon="add" />
          </template>
        </q-input>

        <q-input v-model="text" filled hint="Disable" :dense="dense" disable />

        <q-input
          v-model="text"
          filled
          hint="Readonly"
          :dense="dense"
          readonly
        />

        <q-input
          v-model="text"
          filled
          hint="Disable and readonly"
          :dense="dense"
          disable
          readonly
        />
      </div>
    </div>
  </q-page>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'NewQuotation',

  setup() {
    return { text: ref(''), ph: ref(''), dense: ref(false) };
  },
});
</script>
