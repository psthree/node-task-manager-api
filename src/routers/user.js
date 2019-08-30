const express = require('express');
const User = require('../models/user');
const sharp = require('sharp');
const auth = require('../middleware/auth');
const {
  sendWelcomeEmail,
  sendCancellationEmail
} = require('../emails/account');
const router = new express.Router();
const multer = require('multer');

// signing up
router.post('/users', async (req, res) => {
  // console.log(req.body);
  // res.send('Testing');
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({
      user,
      token
    });
  } catch (error) {
    res.status(400).send(error);
  }
  await user.save();
});

// logging in
// find user by email and password
router.post('/users/login', async (req, res) => {
  try {
    console.log('logging in', req.body.email, req.body.password);
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    console.log('logging in 2', token);
    res.send({
      user,
      token
    });
  } catch (error) {
    res.status(400).send('not loging in');
  }
});

//logging out
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      // returns true when its NOT the one we are looking for
      // if its false it gets removed
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    console.log('logout error');
    res.status(500).send();
  }
});

// logout all sessions, that is delete all tokens
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    // will send a 200 by default
    console.log('logout all');
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

// only runs if user is authenticated
router.get('/users/me', auth, async (req, res) => {
  // router.get('/users/me', async (req, res) => {
  console.log('getting user info/me');
  res.send(req.user);
});

//find specific user
// ***** should not ever need to use this ****
// router.get('/users/:id', async (req, res) => {
//   //console.log(req.params);
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     //if mongo connects but does not find a user
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

//update a user
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({
      error: 'Invalid updates!'
    });
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/users/me', auth, async (req, res) => {
  //console.log(req.user.email, req.user.name)
  try {
    //req.user is supplied by auth.js
    //console.log('delete user', req.user);
    await req.user.remove();
    sendCancellationEmail(req.user.email, req.user.name)

    //default status is 200 no need to set
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//upload an avatar
const upload = multer({
  // dest: 'avatars',
  limits: {
    fileSize: 1000000 // 1 meg
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('File must in JPEG or PNG image'));
    }
    cb(undefined, true);
    // cb(new Error('File must be xxx'));
    // cb(undefined, true);
  }
});

router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
      //store output form sharp
      const buffer = await sharp(req.file.buffer)
        .resize({
          width: 250,
          height: 250
        })
        .png()
        .toBuffer();
      req.user.avatar = buffer;
      //update user profile (update database)
      await req.user.save();
      res.send();
    },
    // sends the error in json formate
    (error, req, res, next) => {
      res.status(400).send({
        error: error.message
      });
    }
);

router.delete(
  '/users/me/avatar',
  auth,
  async (req, res) => {
      //see the field to undefined
      req.user.avatar = undefined;
      // update the database
      await req.user.save();
      res.send();
    },
    // sends the error in json formate
    (error, req, res, next) => {
      res.status(400).send({
        error: error.message
      });
    }
);

//fetching avatar and supplying link
// http://localhost:3000/users/5d484cfdf42f73032b241e98/avatar
router.get('/users/:id/avatar', async (req, res) => {
  // may not have image
  try {
    const user = await User.findById(req.params.id);

    //if no user or avatar
    if (!user || !user.avatar) {
      // not sending message if not found
      throw new Error();
    }
    // send a response header
    res.set('Content-Type', 'image/png');
    // send the image data
    res.send(user.avatar);
  } catch (error) {
    // if image not found
    res.status(404).send();
  }
});

module.exports = router;

// {
// 	"name": "PS3",
// 	"email": "pstema@gmail.com",
// 	"password": "12341234"
// }