const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password can not contain password');
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
});

//virtual property
//relationship between user and task
//virtual('name', {felids})
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.methods.toJSON = function () {
  const user = this;
  // get an user object that has all of mongoose extra stuff removed
  const userObject = user.toObject();
  //remove data we do not want to send
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({
    _id: user._id.toString()
  }, process.env.JWT_SECRET);

  //add to token array(of objects) for user
  user.tokens = user.tokens.concat({
    token
  });
  //save to database
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({
    email: email
  });

  //email not found
  if (!user) {
    throw new Error('Unable to login 1');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login 2');
  }

  return user;
};
// middle ware
// hash the plain text password before saving
// cannot be an arrow function due to binding issues
userSchema.pre('save', async function (next) {
  //this is the doc to be saved
  const user = this;
  // if the password is modified (happens when created and when updated)
  // lets hash (returns a promise)(password to hash, number of rounds(trips though bcrypt))
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  // gets called when we are done here
  next();
});

// middleware
// delete users task when user is removed/deleted
userSchema.pre('remove', async function (next) {
  const user = this;
  await Task.deleteMany({
    owner: user._id
  })

  next();
})

// user model
// name of model and definition
const User = mongoose.model('User', userSchema);

module.exports = User;