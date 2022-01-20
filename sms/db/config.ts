export const DATABASE: string = 'AfroPlay';
export const TABLE = {
	SMS_LOGS: 'sms_logs',
};
// export const SMS_BaseUrl: string = "http://sms_service:1200/send_sms"; // base url for sms services

export const SMS = {
	URL: 'https://api.onfonmedia.co.ke/v1/sms/SendBulkSMS',
	APIKEY: 'CWImOGpgI2jWZmPTzoASXOYUysq35p6LAClaesUPC+w=',
	SENDERID: 'MOBIPESA',
	CLIENTID: 'f801a6e8-ee40-43a0-a5fe-678e774f7d88',
	ACCESSKEY: 'QYnswwkm1BPazhmTgAKAyIfU5lc5rbt3',
	MOBIPESA: "254721792200"
};

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
	}
}
