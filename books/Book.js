const mongoose = require("mongoose");

const BookModel = mongoose.model("Book", {
    title: {
        type: String, 
        required: true
    }, 
    author: {
        type: String, 
        required: true
    }, 
    numberOgPages: {
        type: Number, 
        required: false
    }, 
    publisher: {
        type: String, 
        required: false
    }
});

module.exports = { BookModel };