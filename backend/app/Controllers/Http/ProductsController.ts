import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product, { PRODUCT_STOCK_STATUS_TYPES } from 'App/Models/Product'
import ProductValidator from 'App/Validators/ProductValidator'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ProductsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({ response, request, bouncer, requestedCompany }: HttpContextContract) {
    const {
      productTypeId,
      productName,
      sku,
      price,
      weight,
      countryOfManufacture,
      isEnabled,
      productHasWeight,
      stockStatus,
      description,
      shortDescription,
    } = await request.validate(ProductValidator)

    if (requestedCompany) {
      await bouncer.with('ProductPolicy').authorize('create', requestedCompany)

      let newProduct: Product | null = null
      await Database.transaction(async (trx) => {
        requestedCompany.useTransaction(trx)
        newProduct = await requestedCompany?.related('products').create(
          {
            productTypeId,
            name: productName,
            sku,
            price,
            weight,
            countryOfManufacture,
            isEnabled,
            productHasWeight,
            stockStatus: stockStatus as PRODUCT_STOCK_STATUS_TYPES,
            description,
            shortDescription,
          },
          { ownership: 'owner' }
        )

        // TODO: implement products/company_product cache/clearing of cache

        return response.created({ data: newProduct?.id })
      })
    } else return response.abort({ message: 'Company not found' })
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
