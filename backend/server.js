
const app = require("./app");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");

// Handling uncaught exception--- defined na thakle ei error show krbe o server close hoye jbe

process.on("uncaughtException", (err) => {

  console.log(`Error: ${err.message}`);
  console.log(`Shutting down server due to UnCaught Exception`);
  process.exit(1);

});

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// Connecting to database
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});




const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);  // PORT variable = 4000 in config
});


//unhandled promise rejection- mongodb connect er smy knu bhul str dile server off kore dibe 

process.on("unhandledRejection", (err)=> {

  console.log(`Error: ${err.message}`);
  console.log(`Shutting down server due to unhandled promise rejection`);

  server.close(()=> {

    process.exit(1);

  });

});