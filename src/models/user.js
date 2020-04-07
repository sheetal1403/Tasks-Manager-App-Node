const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

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
    }],

    avatar: {
        type: Buffer
    }

}, {
    timestamps: true
    }
)

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//Generate token for the user
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = await jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens.push({token})
    // user.tokens = user.tokens.concat({token})
    // console.log(user.tokens)
    await user.save()
    //  
    return token
}

//Send only required data to the response . Delete password and tokens
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
   
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

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

userSchema.pre('remove', async function(){
    const user = this
    await Task.deleteMany({
        owner: user._id
    })
})

const User = mongoose.model('User', userSchema)

module.exports = User