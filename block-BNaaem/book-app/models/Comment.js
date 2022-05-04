var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    title: String,
    likes: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    Book: { type: Schema.Types.ObjectId, ref: 'Book' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
