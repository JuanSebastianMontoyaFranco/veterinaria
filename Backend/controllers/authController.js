const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

exports.register = async (req, res) => {
    try {
        const { name, email, password, roles } = req.body;
        const newUser = await User.create({ name, email, password });

        if (roles) {
            const foundRoles = await Role.findAll({ where: { name: roles } });
            await newUser.setRoles(foundRoles);
        } else {
            const defaultRole = await Role.findOne({ where: { name: 'user' } });
            await newUser.setRoles([defaultRole]);
        }

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await user.validPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
