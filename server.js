const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes/index');
const PORT = 8000;

const User = require('./models/user.model');

// connect db
mongoose.connect('mongodb://127.0.0.1:27017/upgrad-eshop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('db connected'))
  .catch(err => console.log(err));

//middlewares 
app.use(bodyParser.json());

// routes
app.use('/', router);

//connect server
app.listen(PORT, () => {
  console.log('server is listening from port:', PORT)
})