import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import attributes from '../data/attributes'
import Attribute from 'App/Models/Attribute'
import slugify from 'slugify'
import FieldInputType from 'App/Models/FieldInputType'
import FieldInputValidationType from 'App/Models/FieldInputValidationType'

export default class AttributeSeeder extends BaseSeeder {
  public async run() {
    for (let index = 0; index < attributes.length; index++) {
      const attribute = attributes[index]

      await Attribute.firstOrCreate({
        name: attribute['Name'],

        attributeCode: slugify(attribute['Name'], { replacement: '_', lower: true, strict: true }),

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
      })
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
