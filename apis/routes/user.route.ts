import { Router } from 'https://deno.land/x/oak/mod.ts';
import authController from '../controllers/authController.ts';

const router = new Router()

router
  .post('/user', authController.createUser)
  .post('/customers', authController.checkCustomers)
  
  .get('/user', authController.getUsers)
  .delete('/user/:id', authController.deleteAccount)
  .put('/user', authController.editUser)


  //GAME
  .post('/game', authController.createGame)
  .get('/game', authController.getGame)
  .put('/game', authController.editGame)
  .delete('/game/:id', authController.deleteGame)

  .post('/login', authController.loginUser)
  .post('/updateUser', authController.updateUser)
  // .post('/branch', authController.createBranch)
  // .get('/branch', authController.getBranches)
  .get('/roles', authController.getRoles)

  .post('/update_transactoion', authController.updateTransaction)
  .post('/flutter', authController.flutterWave)
export default router
