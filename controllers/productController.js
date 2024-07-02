const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/productModel');

exports.createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, stock } = req.body;

    const product = new Product({
        name,
        description,
        price,
        stock
    });

    await product.save();

    res.status(200).json(new ApiResponse(200, product, "Product Created Successfully"));
});

exports.getAllProducts = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const searchQuery = req.query.search || '';
        const sortField = req.query.sortBy || '_id';
        const sortOrder = req.query.order === 'desc' ? -1 : 1;

        const products = await Product.find({
            name: { $regex: searchQuery, $options: 'i' }
        })
            .sort({ [ sortField ]: sortOrder })
            .skip(skip)
            .limit(limit);

        if (!products.length) {
            throw new ApiError(404, 'No product found');
        }

        res.status(200).json(new ApiResponse(200, products, 'Products fetched successfully'));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, "Something went wrong while fetching products"));
    }
});

exports.updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    try {
        const product = await Product.findById(id);
        if (product) {
            product.name = name;
            product.description = description;
            product.price = price;
            product.stock = stock;

            await product.save();
            const updatedProduct = await Product.findById(product._id);

            return res.status(200).json(new ApiResponse(200, updatedProduct, 'Product updated successfully'));
        } else {
            res.status(404).json(new ApiError(404, 'Product not found'));
        }
    } catch (error) {
        res.status(500).json(new ApiError(500, 'Something went wrong'));
    }
});

exports.deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            res.status(404).json(new ApiError(404, 'Product not found'));
        }
        
        return res.status(200).json(new ApiResponse(200, 'Product deleted successfully'));
    } catch (error) {
        console.log("errorrrr", error)
        res.status(500).json(new ApiError(500, 'Something went wrong'));
    }
});

exports.getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);

        if (!product) {
            res.status(404).json(new ApiError(404, 'Product not found'));
        } else {
            return res.status(200).json(new ApiResponse(200, product, 'Product retrieved successfully'));
        }
    } catch (error) {
        res.status(500).json(new ApiError(500, 'Something went wrong'));
    }
});
