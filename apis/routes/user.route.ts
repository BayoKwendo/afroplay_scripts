import { Router } from 'https://deno.land/x/oak/mod.ts';
import authController from '../controllers/authController.ts';

const router = new Router()

router
  // .post('/user', authController.createUser)
  .post('/customers', authController.checkCustomers)


  //GAME

  .post('/game', authController.createGame)
  .get('/game', authController.getGame)
  .put('/game', authController.editGame)
  .delete('/game/:id', authController.deleteGame)


  // .put('/user', authController.editUser)
  // .delete('/user/:id', authController.deleteAccount)
  // .post('/login', dauthController.loginUser)
  // .post('/updateUser', authController.updateUser)
  // .post('/branch', authController.createBranch)
  // .get('/branch', authController.getBranches)
  // .get('/roles', authController.getRoles)
export default router
