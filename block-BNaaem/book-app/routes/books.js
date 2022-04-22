var express = require('express');
var User = require('../models/User');
var Book = require('../models/Book');
var auth = require('../middlewares/auth');

var router = express.Router();

/* GET list of all books. */
router.get('/', function (req, res, next) {
  Book.find({}, (err, books) => {
    if (err) return next(err);

    res.json({ books });
  });
});

//create a new book
router.post('/', auth.verifyToken, (req, res, next) => {
  let data = req.body;
  Book.create(data, (err, createdBook) => {
    if (err) return next(err);
    res.json({ createdBook });
  });
});
//update a book

router.put('/:id', auth.verifyToken, (req, res, next) => {
  let data = req.body;
  let bookId = req.params.id;

  Book.findByIdAndUpdate(bookId, data, (err, updatedBook) => {
    if (err) return next(err);
    res.json({ updatedBook });
  });
});

//delete a book

router.delete('/:id', auth.verifyToken, (req, res, next) => {
  let bookId = req.params.id;

  Book.findByIdAndDelete(bookId, (err, deletedBook) => {
    if (err) return next(err);
    res.json({ deletedBook });
  });
});

//get book by id

router.get('/:id', (req, res, next) => {
  let bookId = req.params.id;

  Book.findById(bookId, (err, book) => {
    if (err) return next(err);
    res.json({ book });
  });
});
//get list of all comments of current book

router.get('/:id/comments', (req, res, next) => {
  let bookId = req.params.id;

  Book.findById(bookId)
    .populate('comments')
    .exec((err, book) => {
      if (err) return next(err);
      res.json({ book });
    });
});
//creating new comment

router.post('/:id/comment/new', auth.verifyToken, (req, res, next) => {
  let bookId = req.params.id;
  let data = req.body;
  data.createdBy = req.user.id;
  Comment.create(data, (err, createdComment) => {
    if (err) return next(err);
    User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { comments: createdComment.id },
      },
      (err, updatedUser) => {
        res.json({ createdComment, updatedUser });
      }
    );
  });
});
//edit comment

router.get('/:id/comment/edit/:commId', auth.verifyToken, (req, res, next) => {
  let bookId = req.params.id;
  let commentId = req.params.commId;

  Comment.findById(commentId, (err, comment) => {
    if (err) return next(err);
    res.json({ comment });
  });
});

router.post('/:id/comment/edit/:commId', auth.verifyToken, (req, res, next) => {
  let bookId = req.params.id;
  let commentId = req.params.commId;
  let data = req.body;

  Comment.findByIdAndUpdate(commentId, data, (err, updatedComment) => {
    if (err) return next(err);
    res.json({ updatedComment });
  });
});

//list books by category

router.get('/list/by/:category', function (req, res, next) {
  let category = req.params.category;

  Book.find({ category: category }, (err, books) => {
    if (err) return next(err);

    res.json({ books });
  });
});

module.exports = router;
