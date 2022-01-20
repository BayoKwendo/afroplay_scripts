import { Router } from 'https://deno.land/x/oak/mod.ts';
import loanController from '../controllers/loanController.ts';
import { upload, preUploadValidate } from 'https://deno.land/x/oak_upload_middleware@3.0/mod.ts';
import authorize from '../middlewares/authorizedmiddle.ts';

const router = new Router();

router

	.post('/loan', authorize, loanController.createLoan)
	.post('/witness', authorize, loanController.createWitness)
	.post('/guarantor', authorize, loanController.createGuarantor)

	// update loan
	.put('/loan', authorize, loanController.updateLoan)
	.put('/witness', authorize, loanController.updateWitness)
	.put('/guarantor', authorize, loanController.updateGuarantor)


	.get('/loan', authorize, loanController.getLoan)
	.post('/b2c_token', loanController.insertToB2CD)
	.post('/loan_callback', loanController.insertIntoWithdrawal)
	.post('/mvalidation', loanController.mValidation)


	.post('/auction', authorize,loanController.insertIntoAuctioning)
	.get('/loan_auction', authorize, loanController.getLoanAuction)

	.get('/statement', loanController.getLoanStatement)

	.get('/loan_logs',  loanController.getStatementLogs)


	.post('/loan_progress', loanController.updateLoanStatusPerson)



	.post('/loan_stage_feedback', loanController.updateLoanStatusFeedback) // give out feedback

	.post('/loan_value_change', loanController.updateLoanValue) // give out feedback


	.post('/confirmation',  loanController.mpesaConfirmation)


	.post('/mvalidation_mobi', loanController.mValidation)

	.post('/confirmation_mobi', loanController.mmpesaConfirmation) // mpesa confirmation


	.get('/test_db',  loanController.testConnection)

	// reports


	.get('/loan_stages',  loanController.getLoanStages)
	.get('/loan_installment_report', loanController.getLoanInstallmentReport)


	.get('/loan_deposits', loanController.getDeposits)

	.get('/loan_withdrawals', loanController.getWithdrawals)

	.post('/reconciliation', loanController.reconciliationCreate)


// .delete('/livestock', authorize, livestockController.deleteLivestock);

export default router;
