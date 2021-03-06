const express = require('express')
const User = require('../models/user')
const router = express.Router()
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const account = require('../emails/account')

const upload = multer({
    // dest: 'avatars', uploaded will be accessible in the route handler
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
            return cb(new Error('Please upload a picture!'))
        }
        cb(undefined, true)
    }
})

//Sign up a new user - No authentication is required
router.post('/users', async (req, res) => {

    // try{
    //     password = await bcrypt.hash(req.body.password, 8)
    //     console.log(password)

    // }catch(e){
    //     return res.send(e)
    // }
    
    
    // const user1 = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     age: req.body.age,
    //     password: password
    //     })
    


    const user1 = new User(req.body)
   

    try{
       
        await user1.save()
        // account.sendWelcomeEmail(req.body.email, req.body.name)
        const token =  await user1.generateAuthToken()
        
        res.status(201).send({user1, token})
    }catch(e){
        res.status(400).send(e)
    }

    // user1.save().then((result) => {
    //     res.status(201).send(user1)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
   
})

//Login in a user - No authentication is required
router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send('sorry')
    }
})

//Log out
router.post('/users/logout', auth, async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((element) => {
            return element.token !== req.token
        })
        
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

//Log out
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        console.log(req.user.tokens)
        req.user.tokens = []
        console.log(req.user.tokens)
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
    
})

// router.get('/users', auth, async (req, res) => {

//     try{
//         const users = await User.find({})
//         res.send(users)
//     }catch(e){
//         res.status(500).send(e)
//     }

//     // User.find({}).then((result) => {
//     //     res.send(result)
//     // }).catch(e => {
//     //     res.status(500).send(e)
//     // })
// })

//Get the logged in user's profile details
router.get('/users/me', auth, async (req,res) => {
    res.send(req.user)
})

//Getting others' user ID should not be allowed
// router.get('/users/:id', async (req,res) => {
//     try{
//         foundUser = await User.findById(req.params.id)
//         if(!foundUser){
//             console.log('Not found')
//             return res.status(404).send()
//         }
//         res.send(foundUser)
//     }catch(e){
//         res.status(400).send(e)
//     }

//     // User.findById(req.params.id).then((user) => {
//     //     if(!user){
//     //         console.log('Not found')
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)
//     // }).catch(e => {
//     //     res.status(400).send(e)
//     // })
// })

//Update logged in users profile details
router.patch('/users/me', auth,  async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']

    const valid = updates.every(element => allowedUpdates.includes(element))
    if(!valid){
        return res.status(400).send({error: 'Invalid updates'})
    }

    try{
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // })
        
        // const user = await User.findById(req.user.id)
        
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        
        //Already taken care of in auth middleware
        // if(!user){
        //     return res.status(404).send()
        // }
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

//Delete the logged in user altogether
router.delete('/users/me', auth, async (req, res) => {
    
    try{
        // const user = await User.findByIdAndDelete(req.user.id) -- req.user already exists in auth middleware
        await req.user.remove()
        account.sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

//Upload avatar picture
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize(320,240).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})


//Delete avatar picture
router.delete('/users/me/avatar', auth, async (req,res) => {
    req.user.avatar = undefined;
    await req.user.save()
    res.send()
})

//Serve/Display a users avatar picture
router.get('/users/:id/avatar', async (req,res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error('Not found!!')
        }
        res.set('Content-type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send(e)
    }
})


module.exports = router