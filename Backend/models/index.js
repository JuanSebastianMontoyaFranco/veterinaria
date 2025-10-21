const sequelize = require('../config/database');
const User = require('./User');
const Role = require('./Role');
const Access = require('./Access');
const Owner = require('./Owner');
const Pet = require('./Pet');
const Appointment = require('./Appointment');

// User-Role relationship (many-to-many)
const UserRoles = sequelize.define('UserRoles', {});
User.belongsToMany(Role, { through: UserRoles });
Role.belongsToMany(User, { through: UserRoles });

// Role-Access relationship (many-to-many)
const RoleAccesses = sequelize.define('RoleAccesses', {});
Role.belongsToMany(Access, { through: RoleAccesses });
Access.belongsToMany(Role, { through: RoleAccesses });

// User-Owner relationship (one-to-one)
User.hasOne(Owner);
Owner.belongsTo(User);

// Owner-Pet relationship (one-to-many)
Owner.hasMany(Pet);
Pet.belongsTo(Owner);

// Pet-Appointment relationship (one-to-many)
Pet.hasMany(Appointment);
Appointment.belongsTo(Pet);

const db = {
    sequelize,
    User,
    Role,
    Access,
    Owner,
    Pet,
    Appointment,
    UserRoles,
    RoleAccesses
};

module.exports = db;
