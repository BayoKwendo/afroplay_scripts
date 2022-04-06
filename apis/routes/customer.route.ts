import { Router } from 'https://deno.land/x/oak/mod.ts';
import customerController from '../controllers/customerController.ts';
import authorize from '../middlewares/authorizedmiddle.ts';

const router = new Router();

router
	.get('/customers', authorize, customerController.getCustomer)

	// PRODUCT

	.post('/product', customerController.createProduct)
	.get('/product', customerController.getProduct)

	.get('/bid_product', customerController.getBidProduct)
	.put('/product', customerController.editProduct)
	.delete('/product/:id', customerController.deleteProduct)
	.put('/product_status', customerController.updateProduct)

	.post('/add_draw', customerController.addDraw)
	.put('/edit_draw', customerController.editDraw)
	.get('/get_draw', customerController.getDraw)
	.delete('/delete_draw/:id', customerController.deleteDraw)
	.get('/customer_deposit', customerController.getCustomerDeposit)




export default router;
