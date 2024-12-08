const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Salon = require('../models/Salon');

exports.protectUser = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

exports.protectSalon = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.salon = await Salon.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized to access this route' });
  }
};
