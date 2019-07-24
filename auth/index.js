const jwt = require('jsonwebtoken');
const cipher = require('../middlewares/cipher');
const secret = require('../config');
const userModel = require('../database/models');
const requestHelper = require('../helpers');

const authenticate = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const check = await userModel.findUser(username).first();
    const checkPassword = await cipher.compare(password, check.password);
    if (check.username === username && checkPassword) {
      // eslint-disable-next-line require-atomic-updates
      req.user = check;
      next();
    }
    return requestHelper.error(res, 400, 'wrong credentials');
  } catch (err) {
    err;
  }
};

const createToken = (res, statusCode, message, user) => {
  const payload = {
    username: user.username
  };
  const token = jwt.sign(payload, secret.jwtSecret, {
    expiresIn: 60 * 60 * 1440
  });
  const logInfo = {
    payload,
    token
  };
  requestHelper.success(res, statusCode, message, logInfo);
};

const restricted = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secret.jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ you: "can't touch this" });
      } else {
        req.decodedToken = decodedToken;
        console.log('decoded token', req.decodedToken);

        next();
      }
    });
  } else {
    res.status(401).json({ you: 'SHALL NOT PASS!' });
  }
};

module.exports = { authenticate, createToken, restricted };
