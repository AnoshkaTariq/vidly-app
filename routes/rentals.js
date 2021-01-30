const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Fawn = require('fawn');
Fawn.init(mongoose);

const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');


router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.get('/:id', async (req, res) => {

    //  validating incoming id
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid Id format');

    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send('The rental with the given ID is not found');

    return res.send(rental);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid Customer');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid Movie');

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    // implementing 2 phase commit or transactions
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } })
            .run();

        return res.send(rental);
    }
    catch (error) {
        return res.status(500).send(error);
    }

});

module.exports = router;
