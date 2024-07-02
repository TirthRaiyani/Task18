const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/authMiddelware');
const { CP, validateRequest } = require('../middleware/validationMiddleware')
const productController = require('../controllers/productController');


router.get('/getallproducts', authenticate, productController.getAllProducts);
router.get('/productbyid/:id', authenticate, productController.getProductById);
router.post('/create', authenticate, productController.createProduct);
router.put('/updateproducts/:id', authenticate, productController.updateProduct);
router.delete('/deleteproducts/:id', authenticate, productController.deleteProduct);

module.exports = router;



