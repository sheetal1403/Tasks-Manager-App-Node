require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndRemove('5e859b7bd212e883809660db').then(task => {
//     console.log(task)
//     return Task.countDocuments({
//         completed: false
//     })
// }).then(count => console.log(count)).catch(e => console.log(e) )

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndRemove(id)
    const count = await Task.countDocuments({completed: true})
    return {task, count}
}

deleteTaskAndCount('5e85bce24b40147cf86ebd64')
    .then(result => console.log(result))
    .catch(e => console.log('ERROR!!',e))

