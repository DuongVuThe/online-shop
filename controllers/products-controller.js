const Product = require("../models/product-model");
const mongodb = require("mongodb");

async function getAllProduct(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render("customer/products/all-products", { products: products });
  } catch (error) {
    return next(error);
  }
}

async function getProductDetails(req, res, next) {
  const productId = new mongodb.ObjectId(req.params.id);
  try {
    const product = await Product.findById(productId);
    res.render("customer/products/product-detail", { product: product });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAllProduct: getAllProduct,
  getProductDetails: getProductDetails,
};
