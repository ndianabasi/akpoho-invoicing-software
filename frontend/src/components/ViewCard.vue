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
            <q-item>
              <q-item-section avatar>
                <q-avatar v-if="showAvatar && titleInfo">
                  <img v-if="titleInfo.avatar" :src="titleInfo.avatar" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label v-if="titleInfo" class="text-h6">{{
                  titleInfo.title
                }}</q-item-label>
              </q-item-section>

              <q-item-section v-if="showTitlePanelSide" side>
                <slot name="title-panel-side"></slot>
                <template
                  v-if="useTitlePanelMenu && !!titlePanelMenuData.length"
                >
                  <SnackMenu :menu-data="titlePanelMenuData" />
                </template>
              </q-item-section>
            </q-item>
          </slot>

          <q-separator v-if="showSeparator" />

          <q-card-section>
            <div style="min-height: 30vh">
              <slot name="body-panel"></slot>
            </div>
          </q-card-section>
          <q-card-section>
            <slot name="footer-panel"></slot>
          </q-card-section>
        </q-card>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { TitleInfo, TitlePanelMenuData } from '../store/types';
import SnackMenu from './SnackMenu';

export default defineComponent({
  name: 'ViewCard',

  components: { SnackMenu },

  props: {
    showSeparator: {
      type: Boolean,
      default: true,
    },

    showAvatar: {
      type: Boolean,
      default: false,
    },

    useTitlePanelMenu: {
      type: Boolean,
      default: false,
    },

    titlePanelMenuData: {
      type: Array as PropType<Array<TitlePanelMenuData>>,
      required: false,
      default: () => [],
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
      default: () => 'col-md-9 col-sm-12 col-xs-12 col-lg-8 col-xl-8',
    },

    titleInfo: {
      type: Object as PropType<TitleInfo>,
      required: false,
      default: () => ({ title: '', avatar: '' }),
      validator: (value: TitleInfo) => {
        return ['title', 'avatar'].every((prop) =>
          Object.prototype.hasOwnProperty.call(value, prop)
        );
      },
    },
  },

  setup() {
    return {};
  },
});
</script>
