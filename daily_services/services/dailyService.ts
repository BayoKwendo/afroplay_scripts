import client from '../db/client.ts';
import { TABLE } from '../db/config.ts';
import Farmer from '../interfaces/farmer.ts';
import Loan from '../interfaces/loan.ts';

export default {
	doesExistById: async ({ id }: Farmer) => {
		const [result] = await client.query(`SELECT COUNT(*) count FROM ${TABLE.FARMER} WHERE id = ? LIMIT 1`, [
			id,
		]);
		return result.count > 0;
	},
	//get withdraw request count
	updateTableLoans: async () => {
		return await client.query(
			`UPDATE ${TABLE.LOAN} SET reminder_lock = 0 WHERE status_paid = 0 AND completion_status =1 AND status =1`);
	},

	//update principal
	updateLoanPayment: async (
		{ id, amount, interest, check_amount, reminder, period_three }: Loan,
	) => {
		const query = await client.query(
			`UPDATE  ${TABLE.LOAN} SET 
				period_three = ${period_three},
		  check_amount = ${check_amount},
				principal_balance = ${amount},
				interest = ${interest}
				WHERE id =${id} AND status_paid = 0`,
		);
		return query;
	},


	//add rollover fee
	updateLoanInterestDefaulting: async (
		{ id, amount, interest, total_interest, reminder, period_three }: Loan,
	) => {
		const query = await client.query(
			`UPDATE  ${TABLE.LOAN} SET 
			rollover_fee = ${interest}
			 WHERE id =${id}`,
		);
		return query;
	},




	insertIntoStatements: async (
		{ credit, debit, interest, balance, loan_id, farmer_id, period }: Loan,
	) => {
		const query = await client.query(
			`INSERT INTO ${TABLE.LOAN_STATEMENT} SET 
				 credit=?, 
				 debit=?, 
				 interest=?,
				 balance=?, 
				 loan_id=?, 
				 farmer_id=?,
				 period=?`,
			[credit, debit, interest, balance, loan_id, farmer_id, period],
		);
		return query;
	},


	updateIntoStatements: async (
		{ interest, loan_id, farmer_id }: Loan,
	) => {
		const query = await client.query(
			`UPDATE ${TABLE.LOAN_STATEMENT} SET 
			rollover_fee=${interest}
			WHERE loan_id = ${loan_id} AND farmer_id = ${farmer_id} AND period = 4 ORDER BY created_on DESC limit 1`);
		return query;
	},
	//get customers
	getDaily: async () => {
		return await client.query(
			`SELECT id, total_amount, farmer_id,total_interest, check_amount,interest,rollover_fee,
			 principal_balance, DATEDIFF(DATE_FORMAT(due_date, '%Y-%m-%d'),DATE_FORMAT(NOW(), '%Y-%m-%d')) d 
			 FROM 
			 ${TABLE.LOAN} 
			 WHERE status_paid = 0 AND completion_status =1 AND status =1 AND lock_period = 6 AND 
			 DATEDIFF(DATE_FORMAT(due_date, '%Y-%m-%d'),DATE_FORMAT(NOW(), '%Y-%m-%d')) BETWEEN  -30 AND 0`);
	},

	insertIntoWithdrawal: async (
		{ transaction_id, name, status, reference, description, working_balance }:
			Loan,
	) => {
		const query = await client.query(
			`INSERT INTO withdrawal_archives SET 
				 transaction_id=?, 
				 name=?, 
				 status=?, 
				 reference=?,
				 description=?, 
				 working_balance=?`,
			[transaction_id, name, status, reference, description, working_balance],
		);
		return query;
	},

	updateLoanStatement: async (
		{ id, reference }: Loan) => {
		const query = await client.query(
			`UPDATE withdrawal_archives SET 
			     status='success' 
				WHERE reference=?`, [reference]);
		return query;
	},



};
