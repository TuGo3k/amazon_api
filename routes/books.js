const express = require("express");

const {
    getBooks,

} = require("../controller/books");

const router = express.Router({mergeParams: true});

// "/api/v1/books"
router.route("/").get(getBooks)

module.exports = router;
