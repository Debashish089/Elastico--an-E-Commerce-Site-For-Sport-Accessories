const app = require("./app");

const dotenv = require("dotenv");

// Handling uncaught exception--- defined na thakle ei error show krbe o server close hoye jbe

process.on("uncaughtException", (err) => {

  console.log(`Error: ${err.message}`);
  console.log(`Shutting down server due to UnCaught Exception`);
  process.exit(1);
 


});



// config ke connect korlam niche

dotenv.config({path:"backend/config/config.env"}); //path diye connect diye dilam


const connectDatabase = require("./config/database");

// connecting to database

connectDatabase();

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