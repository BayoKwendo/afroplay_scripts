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
	//update farmer wallet engine
	updateWalletFarmerEngine: async ({ id, wallet_balance }: Farmer) => {
		const query = await client.query(
			`UPDATE  ${TABLE.FARMER} SET 
		wallet_balance = wallet_balance + ${wallet_balance} 
        WHERE id ="${id}"`
		);
		return query;
	},


};
