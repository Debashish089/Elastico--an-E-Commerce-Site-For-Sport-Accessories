const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router=express.Router();

router.route("/products").get(getAllProducts);    // product get er route set korlam. AuthenticatedUser admin holei sudhu parbe, ei func ache auth.js e
router.route("/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);   // product create er route set korlam, AuthenticatedUser admin holei sudhu parbe, ei func ache auth.js e

router
.route("/product/:id")
.put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
.delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
.get(getProductDetails);   // product update and delete er route, dutatei id  lage, tai eksthe lekha gelo


module.exports = router