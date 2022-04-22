var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bookSchema = new Schema(
  {
    isbn: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    categories: [String],
    publish_date: { type: Date, required: true },
    publisher: { type: String, required: true },
    numOfPagaes: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    comments: { type: Schema.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
