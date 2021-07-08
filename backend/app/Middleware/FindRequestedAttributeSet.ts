import NoEntityDefinedException from 'App/Exceptions/NoEntityDefinedException'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AttributeSet from 'App/Models/AttributeSet'

export default class FindRequestedAttributeSet {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const { attribute_set_id } = ctx.params

    if (!attribute_set_id) throw new NoEntityDefinedException('No attribute set was provided!')

    let attributeSet
    try {
      attributeSet = await AttributeSet.findOrFail(attribute_set_id)
    } catch (error) {
      return ctx.response.notFound({ message: 'Unknown attribute set' })
    }

    ctx.requestedAttributeSet = attributeSet

    await next()
  }
}
