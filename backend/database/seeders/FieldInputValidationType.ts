import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import fieldInputValidationTypes from '../data/field_input_validation_types'
import FieldInputValidationType from 'App/Models/FieldInputValidationType'
import slugify from 'slugify'

export default class FieldInputValidationTypeSeeder extends BaseSeeder {
  public async run() {
    for (let index = 0; index < fieldInputValidationTypes.length; index++) {
      const type = fieldInputValidationTypes[index]

      await FieldInputValidationType.firstOrCreate({
        name: type.name,
        code: slugify(type.name, { replacement: '_', lower: true, strict: true }),
        regex: type?.regex ?? '',
      })
    }
  }
}
