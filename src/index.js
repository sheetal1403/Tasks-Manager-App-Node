const express = require('express')
require('./db/mongoose')
const userRouter = require('../src/routers/user')
const taskRouter = require('../src/routers/task')


const app = express()
const port = process.env.PORT || 3000

// const multer = require('multer')
// const upload = multer({
//     dest: 'uploads',
//     limits: {
//         fileSize: 1000000 //In bytes   
//     },
//     fileFilter(req, file, cb){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('Please provide a doc or docx'))
//         }

//         cb(undefined, true)
//     }
// })

// const errorMiddleware = (req,res,next) => {
//     throw new Error('From the middleware')
// }

// app.post('/upload', upload.single('upload'), (req, res) => {
    
//     res.send({error: error.message})
// }, (error, req, res, next) => {
//     res.status(400).send({error: error.message})
// })


//Express middleware
// app.use((req,res,next) => {
//     if(req.method === 'GET'){
//         res.send('Get req are disbaled')
//     }else{
//         next()
//     }
// })

app.use(express.json()) //Automatically parse all json data
app.use(userRouter)
app.use(taskRouter)






app.listen(port, () => {
    console.log('Listening on '+port)
})




