
const mongoose = require('mongoose')
const schema = mongoose.mongo.schema;
const product = new mongoose.Schema( {
name: String,
description: String,
price: Number,
published: Boolean,
category: String,

})
module.exports = mongoose.model("Product", product)