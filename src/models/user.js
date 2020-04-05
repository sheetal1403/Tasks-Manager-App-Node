const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
    {
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password should not be included!!')
            }
        }
    },

    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Please enter a positive no')
            }
        }
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

}
)

//Generate token for the user
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = await jwt.sign({_id: user._id.toString()}, 'thisismynewcourse')
    user.tokens.push({token})
    // user.tokens = user.tokens.concat({token})
    // console.log(user.tokens)
    await user.save()
    //  
    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
   
    delete userObject.password
    delete userObject.tokens

    return userObject
}

//Login in the user
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    })
    if(!user){
        throw new Error('Unable to login. User not found')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

//Mongoose Middleware for save method
userSchema.pre('save', async function(){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User