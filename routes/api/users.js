const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const keys = require('../../config/keys')
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')
const User = require('../../models/User')

// @route POST api/users/register
// @description Register user
// @access Public
router.post('/register', (req, res) => {
    // Validate the form
    const { errors, isValid } = validateRegisterInput(req.body)

    // Return the errors if any
    if(!isValid) {
        return res.status(400).json(errors)
    }

    // Finds the user in the DB
    User.findOne({ email: req.body.email })
        .then(user => {
        // Checks if a user with the same email already exists
        if(user) {
            return res.status(400).json({ email: 'Email already exists' })
        } else {
            // Creates a new User
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password1
            })

            // bcrypts the password before saving the User
            bcrypt.genSalt(10, (err,salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser 
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err))
                })
            })
        }
    })
})

//@route POST /api/users/login
//@desc User login and returns a jwt token
//@access Public
router.post('/login', (req, res) => {
    // Validate the form
    const { errors, isValid } = validateLoginInput(req.body)

    // Return the errors if any
    if (!isValid){
        return res.status(400).json(errors)
    }

    const email = req.body.email
    const password = req.body.password

    // Find user in DB
    User.findOne({ email })
        .then(user => {
            // Checks if the email exists 
            if (!user) {
                return res.status(404).json({ emailnotfound: 'You first need to register.' })
            }

            // Checks if the password is correct
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // If the password matchs we create a JWT payload
                        const payload = {
                            id: user.id,
                            name: user.name
                        }

                        // Sign jwt token
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            { expiresIn: 31556926 },
                            (err, token) => {
                                res.json({ success: true, token: 'Bearer ' + token })
                            }
                        )
                    } else {
                        return res.status(400).json({ passwordincorrect: 'Password incorrect' })
                    }
                })
        })
})

module.exports = router;