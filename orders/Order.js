const mongoose = require("mongoose");

const OrderModel = mongoose.model("Order", {
    customerId: {
        type: mongoose.SchemaTypes.ObjectId, 
        required: true
    }, 
    bookId: {
        type: mongoose.SchemaTypes.ObjectId, 
        required: true
    }, 
    purchaseDate: {
        type: Date, 
        required: true
    }, 
    deliveryDate: {
        type: Date, 
        required: true
    }
});

module.exports = { OrderModel };