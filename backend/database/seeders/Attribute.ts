import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import attributes from '../data/attributes'
import Attribute from 'App/Models/Attribute'
import slugify from 'slugify'
import FieldInputType from 'App/Models/FieldInputType'
import FieldInputValidationType from 'App/Models/FieldInputValidationType'
import AttributeOption from 'App/Models/AttributeOption'

export default class AttributeSeeder extends BaseSeeder {
  public async run() {
    for (let index = 0; index < attributes.length; index++) {
      const attribute = attributes[index]

      const attributeModel = await Attribute.updateOrCreate(
        { name: attribute['Name'] },
        {
          attributeCode: slugify(attribute['Name'], {
            replacement: '_',
            lower: true,
            strict: true,
          }),

          fieldInputTypeId:
            (await this.fieldInputTypes())?.filter(
              (type) => type.name === attribute['inputType']
            )?.[0]?.id ?? null,

          fieldInputValidationTypeId:
            (await this.fieldInputValidationTypes())?.filter(
              (type) => type.name === attribute['inputValidation']
            )?.[0]?.id ?? null,

          isSystemAttribute: attribute['System'] === 'Yes',

          visibility: attribute['Visible'] === 'Yes',

          useForProductSearch: attribute['Searchable'] === 'Yes',

          useForLayeredNavigation: attribute['Use in Layered Navigation'] === 'Yes',

          comparable: attribute['Comparable'] === 'Yes',
        }
      )

      // Associate attribute with attribute options
      if (attribute['options']) {
        await attributeModel.related('options').detach()
        for (let i = 0; i < attribute['options'].length; i++) {
          const option = attribute['options'][i]
          const optionModel = await AttributeOption.firstOrCreate({ name: option })

          await attributeModel
            .related('options')
            .attach({ [optionModel.id]: { sort_order: i + 1 } })
        }
      }
    }
  }

  private async fieldInputTypes() {
    const inputTypes = await FieldInputType.all()
    return inputTypes.map((type) => type.serialize())
  }

  private async fieldInputValidationTypes() {
    const inputValidationTypes = await FieldInputValidationType.all()
    return inputValidationTypes.map((type) => type.serialize())
  }
}
