var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var profileSchema = new Schema({
  username: { type: String, unique: true },
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  bio: String,
  image: { type: String, default: null },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

profileSchema.pre('save', async function (next) {
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
