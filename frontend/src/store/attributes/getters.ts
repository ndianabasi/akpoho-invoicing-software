import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AttributeStateInterface } from './state';
import { computed } from 'vue';
import {
  AttributeOption,
  FormSchemaProperties,
  InputComponentType,
} from '../types';

export type AttributeGetterInterface = GetterTree<
  AttributeStateInterface,
  StateInterface
>;

const getters: AttributeGetterInterface = {
  GET_ATTRIBUTE_SETS_FOR_SELECT: (state: AttributeStateInterface) =>
    state.attributeSetsForSelect,

  GET_ATTRIBUTE_SET_DATA: (state: AttributeStateInterface) =>
    state.attributeSetData,

  GET_DEFAULT_ATTRIBUTES_SCHEMA: (state: AttributeStateInterface) => {
    const attributeSetData = state.attributeSetData;
    const collector: Array<FormSchemaProperties> = [];

    const defaultGroup =
      attributeSetData?.attributeGroups?.filter(
        (group) => group.name === 'Default'
      )?.[0] ?? null;

    if (defaultGroup) {
      defaultGroup.attributes.forEach((attribute) => {
        const fieldType = attribute.fieldInputType.name;

        collector.push({
          name: attribute.attribute_code,
          label: attribute.name,
          default: '',
          componentType: computed(() => {
            const fieldType = attribute.fieldInputType.name;
            let type: InputComponentType = 'none';
            switch (fieldType) {
              case 'Text Field':
              case 'Text Area':
              case 'Image':
              case 'Price':
                type = 'input';
                break;
              case 'Text Editor':
                type = 'editor';
                break;
              case 'Date':
              case 'Date and Time':
                type = 'date';
                break;
              case 'Multi-select':
              case 'Select':
                type = 'select';
                break;
              case 'Toggle':
                type = 'toggle';
                break;

              default:
                break;
            }
            return type;
          }).value,

          inputType: computed(() => {
            let type = '';
            switch (fieldType) {
              case 'Text Field':
                type = 'text';
                break;
              case 'Text Area':
                type = 'textarea';
                break;
              case 'Text Editor':
                type = 'editor';
                break;
              case 'Image':
                type = 'file';
                break;
              case 'Price':
                type = 'number';
                break;
              case 'Date':
                type = 'date';
                break;
              case 'Date and Time':
                break;
              case 'Multi-select':
                type = 'single';
                break;
              case 'Select':
                type = 'multiple';
                break;
              case 'Toggle':
                type = 'toggle';
                break;

              default:
                break;
            }
            return type;
          }).value,

          isVisible: true,
          model: '',
          options: computed(() => {
            let options: Array<AttributeOption> = [];
            switch (fieldType) {
              case 'Multi-select':
              case 'Select':
              case 'Toggle':
                options = attribute.options;
                break;

              default:
                break;
            }

            return options.map((option) => ({
              label: option.name,
              value: option.id,
            }));
          }).value,
        });
      });
    }

    return collector;
  },
};

export default getters;
