const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/api/users')

// Initialize app using express
const app = express()

// Apply middleware bodyparser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// DB Config 
const db = require('./config/keys').mongoURI

// Connect the DB
const connectDB = async () => {
    try {   
        await mongoose
                .connect(
                    db,
                    { useNewUrlParser: true }
                )
                console.log('Database connected')
        } catch {
            console.log('Error while connecting to DB: ' +err)
            process.exit(1)
        }
    }

connectDB();

// Passport middleware
app.use(passport.initialize())

// Passport config
require('./config/passport')(passport)

// Users routes
app.use('/api/users', users)

app.get('/', (req,res) => res.send('Hello world.') )
// Start the server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log('Server running on port: '+PORT))