const express= require("express");     // express import korlam

const app = express();                 // express er sob func ekhn app diye access korbo

const cookieParser = require("cookie-parser");     // cookie-parser import korlam

const errorMiddleware = require("./middleware/error");

app.use(express.json());
app.use(cookieParser());

// Route imports korbo ekhn

const product = require('./routes/productRoute');

const user = require('./routes/userRoute');

app.use("/api/v1", product);
app.use("/api/v1", user);     // eta likhar karone userRoute e router.route("/register") likkhte parbo, naile barbar router.route("api/v1/register") likha lagto


// middleware for error

app.use(errorMiddleware);




module.exports = app 

