import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import productTypes from '../data/product_types'
import ProductType from 'App/Models/ProductType'

export default class ProductTypeSeeder extends BaseSeeder {
  public async run() {
    for (let index = 0; index < productTypes.length; index++) {
      const productType = productTypes[index]

      await ProductType.updateOrCreate(
        { name: productType },
        {
          name: productType,
          sortOrder: index + 1,
        }
      )
    }
  }
}
