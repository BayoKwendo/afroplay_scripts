import client from '../db/client.ts';
import { TABLE } from '../db/config.ts';
import Farmer from '../interfaces/farmer.ts';

export default {
	doesExistById: async ({ id }: Farmer) => {
		const [result] = await client.query(`SELECT COUNT(*) count FROM ${TABLE.FARMER} WHERE id = ? LIMIT 1`, [
			id,
		]);
		return result.count > 0;
	},

	// create farmer
	addFarmer: async ({
		name,
		msisdn,
		id_no,
		gender,
		age,
		location,
		latitude,
		longitude,
		user_id,
		branch_id,
		pin,
		passport_photo,
		id_front_photo,
		id_back_photo,
	}: Farmer) => {
		const query = await client.query(
			`INSERT INTO ${TABLE.FARMER} SET 
        name =?, 
        msisdn=?, 
        id_no=?, 
        gender=?,
        age=?,
		user_id=?,
		branch_id=?, 
        location=?,
		latitude=?,
		longitude=?,
		pin=?,
		passport_photo=?,
		id_front_photo=?,
		id_back_photo=?`,
			[
				name,
				msisdn,
				id_no,
				gender,
				age,
				user_id,
				branch_id,
				location,
				latitude,
				longitude,
				pin,
				passport_photo,
				id_front_photo,
				id_back_photo,
			]
		);

		return query;
	},

	// opt check out
	insertINTOVerification: async ({ msisdn, code, expired }: Farmer) => {
		const query = await client.query(
			`INSERT INTO ${TABLE.VERIFICATION_CODES} SET 
			    msisdn = ?, 
				code =?, 
				expired =?`,
			[msisdn, code, expired]
		);
		return query;
	},


	//get verified otp
	getOTPVeriefied: async ({ msisdn, code }: Farmer) => {
		return await client.query(`SELECT * 
        FROM ${TABLE.VERIFICATION_CODES} WHERE msisdn=? AND code = ? AND status = 0`);
	},

	//get verified otp
	getOTPChecked: async () => {
		const result = await client.query(`SELECT * 
			FROM ${TABLE.VERIFICATION_CODES} WHERE status = 0 ORDER BY id ASC LIMIT 1`);
		return result;
	},


	// opt expired, change status to 1
	updateINTOVerification: async ({ id }: Farmer) => {
		const query = await client.query(
			`UPDATE ${TABLE.VERIFICATION_CODES} SET 
			   status =1 WHERE id =${id}`);
		return query;
	},


	// opt expired, change status to 1
	updateConfirmed: async ({ msisdn, code }: Farmer) => {
		const query = await client.query(
			`UPDATE ${TABLE.VERIFICATION_CODES} SET 
			   status =1 WHERE msisdn = ? AND code = ?`, [msisdn, code]);
		return query;
	},

	// insert sms log
	insertSMSLogs: async ({ destination, origin, status, message }: Farmer) => {
		const query = await client.query(
			`INSERT INTO ${TABLE.SMS_LOGS} SET 
			destination = ?, 
			origin =?, 
			status =?, 
			message =?`,
			[destination, origin, status, message]
		);

		return query;
	},

	//get all sms
	getSMSLog: async ({ offset, page_size }: Farmer) => {
		return await client.query(`SELECT * 
        FROM ${TABLE.SMS_LOGS} WHERE id ORDER BY id DESC LIMIT ${offset},${page_size}`);
	},

	//get sms count

	getSMSCount: async () => {
		const [result] = await client.query(`SELECT COUNT(id) count FROM ${TABLE.SMS_LOGS}`);
		return result.count;
	},

	//filter sms details
	getSMSFilter: async ({ filter_value }: Farmer) => {
		return await client.query(`SELECT * 
        FROM ${TABLE.SMS_LOGS} WHERE  origin =${filter_value} OR
        destination=${filter_value}`);
	},





	//insert into call logs
	insertCallLogs: async ({ duration, message, reference, farmer_id, created_by }: Farmer) => {
		const query = await client.query(
			`INSERT INTO ${TABLE.MESSAGE} SET 
			duration = ?, 
			description=?, 
			loan_reference =?, 
			farmer_id =?,
			created_by=?`,
			[duration, message, reference, farmer_id, created_by]
		);

		return query;
	},


	getCallLogs: async ({ reference }: Farmer) => {
		return await client.query(`SELECT * 
        FROM ${TABLE.MESSAGE} WHERE loan_reference="${reference}" ORDER BY id DESC`);
	},


	//get all sms
	getChargesLog: async ({ offset, page_size }: Farmer) => {
		return await client.query(`SELECT * FROM ngombe_loan.fee_charges WHERE id GROUP BY loan_reference, narrative ORDER BY id DESC LIMIT ${offset},${page_size}`);
	},

	//get sms count

	getChargesCount: async () => {
		const [result] = await client.query(`SELECT COUNT(id) count FROM fee_charges WHERE id GROUP BY loan_reference, narrative`);
		return result.count;
	},

	//filter sms details
	getFilter: async ({ filter_value }: Farmer) => {
		return await client.query(`SELECT * 
        FROM fee_charges WHERE  loan_reference =${filter_value} AND id GROUP BY loan_reference, narrative ORDER BY id DESC `);
	},



	//update farmer
	editFarmer: async ({ id, name, msisdn, id_no, gender, age, location }: Farmer) => {
		const query = await client.query(
			`UPDATE  ${TABLE.FARMER} SET 
        name =?, 
        msisdn=?, 
        id_no=?, 
        gender=?,
        age=?, 
        location=? WHERE id=?`,
			[name, msisdn, id_no, gender, age, location, id]
		);

		return query;
	},

	//update farmer wallet
	updateWalletFarmer: async ({ id_no, wallet_balance }: Farmer) => {
		const query = await client.query(
			`UPDATE  ${TABLE.FARMER} SET 
		wallet_balance = wallet_balance + ${wallet_balance} 
        WHERE id_no ="${id_no}"`
		);
		return query;
	},


	//update farmer wallet
	updateWalletLoanDisburse: async ({ id_no, wallet_balance }: Farmer) => {
		const query = await client.query(
			`UPDATE  ${TABLE.FARMER} SET 
		wallet_balance = ${wallet_balance} 
        WHERE id_no ="${id_no}"`
		);
		return query;
	},

	//update farmer wallet

	insertCharges: async ({ id_no, wallet_balance, loan_reference }: Farmer) => {
		const query = await client.query(
			`INSERT INTO fee_charges (application_fee, loan_reference, narrative) 
			VALUES (200,"${loan_reference}","Legal Fees"),
			(300,"${loan_reference}","Animal identification fees"),
			(300,"${loan_reference}","Vet Fees"),
			(300,"${loan_reference}","Admin Fees"),
			(33,"${loan_reference}","Mpesa Charges")`
		);
		return query;
	},
	//get farmer wallet
	getWalletBalance: async ({ id_no }: Farmer) => {
		const [query] = await client.query(
			`SELECT wallet_balance count FROM ${TABLE.FARMER} WHERE id_no ="${id_no}"`);
		return query.count;
	},

	//update loan status
	updateLoan: async ({ id, gender, principal_balance, interest }: Farmer) => {
		const query = await client.query(
			`UPDATE  ${TABLE.LOAN} SET 
		status = 1,
		principal_balance= "${principal_balance}",
		interest = "${interest}",
		due_date = "${gender}"
        WHERE id =${id}`
		);
		return query;
	},

	//update loan status
	updateLoanTotal: async ({ id, gender, total_amount, monthly_instalment,
		monthly_instalment_second,
		monthly_instalment_third, insurance_balance, insurance_fee,
		insurance_instalment_second,
		insurance_instalment_third, insurance_installment, principal_balance, interest }: Farmer) => {
		const query = await client.query(
			`UPDATE ${TABLE.LOAN} SET 
		status = 1,
		principal_balance= "${principal_balance}",
		interest = "${interest}",
		insurance_balance = "${insurance_balance}",
		insurance_installment = "${insurance_installment}",
		monthly_instalment = "${monthly_instalment}",
		monthly_instalment_second = ${monthly_instalment_second},
		monthly_instalment_third = ${monthly_instalment_third},
		insurance_instalment_second = ${insurance_instalment_second},
		insurance_instalment_third = ${insurance_instalment_third},
		insurance_fee = "${insurance_fee}",
		total_amount = "${total_amount}",
		due_date = "${gender}"
        WHERE id =${id}`
		);
		return query;
	},

	//get all farmers
	getFarmers: async ({ offset, page_size }: Farmer) => {
		return await client.query(`SELECT f.*, b.branch_name 
        FROM ${TABLE.FARMER} f
		INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
		LEFT JOIN ${TABLE.BRANCHES} b ON b.id = u.branch_id
		WHERE f.id ORDER BY f.id DESC LIMIT ${offset},${page_size}`);
	},

	//get farmers count

	getFarmersCount: async () => {
		const [result] = await client.query(`SELECT COUNT(id) count FROM ${TABLE.FARMER}`);
		return result.count;
	},

	//filter farmers details
	getFarmerFilter: async ({ filter_value }: Farmer) => {
		return await client.query(`SELECT f.*, b.branch_name 
        FROM ${TABLE.FARMER} f
		INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
		LEFT JOIN ${TABLE.BRANCHES} b ON b.id = u.branch_id 
		WHERE  f.name LIKE "%${filter_value}%" OR
        f.msisdn LIKE "%${filter_value}%" OR
        f.id_no LIKE "%${filter_value}%" OR
        f.gender LIKE "%${filter_value}%" OR
        f.age LIKE "%${filter_value}%" OR
        f.location LIKE "%${filter_value}%"`);
	},



//filter farmers details
getFarmerFilterID: async ({ filter_value }: Farmer) => {
	return await client.query(`SELECT f.*, b.branch_name 
	FROM ${TABLE.FARMER} f
	INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
	LEFT JOIN ${TABLE.BRANCHES} b ON b.id = u.branch_id 
	WHERE  
	f.id_no = "${filter_value}"`);
},




	//get all farmers
	getFarmersBranch: async ({ offset, page_size, user_id }: Farmer) => {
		return await client.query(`SELECT f.*, b.branch_name branch_name 
			FROM ${TABLE.FARMER} f 
			INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
			LEFT JOIN ${TABLE.BRANCHES} b ON b.id = u.branch_id
			WHERE f.id AND u.branch_id = (SELECT branch_id FROM ${TABLE.USERS} WHERE id = ${user_id})
			ORDER BY id DESC LIMIT ${offset},${page_size}`);
	},

	//get farmers count

	getFarmersBranchCount: async ({ user_id }: Farmer) => {
		const [result] = await client.query(`
		SELECT COUNT(f.id) count 
			FROM ${TABLE.FARMER} f 
			INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
			WHERE f.id AND u.branch_id = (SELECT branch_id FROM ${TABLE.USERS} WHERE id = ${user_id})`);
		return result.count;
	},

	//filter farmers details
	getFarmerBranchFilter: async ({ filter_value, user_id }: Farmer) => {
		return await client.query(`SELECT f.*, b.branch_name 
        FROM ${TABLE.FARMER} f
		INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
		LEFT JOIN ${TABLE.BRANCHES} b ON b.id = u.branch_id 
		WHERE
		u.branch_id = (SELECT branch_id FROM ${TABLE.USERS} WHERE id = ${user_id}) AND
		f.name LIKE "%${filter_value}%" OR
        f.msisdn LIKE "%${filter_value}%" OR
        f.id_no LIKE "%${filter_value}%" OR
        f.gender LIKE "%${filter_value}%" OR
        f.age LIKE "%${filter_value}%" OR
        f.location LIKE "%${filter_value}%"`);
	},


	//delete
	deleteFarmer: async ({ id }: Farmer) => {
		const result = await client.query(`DELETE FROM ${TABLE.FARMER} WHERE id = ?`, [id]);
		return result;
	},

	//get all withdrawal requests
	getWithdrawalRequests: async ({ offset, page_size }: Farmer) => {
		return await client.query(`SELECT w.*, f.id_no, f.name, a.transaction_id,a.reference 
		FROM 
		${TABLE.WITHDRAWAL_REQUEST} w inner join ${TABLE.FARMER} f on w.msisdn = f.msisdn inner join ${TABLE.WITHDRAWAL_ARCHIVES} a on w.reference = a.reference 
		ORDER BY w.id DESC LIMIT ${offset},${page_size}`);
	},

	// get details of one farmer
	getOneFarmer: async ({ msisdn }: Farmer) => {
		const [result] = await client.query(`SELECT * FROM ${TABLE.FARMER} WHERE msisdn = ? LIMIT 1`, [msisdn]);

		return result;
	},

	//get withdraw request count
	getWithdrawCount: async () => {
		const [result] = await client.query(
			`SELECT COUNT(w.id) count 
			FROM
			${TABLE.WITHDRAWAL_REQUEST} w inner join ${TABLE.FARMER} f on w.msisdn = f.msisdn inner join ${TABLE.WITHDRAWAL_ARCHIVES} a on w.reference = a.reference `
		);
		return result.count;
	},

	//filter  details
	getWithdrawalRFilter: async ({ filter_value }: Farmer) => {
		return await client.query(`SELECT w.*, f.id_no, f.name,a.transaction_id,a.reference
			FROM ${TABLE.WITHDRAWAL_REQUEST} w inner join ${TABLE.FARMER} f on w.msisdn = f.msisdn inner join ${TABLE.WITHDRAWAL_ARCHIVES} a on w.reference = a.reference 

			WHERE f.id_no ="${filter_value}" OR a.transaction_id LIKE "%${filter_value}%" OR a.reference  LIKE "%${filter_value}%"  `);
	},

	//get all withdrawal requests
	getWithdrawalArchive: async ({ offset, page_size }: Farmer) => {
		return await client.query(`SELECT w.*, f.name farmer_name
		FROM ${TABLE.WITHDRAWAL_ARCHIVES} w
		inner join ${TABLE.FARMER} f on w.name = f.msisdn
		ORDER BY w.id DESC LIMIT ${offset},${page_size}`);
	},

	//get withdraw request count
	getWithdrawArchiveCount: async () => {
		const [result] = await client.query(
			`SELECT COUNT(w.id) count 
			FROM ${TABLE.WITHDRAWAL_ARCHIVES} w
			inner join ${TABLE.FARMER} f on w.name = f.msisdn
			`
		);
		return result.count;
	},

	//filter  details
	getWithdrawalArchiveFilter: async ({ filter_value }: Farmer) => {
		return await client.query(`SELECT w.*, f.name farmer_name			
		FROM ${TABLE.WITHDRAWAL_ARCHIVES} w
		inner join ${TABLE.FARMER} f on w.name = f.msisdn  
			WHERE w.transaction_id LIKE "%${filter_value}%" OR w.reference LIKE "%${filter_value}%"`);
	},

	// retrieve deposits

	//filter  details
	getDepositsArchvie: async ({ offset, page_size }: Farmer) => {
		return await client.query(`SELECT w.*,  f.name
				FROM ${TABLE.DEPOSIT} w left join ${TABLE.FARMER} f on w.user_id_no = f.id_no 
				ORDER BY w.id DESC LIMIT ${offset},${page_size}`);
	},

	//get withdraw request count
	getDepsositArchiveCount: async () => {
		const [result] = await client.query(
			`SELECT COUNT(w.id) count 
			FROM ${TABLE.DEPOSIT} w`
		);
		return result.count;
	},

	//filter  details
	getDepositFilter: async ({ filter_value }: Farmer) => {
		return await client.query(`SELECT w.*			
		FROM ${TABLE.DEPOSIT} w  
			WHERE 
			w.transaction_id 
			LIKE "%${filter_value}%" OR 
			w.msisdn LIKE "%${filter_value}%" 
			OR w.user_id_no LIKE "%${filter_value}%"`);
	},



	//SUSPEND ACCOUNT
	getSuspendAccount: async ({ offset, page_size }: Farmer) => {
		return await client.query(`SELECT *
						FROM ${TABLE.SUSPEND_ACCOUNT} where status = 0 
				ORDER BY id DESC LIMIT ${offset},${page_size}`);
	},

	getCOUNT: async () => {
		const [result] = await client.query(
			`SELECT COUNT(id) count 
			FROM ${TABLE.SUSPEND_ACCOUNT} WHERE status = 0`
		);
		return result.count;
	},

	//filter  details
	getSuspendFilter: async ({ filter_value }: Farmer) => {
		return await client.query(`SELECT *			
		FROM ${TABLE.SUSPEND_ACCOUNT}  
			WHERE 
			transaction_id LIKE "%${filter_value}%" OR 
			name LIKE "%${filter_value}%" OR 
			msisdn LIKE "%${filter_value}%" OR 
			amount LIKE "%${filter_value}%" OR 
			user_id_no LIKE "%${filter_value}%" `);
	},


	updateSuspendAccount: async ({ id }: Farmer) => {
		const query = await client.query(
		  `UPDATE ${TABLE.SUSPEND_ACCOUNT} SET status = 1 WHERE id = ${id}`,
		);
		return query; 
	  }
	
};
