import User from 'App/Models/User'

export interface UserOptions {
  email?: User['email']
  id?: User['id']
}

export interface UserCompany {
  id: string
  name: string
}

export interface UserProfileSummary {
  id: string
  first_name: string
  last_name: string
  profile_picture: string
}
export interface UserRoleSummary {
  name: string
}

export interface UserSummary {
  id: string
  email: string
  login_status: boolean
  is_account_activated: boolean
  is_email_verified: boolean
  role_id: string
  companies: Array<UserCompany>
  profile: UserProfileSummary
  role: UserRoleSummary
}

export interface UserFullDetails {
  id: string
  email: string
  role_id: string
  login_code: number | null
  activation_code: number | null
  forgot_password_code: number | null
  login_status: boolean
  is_account_activated: boolean
  is_email_verified: boolean
  lifetime_login: number
  password_change_required: boolean
  last_login_time: string | null
  account_activated_at: string | null
  email_verified_at: string | null
  forgot_password_code_expires_at: string | null
  activation_code_expires_at: string | null
  login_code_expires_at: string | null
  password_last_changed_at: string | null
  password_change_secret: null
  created_at: string
  updated_at: string
  role: {
    name: string
    id: string
  }
  profile: {
    first_name: string | null
    last_name: string | null
    middle_name: string | null
    profile_picture: string | null
    phone_number: string
    address: string
    city: string
    created_at: string
    updated_at: string
    country_id: number
    state_id: number | null
    user_id: string
    userCountry: { id: string; name: string }
    userState: { id: string; name: string }
  }
}
