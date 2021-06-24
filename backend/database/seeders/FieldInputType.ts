import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import fieldInputTypes from '../data/field_input_types'
import FieldInputType from 'App/Models/FieldInputType'
import slugify from 'slugify'

export default class FieldInputTypeSeeder extends BaseSeeder {
  public async run() {
    for (let index = 0; index < fieldInputTypes.length; index++) {
      const field = fieldInputTypes[index]

      await FieldInputType.firstOrCreate({
        name: field,
        code: slugify(field, { replacement: '_', lower: true, strict: true }),
      })
    }
  }
}
