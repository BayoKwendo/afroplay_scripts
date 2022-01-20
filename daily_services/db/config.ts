export const DATABASE: string = 'ngombe_loan';
export const TABLE = {
	FARMER: 'farmers_details',
	LOAN: 'loans',
	SMS_LOGS: 'sms_logs',
	WITHDRAWAL_REQUEST: 'withdraw_request',
	WITHDRAWAL_ARCHIVES: 'withdrawal_archives',

	LOAN_STATUS: 'laon_status',

	GUARANTORS: 'loan_guarantors',

	WITNESSES: 'loan_witnesses',

	LOAN_STATEMENT: "loan_statements",
	DEPOSIT: "transactions_deposits",
	LOAN_DEPOSITS: "transactions_deposits",

	LIVESTOCK: 'livestock_details',
};

export const SMS_BaseUrl: string = "http://sms_service:1200/send_sms"; // base url for sms services

export const SMS = {
	URL: 'https://api.onfonmedia.co.ke/v1/sms/SendBulkSMS',
	APIKEY: 'CWImOGpgI2jWZmPTzoASXOYUysq35p6LAClaesUPC+w=',
	SENDERID: 'MOBIPESA',
	CLIENTID: 'f801a6e8-ee40-43a0-a5fe-678e774f7d88',
	ACCESSKEY: 'QYnswwkm1BPazhmTgAKAyIfU5lc5rbt3',
	MOBIPESA: "254721792200"
};

export const CONFIG = {
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	}
}
