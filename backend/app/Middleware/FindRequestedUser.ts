import User from 'App/Models/User'
import NoEntityDefinedException from 'App/Exceptions/NoEntityDefinedException'
import { CustomContextContract } from '../Controllers/types/index'

export default class FindRequestedUser {
  public async handle(ctx: CustomContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const { user_id } = ctx.params
    //console.log(user_id)

    if (!user_id) throw new NoEntityDefinedException('No user is provided!')

    const user = await User.findOrFail(user_id)
    ctx.requestedUser = user

    await next()
  }
}
