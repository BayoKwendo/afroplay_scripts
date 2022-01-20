import { Router } from 'https://deno.land/x/oak/mod.ts';
import authController from '../controllers/authController.ts';

const router = new Router()

router
  // .post('/user', authController.createUser)
  .post('/customers', authController.checkCustomers)
  // .put('/user', authController.editUser)
  // .delete('/user/:id', authController.deleteAccount)
  // .post('/login', authController.loginUser)
  // .post('/updateUser', authController.updateUser)
  // .post('/branch', authController.createBranch)
  // .get('/branch', authController.getBranches)
  // .get('/roles', authController.getRoles)
export default router
