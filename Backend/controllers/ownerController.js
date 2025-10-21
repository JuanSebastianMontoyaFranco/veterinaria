const { Owner } = require('../models');

exports.createOwner = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const newOwner = await Owner.create({ name, phone, address, UserId: req.user.id });
        res.status(201).json(newOwner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllOwners = async (req, res) => {
    try {
        const owners = await Owner.findAll();
        res.json(owners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
