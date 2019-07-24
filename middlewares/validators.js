const cipher = require('./cipher');
const userModel = require('../database/models');
const requestHelper = require('../helpers');

const validateUserSignUp = async (req, res, next) => {
  const { username, password, department, role } = req.body;
  try {
    const checkUser = await userModel.findUser(username);
    if (
      req.body.username &&
      req.body.password &&
      req.body.department &&
      req.body.role &&
      checkUser.length === 0
    ) {
      const hash = await cipher.createHash(password);
      const newUser = await userModel.addUser({
        username,
        password: hash,
        department,
        role
      });
      // eslint-disable-next-line require-atomic-updates
      req.new = newUser;
      next();
    }
    return requestHelper.error(
      res,
      400,
      `User with username ${username} already exists`
    );
  } catch (err) {
    err;
  }
};

module.exports = {
  validateUserSignUp
};
