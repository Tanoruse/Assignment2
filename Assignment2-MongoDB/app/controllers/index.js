
const product = require('../models/product')

module.exports.home = async function (req, res, next) {
    try {
      res.json({
        success: true,
        message: "Welcome to dress store application",
      });
    } catch (error) {
      next(error);
    }
  };
  
  module.exports.getProducts = async function (req, res, next) {
    try {
      let products = await product.find();
      res.json(products);
    } catch (error) {
      next(error);
    }
  };
  
  module.exports.prd = async function (req, res, next) {
    try {
      let id = req.params.id;
      let prod = await product.findById(id);
      if (prod != null) {
        res.json(prod);
      } else throw new Error("Product not found");
    } catch (error) {
      next(error);
    }
  };
  
  module.exports.Add = async function (req, res, next) {
    try {
      let data = await product.create(req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };
  
  module.exports.update = async function (req, res, next) {
    try {
      let id = req.params.id;
      let prod1 = new product(req.body);
      prod1._id = id;
      let data = await product.findByIdAndUpdate(id, prod1);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };
  
  module.exports.remove = async function (req, res, next) {
    try {
      let id = req.params.id;
      let data = await product.findByIdAndDelete(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };