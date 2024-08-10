const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoriesController')
const { authenticate, verifyJWT } = require('../middleware/authMiddelware');


router.post('/create-category', verifyJWT,categoryController.createCategories)
router.get('/get-all-categories', verifyJWT, categoryController.getAllCategories)
router.put('/updateCategory', verifyJWT, categoryController.updateCategory)
router.delete('/deleteCategory', verifyJWT,categoryController.deleteCategory)

module.exports = router