const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const noteroute=require('./Route/note');

const categoryroute=require('./Route/category');

const authRoutes = require('./Route/auth');

app.use(bodyParser.json()); 

app.use((req, res, next) =>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  next();
});

app.use('/n',noteroute);

app.use('/c',categoryroute);

app.use('/auth',authRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data=error.data
  res.status(status).json({ message: message, data:data});
});

mongoose
  .connect(
    'url'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));