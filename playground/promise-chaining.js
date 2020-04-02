require('../src/db/mongoose')

const User = require('../src/models/user')

// User.findByIdAndUpdate('5e858f10c7a46a122c9ba14d', {
//     age: 3
// }).then(user => {
//     console.log(user)
//     return User.countDocuments({age: 26})
// }).then(count => {
//     console.log(count)
// }).catch(e => { console.log(e) })

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age})
    const count = await User.countDocuments({age: 26})
    return count
}

updateAgeAndCount('5e858f10c7a46a122c9ba14d', 24)
    .then(count => {console.log(count)})
    .catch(e => {console.log(e)})