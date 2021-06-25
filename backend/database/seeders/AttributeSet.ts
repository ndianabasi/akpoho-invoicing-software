import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import attributeSets from '../data/attribute_sets'
import AttributeSet from 'App/Models/AttributeSet'

export default class AttributeSetSeeder extends BaseSeeder {
  public async run() {
    for (let index = 0; index < attributeSets.length; index++) {
      const set = attributeSets[index]

      await AttributeSet.updateOrCreate(
        { name: set.name },
        {
          name: set.name,
          isSystem: set.system,
          sortOrder: index + 1,
        }
      )
    }
  }
}
