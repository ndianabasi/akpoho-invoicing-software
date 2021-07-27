import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { sanitiseHTML } from 'App/Helpers/utils'
import InvoiceQuotation from 'App/Models/InvoiceQuotation'
import UnitOfMeasurement from 'App/Models/UnitOfMeasurement'
import InvoiceQuotationServices from 'App/Services/InvoiceQuotationServices'
import PuppeteerServices from 'App/Services/PuppeteerServices'
import QuotationValidator from 'App/Validators/QuotationValidator'
import isUUID from 'validator/lib/isUUID'

export default class QuotationsController {
  public async index({ response, requestedCompany, request, bouncer }: HttpContextContract) {
    await bouncer.with('InvoiceQuotationPolicy').authorize('list')

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
      date,
      show_discounts,
      created_at,
      updated_at,
      type,
    } = request.qs()

    const searchQuery = {
      id: id ? id : null,
      title: title ? title : null,
      date: date ? date : null,
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
        'invoices_quotations.type',
        'invoices_quotations.date',
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
      .select(
        Database.rawQuery(
          "COALESCE(customers.company_name, CONCAT(customers.first_name, ' ', customers.last_name)) AS customer"
        )
      )
      .where('invoices_quotations.company_id', requestedCompany?.id ?? '')
      .where({ type })
      .leftJoin('customers', (query) =>
        query.on('customers.id', '=', 'invoices_quotations.customer_id')
      )

    if (sortBy) {
      subquery = subquery?.orderBy(sortBy, descending === 'true' ? 'desc' : 'asc')
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

  public async store({ response, request, bouncer, requestedCompany }: HttpContextContract) {
    if (requestedCompany) {
      await bouncer.with('InvoiceQuotationPolicy').authorize('create')

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
        useCustomSerialNumbers,
        useEditor,
      } = await request.validate(QuotationValidator)

      const { type: documentType } = request.qs()

      const newQuotation = await requestedCompany?.related('quotations').create({
        additionalFees,
        date,
        code,
        customerId,
        customerBillingAddress: customerBillingAddressId,
        customerShippingAddress: customerShippingAddressId,
        introduction: sanitiseHTML(introduction),
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
        notes: sanitiseHTML(notes),
        showAdditionalSubtotalDiscount,
        additionalDiscountType,
        additionalDiscountAmount,
        showAdditionalFees,
        showImages,
        type: documentType,
        useCustomSerialNumbers,
        useEditor,
      })

      const preparedItems: Array<Record<string, unknown>> = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const itemCollector: Record<string, unknown> = {}

        // 1. test if product id is a UUID
        const isId = isUUID(item?.productId ?? '', 5)
        itemCollector.productId = isId ? item.productId : null
        itemCollector.productName = isId ? null : sanitiseHTML(item?.productName)

        // 2. Get other fields
        itemCollector.description = item.description
        itemCollector.sortOrder = i + 1
        itemCollector.qty = item.qty
        itemCollector.groupQty = item.groupQty
        itemCollector.unitPrice = item.unitPrice
        itemCollector.unitDiscount = item.unitDiscount
        itemCollector.discountType = item.discountType
        itemCollector.customSerialNumber = item.customSerialNumber

        // 3. Get `unitOfMeasurementId`
        const uom = await UnitOfMeasurement.findBy('name', item.UOM)
        itemCollector.unitOfMeasurementId = uom?.id
        // 4. Get `collectionTypeId`
        const colType = await UnitOfMeasurement.findBy('name', item.collectionTypeId)
        itemCollector.collectionTypeId = colType?.id

        preparedItems.push(itemCollector)
      }

      await newQuotation.related('items').createMany(preparedItems)

      await new InvoiceQuotationServices({
        invoiceQuotationModel: newQuotation,
      }).clearCache()

      return response.created({ data: newQuotation?.id })
    } else return response.abort({ message: 'Company not found' })
  }

  public async show({
    response,
    requestedInvoiceQuotation,
    requestedCompany,
    bouncer,
  }: HttpContextContract) {
    // Check authorisation
    await bouncer
      .with('InvoiceQuotationPolicy')
      .authorize('view', requestedInvoiceQuotation!, requestedCompany!)

    const invoiceQuotationDetails = await new InvoiceQuotationServices({
      invoiceQuotationModel: requestedInvoiceQuotation,
    }).getInvoiceQuotationFullDetails()

    return response.ok({ data: invoiceQuotationDetails })
  }

  public async update({
    response,
    request,
    bouncer,
    requestedCompany,
    requestedInvoiceQuotation,
  }: HttpContextContract) {
    if (requestedCompany) {
      await bouncer
        .with('InvoiceQuotationPolicy')
        .authorize('edit', requestedInvoiceQuotation, requestedCompany!)

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
        useCustomSerialNumbers,
        useEditor,
      } = await request.validate(QuotationValidator)

      // 1. Update Quotation/Invoice details
      requestedInvoiceQuotation.merge({
        // Stringify `additionalFees` since the query is not directly
        // done on the InvoiceQuotation model
        additionalFees,
        date,
        code,
        customerId,
        customerBillingAddress: customerBillingAddressId,
        customerShippingAddress: customerShippingAddressId,
        introduction: sanitiseHTML(introduction),
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
        notes: sanitiseHTML(notes),
        showAdditionalSubtotalDiscount,
        additionalDiscountType,
        additionalDiscountAmount,
        showAdditionalFees,
        showImages,
        useCustomSerialNumbers,
        useEditor,
      })

      await requestedInvoiceQuotation.save()
      await requestedInvoiceQuotation.refresh()

      // 2. Get and drop any previous items owed by the Invoice/Quotation
      await requestedInvoiceQuotation.related('items').query().delete()

      // 3. Then create new items for the Invoice/Quotation
      const preparedItems: Array<Record<string, unknown>> = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const itemCollector: Record<string, unknown> = {}

        // 1. test if product id is a UUID
        const isId = isUUID(item?.productId ?? '', 5)
        itemCollector.productId = isId ? item.productId : null
        itemCollector.productName = isId ? null : sanitiseHTML(item?.productName)

        // 2. Get other fields
        itemCollector.description = item.description
        itemCollector.sortOrder = i + 1
        itemCollector.qty = item.qty
        itemCollector.groupQty = item.groupQty
        itemCollector.unitPrice = item.unitPrice
        itemCollector.unitDiscount = item.unitDiscount
        itemCollector.discountType = item.discountType
        itemCollector.customSerialNumber = item.customSerialNumber

        // 3. Get `unitOfMeasurementId`
        const uom = await UnitOfMeasurement.findBy('name', item.UOM)
        itemCollector.unitOfMeasurementId = uom?.id
        // 4. Get `collectionTypeId`
        const colType = await UnitOfMeasurement.findBy('name', item.collectionTypeId)
        itemCollector.collectionTypeId = colType?.id

        preparedItems.push(itemCollector)
      }

      await requestedInvoiceQuotation.related('items').createMany(preparedItems)

      await new InvoiceQuotationServices({
        invoiceQuotationModel: requestedInvoiceQuotation,
      }).clearCache()

      return response.created({ data: requestedInvoiceQuotation?.id })
    } else return response.abort({ message: 'Company not found' })
  }

  public async destroy({
    requestedInvoiceQuotation,
    response,
    requestedCompany,
    bouncer,
  }: HttpContextContract) {
    await bouncer
      .with('InvoiceQuotationPolicy')
      .authorize('delete', requestedInvoiceQuotation!, requestedCompany!)

    const type = requestedInvoiceQuotation.type

    await requestedInvoiceQuotation.delete()

    return response.created({
      message: `${type === 'invoice' ? 'Invoice' : 'Quotation'} was deleted!`,
      data: requestedInvoiceQuotation.id,
    })
  }

  public async download({
    requestedInvoiceQuotation,
    requestedCompany,
    bouncer,
  }: HttpContextContract) {
    // Check authorisation
    await bouncer
      .with('InvoiceQuotationPolicy')
      .authorize('view', requestedInvoiceQuotation!, requestedCompany!)

    const requestUrl = `print-pages/invoices-quotations/${requestedInvoiceQuotation.id}/${requestedInvoiceQuotation.type}`

    await new PuppeteerServices(requestUrl, {
      paperFormat: 'a3',
      fileName: `${requestedInvoiceQuotation.type}_${requestedInvoiceQuotation.id}`,
    })
      .printAsPDF()
      .catch((error) => console.error(error))
  }

  public async print({ params, response }: HttpContextContract) {
    // Get invoice/quotation id and type from params
    const { invoice_quotation_id, type } = params

    const invoiceQuotationDetails = await new InvoiceQuotationServices({
      id: invoice_quotation_id,
      type,
    }).getInvoiceQuotationFullDetails()

    return response.ok({ data: invoiceQuotationDetails })
  }
}
