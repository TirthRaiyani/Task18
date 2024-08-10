const Categories = require('../models/categoriesModel')
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

exports.createCategories = async(req,res) => {
    const {name, description} = req.body

    if(!name ||!description){
        return res.status(400).json({message:'All fields are required'})
    }

    const category = new Categories({
        name,
        description,
    })

    await category.save()
    return res.status(200).json({statuscode:200,success:true, data: category, message:"category created successfully"})
}

exports.getAllCategories = (async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const searchQuery = req.query.search || '';
        const sortField = req.query.sortBy || '_id';
        const sortOrder = req.query.order === 'desc' ? -1 : 1;

        const categories = await Category.find({
            name: { $regex: searchQuery, $options: 'i' }
        })
            .sort({ [ sortField ]: sortOrder })
            .skip(skip)
            .limit(limit)

        if (!categories.length) {
            throw new ApiError(404, 'No product found');
        }

        res.status(200).json(new ApiResponse(200, products, 'Categories fetched successfully'));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, "Something went wrong while fetching categories"));
    }
});

exports.deleteCategory = (async (req, res) => {
    const { id } = req.params;
    try {
        const categories = await Category.findByIdAndDelete(id);

        if (!categories) {
            res.status(404).json(new ApiError(404, 'categories not found'));
        }

        return res.status(200).json(new ApiResponse(200, 'categories deleted successfully'));
    } catch (error) {
        console.log("errorrrr", error)
        res.status(500).json(new ApiError(500, 'Something went wrong'));
    }
});

exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const category = await Category.findById(id);
        if (category) {
            category.name = name;
            category.description = description;

            await category.save();
            const updatedCategory = await Category.findById(category._id);

            return res.status(200).json(new ApiResponse(200, updatedCategory, 'category updated successfully'));
        } else {
            res.status(404).json(new ApiError(404, 'category not found'));
        }
    } catch (error) {
        res.status(500).json(new ApiError(500, 'Something went wrong'));
    }
};