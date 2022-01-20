import client from '../db/client.ts';
import { TABLE } from '../db/config.ts';
import SMS from '../interfaces/sms.ts';

export default {


	// insert sms log
	insertSMSLogs: async ({ destination, origin, status, message }: SMS) => {
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

};
