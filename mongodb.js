// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

//Object destructuring
const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const id = new ObjectID()
// console.log(id)
// console.log(id.getTimestamp())

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if(error){
        return console.log('Unable to connect')
    }

    const db = client.db(databaseName)

    // db.collection('users').insertOne({
    //     _id: id,
    //     name: 'Jennifer',
    //     age: 25
    // },
    // (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert user')
    //     }

    //     console.log(result.ops)
    // })

//     db.collection('users').insertMany([{
//         name: 'Rahul',
//         age: 20
//     }, {
//         name: 'Max',
//         age: 34
//     }] , (error, result) => {
//         if(error){
//             return console.log('Unable to insert')
//         }

//         console.log(result.insertedCount)
//         console.log(result.ops)
//     })
// })

// db.collection('tasks').insertMany([{
//     description: 'Buy groceries',
//     completed: false
// }, {
//     description: 'Learn',
//     completed: true
// }], (error, result) => {
//     if(error){
//         return console.log(error)
//     }

//     console.log(result.ops)

// })

// db.collection('users').findOne({ _id: ObjectID("5e84371ebab2aa8530ed931a")}, (error, user) => {
//     if(error){
//         return console.log('Not found')
//     }

//     console.log(user)
// })

// db.collection('users').find({ age : 25}).toArray((error, users) => {
//     if(error){
//         return console.log(error)
//     }
//     console.log(users)

// })

// db.collection('tasks').findOne({_id : new ObjectID("5e843c4b6df16968a03a5594")}, (error, task) => {
//     if(error){
//         return console.log('Not found')
//     }
//     console.log(task)
// })

// db.collection('users').updateOne(
//     {_id: new ObjectID("5e84329c80438d7ed4f0d46a")}, 
//     { $inc: {
//         age: 2
//         }
//     }).then(result => {
//         console.log(result.result)
//     }).catch(error => {
//         console.log(error)
//     })

// db.collection('tasks').updateMany(
//     {completed: false},
//     {
//         $set: {
//             completed: true
//         }
//     }
// ).then(result => {
//     console.log(result.result)
// }).catch(error => {
//     console.log(error)
// })

db.collection('users').deleteMany({
    age: 25
}).then(result => {
    console.log(result)
}).catch(error => {
    console.log(error)
}) 

   



})