const express = require("express");
const router = express.Router();
const Customer = require("../models/customers.js");

//middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(403).json({ message: "Access Denied" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        res.json(customer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post("/", async (req, res) => {
    const { fullName, phoneNumber, email, gender, dateOfBirth } = req.body;

    if (!phoneNumber || !email) {
        return res
            .status(400)
            .json({ message: "Phone number and email are required." });
    }

    const customer = new Customer({
        fullName,
        phoneNumber,
        email,
        gender,
        dateOfBirth,
    });

    try {
        const newCustomer = await customer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyValue)[0];
            res.status(400).json({
                message: `Duplicate value for ${duplicateField}: '${err.keyValue[duplicateField]}'. Please use a different ${duplicateField}.`,
            });
        } else {
            res.status(400).json({ message: err.message });
        }
    }
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const { fullName, phoneNumber, email, gender, dateOfBirth } = req.body;
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            { fullName, phoneNumber, email, gender, dateOfBirth },
            { new: true }
        );
        res.json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const removedCustomer = await Customer.findByIdAndDelete(req.params.id);
        res.json({ message: "Customer deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
