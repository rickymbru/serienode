const express = require('express');

const bodyParser = require('body-parser');

const routes = require('./routes'); // Arquivo

require('dotenv').config()

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(routes);

//require('./controllers/authController')(app);

app.listen(process.env.PORT);

module.exports = app;
