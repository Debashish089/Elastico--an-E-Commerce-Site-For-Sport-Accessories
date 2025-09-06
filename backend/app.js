const express= require("express");     // express import korlam

const app = express();                 // express er sob func ekhn app diye access korbo

const cookieParser = require("cookie-parser");     // cookie-parser import korlam
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");



const errorMiddleware = require("./middleware/error");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}



app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload());

// Route imports korbo ekhn

const product = require('./routes/productRoute');

const user = require('./routes/userRoute');

const order = require('./routes/orderRoute');
const payment = require("./routes/paymentRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);     // eta likhar karone userRoute e router.route("/register") likkhte parbo, naile barbar router.route("api/v1/register") likha lagto
app.use("/api/v1", order);
app.use("/api/v1", payment);






// middleware for error

app.use(errorMiddleware);


module.exports = app 

