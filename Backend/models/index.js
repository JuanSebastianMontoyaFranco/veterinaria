const sequelize = require('../config/database');
const User = require('./User');
const Role = require('./Role');
const Access = require('./Access');
const Owner = require('./Owner');
const Pet = require('./Pet');
const Appointment = require('./Appointment');

// User-Role relationship (many-to-many)
User.belongsToMany(Role, {
    through: 'UserRoles',
    foreignKey: 'UserId',
    otherKey: 'RoleId',
    as: 'roles'
});
Role.belongsToMany(User, {
    through: 'UserRoles',
    foreignKey: 'RoleId',
    otherKey: 'UserId',
    as: 'users'
});

// Role-Access relationship (many-to-many)
Role.belongsToMany(Access, {
    through: 'RoleAccesses',
    foreignKey: 'RoleId',
    otherKey: 'AccessId',
    as: 'accesses'
});
Access.belongsToMany(Role, {
    through: 'RoleAccesses',
    foreignKey: 'AccessId',
    otherKey: 'RoleId',
    as: 'roles'
});

// User-Owner relationship (one-to-one)
User.hasOne(Owner, {
    foreignKey: 'UserId',
    as: 'owner'
});
Owner.belongsTo(User, {
    foreignKey: 'UserId',
    as: 'user'
});

// Owner-Pet relationship (one-to-many)
Owner.hasMany(Pet, {
    foreignKey: 'OwnerId',
    as: 'pets'
});
Pet.belongsTo(Owner, {
    foreignKey: 'OwnerId',
    as: 'owner'
});

// Pet-Appointment relationship (one-to-many)
Pet.hasMany(Appointment, {
    foreignKey: 'PetId',
    as: 'appointments'
});
Appointment.belongsTo(Pet, {
    foreignKey: 'PetId',
    as: 'pet'
});

module.exports = {
    sequelize,
    User,
    Role,
    Access,
    Owner,
    Pet,
    Appointment
};
