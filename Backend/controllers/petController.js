const { Pet } = require('../models');

// Create a new pet
exports.createPet = async (req, res) => {
    try {
        const { name, photo, adoptionStatus, breed, color, ageRange, feedingType, diseases } = req.body;
        const newPet = await Pet.create({
            name,
            photo,
            adoptionStatus,
            breed,
            color,
            ageRange,
            feedingType,
            diseases
        });
        res.status(201).json(newPet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all pets
exports.getAllPets = async (req, res) => {
    try {
        const pets = await Pet.findAll();
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single pet by ID
exports.getPetById = async (req, res) => {
    try {
        const { id } = req.params;
        const pet = await Pet.findByPk(id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.status(200).json(pet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a pet
exports.updatePet = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, photo, adoptionStatus, breed, color, ageRange, feedingType, diseases } = req.body;
        const [updated] = await Pet.update({
            name,
            photo,
            adoptionStatus,
            breed,
            color,
            ageRange,
            feedingType,
            diseases
        }, {
            where: { id: id }
        });
        if (updated) {
            const updatedPet = await Pet.findByPk(id);
            res.status(200).json(updatedPet);
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a pet
exports.deletePet = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Pet.destroy({
            where: { id: id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
