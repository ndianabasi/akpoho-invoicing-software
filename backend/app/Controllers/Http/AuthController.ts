import User from 'App/Models/User'
import Company from 'App/Models/Company'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NoLoginException from '../../Exceptions/NoLoginException'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    /**
     * Validate user details
     */
    const validationSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true }, [rules.confirmed()]),
    })

    const userDetails = await request.validate({
      schema: validationSchema,
    })

    /**
     * Create a new user
     */
    const user = new User()
    user.email = userDetails.email
    user.password = userDetails.password
    await user.save()

    return response.created(user.toJSON())
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const { email, password, loginCode /* recaptchaResponseToken */ } = request.body()
    //const loginRecaptchaHelper = new LoginRecaptchaHelper(recaptchaResponseToken);

    let user = await User.findBy('email', email)
    if (!user) throw new NoLoginException({ message: 'Log in not allowed' })
    else {
      // Check if user can log in.
      // Get login status
      const loginStatus = Boolean(user.loginStatus)
      if (!loginStatus) {
        throw new NoLoginException({
          message: 'Log in is not permitted for this account!',
        })
      }

      // Get activation status
      const activationStatus = Boolean(user.isAccountActivated)
      if (!activationStatus) {
        throw new NoLoginException({
          message:
            'Your account is not activated. Please activate your account with the activation link sent to you via email.',
        })
      }

      // Get email verification status
      const emailVerificationStatus = Boolean(user.isEmailVerified)
      if (!emailVerificationStatus) {
        throw new NoLoginException({
          message:
            'Your email address is not verified. Please check your email inbox for a verification sent to you or request for a new verification email from your Church admin. If you are a Church admin, please contact us for assistance.',
        })
      }

      const token = await auth.use('api').attempt(email, password)
      // Check if credentials are valid, else return error
      if (!token)
        throw new NoLoginException({ message: 'Email address or password is not correct.' })

      /* Retrieve user with company information */
      user = await User.query()
        .select('users.id', 'users.email', 'users.login_status')
        .where('email', email)
        .preload('companies')
        .first()

      //console.log(user)

      /**
       * Emit event to log login activity and
       * persist login meta information to DB
       * Clean up login code information
       */
      /* const ip = request.ip()
      Event.fire('new::login', {
        ip: ip,
        user_id: user.id,
        time: null,
        response,
      }) */

      return response.status(200).json({
        message: 'Login successful.',
        token: token,
        data: user,
        status: 200,
        statusText: 'OK',
      })
    }
  }
}
