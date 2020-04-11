const express = require('express');

const bodyParser = require('body-parser');

const routes = require('./routes'); // Arquivo

const path = require ('path');

require('dotenv').config()

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(routes);

app.listen(process.env.PORT);

module.exports = app;
