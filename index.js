const express = require('express');
require('dotenv').config();
const routes = require('./routes/Route')
const app = express();
const port = process.env.PORT




  app.use(express.json())
  app.use(express.urlencoded({extended:true}))
  app.use('/',routes);


app.listen(port,() => {
    console.log(port);
})