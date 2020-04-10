const express = require('express');    

const routes = express.Router();

const authController = require('./controllers/authController');

routes.post('/register',function (req, res){
    res.send('POST request to the homepage')
});
