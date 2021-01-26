const Joi = require('joi');
const mongoose = require('mongoose');


const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255
    }
});

const Genre = mongoose.model('Genre', genreSchema);


// validate function 
function validateGenre(genre) {

    const schema = Joi.object({
        name: Joi.string().min(5).required()
    });

    return schema.validate(genre);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;