//this code was moved from index.js to that it can be called without using listen
// which is necessary for testing

const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();



// app.use((req, res, next) => {
//   res.status(503).send('Maintenance Mode');
// });

//express please parse the incoming object to an object that is easy for us to use
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;