import User from 'App/Models/User'
import Encryption from '@ioc:Adonis/Core/Encryption'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NoLoginException from '../../Exceptions/NoLoginException'
import Env from '@ioc:Adonis/Core/Env'

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

    return response.created(user)
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
        .select(
          'users.id',
          'users.email',
          'users.login_status',
          'users.is_account_activated',
          'users.is_email_verified',
          'users.role_id'
        )
        .where('email', email)
        .preload('companies', (companiesQuery) => companiesQuery.select(...['id', 'name']))
        .preload('profile', (profileQuery) =>
          profileQuery.select(...['id', 'first_name', 'last_name', 'profile_picture'])
        )
        .preload('role', (roleQuery) => roleQuery.select(...['name']))
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

      return response.created({
        message: 'Login successful.',
        token: token,
        data: user,
      })
    }
  }

  public async authProfile({ auth, response }: HttpContextContract) {
    /* Retrieve user with company information */
    const email = auth.user?.email!

    const user = await User.query()
      .select(
        'users.id',
        'users.email',
        'users.login_status',
        'users.is_account_activated',
        'users.is_email_verified',
        'users.role_id'
      )
      .where('email', email)
      .preload('companies', (companiesQuery) => companiesQuery.select(...['id', 'name']))
      .preload('profile', (profilesQuery) =>
        profilesQuery.select(...['id', 'first_name', 'last_name', 'profile_picture'])
      )
      .preload('role', (roleQuery) => roleQuery.select(...['name']))
      .first()

    return response.ok({
      data: user,
    })
  }

  public async requestPasswordReset({ request, response }: HttpContextContract) {
    const { email } = request.body()

    let user: User
    try {
      user = await User.findByOrFail('email', email)
    } catch (error) {
      return response.notFound({ message: 'This email was not found' })
    }

    // Step 1: generate encrypted string to be used for email
    // This is not meant for storing in var(255) column as
    // it is over 255 characters. 282 characters, actually
    // Storing as text is not an option too due to indexing cost
    // Best bet is to make this stateless
    // So encrypted key will be embed in URL is sent via email without storing
    const key = Encryption.encrypt(`password-reset-for-${user.id}`, '2 hours', String(user.id))

    const FORGET_PASSWORD_URI = Env.get('FORGET_PASSWORD_URI', 'auth/reset-password')
    const FRONTEND_URL = Env.get('FRONTEND_URL')
    const passwordResetLink = `${FRONTEND_URL}${FORGET_PASSWORD_URI}/${key}`
    console.info(
      '\n\n==============\n',
      'Use this link to reset your password:\n',
      passwordResetLink,
      '\n=============='
    )

    return response.ok({ id: user.email })
  }
}
