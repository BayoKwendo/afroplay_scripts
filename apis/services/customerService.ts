import client from '../db/client.ts';
import { TABLE } from '../db/config.ts';
import General from '../interfaces/general.ts';

export default {
	doesExistById: async ({ id }: General) => {
		const [result] = await client.query(`SELECT COUNT(*) count FROM ${TABLE.CUSTOMERS} WHERE id = ? LIMIT 1`, [
			id,
		]);
		return result.count > 0;
	},


	//get all customers
	getCustomers: async ({ offset, page_size }: General) => {
		return await client.query(`SELECT *  
        FROM ${TABLE.CUSTOMERS}
		WHERE id ORDER BY id DESC LIMIT ${offset},${page_size}`);
	},

	//get customers count
	getCustomerCount: async () => {
		const [result] = await client.query(`SELECT COUNT(id) count FROM ${TABLE.CUSTOMERS}`);
		return result.count;
	},

	//filter farmers details
	getCustomerFilter: async ({ filter_value }: General) => {
		return await client.query(`SELECT * FROM ${TABLE.CUSTOMERS}
		WHERE name LIKE "%${filter_value}%" OR
        msisdn LIKE "%${filter_value}%" OR
        email LIKE "%${filter_value}%"`);
	},



	//PRODUCT
	createProduct: async ({ name, game_id, value }: General,) => {
		const result = await client.query(`INSERT INTO 
          ${TABLE.PRODUCT} SET name =?, game_id=?, value=?`, [
			name, game_id, value
		]);
		return result;
	},


	editProduct: async ({ name, game_id, value, id }: General) => {
		const result = await client.query(`UPDATE 
          ${TABLE.PRODUCT} SET name =?, game_id=?, value=? WHERE id = ?`, [
			name,
			game_id,
			value,
			id
		]);
		return result;
	},


	updateProduct: async ({ id }: General) => {
		const result = await client.query(`UPDATE 
          ${TABLE.PRODUCT} SET status = 1 WHERE id = ?`, [
			id
		]);
		return result;
	},

	updateNegProduct: async ({ id }: General) => {
		const result = await client.query(`UPDATE 
          ${TABLE.PRODUCT} SET status = 0 WHERE id = ?`, [
			id
		]);
		return result;
	},

	deleteProduct: async ({ id }: General,) => {
		const result = await client.query(`DELETE FROM ${TABLE.PRODUCT} WHERE id = ?`, [
			id
		]);
		return result;
	},

	getProduct: async () => {
		const result = await client.query(`SELECT name,id, status,value, created_on FROM  ${TABLE.PRODUCT}`);
		return result;
	},


	getBidProduct: async () => {
		const result = await client.query(`SELECT name,id,value FROM  ${TABLE.PRODUCT} WHERE status = 1 ORDER BY id limit 1`);
		return result;
	},



	//DRAW
	addDraw: async ({ name, game_id, end_date }: General,) => {
		const result = await client.query(`INSERT INTO 
          ${TABLE.DRAW} SET name =?, bet_id = ?, end_date=? , status = 1`, [
			name, game_id, end_date
		]);
		return result;
	},


	editDraw: async ({ name, game_id, end_date, id }: General) => {
		const result = await client.query(`UPDATE 
          ${TABLE.DRAW} SET name =?, bet_id=?,end_date=? , status = 1 WHERE id = ?`, [
			name,
			game_id,
			end_date,
			id
		]);
		return result;
	},


	getDraw: async () => {
		const result = await client.query(`SELECT name, bet_id, id, end_date, status, created_on FROM  ${TABLE.DRAW}`);
		return result;
	},

	deleteDraw: async ({ id }: General,) => {
		const result = await client.query(`DELETE FROM ${TABLE.DRAW} WHERE id = ?`, [
			id
		]);
		return result;
	},

	// updateDraw: async ({ id }: General) => {
	// 	const result = await client.query(`UPDATE 
	//       ${TABLE.PRODUCT} SET status = 1 WHERE id = ?`, [
	// 		id
	// 	]);
	// 	return result;
	// },





	//get deposits
	getTransactions: async ({ msisdn, offset, page_size }: General) => {
		return await client.query(`SELECT *  
        FROM deposit_requests
		WHERE id  AND msisdn = ${msisdn} ORDER BY id DESC LIMIT ${offset},${page_size}`);
	},

	//get deposit count
	getDepositCount: async ({ msisdn }: General) => {
		const [result] = await client.query(`SELECT COUNT(id) count FROM deposit_requests WHERE msisdn = ${msisdn}`);
		return result.count;
	},

	//filter deposit filter value details
	getDepositFilter: async ({msisdn, filter_value }: General) => {
		return await client.query(`SELECT * FROM deposit_requests
		WHERE 
		msisdn = ${msisdn}
		status LIKE "%${filter_value}%" OR
        reference LIKE "%${filter_value}%" OR
        transaction_id LIKE "%${filter_value}%"`);
	},
};
