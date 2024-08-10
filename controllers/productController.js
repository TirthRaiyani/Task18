const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const Product = require('../models/productModel');
const Log = require('../models/logModel')

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categoryId } = req.body;
        const images = req.files && req.files[ 'image' ] ? req.files[ 'image' ].map(file => file.path) : [];

        const product = new Product({
            name,
            description,
            price,
            stock,
            categoryId,
            images: images
        });

        const savedProduct = await product.save();
        const createLog = await Log.create({
            userId: req.user._id, 
            operation: 'CREATE',
            model: 'Product',
            documentId: savedProduct._id,
            // changes: savedProduct.toObject()
        })

        res.status(200).json({ statuscode: 200, success: true, error: false, data: product, log: createLog, message : "Product Created Successfully"});
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, "Failed to create product"));
    }
};



// exports.getAllProducts = (async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         const searchQuery = req.query.search || '';
//         const sortField = req.query.sortBy || 'price';
//         const sortOrder = req.query.order === 'desc' ? -1 : 1;

//         const products = await Product.find({
//             name: { $regex: searchQuery, $options: 'i' }
//         })
//             .sort({ [ sortField ]: sortOrder })
//             .skip(skip)
//             .limit(limit)
//             .populate('categoryId')

//         if (!products.length) {
//             throw new ApiError(404, 'No product found');
//         }
//         await Log.create({
//             userId: req.user._id,
//             operation: 'READ',
//             model: 'Product',
//             documentId: products._id,
//             changes: products.toObject()
//         })

//         res.status(200).json(new ApiResponse(200, products, 'Products fetched successfully'));
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json(new ApiError(500, "Something went wrong while fetching products"));
//     }
// });

exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (page <= 0 || limit <= 0) {
            return res.status(400).json(new ApiError(400, 'Invalid page or limit parameter'));
        }

        const searchQuery = req.query.search || '';
        const sortField = req.query.sortBy || 'price';
        const sortOrder = req.query.order === 'desc' ? -1 : 1;

        const products = await Product.find({
            name: { $regex: searchQuery, $options: 'i' }
        })
            .sort({ [ sortField ]: sortOrder })
            .skip(skip)
            .limit(limit)
            .populate('categoryId');

        if (!products.length) {
            return res.status(404).json(new ApiError(404, 'No products found'));
        }

        for (const product of products) {
            await Log.create({
                userId: req.user._id,
                operation: 'READ',
                model: 'Product',
                documentId: product._id,
                changes: product.toObject()
            });
        }

        res.status(200).json(new ApiResponse(200, products, 'Products fetched successfully'));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, 'Something went wrong while fetching products'));
    }
};

exports.updateProduct = async (req, res) => {
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

            await Log.create({
                userId: req.user._id,
                operation: 'UPDATE',
                model: 'Product',
                documentId: updatedProduct._id,
                changes: updatedProduct.toObject()
            })

            return res.status(200).json(new ApiResponse(200, updatedProduct, 'Product updated successfully'));
        } else {
            res.status(404).json(new ApiError(404, 'Product not found'));
        }
    } catch (error) {
        res.status(500).json(new ApiError(500, 'Something went wrong'));
    }
};

exports.deleteProduct = (async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            res.status(404).json(new ApiError(404, 'Product not found'));
        }
        await Log.create({
            userId: req.user._id,
            operation: 'DELETE',
            model: 'Product',
            documentId: product._id,
            changes: product.toObject()
        })
        return res.status(200).json(new ApiResponse(200, 'Product deleted successfully'));
    } catch (error) {
        console.log("errorrrr", error)
        res.status(500).json(new ApiError(500, 'Something went wrong'));
    }
});

exports.getProductById = (async (req, res) => {
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

exports.updateStock =  async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json(new ApiResponse(404, null, "Product not found"));
        }

        if (product.stock < quantity) {
            return res.status(400).json(new ApiResponse(400, null, "Insufficient stock"));
        }

        await product.updateStock(quantity);

        res.status(200).json(new ApiResponse(200, product, "Stock updated successfully"));
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiResponse(500, null, "Failed to update stock"));
    }
};


 exports.lowStockAlerts = async (req, res) => {
    try {
        const threshold = parseInt(req.query.threshold) || 10;
        const lowStockProducts = await Product.find({ stock: { $lte: threshold } });

        res.status(200).json(new ApiResponse(200, lowStockProducts, "Low stock alerts generated"));
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiResponse(500, null, "Failed to generate low stock alerts"));
    }
};


