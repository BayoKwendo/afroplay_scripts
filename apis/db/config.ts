export const DATABASE: string = 'AfroPlay'; // database name

export const MYSQL = {
	host: "157.230.229.119",
	user: "root",
	password: "part@^yr9053",
	database: "AfroPlay",
	port: 3306
}

export const CONFIG = {
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Authorization': ''
	},
};

export const TABLE = {

	CUSTOMERS: 'customers',

	FARMER: 'farmers_details',
	LOAN: 'loans',
	SMS_LOGS: 'sms_logs',
	VERIFICATION_CODES: 'verification',
	WITHDRAWAL_REQUEST: 'withdraw_request',
	WITHDRAWAL_ARCHIVES: 'withdrawal_archives',

	LOAN_STATUS: 'laon_status',

	USERS: 'users',

	MESSAGE: "call_messages",
	GUARANTORS: 'loan_guarantors',

	BRANCHES: 'branches',

	ROLES: 'roles',
	WITNESSES: 'loan_witnesses',
	LOAN_STATEMENT: "loan_statements",
	DEPOSIT: "transactions_deposits",
	SUSPEND_ACCOUNT: "suspend_account",
	LOAN_DEPOSITS: "transactions_deposits",
	LIVESTOCK: 'livestock_details',
};



export const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'Ksh',
	minimumFractionDigits: 2
});

export const SMS_BaseUrl: string = "http://localhost:1200/send_sms"; // base url for sms services

export const SMS_BaseUrl_Officer: string = "http://localhost:1200/send_sms_field_officer"; // base url for sms services


export const SMS_BaseUrl_Admin: string = "http://localhost:1200/send_sms_admin_officer"; // base url for sms services

export const SMS_BaseUrl_Admin_Final: string = "http://localhost:1200/send_sms_final_officer"; // base url for sms services


export const SMS_BaseUrl_All: string = "http://localhost:1200/sms_all_staff"; // base url for sms services


// export const SMS_BaseUrl: string = "http://sms_service:1200/send_sms"; // base url for sms services

export const SMS = {
	URL: 'https://api.onfonmedia.co.ke/v1/sms/SendBulkSMS',
	APIKEY: 'LkE9VDl8Ww8Jzt0qAnSF3ltwnMxUci6lAlHw6vcUm8A=',
	SENDERID: '22141',
	CLIENTID: 'efb70be7-8994-4aee-a900-8eb076233487',
	ACCESSKEY: 'FtmeVaEIeREw3QiFhgDzDO9i1DDrwPHv',
	MOBIPESA: "254721792200"

};

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