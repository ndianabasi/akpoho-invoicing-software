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
                  <q-btn round flat icon="more_vert">
                    <q-menu
                      auto-close
                      anchor="bottom right"
                      self="top end"
                      transition-show="flip-right"
                      transition-hide="flip-left"
                      class="title-panel-menu"
                    >
                      <q-list>
                        <q-item
                          v-for="{
                            label,
                            icon,
                            type,
                            action,
                            routeObject,
                          } in permittedTitlePanelMenuData"
                          :key="'title_panel_menu_item:' + snakeCase(label)"
                          v-ripple
                          :clickable="type === 'click-action'"
                          :to="
                            type === 'router-navigation' ? routeObject : void 0
                          "
                          @click.prevent="
                            type === 'click-action' ? action() : void 0
                          "
                        >
                          <q-item-section>
                            <q-btn flat round :icon="icon" />
                          </q-item-section>
                          <q-item-section>{{ label }}</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
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
import { defineComponent, PropType, computed } from 'vue';
import { TitleInfo, TitlePanelMenuData } from '../store/types';
import { snakeCase } from 'lodash';

export default defineComponent({
  name: 'ViewCard',

  components: {},

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

  setup(props) {
    const permittedTitlePanelMenuData = computed(() =>
      props.titlePanelMenuData.filter((item) => item.permitted)
    );

    return {
      snakeCase,
      permittedTitlePanelMenuData,
    };
  },
});
</script>
