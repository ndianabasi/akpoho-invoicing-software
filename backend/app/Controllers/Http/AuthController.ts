import User from 'App/Models/User'
import Encryption from '@ioc:Adonis/Core/Encryption'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NoLoginException from '../../Exceptions/NoLoginException'
import Env from '@ioc:Adonis/Core/Env'
import PasswordResetValidator from 'App/Validators/PasswordResetValidator'
import { DateTime } from 'luxon'
import Event from '@ioc:Adonis/Core/Event'
import Hash from '@ioc:Adonis/Core/Hash'
import PasswordChangeValidator from 'App/Validators/PasswordChangeValidator'
import AppRegistrationValidator from 'App/Validators/AppRegistrationValidator'
import UserServices from 'App/Services/UserServices'
import Role from 'App/Models/Role'
import Logger from '@ioc:Adonis/Core/Logger'

export default class AuthController {
  public async register({ request, response, auth }: HttpContextContract) {
    // Validate user details
    const form = await request.validate(AppRegistrationValidator)
    const {
      email,
      firstName,
      middleName,
      lastName,
      newPassword,
      phoneNumber,
      address,
      city,
      stateId,
      countryId,
    } = form

    // Get the CompanyAdmin role
    let companyAdminRole
    try {
      companyAdminRole = await Role.findByOrFail('name', 'CompanyAdmin')
    } catch (error) {
      Logger.error('Role not found at AuthController.register:\n%o', error)
      return response.abort({ message: 'Account could not be created' })
    }

    // Create a new user
    const user = await User.create({
      email,
      password: newPassword,
      isAccountActivated: true,
      loginStatus: true,
      accountActivatedAt: DateTime.now(),
      roleId: companyAdminRole.id,
    })

    if (user) {
      await user.related('profile').create({
        firstName,
        middleName,
        lastName,
        phoneNumber,
        address,
        city,
        stateId,
        countryId,
      })

      // Send verification email
      Event.emit('auth::new-registration-verification', {
        user,
      })

      const token = await auth.use('api').attempt(email, newPassword)
      // Check if credentials are valid, else return error
      if (!token)
        throw new NoLoginException({ message: 'Email address or password is not correct.' })

      /* Retrieve user with company information */
      const userService = new UserServices({ email })
      const cachedUser = await userService.getUserSummary()

      /**
       * Emit event to log login activity and
       * persist login meta information to DB
       * Also Clean up login code information
       */
      const ip = request.ip()
      Event.emit('auth::new-login', {
        ip,
        user,
      })

      return response.created({
        message: 'Account was created successfully.',
        token: token,
        data: cachedUser,
      })
    } else {
      Logger.error('User could not be created at AuthController.register')
      return response.abort({ message: 'Account could not be created' })
    }
  }

  public async newAccountEmailVerification({ request, response }: HttpContextContract) {
    let { key } = request.body()
    if (!key) {
      return response.badRequest('Invalid request for password reset validation')
    }

    const decryptedKey: string = Encryption?.decrypt(key) ?? ''
    if (!decryptedKey)
      return response.badRequest({ message: 'Invalid request for password reset validation' })
    else {
      const userId = decryptedKey.split('email-verification-for-')[1]

      let user: User
      try {
        user = await User.findOrFail(userId)

        if (Boolean(user.isEmailVerified)) {
          return response.ok({ message: 'Your email address is already verified' })
        }

        user.merge({ isEmailVerified: true, emailVerifiedAt: DateTime.now() })
        await user.save()

        return response.ok({ message: 'Thank you! Your email address is verified' })
      } catch (error) {
        return response.notFound({
          message:
            'Email verification failed. This could be as a result of an expired or tampered link. Please proceed to Dashboard to request a new one',
        })
      }
    }
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const { password, loginCode /* recaptchaResponseToken */ } = request.body()
    const email: string = request.body().email
    //const loginRecaptchaHelper = new LoginRecaptchaHelper(recaptchaResponseToken);

    const userService = new UserServices({ email: email })

    let user = await userService.getUserModel()
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

      const token = await auth.use('api').attempt(email, password)
      // Check if credentials are valid, else return error
      if (!token)
        throw new NoLoginException({ message: 'Email address or password is not correct.' })

      /* Retrieve user with company information */

      const cachedUser = await userService.getUserSummary()

      //console.log(user)

      /**
       * Emit event to log login activity and
       * persist login meta information to DB
       * Also Clean up login code information
       */
      const ip = request.ip()
      Event.emit('auth::new-login', {
        ip,
        user,
      })

      return response.created({
        message: 'Login successful.',
        token: token,
        data: cachedUser,
      })
    }
  }

  public async authProfile({ auth, response }: HttpContextContract) {
    /* Retrieve user with company information */
    const email = auth.user?.email!

    const userService = new UserServices({ email: email })

    const cachedUser = await userService.getUserSummary()

    return response.ok({
      data: cachedUser,
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

    // Step 1: generate encrypted string to be used for email
    // This is not meant for storing in var(255) column as
    // it is over 255 characters. 282 characters, actually
    // Storing as text is not an option too due to indexing cost
    // Best bet is to make this stateless
    // So encrypted key will be embed in URL is sent via email without storing
    const key = Encryption.encrypt(`password-reset-for-${user.id}`, '2 hours', undefined)

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

  public async verifyPasswordReset({ request, response }: HttpContextContract) {
    let { key } = request.body()
    if (!key) {
      return response.badRequest('Invalid request for password reset validation')
    }

    const decryptedKey: string = Encryption?.decrypt(key) ?? ''
    if (!decryptedKey) return response.badRequest('Invalid request for password reset validation')
    else {
      const userId = decryptedKey.split('password-reset-for-')[1]

      let user: User
      try {
        user = await User.findOrFail(userId)
      } catch (error) {
        return response.notFound({ message: 'Invalid user for password reset validation' })
      }

      return response.ok({ data: user.email })
    }
  }

  /**
   * Reset password via the auth page password reset flow
   * @param ctx {HttpContextContract} The HTTP context
   * @returns {Promise<void>}
   */
  public async ResetPassword({ request, response, auth }: HttpContextContract) {
    let { email, newPassword } = await request.validate(PasswordResetValidator)

    let user: User
    try {
      user = await User.findByOrFail('email', email)
    } catch (error) {
      return response.notFound({ message: 'Invalid user for password reset' })
    }

    // Verify 'newPassword' against user's old passwords on
    // the password_histories table.
    await user.load('passwordHistories')
    const passwordHistories = user.passwordHistories

    for (const history of passwordHistories) {
      if (await Hash.verify(history.oldPassword, newPassword)) {
        return response.badRequest({
          message:
            'The password you submitted was already used by you! Please try again with a unique password.',
        })
      }
    }

    /**
     *  If all is green, update password on users table and store old password
     *  on the password_histories table.
     */
    await user.related('passwordHistories').create({
      oldPassword: user.password,
    })

    user.merge({ password: newPassword })
    await user.save()

    const token = await auth.use('api').attempt(email, newPassword)
    // Check if credentials are valid, else return error
    if (!token) throw new NoLoginException({ message: 'Email address or password is not correct.' })

    /* Retrieve user with company information */
    const cachedUser = new UserServices({ email: email }).getUserSummary()

    return response.created({
      message: 'Password change was successful.',
      token: token,
      data: cachedUser,
    })
  }

  public async confirmCurrentPassword({ request, response, auth }: HttpContextContract) {
    let { currentPassword } = request.body()
    if (!currentPassword) {
      return response.badRequest('Invalid request. No current password provided!')
    }

    const user = auth.user
    const userEmail = user?.email!

    try {
      // Check if credentials are valid, else throw an error
      await auth.use('api').verifyCredentials(userEmail, currentPassword)
    } catch (error) {
      return response.badRequest({ message: 'Current password is not valid' })
    }

    // Create or update password change record for the user
    // Most fields are auto-created/auto-updated in the PasswordChange model
    // via the beforeSave hooks
    await user?.related('passwordChange').updateOrCreate({ userId: user.id }, {})

    // reload passwordChange relationship
    await user?.load('passwordChange')
    const passwordChange = user?.passwordChange

    /**
     * Fire event and send verification email
     */
    Event.emit('auth::send-code', { user: user ?? null, type: 'password_change_code' })

    return response.ok({
      message:
        'Current password is verified. Please check your email address for a confirmation code. Code is valid for only 2 hours.',
      data: { secret: passwordChange?.secret },
    })
  }

  public async confirmPasswordCode({ request, response, auth }: HttpContextContract) {
    // Validate request
    const validationSchema = schema.create({
      code: schema.number([rules.required(), rules.unsigned(), rules.range(100000, 999999)]),
      secret: schema.string({ trim: true }, [rules.uuid({ version: 5 }), rules.required()]),
    })

    const validationMessages = {
      'code.required': 'Code is required!',
      'code.unsigned': 'Code is invalid',
      'code.range': 'Code is out of range',
      'secret.uuid': 'Secret is invalid',
      'secret.required': 'Secret is required',
    }

    let { code, secret } = await request.validate({
      schema: validationSchema,
      messages: validationMessages,
    })

    const user = auth.user!

    await user.load('passwordChange')
    const passwordChange = user.passwordChange
    if (!passwordChange) {
      return response.badRequest({ message: 'Password change has not been initiated' })
    }

    if (passwordChange.verificationCode !== Number(code) || passwordChange.secret !== secret) {
      return response.badRequest({ message: 'Invalid data provided' })
    }

    const NOW = DateTime.now()
    const THEN = passwordChange.verificationCodeExpiresAt
    if (THEN > NOW.plus({ hours: 2 })) {
      return response.badRequest({
        message: 'Verification code has expired. Please restart the process',
      })
    }

    return response.ok({
      message: 'Everything is green. Please reset your password',
    })
  }

  public async submitNewPassword({ request, response, auth }: HttpContextContract) {
    let { newPassword, secret } = await request.validate(PasswordChangeValidator)

    const user = auth.user!

    await user.load('passwordChange')
    const passwordChange = user.passwordChange
    if (!passwordChange) {
      return response.badRequest({ message: 'Password change has not been initiated' })
    }

    if (passwordChange.secret !== secret) {
      return response.badRequest({ message: 'Invalid password-change session!' })
    }

    // Verify 'newPassword' against user's old passwords on
    // the password_histories table.
    await user.load('passwordHistories')
    const passwordHistories = user.passwordHistories

    for (const history of passwordHistories) {
      if (await Hash.verify(history.oldPassword, newPassword)) {
        return response.badRequest({
          message:
            'New password has been used already on Akpoho Software! Please try again with a unique password.',
        })
      }
    }

    /**
     *  If all is green, update password on users table and store old password
     *  on the password_histories table.
     */
    await user.related('passwordHistories').create({
      oldPassword: user.password,
    })

    /**
     * `newPassword` is not hashed here because hashing will be handled
     * by the `beforeSave` hook on the User model.
     */
    user.merge({ password: newPassword })
    await user.save()

    // Future: flush user cache after this

    Event.emit('auth::send-success-emails', { user, type: 'password_change_success' })

    return response.status(201).json({
      message: 'Your password was updated successfully. You can now login with it subsequently.',
    })
  }
}
