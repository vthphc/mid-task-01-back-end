const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

const User = require("../models/users.js");

const JWT_SECRET = "your_jwt_secret_key";
const JWT_SECRET_REFRESH = "your_jwt_secret_key_refresh";

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


router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Username not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "24h",
        });

        return res.json({ token });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

router.post("/signup", async (req, res) => {
    const { username, role } = req.body;
    const password = req.body.password.trim();

    const salt = await bcrypt.genSalt(10);

    try {
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ username, password: hashedPassword, role });
        await user.save();
        res.status(201).json(user);
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

router.get("/profile", verifyToken, async (req, res) => {
    const { id } = req.user;

    try {
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

module.exports = router;
