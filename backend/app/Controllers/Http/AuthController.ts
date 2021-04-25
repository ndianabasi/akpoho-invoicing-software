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
    const { email, password, loginCode /* recaptchaResponseToken */ } = request.post()
    //const loginRecaptchaHelper = new LoginRecaptchaHelper(recaptchaResponseToken);

    let user = await User.findBy('email', email)
    if (!user) throw new NoLoginException({ message: 'Log in not allowed' })

    const token = await auth.use('api').attempt(email, password)
    // Check if credentials are valid, else return error
    if (!token) throw new NoLoginException({ message: 'Email address or password is not correct.' })

    // Check if user can log in.
    // Get login status
    const loginStatus = Boolean(user.login_status)
    if (!loginStatus)
      throw new NoLoginException({
        message: 'Log in is not permitted for this account!',
      })

    // Get activation status
    const activationStatus = Boolean(user.is_account_activated)
    if (!activationStatus)
      throw new NoLoginException({
        message:
          'Your account is not activated. Please activate your account with the activation link sent to you via email.',
      })

    // Get email verification status
    const emailVerificationStatus = Boolean(user.is_email_verified)
    if (!emailVerificationStatus)
      throw new NoLoginException({
        message:
          'Your email address is not verified. Please check your email inbox for a verification sent to you or request for a new verification email from your Church admin. If you are a Church admin, please contact us for assistance.',
      })

    /* Retrieve user with role information */
    user = await User.query()
      .select('users.id', 'users.email', 'users.login_status', 'roles.name as role')
      .where('email', email)
      .leftJoin('roles', 'users.role_id', 'roles.id')
      .first()
    user = user.toJSON()

    /**
     * Emit event to log login activity and
     * persist login meta information to DB
     * Clean up login code information
     */
    const ip = request.ip()
    Event.fire('new::login', {
      ip: ip,
      user_id: user.id,
      time: null,
      response,
    })

    return response.status(200).json({
      message: 'Login successful.',
      type: token.type,
      token: token.token,
      refreshToken: token.refreshToken,
      data: {
        user_id: user.id,
        email: user.email,
        role: user.role,
        organisation_id: user.organisation_id || null,
      },
      status: 200,
      statusText: 'OK',
    })
  }
}
