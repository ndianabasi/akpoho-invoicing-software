import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AttributeStateInterface } from './state';
import { computed } from 'vue';
import {
  AttributeGroupsCollection,
  AttributeOption,
  AttributeSetData,
  FormSchemaProperties,
  InputComponentType,
  SelectOption,
} from '../types';

type AttributeGetters = {
  [K in keyof AttributesGettersInterface]: ReturnType<
    AttributesGettersInterface[K]
  >;
};

export interface AttributesGettersInterface
  extends GetterTree<AttributeStateInterface, StateInterface> {
  readonly GET_ATTRIBUTE_SETS_FOR_SELECT: (
    state: AttributeStateInterface
  ) => Array<SelectOption>;

  readonly GET_ATTRIBUTE_SET_DATA: (
    state: AttributeStateInterface
  ) => AttributeSetData | null;

  readonly GET_ATTRIBUTE_GROUPS_SCHEMA: (
    state: AttributeStateInterface,
    getters: AttributeGetters,
    rootState: StateInterface,
    rootGetters: Record<string, unknown>
  ) => AttributeGroupsCollection | null;

  readonly GET_DEFAULT_ATTRIBUTES_SCHEMA: (
    state: AttributeStateInterface,
    getters: AttributeGetters
  ) => Array<FormSchemaProperties>;
}

const getters: AttributesGettersInterface = {
  GET_ATTRIBUTE_SETS_FOR_SELECT: (state: AttributeStateInterface) =>
    state.attributeSetsForSelect,

  GET_ATTRIBUTE_SET_DATA: (state: AttributeStateInterface) =>
    state.attributeSetData,

  GET_ATTRIBUTE_GROUPS_SCHEMA: (
    state: AttributeStateInterface,
    getters,
    rootState,
    rootGetters
  ) => {
    const attributeSetData = state.attributeSetData;
    const countries = rootGetters[
      'countries_states/GET_COUNTRIES_FOR_SELECT'
    ] as SelectOption[];

    if (!attributeSetData) return null;
    else {
      const attributeGroupsCollector: AttributeGroupsCollection = {};

      const attributeGroups = attributeSetData.attributeGroups;

      attributeGroups.forEach((group) => {
        const groupName = group.name;
        const groupAttributeCollector: Array<FormSchemaProperties> = [];

        group.attributes
          .filter((attribute) => Boolean(attribute.visibility))
          .forEach((attribute) => {
            const fieldType = attribute.fieldInputType.name;

            groupAttributeCollector.push({
              name: attribute.attribute_code,
              label: attribute.name,
              default: '',
              model: '',
              componentType: computed(() => {
                const fieldType = attribute.fieldInputType.name;
                let type: InputComponentType = 'none';
                switch (fieldType) {
                  case 'Text Field':
                  case 'Text Area':
                  case 'Image':
                  case 'Price':
                  case 'Number':
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
                    type = 'input';
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
                  case 'Number':
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
                    type = 'text';
                    break;
                }
                return type;
              }).value,

              isVisible: true,
              options: computed(() => {
                const attributeCode = attribute.attribute_code;
                let options: Array<AttributeOption> | null = [];
                switch (fieldType) {
                  case 'Multi-select':
                  case 'Select':
                  case 'Toggle':
                    options = attribute.options;
                    break;

                  default:
                    options = null;
                    break;
                }

                let attributeOptions: SelectOption[] = [];

                switch (attributeCode) {
                  case 'country_of_manufacture':
                    attributeOptions = countries;
                }

                return attributeOptions && attributeOptions.length
                  ? attributeOptions
                  : options
                  ? options.map((option) => ({
                      label: option.name,
                      value: option.id,
                    }))
                  : null;
              }).value,

              required: Boolean(attribute.required),
            });
          });

        attributeGroupsCollector[groupName] = groupAttributeCollector;
      });

      return attributeGroupsCollector;
    }
  },

  GET_DEFAULT_ATTRIBUTES_SCHEMA: (
    state: AttributeStateInterface,
    getters: AttributeGetters
  ) => {
    const attributeGroupsCollector = getters.GET_ATTRIBUTE_GROUPS_SCHEMA;

    return attributeGroupsCollector ? attributeGroupsCollector['Default'] : [];
  },
};

export default getters;
