import { Router } from 'https://deno.land/x/oak/mod.ts';
import farmerController from '../controllers/farmerController.ts';
import authorize from '../middlewares/authorizedmiddle.ts';

const router = new Router();

router
	.post('/farmer', authorize, farmerController.createFarmer)
	.get('/farmer', authorize, farmerController.getFarmers)
	.post('/one_farmer', authorize, farmerController.getOneFarmer)
	.put('/farmer', authorize, farmerController.editFarmer)
	.delete('/farmer', authorize, farmerController.deleteFarmers)
	.get('/sms', authorize, farmerController.getSMS) // sms logs
	.post('/updatewallet', farmerController.updateWalletFarmer) // sms logs
	.get('/withdrawal_request', authorize, farmerController.getWithdrawalRequests) // sms logs
	.get('/withdrawal_archive', authorize, farmerController.getWithdrawalArchive) // sms logs

	.get('/charges', authorize, farmerController.getCharges) // sms logs

	.post('/otp_request', authorize, farmerController.createMsisdn) // otp request

	.post('/otp_verify', authorize, farmerController.confirmOTP) // otp verify


	.post('/sms_demo', farmerController.sendSMS) // send sns
	.post('/sms_all_staffs', farmerController.sendSMSAllStaffs) // send sns
	.get('/deposits', farmerController.getDeposits) // GET deposit logs
	.post('/call_logs', farmerController.createCallLog) // Post message
	.get('/call_logs', farmerController.getCallLogs) // GET message

	.get('/suspend_account', farmerController.getSuspendAccount) // GET message

	.post('/update_suspend', farmerController.updateSuspend) // uupdate suspend account


export default router;
