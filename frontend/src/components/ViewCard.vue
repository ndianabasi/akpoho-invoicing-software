<template>
  <div class="row justify-center">
    <div class="col-md-6 col-sm-12 col-xs-12">
      <q-card flat bordered>
        <slot v-if="showTitlePanel" name="title-panel">
          <q-item v-if="titleInfo">
            <q-item-section v-if="showAvatar" avatar>
              <q-avatar>
                <img v-if="titleInfo.avatar" :src="titleInfo.avatar" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-h6">{{ titleInfo.title }}</q-item-label>
            </q-item-section>

            <q-item-section v-if="showTitlePanelSide" side>
              <slot name="title-panel-side"></slot>
            </q-item-section>
          </q-item>
        </slot>

        <q-separator v-if="showSeparator" />

        <q-card-section>
          <slot name="body-panel"></slot>

          <slot name="footer-panel"></slot>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { TitleInfo } from '../store/types';

export default defineComponent({
  name: 'ViewCard',

  props: {
    showSeparator: {
      type: Boolean,
      default: true,
    },

    showAvatar: {
      type: Boolean,
      default: false,
    },

    showTitlePanelSide: {
      type: Boolean,
      default: false,
    },

    showTitlePanel: {
      type: Boolean,
      default: true,
    },

    titleInfo: {
      type: Object as PropType<TitleInfo>,
      required: false,
      default: () => ({ title: '', avatar: '' }),
      validator(value: TitleInfo) {
        return ['title', 'avatar'].every((prop) =>
          Object.prototype.hasOwnProperty.call(value, prop)
        );
      },
    },
  },

  setup(/* props */) {
    return {};
  },
});
</script>
