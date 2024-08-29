const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minLength: 8,
        },
        role: String,
    },
    { versionKey: false }
);

userSchema.index({ username: 1 }, { unique: true });

const User = mongoose.model("User", userSchema, "users");

User.createIndexes();

module.exports = User;
