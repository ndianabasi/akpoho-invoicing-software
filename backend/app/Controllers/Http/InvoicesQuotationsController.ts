import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import QuotationValidator from 'App/Validators/QuotationValidator'

export default class QuotationsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({ response, request, bouncer, requestedCompany }: HttpContextContract) {
    const {
      items,
      additionalFees,
      date,
      code,
      customerId,
      customerBillingAddressId,
      customerShippingAddressId,
      introduction,
      title,
      simpleQuantities,
      amountsAreTaxInclusive,
      taxPercentage,
      roundAmounts,
      roundAmountType,
      showDiscount,
      discountType,
      setDiscountTypePerLine,
      calculateTotals,
      changeProductPrices,
      numberOfDecimals,
      useThousandSeparator,
      thousandSeparatorType,
      notes,
      theme,
      showAdditionalSubtotalDiscount,
      additionalDiscountType,
      additionalDiscountAmount,
      showAdditionalFees,
      showImages,
    } = await request.validate(QuotationValidator)

    /* if (requestedCompany) {
      await bouncer.with('ProductPolicy').authorize('create')

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
    } else return response.abort({ message: 'Company not found' }) */
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
