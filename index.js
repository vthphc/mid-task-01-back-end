const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const databaseURL = process.env.DB_URL;

app.use(bodyParser.json());

app.use(cors());

mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
});
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.use("/customers", require("./routes/customers.js"));
app.use("/users", require("./routes/users.js"));
app.use("/auth", require("./routes/auth.js"));
