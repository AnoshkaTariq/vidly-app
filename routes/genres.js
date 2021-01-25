const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255
    }
});

const Genre = mongoose.model('Genre', genreSchema);

// to get all genres
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

// to get genre of a specific id
router.get('/:id', async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.send('Given id is not valid');
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID is not found');

    res.send(genre);
});

// to post new genre
router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await new Genre({ name: req.body.name });

    await genre.save();
    return res.send(genre);
});

// to update a genre of specific id
router.put('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true, useFindAndModify: false });
    if (!genre) return res.status(404).send('The genre with the given ID is not found');

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    res.send(genre);
});

//to delete a genre of a specific id
router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id, { useFindAndModify: false });
    if (!genre) return res.status(404).send('The genre with the given ID is not found');

    res.send(genre);
});


// validate function 
function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(5).required()
    });

    return schema.validate(genre);
}



module.exports = router;