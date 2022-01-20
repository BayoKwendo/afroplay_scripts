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

	updateWalletFarmerDefault: async ({ id_no, wallet_balance }: Farmer) => {
		const query = await client.query(
			`UPDATE  ${TABLE.FARMER} SET 
		wallet_balance = ${wallet_balance} 
        WHERE id_no ="${id_no}"`
		);
		return query;
	},

	//update farmer wallet
	updateWalletFarmerReminder: async ({ id_no }: Farmer) => {
		const query = await client.query(
			`UPDATE  ${TABLE.FARMER} SET 
		wallet_balance = 0 
        WHERE id_no ="${id_no}"`
		);
		return query;
	},

	//update farmer wallet engine
	updateWalletFarmerEngine: async ({ id, wallet_balance }: Farmer) => {
		const query = await client.query(
			`UPDATE  ${TABLE.FARMER} SET 
		wallet_balance = wallet_balance + ${wallet_balance} 
        WHERE id ="${id}"`
		);
		return query;
	},

	//update farmer wallet
	updateWalletFarmerID: async ({ id, wallet_balance }: Farmer) => {
		const query = await client.query(
			`UPDATE  ${TABLE.FARMER} SET 
			wallet_balance = wallet_balance + ${wallet_balance} 
			WHERE id ="${id}"`
		);
		return query;
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

	//get all farmers
	getFarmers: async ({ offset, page_size }: Farmer) => {
		return await client.query(`SELECT * 
        FROM ${TABLE.FARMER} WHERE id ORDER BY id DESC LIMIT ${offset},${page_size}`);
	},

	//get farmers count

	getFarmersCount: async () => {
		const [result] = await client.query(`SELECT COUNT(id) count FROM ${TABLE.FARMER}`);
		return result.count;
	},

	//filter farmers details
	getFarmerFilter: async ({ filter_value }: Farmer) => {
		return await client.query(`SELECT * 
        FROM ${TABLE.FARMER} WHERE  name =${filter_value} OR
        msisdn=${filter_value} OR
        id_no=${filter_value} OR
        gender=${filter_value} OR
        age=${filter_value} OR
        location=${filter_value}`);
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
		return await client.query(`SELECT w.*
		FROM ${TABLE.WITHDRAWAL_ARCHIVES} w
		ORDER BY w.id DESC LIMIT ${offset},${page_size}`);
	},

	//get withdraw request count
	getWithdrawArchiveCount: async () => {
		const [result] = await client.query(
			`SELECT COUNT(w.id) count 
			FROM ${TABLE.WITHDRAWAL_ARCHIVES} w`
		);
		return result.count;
	},

	//filter  details
	getWithdrawalArchiveFilter: async ({ filter_value }: Farmer) => {
		return await client.query(`SELECT w.*			
		FROM ${TABLE.WITHDRAWAL_ARCHIVES} w  
			WHERE w.transaction_id LIKE "%${filter_value}%" OR w.reference LIKE "%${filter_value}%"`);
	},

	// retrieve deposits

	//filter  details
	getDepositsArchvie: async ({ offset, page_size }: Farmer) => {
		return await client.query(`SELECT w.*,  f.name
				FROM ${TABLE.DEPOSIT} w inner join ${TABLE.FARMER} f on w.user_id_no = f.id_no 
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
			WHERE w.transaction_id LIKE "%${filter_value}%" OR w.msisdn LIKE "%${filter_value}%" OR w.user_id_no LIKE "%${filter_value}%"`);
	},

};
