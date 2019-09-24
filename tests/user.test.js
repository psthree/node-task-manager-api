//notice names do NOT match
const request = require('supertest');

const app = require('../src/app');
//loads model
const User = require('../src/models/user');
const { userOne, userOneId, setUpDatabase } = require('./fixtures/db');

// wipes data base
beforeEach(setUpDatabase);

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

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    //supertest method to upload the image
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);
  //check that it is saving binary data(image)
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user felids', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ name: 'Bob' })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe('Bob'); //can also use toEqual
});

test('Should not update invalid user felids', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ date: 'B1234' })
    .expect(400);
});
