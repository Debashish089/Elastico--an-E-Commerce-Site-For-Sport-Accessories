const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product Name"],  // nam na likhle enter name bolbe
    trim: true
  },
  description: {
    type: String,
    required: [true, "Please Enter product Description"],
  },

  price: {
    type: Number,
    required: [true, "Please Enter product Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },

  ratings: {
    type: Number,
    default: 0,     // kw rating na dile 0
  },

  images: [          // array nilam karon product er 3-4 ta image hote pare
    {
      public_id: {         // image host krr jnno use korbo cloudnight jekhane public id pabo
        type: String,
        required: true,
      },

      url: {
        type: String,
        required: true,
      }
    }
  ],

  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },

  Stock: {
    type: Number,
    required: [true, "Please Enter product Stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },

  numOfReviews: {
    type: Number,
    default: 0,
  },
  
  reviews: [
    {

        user:{          
          type: mongoose.Schema.ObjectId,
          ref: "User",         
          required: true,

      },
      
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      }
    }
  ],

  user:{          // kun admin product create korlo seta bujhar jnno

    type: mongoose.Schema.ObjectId,
    ref: "User",         // productController er create products e (req.body.user = req.user.id) line theke admin er id pacchi
    required: true,

  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);