//notice names do NOT match
const request = require('supertest');

const app = require('../src/app');
//loads model
const Task = require('../src/models/task');

const {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setUpDatabase
} = require('./fixtures/db');

// wipes data base
beforeEach(setUpDatabase);

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201);

    //check that the task was added to the database
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull()
    //task should be false
    expect(task.completed).toEqual(false);
});

test("should return all task for userOne", async () => {

    // const _id = await req.params.id;
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    //check length (number of tasks) should be 2
    expect(response.body.length).toEqual(2);
})

test('Should not delete other users tasks', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404);
    //  make sure task is still in database
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull();
})