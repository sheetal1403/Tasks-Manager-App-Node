const express = require('express')
require('./db/mongoose')
const userRouter = require('../src/routers/user')
const taskRouter = require('../src/routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) //Automatically parse all json data
app.use(userRouter)
app.use(taskRouter)




app.listen(port, () => {
    console.log('Listening on '+port)
})


// const bcrypt = require('bcryptjs')

// const myFunc = async () => {
//     const password = 'Red12345!'
//     const hashedPassword = await bcrypt.hash(password, 8) 

//     console.log(password)
//     console.log(hashedPassword)

//     const isMatch = await bcrypt.compare('Red1234!', hashedPassword)
//     console.log(isMatch)
// }

// myFunc()