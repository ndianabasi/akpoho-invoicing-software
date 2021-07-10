import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InvoiceQuotationItem from 'App/Models/InvoiceQuotationItem'
import UnitOfMeasurement from 'App/Models/UnitOfMeasurement'
import QuotationValidator from 'App/Validators/QuotationValidator'
import isUUID from 'validator/lib/isUUID'

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
      showDiscounts,
      discountType,
      setDiscountTypePerLine,
      calculateTotals,
      changeProductPrices,
      numberOfDecimals,
      useThousandSeparator,
      thousandSeparatorType,
      notes,
      //theme,
      showAdditionalSubtotalDiscount,
      additionalDiscountType,
      additionalDiscountAmount,
      showAdditionalFees,
      showImages,
    } = await request.validate(QuotationValidator)

    if (requestedCompany) {
      await bouncer.with('InvoiceQuotationPolicy').authorize('createQuotation')

      const newQuotation = await requestedCompany?.related('quotations').create({
        additionalFees,
        date,
        code,
        customerId,
        customerBillingAddress: customerBillingAddressId,
        customerShippingAddress: customerShippingAddressId,
        introduction,
        title,
        simpleQuantities,
        amountsAreTaxInclusive,
        taxPercentage,
        roundAmounts,
        roundAmountType,
        showDiscounts,
        discountType,
        setDiscountTypePerLine,
        calculateTotals,
        changeProductPrices,
        numberOfDecimals,
        useThousandSeparator,
        thousandSeparatorType,
        notes,
        showAdditionalSubtotalDiscount,
        additionalDiscountType,
        additionalDiscountAmount,
        showAdditionalFees,
        showImages,
        type: 'quotation',
      })

      const preparedItems: Array<Record<string, unknown>> = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const itemCollector: Record<string, unknown> = {}

        // 1. test if product id is a UUID
        const isId = isUUID(item.productId, 5)
        if (isId) itemCollector.productId = item.productId
        else itemCollector.productName = item.productId

        // 2. Get other fields
        itemCollector.description = item.description
        itemCollector.qty = item.qty
        itemCollector.groupQty = item.groupQty
        itemCollector.unitPrice = item.unitPrice
        itemCollector.unitDiscount = item.unitDiscount
        itemCollector.discountType = item.discountType

        // 3. Get `unitOfMeasurementId`
        const uom = await UnitOfMeasurement.findBy('name', item.UOM)
        itemCollector.unitOfMeasurementId = uom?.id
        // 4. Get `collectionTypeId`
        const colType = await UnitOfMeasurement.findBy('name', item.collectionTypeId)
        itemCollector.collectionTypeId = colType?.id

        itemCollector.invoicesQuotationsId = newQuotation.id

        preparedItems.push(itemCollector)
      }

      //await newQuotation.related('items').createMany(preparedItems)
      // fix issue with foreign key (`ER_NO_REFERENCED_ROW_2`) with the statement below
      await InvoiceQuotationItem.createMany(preparedItems)

      return response.created({ data: newQuotation?.id })
    } else return response.abort({ message: 'Company not found' })
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
