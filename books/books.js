const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { BookModel } = require("./Book");
const app = express();
const PORT = process.env.PORT || 4001;


mongoose.connect("mongodb+srv://techsuryakanthota:HwVsJJYSQgmUb5AZ@cluster0.0lvcngb.mongodb.net/?retryWrites=true&w=majority").then(( resp ) => {
    // console.log("resp", resp);
}).catch(( error ) => {
    // console.log("error", error);
});

app.use(bodyParser.json());

app.get("/", ( req, res ) => {
    res.send("Books appewq");
});

app.post("/book", ( req, res ) => {
    console.log("req.body====", req.body);
    const newBook = {
        title: req.body.title, 
        author: req.body.author, 
        numberOgPages: req.body.numberOgPages, 
        publisher: req.body.publisher, 
    };
    const book = new BookModel(newBook);
    book.save().then( resp => {
        res.status(200).send("Testing our book route");
    }).catch( error => {
        res.status(400).send("Error");
    });
});

app.get("/books", ( req, res ) => {
    BookModel.find().then(resp => {
        res.status(200).json(resp);
    }).catch(error => {
        res.status(404).json("Books not found");
    });
});

app.get("/book/:id", ( req, res ) => {
    const { id: BookId } = req.params;
    BookModel.findById(BookId).then(resp => {
        res.status(200).json(resp);
    }).catch(error => {
        res.status(404).json("Books not found");
    });
});

app.delete("/book/:id", ( req, res ) => {
    const { id: BookId } = req.params;
    BookModel.findByIdAndRemove(BookId).then(resp => {
        res.status(200).send("Deleted book successfully");
    }).catch(error => {
        res.status(404).json("Books not found");
    });
});

app.listen(PORT, () => {
    console.log("Server is up and running");
});
