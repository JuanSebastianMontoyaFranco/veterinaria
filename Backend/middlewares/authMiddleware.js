const jwt = require('jsonwebtoken');
const { User, Role, Access } = require('../models');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findByPk(decoded.id, {
                include: {
                    model: Role,
                    include: [Access]
                }
            });
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

exports.authorize = (...accesses) => {
    return (req, res, next) => {
        const userAccesses = req.user.Roles.flatMap(role => role.Accesses.map(access => access.name));
        const hasAccess = accesses.every(access => userAccesses.includes(access));

        if (!hasAccess) {
            return res.status(403).json({ message: 'You do not have permission to perform this action' });
        }
        next();
    };
};
