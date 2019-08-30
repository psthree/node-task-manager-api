const mongoose = require('mongoose');
// const validator = require('validator');

// mongoose.set('useFindAndModify', false);

//url, options object
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

//task model
// const Task = mongoose.model('Task', {
//   description: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   completed: {
//     type: Boolean,
//     default: false
//   }
// });

//to add our data
// const todo = new Task({
//   description: 'Read a book'
//   // completed: null
// });

//to add to database
//returns the promise
// todo
// todo
//   .save()
//   .then(result => {
//     console.log('Success: ', result);
//   })
//   .catch(error => {
//     console.log('Error: ', error);
//   });

// user model
//name and definition
// const User = mongoose.model('User', {
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     lowercase: true,
//     validate(value) {
//       if (!validator.isEmail(value)) {
//         throw new Error('Email is invalid');
//       }
//     }
//   },
//   age: {
//     type: Number,
//     default: 0,
//     validate(value) {
//       if (value < 0) {
//         throw new Error('Age must be a positive number');
//       }
//     }
//   },
//   password: {
//     type: String,
//     required: true,
//     minLength: 7,
//     trim: true,
//     validate(value) {
//       if (value.toLowerCase().includes('password')) {
//         throw new Error('Password can not contain password');
//       }
//     }
//   }
// });

//to add our data
// const me = new User({
//   name: '    Peter',
//   email: 'psthree@aol.com',
//   password: 'Password',
//   age: 60
// });

//to add to database
//returns a promise
// me.save()
//   .then(result => {
//     console.log('Result: ', result);
//   })
//   .catch(error => {
//     console.log('Error: ', error);
//   });

// cd /Users/peterstema/Documents/repos/node\ 3/site/task-manager/src/db
// node mongoose.js

// cd /Users/peterstema/mongodb/bin
// /Users/peterstema/mongodb/bin/mongod --dbpath=/Users/peterstema/mongodb-data