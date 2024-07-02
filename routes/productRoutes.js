const express = require('express');
const router = express.Router();
const { authenticate, verifyJWT } = require('../middleware/authMiddelware');
const { CP, validateRequest } = require('../middleware/validationMiddleware')
const productController = require('../controllers/productController');


router.get('/getallproducts', verifyJWT, productController.getAllProducts);
router.get('/productbyid/:id', verifyJWT, productController.getProductById);
router.post('/create', authenticate, productController.createProduct);
router.put('/updateproducts/:id', authenticate, productController.updateProduct);
router.delete('/deleteproducts/:id', authenticate, productController.deleteProduct);

module.exports = router;



