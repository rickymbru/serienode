const express = require('express');    

const routes = express.Router();

require('dotenv').config()

const authController = require('./controllers/authController');
const projectController = require('./controllers/projectController');
const authMiddleware = require('./middleware/auth');

routes.post('/auth/register', authController.create);

routes.post('/auth/authenticate', authController.index);
routes.post('/auth/forgot_password', authController.forgot);
routes.post('/auth/reset_password', authController.reset);

routes.get('/', authMiddleware, projectController.list);
routes.get('/:projectId', authMiddleware, projectController.show);
routes.post('/', authMiddleware, projectController.create);
routes.put('/:projectId', authMiddleware, projectController.update);
routes.delete('/:projectId', authMiddleware, projectController.delete);


module.exports = routes;
