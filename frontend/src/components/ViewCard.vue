<template>
  <div class="row justify-center" style="min-height: 50vh">
    <div :class="cardContainerClasses">
      <q-inner-loading :showing="loading">
        <q-spinner-oval size="100px" color="accent" />
      </q-inner-loading>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <q-card v-if="!loading" flat bordered>
          <slot v-if="showTitlePanel" name="title-panel">
            <q-item v-if="titleInfo">
              <q-item-section v-if="showAvatar" avatar>
                <q-avatar>
                  <img v-if="titleInfo.avatar" :src="titleInfo.avatar" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-h6">{{
                  titleInfo.title
                }}</q-item-label>
              </q-item-section>

              <q-item-section v-if="showTitlePanelSide" side>
                <slot name="title-panel-side"></slot>
              </q-item-section>
            </q-item>
          </slot>

          <q-separator v-if="showSeparator" />

          <q-card-section>
            <div style="min-height: 50vh">
              <slot name="body-panel"></slot>
            </div>

            <slot name="footer-panel"></slot>
          </q-card-section>
        </q-card>
      </transition>
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

    loading: {
      type: Boolean,
      default: false,
      required: true,
    },

    showTitlePanelSide: {
      type: Boolean,
      default: false,
    },

    showTitlePanel: {
      type: Boolean,
      default: true,
    },

    cardContainerClasses: {
      type: [String, Array, Object],
      default: () => 'col-md-6 col-sm-12 col-xs-12',
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
});
</script>
