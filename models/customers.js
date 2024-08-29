const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        fullName: String,
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        gender: String,
        dateOfBirth: Date,
    },
    { versionKey: false }
);

customerSchema.index({ phoneNumber: 1, email: 1 }, { unique: true });

const Customer = mongoose.model("Customer", customerSchema, "customers");

Customer.createIndexes();

module.exports = Customer;