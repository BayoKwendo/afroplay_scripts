import { Router } from 'https://deno.land/x/oak/mod.ts';
import customerController from '../controllers/customerController.ts';
import authorize from '../middlewares/authorizedmiddle.ts';

const router = new Router();

router
	.get('/customers', authorize, customerController.getCustomer)

	// PRODUCT

	.post('/product', customerController.createProduct)
	.get('/product', customerController.getProduct)
	.put('/product', customerController.editProduct)
	.delete('/product/:id', customerController.deleteProduct)

	.put('/product_status', customerController.updateProduct)




export default router;
