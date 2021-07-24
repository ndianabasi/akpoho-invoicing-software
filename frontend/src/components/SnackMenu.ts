import { defineComponent, PropType, computed, h } from 'vue';
import { TitlePanelMenuData } from '../store/types';
import { snakeCase } from 'lodash';
import { QBtn, QMenu, QList, QItem, QItemSection } from 'quasar';

export default defineComponent({
  name: 'SnackMenu',
  props: {
    menuData: {
      type: Array as PropType<Array<TitlePanelMenuData>>,
      required: true,
    },
  },
  setup(props) {
    const permittedMenuData = computed(() =>
      props.menuData.filter((item) => item.permitted)
    );

    return {
      permittedMenuData,
      snakeCase,
    };
  },
  render() {
    return h(
      QBtn,
      { round: true, flat: true, icon: 'more_vert' },
      {
        default: () => [
          h(
            QMenu,
            {
              autoClose: true,
              anchor: 'bottom right',
              self: 'top end',
              transitionShow: 'flip-right',
              transitionHide: 'flip-left',
              class: 'title-panel-menu',
            },
            {
              default: () => [
                h(QList, null, {
                  default: () =>
                    this.permittedMenuData.map(
                      ({ label, icon, type, action, routeObject }) => {
                        return h(
                          QItem,
                          {
                            key: 'title_panel_menu_item:' + snakeCase(label),
                            vRipple: true,
                            clickable: true,
                            to:
                              type === 'router-navigation'
                                ? routeObject
                                : void 0,
                            onClick: (event: MouseEvent | TouchEvent) => {
                              event.preventDefault();
                              type === 'click-action' && action
                                ? action()
                                : void 0;
                            },
                          },
                          {
                            default: () => [
                              h(QItemSection, null, {
                                default: () => [
                                  h(QBtn, {
                                    flat: true,
                                    round: true,
                                    icon: icon,
                                  }),
                                ],
                              }),
                              h(QItemSection, null, { default: () => label }),
                            ],
                          }
                        );
                      }
                    ),
                }),
              ],
            }
          ),
        ],
      }
    );
  },
});
