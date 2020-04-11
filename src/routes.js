const express = require('express');    

const routes = express.Router();

require('dotenv').config()

const authController = require('./controllers/authController');
const projectController = require('./controllers/projectController');
const authMiddleware = require('./middleware/auth');

routes.post('/auth/register', authController.create);

routes.post('/auth/authenticate', authController.index);
routes.post('/auth/forgot_password', authController.forgot);

routes.get('/project', authMiddleware, projectController.create);

module.exports = routes;
