const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  // console.log('auth loaded');
  // next();
  try {
    //get the token from the header it comes back with Bearer at the start remove that
    // it there is no token it will come back as undefined and trigger the error
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    });
    //console.log('_id', _id);
    if (!user) {
      throw new Error();
    }

    // send back token and user
    req.token = token;
    //add user to req so route does not have to fetch again
    req.user = user;

    //user found run route
    next();
  } catch (error) {
    //console.log('E _id');
    res.status(401).send({
      error: ' Please authenticate.'
    });
  }
};

module.exports = auth;