//notice names do NOT match
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
//loads model
const User = require('../src/models/user');

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

// jest supplies functions to run before the test so you can do things
// like wipe the database before running the test (live cycle/ setup-teardown)
beforeEach(async () => {
  //console.log('before each loaded');
  // this will delete all records
  await User.deleteMany();
  //save our dummy data to the database for testing
  await new User(userOne).save();
});

// also
// afterEach(() => {
//     console.log('after each loaded');
// })
//use the method and url, then send some data to test with
test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Itest',
      email: 'itest@example.com',
      password: 'MyPass777!'
    })
    .expect(201);

  //assert that the database was changed correctly
  // response contains body and token
  const user = await User.findById(response.body.user._id);
  // not reverses null
  expect(user).not.toBeNull();

  //assertion about the response

  //one at at time
  //expect(response.body.user.name).toBe('Itest');

  //to check whole response object
  expect(response.body).toMatchObject({
    user: {
      name: 'Itest',
      email: 'itest@example.com'
    },
    token: user.tokens[0].token
  });

  //make sure password is NOT stored in database
  expect(user.password).not.toBe('MyPass777!');
});

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);

  // Validate that new token is saved
  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'xxx@test.com',
      password: 'MyPass777@'
    })
    .expect(400);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
});
