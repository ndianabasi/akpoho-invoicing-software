import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InvoiceQuotation from 'App/Models/InvoiceQuotation'
import InvoiceQuotationItem from 'App/Models/InvoiceQuotationItem'
import UnitOfMeasurement from 'App/Models/UnitOfMeasurement'
import QuotationValidator from 'App/Validators/QuotationValidator'
import isUUID from 'validator/lib/isUUID'

export default class QuotationsController {
  public async index({ response, requestedCompany, request, bouncer }: HttpContextContract) {
    await bouncer.with('CustomerPolicy').authorize('list', requestedCompany!)

    const {
      page,
      descending,
      perPage,
      sortBy,
      id,
      title,
      customer,
      tax_percentage,
      simple_quantities,
      show_discounts,
      created_at,
      updated_at,
      type,
    } = request.qs()

    const searchQuery = {
      id: id ? id : null,
      title: title ? title : null,
      customer: customer ? customer : null,
      tax_percentage: tax_percentage ? tax_percentage : null,
      simple_quantities: simple_quantities ? simple_quantities : null,
      show_discounts: show_discounts ? show_discounts : null,
      created_at: created_at ? created_at : null,
      updated_at: updated_at ? updated_at : null,
    }

    let subquery = InvoiceQuotation.query()
      .select(
        'invoices_quotations.id',
        'invoices_quotations.title',
        'invoices_quotations.tax_percentage',
        'invoices_quotations.simple_quantities',
        'invoices_quotations.show_discounts',
        'invoices_quotations.created_at',
        'invoices_quotations.updated_at',
        'customers.is_corporate',
        'customers.first_name',
        'customers.last_name',
        'customers.corporate_has_rep',
        'customers.company_name',
        'customers.company_phone'
      )
      .where('invoices_quotations.company_id', requestedCompany?.id ?? '')
      .where({ type })
      .leftJoin('customers', (query) =>
        query.on('customers.id', '=', 'invoices_quotations.customer_id')
      )

    if (sortBy) {
      if (sortBy === 'customer') {
        subquery = subquery
          ?.orderBy('customers.first_name', descending === 'true' ? 'desc' : 'asc')
          .orderBy('customers.company_name ', descending === 'true' ? 'desc' : 'asc')
      } else subquery = subquery?.orderBy(sortBy, descending === 'true' ? 'desc' : 'asc')
    }

    if (searchQuery) {
      subquery?.where((query) => {
        for (const param in searchQuery) {
          if (Object.prototype.hasOwnProperty.call(searchQuery, param)) {
            let value = searchQuery[param]
            if (value) {
              if (value === 'true') value = true
              if (value === 'false') value = false

              if (param === 'customer') {
                query
                  .where('customers.first_name', '=', `%${value}%`)
                  .orWhere('customers.last_name', '=', `%${value}%`)
                  .orWhere('customers.company_name', '=', `%${value}%`)
              } else {
                query.where(`invoices_quotations.${param}`, value)
                if (typeof value === 'string') {
                  query.orWhere(`invoices_quotations.${param}`, 'like', `%${value}%`)
                }
              }
            }
          }
        }
      })
    }

    const quotations = await await subquery?.paginate(page ? page : 1, perPage ? perPage : 20)

    return response.ok({ data: quotations })
  }

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
