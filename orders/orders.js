const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 4003;

const { OrderModel } = require("./Order");

mongoose.connect("mongodb+srv://techsuryakanthota:HwVsJJYSQgmUb5AZ@cluster0.0lvcngb.mongodb.net/?retryWrites=true&w=majority").then(( resp ) => {
    // console.log("resp", resp);
}).catch(( error ) => {
    // console.log("error", error);
});

app.use(bodyParser.json());

app.get("/", ( req, res ) => {
    res.send("Orders service");
});

app.post("/order", ( req, res ) => {
    console.log("req.body====", req.body);
    const newOrder = {
        customerId: req.body.customerId, 
        bookId: req.body.bookId, 
        purchaseDate: req.body.purchaseDate, 
        deliveryDate: req.body.deliveryDate, 
    };
    const order = new OrderModel(newOrder);
    order.save().then( resp => {
        res.status(200).send("Order created success");
    }).catch( error => {
        console.log("req.error====", error);
        res.status(400).send("Error");
    });
});

app.get("/orders", ( req, res ) => {
    OrderModel.find().then(resp => {
        res.status(200).json(resp);
    }).catch(error => {
        res.status(404).json("Orders not found");
    });
});

app.get("/order/:id", ( req, res ) => {
    const { id: OrderId } = req.params;
    console.log("OrderId", OrderId);
    OrderModel.findById(OrderId).then(resp => {
        console.log("resp", resp);
        const cURL = "http://localhost:4002/customer/" + resp.customerId.toString();
        const bURL = "http://localhost:4001/book/" + resp.bookId.toString();
        console.log("cURL, bURL", cURL, bURL);
        if ( resp ) {
            Promise.allSettled([
                axios.get(cURL), 
                axios.get(bURL)
            ]).then(([ customerResp, bookResp ]) => {
                // console.log("customerResp, bookResp", customerResp, bookResp);
                const newResp = {
                    purchaseDate: resp.purchaseDate, 
                    deliveryDate: resp.deliveryDate
                };
                if ( customerResp && customerResp.value.status === 200 ) {
                    console.log("customerResp data ", customerResp.value.data);
                    newResp["customer"] = customerResp.value.data;
                } else {
                    throw new Error("Customer not found");
                }
                if ( bookResp && bookResp.value.status === 200 ) {
                    console.log("bookResp data ", bookResp.value.data);
                    newResp["book"] = bookResp.value.data;
                } else {
                    throw new Error("Book not found");
                }
                res.status(200).json(newResp);
            }).catch(err => {
                console.log("customer err");
            });
        } else {
            throw new Error("Book not found");
        }
    }).catch(error => {
        res.status(404).send(error);
    });
});

app.listen(PORT, () => {
    console.log("Server is up and running");
});
