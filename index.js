const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const app = express();


mongoose.connect('mongodb://localhost:27017/vidly-app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to mongoDB'))
    .catch(error => console.log('Could not connect to mongoDB', error));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Connected to port: ${port}`));


// error handler for faulty input json 
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({
            error: {
                code: "INVALID_JSON",
                message: "The body of your request is not valid JSON.",
                type: err.type
            }
        });
    }

    console.error(err);
    res.status(500).send();
});
