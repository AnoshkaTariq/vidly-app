const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');




router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name');
    return res.send(movies);
});

router.get('/:id', async (req, res) => {

    // validating incoming Id
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Given id is not valid');

    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('The movie with the given ID is not found');

    return res.send(movie);
});

router.post('/', async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('The genre with the give ID does not exist');

    let movie = new Movie({
        title: req.body.title,
        genre: {
            id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save();
    return res.send(movie);


});

router.put('/:id', async (req, res) => {


    // validating incoming Id
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Given id is not valid');

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // validating genreId
    if (!mongoose.Types.ObjectId.isValid(req.body.genreId))
        return res.send('Given ID is not valid format.....');

    const genre = await Genre.findById(req.body.genreId);
    if (!mongoose.Types.ObjectId.isValid(genre._id))
        return res.send('Given id is not valid');
    if (!genre) return res.status(400).send('The genre with the give ID does not exist');

    const movie = await Movie.findByIdAndUpdate({
        title: req.body.title,
        genre: {
            id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, { new: true, useFindAndModify: false });

    if (!movie) return res.status(404).send('The movie with the given ID is not found');

    return res.send(movie);
});

router.delete('/:id', async (req, res) => {

    // validating incoming Id
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Given id is not valid');

    const movie = await Movie.findByIdAndDelete(req.params.id, { useFindAndModify: false });
    if (!movie) return res.status(404).send('The movie with the given ID is not found');

    return res.send(movie);
});



module.exports = router;
