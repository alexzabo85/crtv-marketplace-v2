import express from 'express'
// import productCtrl from '../controllers/product.controller'
import adminCtrl from '../controllers/admin.controller'
// import shopCtrl from '../controllers/shop.controller'

const router = express.Router()

// router.param('shopId', shopCtrl.shopByID)
// router.param('productId', productCtrl.productByID)


router.route('/api/admin/generate-products')
    .get(adminCtrl.generateProducts)

router.route('/api/admin/generate-users')
    .get(adminCtrl.generateUsers)

export default router


