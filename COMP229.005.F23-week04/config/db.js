// Do not expose your credentials in your code.
let config = require('./config');

// Database setup
const mongoose = require('mongoose');

const productSchema=mongoose.Schema(
    {
        name:{
            type: String,
            required:[true, "Please enter name"]

        },
        decription:
        {
            type: String,
            
        },
        price:
        {
            type:Number,

        },
        published:
        {
            type: Boolean,
        },
        category:
        {
            type: String,
        }
    
    }
)
const Product=mongoose.model('Product',productSchema);
module.exports=Product;

const categorySchema=mongoose.Schema(
    {
        name: {
            type:String,
            
        }
    }
)
const category=mongoose.model('Category', categorySchema);
module.exports=category;

module.exports = function(){

    mongoose.connect(config.ATLASDB);

    let mongodb = mongoose.connection;

    mongodb.on('error', console.error.bind(console, 'Connection Error: '));
    mongodb.once('open', ()=>{
        console.log("====> Connected to MongoDB.");
    })

    return mongodb;

}