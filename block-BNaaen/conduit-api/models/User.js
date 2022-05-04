var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var Profile = require('./Profile');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: { type: String, unique: true },
  token: String,
  username: { type: String, unique: true },
  password: { type: String },
  bio: String,
  image: { type: String, default: null },
  profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  comments: [{ type: Schema.Types.ObjectId, red: 'Comment' }],
});

//hooks to create profile data
userSchema.pre('save', async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    var profileData = {
      username: this.username,
      bio: this.bio,
      image: this.image,
    };
    var profile = await Profile.create(profileData);
    this.profile = profile.id;
    next();
  } catch (error) {
    next(error);
  }
});

//password hashing
userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    return error;
  }
};

//signing token method or creating token for user
userSchema.methods.createToken = async function (password) {
  try {
    var profileData = await Profile.findById(this.profile);
    var payload = {
      username: profileData.username,
      bio: profileData.bio,
      image: profileData.image,
    };

    var token = await jwt.sign(payload, process.env.SECRET);

    return token;
  } catch (error) {
    return error;
  }
};

//to send data at response to display id ,email and token after registration
userSchema.methods.userJSON = function (token) {
  return {
    userId: this.id,
    email: this.email,
    token: token,
  };
};
module.exports = mongoose.model('User', userSchema);
