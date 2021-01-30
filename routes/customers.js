const { validate, Customer } = require('../models/customer');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();



router.get('/', async (req, res) => {
    const customer = await Customer.find().sort('name');
    return res.send(customer);
});

router.get('/:id', async (req, res) => {

    // validating incoming Id
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Given id is not valid');

    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('the customer with the given ID is not found');

    res.send(customer);

});

router.post('/', auth, async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    await customer.save();
    return res.send(customer);
});

router.put('/:id', auth, async (req, res) => {

    // validating incoming Id
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Given id is not valid');

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, { new: true, useFindAndModify: false });

    if (!customer) return res.status(404).send('The cutomer with the given ID is not found');

    return res.send(customer);
});

router.delete('/:id', [auth, admin], async (req, res) => {

    // validating incoming Id
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Given id is not valid');

    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).send('The cutomer with the given ID is not found');

    return res.send(customer);
});



module.exports = router;