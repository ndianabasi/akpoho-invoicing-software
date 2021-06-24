import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import attributesAttributeGroups from '../data/attributes__attribute_groups'
import AttributeSet from 'App/Models/AttributeSet'
import Attribute from 'App/Models/Attribute'

export default class ProductTypeSeeder extends BaseSeeder {
  public async run() {
    for (let i = 0; i < attributesAttributeGroups.length; i++) {
      const group = attributesAttributeGroups[i]

      const attributeSet = await AttributeSet.findByOrFail('name', group.attributeSet)

      const attributeGroup = await attributeSet.related('attributeGroups').firstOrCreate(
        { name: group.groupName },
        {
          name: group.groupName,
          isSystem: group.isGroupSystem,
          sortOrder: group.sortOrder,
        }
      )

      await attributeGroup.related('attributes').detach()

      for (let j = 0; j < group.attributes.length; j++) {
        const attributeName = group.attributes[j]
        const attribute = await Attribute.findByOrFail('name', attributeName)

        await attributeGroup
          .related('attributes')
          .attach({ [attribute.id]: { sort_order: ++j, type: group.type } })
      }
    }
  }
}
