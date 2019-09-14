const app = require('./app')

const port = process.env.PORT;

app.listen(port, () => {
  console.log('Server is up an on port ' + port);
});


//testing file upload
// const multer = require('multer');
// const upload = multer({
//   dest: 'images',
//   limits: {
//     fileSize: 1000000 // 1 meg
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       return cb(new Error('File must be Word doc'));
//     }
//     console.log('here');
//     cb(undefined, true);
//     // cb(new Error('File must be xxx'));
//     // cb(undefined, true);
//   }
// });
// const errorMiddleware = (req, res, next) => {
//   throw new Error('from my middle ware');
// };
// app.post(
//   '/upload',
//   upload.single('upload'),
//   (req, res) => {
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

// cd /Users/peterstema/Documents/repos/node\ 3/site/task-manager/src
// node index.js
// npm run dev

// cd /Users/peterstema/mongodb/bin
// /Users/peterstema/mongodb/bin/mongod --dbpath=/Users/peterstema/mongodb-data

// {
// 	"name": "Peter Seven",
// 	"email": "8test@test1.com",
// 	"password": "12341234"
// }

//https://git.heroku.com/ps3-task-manager.git
//to deploy git push heroku master