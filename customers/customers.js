const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { CustomerModel } = require("./Customer");

const app = express();
const PORT = process.env.PORT || 4002;

mongoose.connect("mongodb+srv://techsuryakanthota:HwVsJJYSQgmUb5AZ@cluster0.0lvcngb.mongodb.net/?retryWrites=true&w=majority").then(( resp ) => {
    console.log("Customer service db connected");
}).catch(( error ) => {
    console.log("Customer service db error");
});

app.use(bodyParser.json());

app.get("/", ( req, res ) => {
    res.send("Customers service");
});

app.get("/customers", ( req, res ) => {
    CustomerModel.find().then(resp => {
        res.status(200).json(resp);
    }).catch(error => {
        res.status(404).json("Customers not found");
    });
});

app.post("/customer", ( req, res ) => {
    console.log("req.body====", req.body);
    const newCustomer = {
        name: req.body.name, 
        age: req.body.age, 
        address: req.body.address
    };
    const customer = new CustomerModel(newCustomer);
    customer.save().then( resp => {
        res.status(200).send("Customer created");
    }).catch( error => {
        res.status(400).send("Error");
    });
});

app.get("/customer/:id", ( req, res ) => {
    const { id: customerId } = req.params;
    CustomerModel.findById(customerId).then(resp => {
        res.status(200).json(resp);
    }).catch(error => {
        res.status(404).json("Customer not found");
    });
});

app.delete("/customer/:id", ( req, res ) => {
    const { id: customerId } = req.params;
    CustomerModel.findByIdAndRemove(customerId).then(resp => {
        res.status(200).send("Deleted customer successfully");
    }).catch(error => {
        res.status(404).json("Customer not found");
    });
});

app.listen(PORT, () => {
    console.log("Server is up and running");
});