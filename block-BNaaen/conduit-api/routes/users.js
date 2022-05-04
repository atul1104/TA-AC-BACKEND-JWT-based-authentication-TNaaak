var express = require('express');
const Article = require('../models/Article');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
var router = express.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//registring new user

router.post('/register', async (req, res, next) => {
  let data = req.body;

  try {
    let user = await User.findOne({ username: data.username });

    if (user) {
      return res.status(400).json({ error: 'User already exist' });
    }

    let createdUser = await User.create(data);
    let token = await user.createToken();
    return res.json({ user: createdUser.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

//login user

router.post('/login', async (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: ' Email/Password required',
    });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: ' User does not exist.',
      });
    }

    let result = user.verifyPassword(password);

    if (!result) {
      return res.status(400).json({
        error: ' Incorrect password.',
      });
    }

    let token = await user.createToken();

    return res.json({ token, user });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
