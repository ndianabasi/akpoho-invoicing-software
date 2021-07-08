import NoEntityDefinedException from 'App/Exceptions/NoEntityDefinedException'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'

export default class FindRequestedProduct {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { product_id } = ctx.params

    if (!product_id) throw new NoEntityDefinedException('No product is provided!')

    let requestedProduct: Product
    try {
      requestedProduct = await Product.findOrFail(product_id)
    } catch (error) {
      return ctx.response.notFound({ message: 'Unknown product was requested' })
    }

    ctx.requestedProduct = requestedProduct

    await next()
  }
}
