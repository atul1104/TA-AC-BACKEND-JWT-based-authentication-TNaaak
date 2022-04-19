var express = require('express');
var router = express.Router();
var User = require('../model/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send({ message: 'User Information' });
});

//registration handler

router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    console.log(user);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

//login handler

router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email/Password is required' });
  }
  try {
    var user = await user.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email is not registered' });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ error: 'Password is not correct' });
    }
    //generate token
    var token = user.signToken();
    console.log(token);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
