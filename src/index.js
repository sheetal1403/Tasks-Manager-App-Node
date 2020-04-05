const express = require('express')
require('./db/mongoose')
const userRouter = require('../src/routers/user')
const taskRouter = require('../src/routers/task')


const app = express()
const port = process.env.PORT || 3000


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


const jwt = require('jsonwebtoken')

const myFunc = async () => {
    const token = jwt.sign({_id : 'abc123'}, 'This is my new course', {expiresIn: '7 seconds'}) 
    console.log(token)  

    const data = jwt.verify(token, 'This is my new course')
    console.log(data)
}

// myFunc()