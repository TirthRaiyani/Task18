const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: [ 0, 'Stock cannot be negative' ]
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    images: [ {
        type: String
    } ]
});


productSchema.methods.updateStock = async function (quantity) {
    this.stock -= quantity;
    await this.save();
};

productSchema.methods.isLowStock = function (threshold = 10) {
    return this.stock <= threshold;
};

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
