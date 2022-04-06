import userService from '../services/userService.ts';
import { connect } from "https://deno.land/x/redis/mod.ts";
import axiod from 'https://deno.land/x/axiod@0.22/mod.ts';
import { SMS_BaseUrl, CONFIG } from '../db/config.ts';
import { getQuery } from 'https://deno.land/x/oak/helpers.ts';
import * as log from 'https://deno.land/std/log/mod.ts';
import { create, getNumericDate } from 'https://deno.land/x/djwt@v2.3/mod.ts';
import { hashSync, compareSync } from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts';
import { key } from '../exports.ts';
import { open } from 'https://deno.land/x/open/index.ts';
import { cryptoRandomString } from 'https://github.com/piyush-bhatt/crypto-random-string/raw/main/mod.ts';

export default {




	//check customers
	checkCustomers: async (ctx: any) => {

		const redis = await connect({
			hostname: "127.0.0.1",
			port: 6379,
		});
		// console.log(redis);
		// var client = redis.createClient({ host: 'ngombe_redis', port: 6379 });
		// await client.connect().then(() => {
		// 	console.log("Redis connected");
		// }).catch(err => {
		// 	console.log(err)
		// });
		const body = await ctx.request.body();
		if (!ctx.request.hasBody) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;

			console.log("here")


			// require('child_process').exec('start http://localhost:3000/');

			// ctx.response.redirect('')

			var val = Math.floor(1000 + Math.random() * 9000);
			await userService.addSessionID({ msisdn: values.msisdn, session_id: values.sessionId });
			let data = await userService.getCustomers({ msisdn: values.msisdn });


			if (data.length > 0) {


				let ifActive = data[0].active;
				if (ifActive == 1) {
					ctx.response.body = {
						status: true,
						status_code: 200,
						balance: data[0].balance,
						data: "proceed"
					};
				} else {
					ctx.response.body = {
						status: true,
						status_code: 200,
						balance: data[0].balance,
						data: "subscribe"
					};
				}
			} else {
				let create_customer = await userService.createCustomer({ msisdn: values.msisdn, pin: val });
				if (create_customer) {
					// let formData = {
					// 	"text": "Welcome to AfroPlay",
					// 	"msisdn": values.msisdn
					// }
					// // send sms to sms service
					// await axiod.post(`${SMS_BaseUrl}`, formData, CONFIG);
					ctx.response.body = {
						status: true,
						status_code: 200,
						balance: 0,
						data: "new"
					};
				}
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				status: false,
				message: `${JSON.stringify(error)}`,
			};
		}
	},

	/**
* @description GAME 
*/
	createGame: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;

			await userService.createGame({
				name: values.name,
			});
			response.body = {
				success: true,
				message: 'Success',
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},


	// DELETE users

	deleteGame: async ({ params, response }: { params: { id: string }, response: any }) => {
		try {
			console.log(params.id);
			const data = await userService.deleteGame({ id: params.id });
			if (data.affectedRows > 0) {
				response.status = 200;
				response.body = {
					status: true,
					status_code: 200,
					message: 'Success',
				};
			} else {
				response.status = 201;
				response.body = {
					status: false,
					status_code: 200,
					message: 'Error deleting!',
				};
			}
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},

	// {
	// 	--   "card_issuer": "MASTERCARD",
	// 	--   "auth_type": "PIN",
	// 	--   "card_number": "5531886652142950",
	// 	--   "cvv": "564",
	// 	--   "expiry_date": "09/32",
	// 	--   "pin": "3310",
	// 	--   "otp": "12345"
	// 	-- }


	/**
* @description update transaction
*/
	updateTransaction: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;

			await userService.updateTransaction({
				status: values.status,
				transaction_id: values.transaction_id,
				reference: values.reference
			})

			if (values.status == "successful") {

				let data = await userService.getTransaction(
					{
						reference: values.reference, 
						transaction_id: values.transaction_id
					}
				);
				await userService.updateCustomerBalance({
					msisdn: data.msisdn,
					amount: data.amount
				})
			}

			response.body = {
				success: true,
				message: 'Success',
			};

		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	flutterWave: async (ctx: any) => {
		try {
			const body = await ctx.request.body();
			const data_reference = cryptoRandomString({ length: 12, type: 'alphanumeric' });
			const values = await body.value;

			console.log(values)
			let data = await userService.getCustomers({ msisdn: values.msisdn });


			if (data.length > 0) {

				await userService.addTransaction({
					msisdn: values.msisdn,
					amount: values.amount,
					reference: data_reference
				})

				let formData = {
					"tx_ref": `${data_reference}`,
					"amount": values.amount,
					"currency": "NGN",
					"redirect_url": "http://localhost:3000/flutter",
					"customer": {
						"email": `${values.msisdn}@gmail.com`,
						"phonenumber": values.msisdn,
						"name": " "
					},
					"customizations": {
						"title": "AfroPlay",
						"logo": "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png"
					}

				}

				const response = await axiod.post("https://api.flutterwave.com/v3/payments",
					formData,
					{
						headers: {
							'Content-Type': 'application/json',
							'Accept': 'application/json',
							'Access-Control-Allow-Origin': '*',
							'Authorization': `Bearer FLWSECK_TEST-3149ff3614f2334e787149392a95e86c-X`
						},
					},
				);

				if (response) {
					ctx.response.status = 200;
					ctx.response.body = {
						status: true,
						status_code: 200,
						message: response,
					};
				} else {
					ctx.response.status = 201;
					ctx.response.body = {
						status: false,
						status_code: 200,
						message: 'Error deleting!',
					};
				}
			} else {
				ctx.response.status = 201;
				ctx.response.body = {
					status: false,
					status_code: 200,
					message: 'Phone number not found! Try Again',
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `${JSON.stringify(error)}`,
			};
		}
	},

	/**
	* @description edit user
	*/
	editGame: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;
			await userService.editGame({
				name: values.name,
				id: values.id
			});
			response.body = {
				success: true,
				message: 'Success',
			};

		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},


	getGame: async (ctx: any) => {
		try {
			// console.log(total)
			let data;
			data = await userService.getGame();

			console.log(data)

			ctx.response.body = {
				status: true,
				status_code: 200,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},


	// 	/**
	//    * @description Get all Employee List
	//    */
	loginUser: async (ctx: any) => {
		const body = await ctx.request.body();
		if (!ctx.request.hasBody) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;

			const isAvailable = await userService.loginUser({ username: values.username });
			if (!isAvailable) {
				ctx.response.status = 404;
				ctx.response.body = {
					status: false,
					message: 'Username not found',
				};
				return;
			} else if (!compareSync(values.password, isAvailable.password)) {
				ctx.response.status = 404;
				ctx.response.body = {
					status: false,
					message: 'Password Incorrect',
				};
				return;
			} else {

				console.log(isAvailable);
				const data = {
					username: isAvailable.username,
					msisdn: isAvailable.msisdn,
					name: isAvailable.role_name,
					mobipesa_name: isAvailable.name,
					user_id: isAvailable.user_id,
					role_id: isAvailable.role_id,
				};
				const oneHour = 43200;

				// const jwt = "fff"
				const jwt = await create(
					{ alg: 'HS512', typ: 'JWT' },
					{ iss: isAvailable.email, exp: getNumericDate(oneHour) },
					key
				);
				ctx.response.body = {
					success: true,
					token: jwt,
					message: data,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},
	/**
   * @description Get all Employee List
   */
	createUser: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;
			const hashedPassword = hashSync(values.password);

			if (values.password === values.confirmPassword) {

				await userService.createUser({
					username: values.username,
					msisdn: values.msisdn,
					name: values.name,
					role_id: values.role_id,
					password: hashedPassword,
				});
				response.body = {
					success: true,
					message: 'User Created Successfully',
				};
			} else {
				response.status = 400;
				response.body = {
					success: false,
					message: `Password didn't match`,
				};
			}
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},


	// DELETE users

	deleteAccount: async ({ params, response }: { params: { id: string }, response: any }) => {
		try {
			console.log(params.id);
			const data = await userService.deleteUser({ id: params.id });
			if (data.affectedRows > 0) {
				response.status = 200;
				response.body = {
					status: true,
					status_code: 200,
					message: 'Account has been deleted',
				};
			} else {
				response.status = 201;
				response.body = {
					status: true,
					status_code: 200,
					message: 'Error deleting the account',
				};
			}
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},
	/**
   * @description edit user
   */
	editUser: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;
			// const hashedPassword = hashSync(values.password);
			// if (values.password === values.confirmPassword) {

			await userService.editUser({
				username: values.username,
				msisdn: values.msisdn,
				name: values.name,
				role_id: values.role_id,
				id: values.id
			});
			response.body = {
				success: true,
				message: 'User Updated Successfully',
			};

		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	// update user password
	updateUser: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;
			const hashedPassword = hashSync(values.password);

			console.log(hashedPassword);
			await userService.updateUser({
				username: values.username,
				password: hashedPassword,
			});
			response.body = {
				success: true,
				message: 'User Updated Successfully',
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},


	//get roles
	getRoles: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { filter_value, period } = getQuery(ctx, { mergeParams: true });
			// console.log(total)

			let data;

			let credit_total;

			console.log({
				filter_value: Number(filter_value),
				period: Number(period)
			})

			data = await userService.getRoles();

			ctx.response.body = {
				status: true,
				credit_sum: credit_total,
				status_code: 200,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},


	//get users
	getUsers: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { filter_value, period } = getQuery(ctx, { mergeParams: true });
			// console.log(total)

			let data;

			let credit_total;

			console.log({
				filter_value: Number(filter_value),
				period: Number(period)
			})

			data = await userService.getAllUsers();

			ctx.response.body = {
				status: true,
				credit_sum: credit_total,
				status_code: 200,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},



};
