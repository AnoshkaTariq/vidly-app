const Joi = require('joi');
const express = require('express');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const app = express();


mongoose.connect('mongodb://localhost:27017/vidly-app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to mongoDB'))
    .catch(error => console.log('Could not connect to mongoDB', error));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/genres', genres);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Connected to port: ${port}`));
