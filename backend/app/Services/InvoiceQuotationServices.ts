'use strict'

import CacheHelper from 'App/Helpers/CacheHelper'
import { CACHE_TAGS } from 'Contracts/cache'
import InvoiceQuotation from 'App/Models/InvoiceQuotation'
import { InvoiceQuotationOptions } from './types/invoice_quotation_type'
import HttpContext from '@ioc:Adonis/Core/HttpContext'

export default class InvoiceQuotationServices {
  protected type: InvoiceQuotation['type'] | undefined
  protected id: InvoiceQuotation['id'] | undefined
  protected invoiceQuotationModel: InvoiceQuotation | undefined | null

  constructor(invoiceQuotationOptions?: InvoiceQuotationOptions) {
    if (invoiceQuotationOptions) {
      const { type, id, invoiceQuotationModel } = invoiceQuotationOptions

      if (!type && !id && !invoiceQuotationModel)
        throw new Error('Please provide any of `type`, `id`, or `invoiceQuotationModel`.')

      this.type = type ?? invoiceQuotationModel?.type
      this.id = id ?? invoiceQuotationModel?.id
      this.invoiceQuotationModel = invoiceQuotationModel
    }
  }

  public async getInvoiceQuotationModel(): Promise<InvoiceQuotation> {
    if (this.invoiceQuotationModel) return this.invoiceQuotationModel

    if (!this.type && !this.id)
      throw new Error(
        'The `invoiceQuotationOptions` object should have either type or id property or both.'
      )

    try {
      if (this.id && this.type) {
        this.invoiceQuotationModel = await InvoiceQuotation.query()
          .where({
            id: this.id,
            type: this.type,
          })
          .first()
      } else if (this.id) {
        this.invoiceQuotationModel = await InvoiceQuotation.query()
          .where({
            id: this.id,
          })
          .first()
      }

      return this.invoiceQuotationModel!
    } catch (error) {
      throw new Error('InvoiceQuotation not found')
    }
  }

  public async getInvoiceQuotationFullDetails(): Promise<unknown> {
    let invoiceQuotationDetails: unknown | null = null

    const cacheKey = `${CACHE_TAGS.INVOICE_QUOTATION_DETAILS_CACHE_KEY_PREFIX}:${this.id}${
      this.type ? ':' + this.type : ''
    }`
    await CacheHelper.get(cacheKey).then(async (result: unknown | null) => {
      if (result) {
        invoiceQuotationDetails = result
      } else {
        const invoiceQuotationModel = await this.getInvoiceQuotationModel()

        await invoiceQuotationModel?.load('customer', (customerQuery) => {
          customerQuery.preload('title', (titleQuery) => titleQuery.select('name'))
        })
        await invoiceQuotationModel?.load('company', (companyQuery) => {
          companyQuery.preload('country')
          companyQuery.preload('state')
          companyQuery.preload('companyLogo', (logoQuery) => logoQuery.select('url', 'formats'))
        })
        await invoiceQuotationModel?.load('shippingAddress', (addressQuery) => {
          addressQuery.preload('addressCountry', (subAddressQuery) =>
            subAddressQuery.select('id', 'name')
          )
          addressQuery.preload('addressState', (subAddressQuery) =>
            subAddressQuery.select('id', 'name')
          )
        })
        await invoiceQuotationModel?.load('billingAddress', (addressQuery) => {
          addressQuery.preload('addressCountry', (subAddressQuery) =>
            subAddressQuery.select('id', 'name')
          )
          addressQuery.preload('addressState', (subAddressQuery) =>
            subAddressQuery.select('id', 'name')
          )
        })
        await invoiceQuotationModel?.load('items', (itemsQuery) => {
          itemsQuery
            .preload('collectionType')
            .preload('files')
            .preload('product')
            .preload('unitOfMeasurement')
        })

        invoiceQuotationDetails = invoiceQuotationModel?.serialize({
          fields: {
            omit: [
              'customer_id',
              'company_id',
              'customer_billing_address',
              'customer_shipping_address',
            ],
          },
          relations: {
            customer: {
              fields: {
                pick: [
                  'id',
                  'customer_name',
                  'is_corporate',
                  'corporate_has_rep',
                  'first_name',
                  'last_name',
                  'email',
                  'phone_number',
                  'company_name',
                  'company_phone',
                  'company_email',
                ],
              },
            },
            shipping_address: {
              fields: { pick: ['id', 'full_address', 'street_address', 'city', 'postal_code'] },
            },
            billing_address: {
              fields: { pick: ['id', 'full_address', 'street_address', 'city', 'postal_code'] },
            },
            items: {
              fields: {
                omit: [
                  'invoices_quotations_id',
                  'product_id',
                  'collection_type_id',
                  'unit_of_measurement_id',
                  'updated_at',
                  'created_at',
                ],
              },
              relations: {
                collectionType: {
                  fields: {
                    omit: ['created_at', 'updated_at'],
                  },
                },
                product: {
                  fields: {
                    omit: ['created_at', 'updated_at', 'product_type_id', 'attribute_set_id'],
                    pick: ['id', 'name'],
                  },
                },
                unitOfMeasurement: {
                  fields: {
                    omit: ['created_at', 'updated_at'],
                  },
                },
              },
            },
            company: {
              fields: {
                pick: ['name', 'email', 'phone_number', 'address', 'city'],
              },
              relations: {
                country: {
                  fields: {
                    pick: ['name'],
                  },
                },
                state: {
                  fields: {
                    pick: ['name'],
                  },
                },
              },
            },
          },
        })

        await CacheHelper.put(cacheKey, invoiceQuotationDetails)
        // Add the `cacheKey` to sets
        // Get user from the HTTP context
        const ctx = HttpContext.get()
        const currentCompany = ctx?.requestedCompany
        const sets = [
          CACHE_TAGS.ALL_COMPANIES_CACHES_TAG,
          `${CACHE_TAGS.COMPANY_CACHE_TAG_PREFIX}:${currentCompany?.id}`,
          CACHE_TAGS.ALL_INVOICES_QUOTATIONS_CACHES_TAG,
          CACHE_TAGS.ALL_INVOICES_QUOTATIONS_DETAILS_CACHES_TAG,
          `${CACHE_TAGS.INVOICE_QUOTATION_DETAILS_CACHE_TAG_PREFIX}:${this.id}`,
          `${CACHE_TAGS.INVOICE_QUOTATION_DETAILS_CACHE_KEY_PREFIX}:${this.id}`,
        ]

        await CacheHelper.tag(sets, cacheKey)
      }
    })

    return invoiceQuotationDetails!
  }

  public async clearCache(): Promise<void> {
    // Clear the invoiceQuotationModel's entire cache

    // Get user from the HTTP context
    const ctx = HttpContext.get()
    const currentCompany = ctx?.requestedCompany
    const sets = [
      `${CACHE_TAGS.COMPANY_CACHE_TAG_PREFIX}:${currentCompany?.id}`,
      `${CACHE_TAGS.INVOICE_QUOTATION_DETAILS_CACHE_TAG_PREFIX}:${this.invoiceQuotationModel?.id}`,
      `${CACHE_TAGS.INVOICE_QUOTATION_DETAILS_CACHE_KEY_PREFIX}:${this.invoiceQuotationModel?.id}`,
    ]
    await CacheHelper.flushTags(sets)
  }
}
