require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);

app.use(errorHandler);

module.exports = app;