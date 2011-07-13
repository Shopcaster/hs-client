
dep.require 'hs'

dep.provide 'hs.authFormFields'

hs.authFormFields = [{
    name: 'email'
    type: 'email'
    placeholder: 'Email'
    hide: true
  },{
    name: 'password'
    type: 'password'
    placeholder: 'Password'
    hide: true
}]
