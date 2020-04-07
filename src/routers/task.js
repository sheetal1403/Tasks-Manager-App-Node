const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')


// GET '/tasks?completed=true
//GET '/tasks?limit=2&&skip=2
//GET '/tasks?sortBy=createdAt_asc
router.get('/tasks', auth, async (req,res) => {
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'asc'? 1 : -1 
    }
   
    try{
        // const tasks = await Task.find({
        //     owner: req.user._id
        // })
        // await req.user.populate('tasks').execPopulate()
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                    limit : parseInt(req.query.limit),
                    skip:  parseInt(req.query.skip),
                    sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(400).send(e)
    }

    
})

router.get('/tasks/:id', auth, async (req,res) => {
    try{
        // const foundTask = await Task.findById(req.params.id)
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/tasks', auth, async (req, res) => {
    // const task1 = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user.id
    })

    try{
       await task.save()
       res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    allowedUpdates = ["description", "completed"]
    updates = Object.keys(req.body)
    const valid = updates.every(element => allowedUpdates.includes(element))

    if(!valid){
        return res.status(400).send({error: 'Invalid updates'})
    }

    try{
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // })
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({
            _id: req.params.id,
             owner: req.user._id
        })
        updates.forEach(update => task[update] = req.body[update]);
        await task.save()
        if(!task){
            return res.status(400).send({
                error: 'Not found'
            })
        }
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    
    try{
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.id
        })
        if(!task){
            return res.status(400).send()
        }
        task.delete
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router