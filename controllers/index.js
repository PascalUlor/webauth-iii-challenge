const userModel = require('../database/models');
// const md5 = require('md5');
const requestHelper = require('../helpers');
const Token = require('../auth');

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    if (users) {
      return res.status(200).json({
        status: 200,
        data: users
      });
    }
    return res.status(404).json({
      status: 404,
      error: 'No user available'
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      error: err
    });
  }
};

const createUser = async (req, res) => {
  try {
    const payload = req.new;
    console.log(payload);
    // return requestHelper.success(res, 200, 'User signup successfull', payload);
    Token.createToken(res, 201, 'Signup succesful', ...payload);
  } catch (err) {
    return requestHelper.error(res, 500, 'server error');
  }
};

const loginUser = async (req, res) => {
  try {
    const payload = req.user;
    Token.createToken(res, 200, 'Login succesful', payload);
  } catch (err) {
    return requestHelper.error(res, 500, 'server error');
  }
};

module.exports = {
  getUsers,
  createUser,
  loginUser
};
