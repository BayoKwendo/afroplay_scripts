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

export const SMS_BaseUrl: string = "http://localhost:1200/send_sms"; // base url for sms services


export const SMS_BaseUrl_Officer: string = "http://localhost:1200/send_sms_field_officer"; // base url for sms services

// export const SMS_BaseUrl: string = "http://sms_service:1200/send_sms"; // base url for sms services

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

// mpesa declaration
export const MPESA = {
	b2c_consumer_api: 'Gr4w4yvpMaK4G98XkMNK7v477XA4MzAz',
	b2c_secret: '1UIJS2ulmtCK3Fwv',
	b2c_shortcode: '3131497',
	iniatorpwd: 'Humble23!',
	url_token: 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
	initiatorName: 'Eve Bunyangs',
	b2c_url: 'https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',
	securityCredential: 'cuADFICbBm/XZpTvbdbnAnWDP2na7nUHWfpYZMiqSpVlIDdSUyl5osAqTvvxMgQ3VSG4+KCnUqqlKnLszOSNhfclHmFkNKIK6emIWyI7A7o9NRP3aHlDwjcufrtkyCFDm2rDrjfL6RhsDZIHHhn68iOzfBR5wEqQkOhp6vGNkYJ3Mbnrz6ClHKuDfVsjUC9Z9M2TzA1PNtcAzo9ZN3DgcmS0p+XFZch6VUHnsqgSfpZawR87jGbIEa3Jkz1Kgy4FK9G9D4/7Xw78MUiZMjKrgleMhCvuOCc6xGLscfxGOo/NXr5uHzVcih51Z85Wo7etSw0DJQS4+/eHEycN+Yixlw==',
};

export const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'Ksh',
	minimumFractionDigits: 2
});
