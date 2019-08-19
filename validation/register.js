const Validator = require('validator')
const isEmpty = require('is-empty')

module.exports = function validateRegisterInput (data) {
    let errors = {}

    // Assign empty field to an empty string so that we can use validator
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password1 = !isEmpty(data.password1) ? data.password1 : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    // Name check
    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required.'
    }

    // Email check
    if(Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required.'
    } else if (!Validator.isEmail(data.email)) {
        errors.email = 'Please enter a valid email.'
    }

    // Passwords check
    if(Validator.isEmpty(data.password1)) {
        errors.password1 = 'Password field is required.'
    }

    if(Validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm password field is required.'
    }

    if(!Validator.isLength(data.password1, { min: 6, max: 30})) {
        errors.password1 = 'Password must be at least 6 characters.'
    }

    if(!Validator.equals(data.password1, data.password2)) {
        errors.password2 = 'Passwords musth match.'
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}