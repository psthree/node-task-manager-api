const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

// dummy data to test with
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'Mike',
  email: 'mike@example.com',
  password: '56what!!',
  tokens: [
    {
      token: jwt.sign(
        {
          _id: userOneId
        },
        process.env.JWT_SECRET
      )
    }
  ]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: 'Barb',
  email: 'barb@example.com',
  password: '57what!!',
  tokens: [
    {
      token: jwt.sign(
        {
          _id: userTwoId
        },
        process.env.JWT_SECRET
      )
    }
  ]
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First task',
  completed: false,
  owner: userOne._id
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second task hat is completed',
  completed: true,
  owner: userOne._id
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third task that is completed',
  completed: true,
  owner: userTwo._id
};

// jest supplies functions to run before the test so you can do things
// like wipe the database before running the test (live cycle/ setup-teardown)
const setUpDatabase = async () => {
  // this will delete all records
  await User.deleteMany();
  await Task.deleteMany();
  //save our dummy data to the database for testing
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOne,
  userOneId,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setUpDatabase
};
