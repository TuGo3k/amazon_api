const express = require("express");

const { getBooks, getBook, createBook, deleteBook, updateBook } = require("../controller/books");

const router = express.Router({ mergeParams: true });

// "/api/v1/books"
router.route("/").get(getBooks).post(createBook);

router.route("/:id").get(getBook).delete(deleteBook).put(updateBook);

module.exports = router;
