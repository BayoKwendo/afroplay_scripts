import { getQuery } from 'https://deno.land/x/oak/helpers.ts';
import customerService from '../services/customerService.ts';

export default {
	//get All Customers
	getCustomer: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, page_size, user_id, role_id, filter_value } = getQuery(ctx, { mergeParams: true });
			// console.log(total)


			console.log(role_id);

			const total = await customerService.getCustomerCount();


			console.log("here")
			if (filter_value == null || filter_value == '') {
				if (page_number == null) {
					page_number = '1';
					page_size = '20';
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await customerService.getCustomers({
						offset: Number(offset),
						page_size: Number(page_size),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total,
						data: data,
					};
				} else {
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await customerService.getCustomers({
						offset: Number(offset),
						page_size: Number(page_size),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total,
						data: data,
					};
				}
			} else {
				// console.log(filter_value, '||| params');
				const data = await customerService.getCustomerFilter({ filter_value: filter_value });
				ctx.response.body = {
					status: true,
					status_code: 200,
					data: data,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},


	/**
* @description PRODUCT 
*/
	createProduct: async ({ request, response }: { request: any, response: any }) => {
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

			await customerService.createProduct({
				name: values.name,
				value: values.value,
				game_id: values.game_id
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

	deleteProduct: async ({ params, response }: { params: { id: string }, response: any }) => {
		try {
			console.log(params.id);
			const data = await customerService.deleteProduct({ id: params.id });
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



	deleteDraw: async ({ params, response }: { params: { id: string }, response: any }) => {
		try {
			console.log(params.id);
			const data = await customerService.deleteDraw({ id: params.id });
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

	/**
	* @description edit product
	*/
	editProduct: async ({ request, response }: { request: any, response: any }) => {
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
			await customerService.editProduct({
				name: values.name,
				game_id: values.game_id,
				value: values.value,
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


	/**
* @description update product
*/
	updateProduct: async ({ request, response }: { request: any, response: any }) => {
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

			if (values.status === 0) {
				console.log("here")
				await customerService.updateProduct({
					id: values.id
				});
			} else {
				await customerService.updateNegProduct({
					id: values.id
				});
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




	getProduct: async (ctx: any) => {
		try {
			// console.log(total)
			let data;
			data = await customerService.getProduct();

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

	// GET PRODUCT


	getBidProduct: async (ctx: any) => {
		try {
			// console.log(total)
			let data;
			data = await customerService.getBidProduct();

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

	/**
* @description DRAW 
*/
	addDraw: async ({ request, response }: { request: any, response: any }) => {
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

			console.log(values)
			await customerService.addDraw({
				name: values.name,
				game_id: values.bet_id,
				end_date: values.end_date
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

	/**
	* @description edit draw
	*/
	editDraw: async ({ request, response }: { request: any, response: any }) => {
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
			console.log(values)
			await customerService.editDraw({
				name: values.name,
				game_id: values.game_id,
				end_date: values.end_date,
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


	getDraw: async (ctx: any) => {
		try {
			// console.log(total)
			let data;
			data = await customerService.getDraw();

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




	//get All deposits
	getCustomerDeposit: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, page_size, msisdn, role_id, filter_value } = getQuery(ctx, { mergeParams: true });
			// console.log(total)


			console.log(role_id);

			const total = await customerService.getDepositCount({
				msisdn: msisdn
			});


			console.log("here")
			if (filter_value == null || filter_value == '') {
				if (page_number == null) {
					page_number = '1';
					page_size = '100';
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await customerService.getTransactions({
						offset: Number(offset),
						msisdn: msisdn,
						page_size: Number(page_size),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total,
						data: data,
					};
				} else {
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await customerService.getTransactions({
						offset: Number(offset),
						msisdn: msisdn,
						page_size: Number(page_size),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total,
						data: data,
					};
				}
			} else {
				// console.log(filter_value, '||| params');
				const data = await customerService.getDepositFilter({ msisdn: msisdn, filter_value: filter_value });
				ctx.response.body = {
					status: true,
					status_code: 200,
					data: data,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},
};
