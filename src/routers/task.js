const express = require('express')
const router = express.Router()
const Task = require('../models/task')



router.get('/tasks', async (req,res) => {
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }catch(e){
        res.status(400).send(e)
    }

    
})

router.get('/tasks/:id', async (req,res) => {
    try{
        const foundTask = await Task.findById(req.params.id)
        res.send(foundTask)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/tasks', async (req, res) => {
    const task1 = new Task(req.body)

    try{
       await task1.save()
       res.send(task1)
    }catch(e){
        res.status(400).send(e)
    }
})

router.patch('/tasks/:id', async (req, res) => {
    allowedUpdates = ["description", "completed"]
    updates = Object.keys(req.body)
    const valid = updates.every(element => allowedUpdates.includes(element))

    if(!valid){
        return res.status(400).send({error: 'Invalid updates'})
    }

    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(400).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router