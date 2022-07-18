import Factory from '@ioc:Adonis/Lucid/Factory'
import Country from 'App/Models/Country'
import Product, {
  PRODUCT_STOCK_STATUS_OPTIONS,
  PRODUCT_STOCK_STATUS_TYPES,
} from 'App/Models/Product'
import ProductType from 'App/Models/ProductType'

const ProductFactory = Factory.define(Product, async ({ faker }) => {
  // Get a simple product type
  const simpleProduct = await ProductType.findBy('name', 'Simple Product')
  // Get array of country ids
  const countryIds = (await Country.all()).map((country) => country.id)
  const productHasWeight = faker.datatype.boolean()

  const generatedProduct = {
    productTypeId: simpleProduct?.id ?? '',
    name: faker.commerce.productName(),
    sku: `${faker.random.alpha({ casing: 'upper', count: 4 })}-${faker.datatype.number({
      max: 9999,
      min: 1234,
    })}`,
    price: Number(faker.commerce.price(100, 99999, 2)),
    weight: productHasWeight
      ? faker.datatype.number({
          max: 200,
          min: 1,
        })
      : 0,
    countryOfManufacture: faker.helpers.arrayElement(countryIds),
    isEnabled: true,
    productHasWeight,
    stockStatus: faker.helpers.arrayElement(
      PRODUCT_STOCK_STATUS_OPTIONS
    ) as PRODUCT_STOCK_STATUS_TYPES,
    description: faker.commerce.productDescription(),
    shortDescription: faker.lorem.sentences(2),
  }

  return generatedProduct
}).build()

export default ProductFactory
