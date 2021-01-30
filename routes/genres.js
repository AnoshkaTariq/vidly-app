const { Genre, validate } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


// to get all genres
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

// to get genre of a specific id
router.get('/:id', async (req, res) => {

    // validating incoming Id
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Given id is not valid');

    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID is not found');

    res.send(genre);
});

// to post new genre
router.post('/', auth, async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await new Genre({ name: req.body.name });

    await genre.save();
    return res.send(genre);

});

// to update a genre of specific id
router.put('/:id', auth, async (req, res) => {

    // validating incoming Id
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Given id is not valid');

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true, useFindAndModify: false });
    if (!genre) return res.status(404).send('The genre with the given ID is not found');

    res.send(genre);
});

//to delete a genre of a specific id
router.delete('/:id', [auth, admin], async (req, res) => {

    // validating incoming Id
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Given id is not valid');

    const genre = await Genre.findByIdAndRemove(req.params.id, { useFindAndModify: false });
    if (!genre) return res.status(404).send('The genre with the given ID is not found');

    res.send(genre);
});



module.exports = router;