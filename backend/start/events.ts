/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import Event from '@ioc:Adonis/Core/Event'
import Database from '@ioc:Adonis/Lucid/Database'

Event.on('db:query', Database.prettyPrint)

Event.on('db:query', function ({ sql, bindings }) {
  console.log(sql, bindings)
})

Event.on('auth::send-code', 'Auth.onSendCode')
Event.on('auth::send-success-emails', 'Auth.onSendSuccessEmails')
Event.on('auth::new-login', 'Auth.onNewLogin')
