const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth.js');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  console.log('Task : ', task);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send(error);
  }

  // res.send('Testing');
  // task
  //   .save()
  //   .then(() => {
  //     res.status(201).send(task);
  //   })
  //   .catch(error => {
  //     res.status(400);
  //     res.send(error);
  //   });
});

// /tasks?completed=true
// get tasks has the option to either select completed = true
// or completed= false
// options for pagination limit, skip
// /tasks?limit&skip10
// /task?sortBy=field:order (sortBy=createdAt:desc)
router.get('/tasks', auth, async (req, res) => {
  // empty object finds all (attributes limit what is returned)
  // adding owner only returns tasks owned by (logged in) user

  // get the complete data from the url
  const match = {};
  const sort = {};
  if (req.query.completed) {
    // have to convert the url parameter to a boolean (from a string)
    // if its the string true set the value to boolean true
    match.completed = req.query.completed === 'true';
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    //first split the query
    // then test the second part to see if its desc(-1) or asc(1)
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: 'tasks',
        match: match,
        options: {
          // make sure user input is a number
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort: sort
        }
      })
      .execPopulate();

    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  // console.log(req.params);
  const _id = req.params.id;
  //console.log('test', _id);
  try {
    console.log('test', req.params);
    //only tasks owned by user
    const task = await Task.findOne({
      _id,
      owner: req.user._id
    });
    console.log('here', task);
    if (!task) {
      return res.statusCode(404).send();
    }
    console.log('test 2', req.params);
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const update = req.body;

  //only fields user can update
  const allowedUpdates = ['completed', 'description'];
  const updates = Object.keys(req.body);
  // returns false if ANY do not match
  const isValidUpdate = updates.every(update => {
    //returns true if it match's
    return allowedUpdates.includes(update);
  });

  //if there is a inValidate field send user an error
  if (!isValidUpdate) {
    return res.status(400).send('Error: you send invalid update data');
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    // findByIdAndUpdate(what to update, data to update, options
    // (new returns update user instead of found user))

    // const task = await Task.findByIdAndUpdate(_id, update, {
    //     new: true,
    //     runValidators: true
    // });

    //if mongo connects but does not find the task
    if (!task) {
      return res.status(404).send();
    }

    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();

    //default status is 200 no need to set
    res.send(task);
  } catch (error) {
    //this is if validation fails
    res.status(400).send(error);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    //if task no found
    if (!task) {
      return res.status(404).send('No task with that ID found');
    }
    //default status is 200 no need to set
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;