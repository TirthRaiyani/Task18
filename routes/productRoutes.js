const express = require('express');
const router = express.Router();
const { authenticate, verifyJWT } = require('../middleware/authMiddelware');
const { CP, validateRequest } = require('../middleware/validationMiddleware')
const productController = require('../controllers/productController');
const upload = require('../utils/multer')


router.post('/create', authenticate, upload.fields([ { name: 'images', maxCount: 1 }]), productController.createProduct);
router.get('/getallproducts', verifyJWT, productController.getAllProducts);
router.get('/productbyid/:id', verifyJWT, productController.getProductById);
router.put('/updateproducts/:id', authenticate, productController.updateProduct);
router.delete('/deleteproducts/:id', authenticate, productController.deleteProduct);
router.post('/update-stock/:id',verifyJWT,productController.updateStock);
router.get('/low-stock-alerts',verifyJWT,productController.lowStockAlerts);

module.exports = router



