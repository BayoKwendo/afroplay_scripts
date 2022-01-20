import { getQuery } from 'https://deno.land/x/oak/helpers.ts';
import * as log from 'https://deno.land/std/log/mod.ts';
import farmerService from '../services/farmerService.ts';

import loanService from '../services/loanService.ts';

import { S3Bucket } from 'https://deno.land/x/s3@0.4.1/mod.ts';
import { SMS, SMS_BaseUrl, SMS_BaseUrl_Officer, SMS_BaseUrl_All, formatter } from '../db/config.ts';
import { cryptoRandomString } from 'https://github.com/piyush-bhatt/crypto-random-string/raw/main/mod.ts';
import axiod from 'https://deno.land/x/axiod@0.22/mod.ts';
import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";


export default {
	/**
   * @description Create Farmer
   */

	sendSMS: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();

		try {
			const values = await body.value;


			let formData = {
				"msisdn": values.msisdn,
				"text": values.message.toString()
			}
			// send sms to the borrower
			await axiod
				.post(`${SMS_BaseUrl}`, formData, {
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
					},
				})
			response.body = {
				success: true,
				message: 'Success!',
			};

		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},


	sendSMSAllStaffs: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();

		try {
			const values = await body.value;

			let formData = {
				"text": values.message.toString()
			}
			// send sms to the borrower
			await axiod
				.post(`${SMS_BaseUrl_All}`, formData, {
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
					},
				})

				
			response.body = {
				success: true,
				message: 'Success!',
			};

		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},

	createMsisdn: async (context: any) => {
		const body = await context.request.body();
		const values = await body.value;
		var val = Math.floor(1000 + Math.random() * 9000);
		let mfrequency = ((Date.now() / 1000) + (1 * 1 * 5 * 60))  // five minutes added to current time

		const send = await farmerService.insertINTOVerification({
			msisdn: values.msisdn,
			code: val,
			expired: mfrequency
		});
		if (send) {
			const text = `Your OTP code is ${val}\n\nExpires in the next 5 minutes`;

			let formData = {
				"msisdn": values.msisdn,
				"text": text
			}
			// send sms to the borrower
			await axiod
				.post(`${SMS_BaseUrl}`, formData, {
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
					},
				})

			context.response.body = {
				success: true,
				message: 'Success!',
			};

		}


	},




	createCallLog: async (context: any) => {
		const body = await context.request.body();
		const values = await body.value;
		const send = await farmerService.insertCallLogs({
			duration: values.duration,
			message: values.message,
			reference: values.reference,
			farmer_id: values.farmer_id,
			created_by: values.created_by
		});
		if (send) {
			context.response.body = {
				success: true,
				message: 'Success!',
			};
		}
	},


	//get All Call
	getCallLogs: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { reference } = getQuery(ctx, { mergeParams: true });
			const data = await farmerService.getCallLogs({
				reference: reference
			});
			ctx.response.body = {
				status: true,
				status_code: 200,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},



	confirmOTP: async (context: any) => {
		const body = await context.request.body();
		const values = await body.value;


		console.log(values)
		const send = await farmerService.updateConfirmed({
			msisdn: values.msisdn,
			code: values.code,
		});
		if (send.affectedRows > 0) {
			// send sms to the borrower
			context.response.body = {
				success: true,
				message: 'Success!',
			};

		} else {
			context.response.body = {
				success: false,
				message: 'Failed!',
			};
		}


	},


	updateSuspend: async (context: any) => {
		const body = await context.request.body();
		const values = await body.value;

		await farmerService.updateSuspendAccount({
			id: values.id
		});
		context.response.body = {
			success: true,
			message: 'Success!',
		};
	},

	createFarmer: async (context: any) => {
		var val = Math.floor(1000 + Math.random() * 9000);

		try {
			const body = await context.request.body();
			const data = await body.value.read({ maxSize: 20000000000 });

			console.log(data);

			const bucket = new S3Bucket({
				accessKeyID: 'AKIAZTX7OWBI4J7EGIVR',
				secretKey: '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',
				bucket: 'ngombeloan',
				region: 'eu-west-1',
			});
			const applicant_photo = Date.now() + data.files[0].originalName;
			const applicant_id_front_page = Date.now() + data.files[1].originalName;
			const applicant_id_back_page = Date.now() + data.files[2].originalName;

			const s3push_2 = await bucket.putObject(`applicant_pics/${applicant_photo}`, data.files[0].content);
			const s3push_3 = await bucket.putObject(`applicant_pics/${applicant_id_front_page}`, data.files[1].content);
			const s3push_4 = await bucket.putObject(`applicant_pics/${applicant_id_back_page}`, data.files[2].content);

			const applicant_photo_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/applicant_pics/${applicant_photo}`;
			const applicant_id_front_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/applicant_pics/${applicant_id_front_page}`;
			const applicant_id_back_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/applicant_pics/${applicant_id_back_page}`;
			/**
			 * @description the below is used to write image in the specific folder. Deno write for server based storage.
			   * const deno = await Deno.writeFile(`temp_uploads/${data.files[0].originalName}`, data.files[0].content);
		   **/
			if (s3push_2 && s3push_3 && s3push_4) {
				// const values = await body.value;
				const values = data.fields;

				const send = await farmerService.addFarmer({
					name: values.name,
					id_no: values.id_no,
					gender: values.gender,
					age: values.age,
					msisdn: values.msisdn,
					branch_id: values.branch_id,
					user_id: values.user_id,
					pin: val,
					passport_photo: applicant_photo_submit,
					id_front_photo: applicant_id_front_submit,
					id_back_photo: applicant_id_back_submit,
					location: values.location,
					latitude: values.latitude,
					longitude: values.longitude,
				});
				if (send) {

					const text = `Dear ${values.name} You have successfully been registered for Ngombe Loan,\n\nYour USSD pin is ${val}`;

					let formData = {
						"msisdn": values.msisdn,
						"text": text
					}
					// send sms to the borrower
					await axiod
						.post(`${SMS_BaseUrl}`, formData, {
							headers: {
								'Content-Type': 'application/json',
								'Accept': 'application/json',
							},
						})

					context.response.body = {
						success: true,
						message: 'Success!',
					};

				}
			}
		} catch (error) {
			context.response.status = 400;
			context.response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},

	//get All Farmers
	getFarmers: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, page_size, user_id, role_id, filter_value } = getQuery(ctx, { mergeParams: true });
			// console.log(total)


			console.log(role_id);

			if (role_id != undefined) {
				if (Number(role_id) === 1 || Number(role_id) === 2) {
					const total = await farmerService.getFarmersCount();

					console.log("here")
					if (filter_value == null || filter_value == '') {
						if (page_number == null) {
							page_number = '1';
							page_size = '20';
							const offset = (Number(page_number) - 1) * Number(page_size);
							const data = await farmerService.getFarmers({
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
							const data = await farmerService.getFarmers({
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
						const data = await farmerService.getFarmerFilter({ filter_value: filter_value });
						ctx.response.body = {
							status: true,
							status_code: 200,
							data: data,
						};
					}
				} else {
					const total = await farmerService.getFarmersBranchCount({
						user_id: Number(user_id)
					});

					console.log(total)

					if (filter_value == null || filter_value == '') {
						if (page_number == null) {
							page_number = '1';
							page_size = '20';
							const offset = (Number(page_number) - 1) * Number(page_size);
							const data = await farmerService.getFarmersBranch({
								offset: Number(offset),
								user_id: Number(user_id),
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
							const data = await farmerService.getFarmersBranch({
								offset: Number(offset),
								user_id: Number(user_id),
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
						const data = await farmerService.getFarmerBranchFilter({
							filter_value: filter_value,
							user_id: Number(user_id),
						});
						ctx.response.body = {
							status: true,

							status_code: 200,
							data: data,
						};
					}
				}
			} else {
				const total = await farmerService.getFarmersCount();

				console.log("here")
				if (filter_value == null || filter_value == '') {
					if (page_number == null) {
						page_number = '1';
						page_size = '20';
						const offset = (Number(page_number) - 1) * Number(page_size);
						const data = await farmerService.getFarmers({
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
						const data = await farmerService.getFarmers({
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
					const data = await farmerService.getFarmerFilterID({ filter_value: filter_value });
					ctx.response.body = {
						status: true,
						status_code: 200,
						data: data,
					};
				}
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},



	//get All SMS
	getSMS: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, page_size, filter_value } = getQuery(ctx, { mergeParams: true });
			const total = await farmerService.getSMSCount();
			// console.log(total)
			if (filter_value == null || filter_value == '') {
				if (page_number == null) {
					page_number = '1';
					page_size = '100';
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await farmerService.getSMSLog({
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
					const data = await farmerService.getSMSLog({
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
				const data = await farmerService.getSMSFilter({ filter_value: filter_value });
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


	//get All SMS
	getCharges: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, page_size, filter_value } = getQuery(ctx, { mergeParams: true });
			const total = await farmerService.getChargesCount();
			// console.log(total)
			if (filter_value == null || filter_value == '') {
				if (page_number == null) {
					page_number = '1';
					page_size = '100';
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await farmerService.getChargesLog({
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
					const data = await farmerService.getChargesLog({
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
				const data = await farmerService.getFilter({ filter_value: filter_value });
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
  * @description Get Delete Farmer
  */
	deleteFarmers: async (ctx: any) => {
		try {
			let { id } = getQuery(ctx, {
				mergeParams: true,
			});
			const data = await farmerService.deleteFarmer({
				id: Number(id),
			});
			ctx.response.body = {
				status: true,
				status_code: 200,
				message: 'Success',
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},

	/**
   * @description Create Farmer
   */
	editFarmer: async ({ request, response }: { request: any, response: any }) => {
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
			await farmerService.editFarmer({
				name: values.name,
				id_no: values.id_no,
				gender: values.gender,
				age: values.age,
				msisdn: values.msisdn,
				location: values.location,
				id: values.id,
			});
			response.body = {
				success: true,
				message: 'Success!',
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},


	/**
   * @description get one Farmer
   */
	getOneFarmer: async ({ request, response }: { request: any, response: any }) => {
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
			const data = await farmerService.getOneFarmer({
				msisdn: values.msisdn,
			});
			response.body = {
				status: true,
				data: data,
				message: "Sucess!"
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},

	/**
   * @description Create Farmer
   */
	updateWalletFarmer: async ({ request, response }: { request: any, response: any }) => {
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
			let mfrequency = Date.now() / 1000 + 90 * 24 * 60 * 60;
			let mdate = moment.unix(mfrequency).format('YYYY-MM-DD HH:mm:ss').toString();

			const values = await body.value;
			const pay_reference = cryptoRandomString({ length: 12, type: 'alphanumeric' });

			// total monthly installment
			let monthly_installment = (((parseFloat(values.wallet_balance) + parseFloat(values.application_fee) + 33.00) / 3) + (parseFloat(values.insurance_fee) / 3) + (0.075 * (parseFloat(values.wallet_balance) + parseFloat(values.application_fee) + 33.00)))

			let second_monthly_installment = (((parseFloat(values.wallet_balance) + parseFloat(values.application_fee) + 33.00) / 3) + (parseFloat(values.insurance_fee) / 3) + (0.075 * ((parseFloat(values.wallet_balance) + parseFloat(values.application_fee) + 33.00) - ((parseFloat(values.wallet_balance) + parseFloat(values.application_fee) + 33.00) / 3))))

			let third_monthly_installment = (((parseFloat(values.wallet_balance) + parseFloat(values.application_fee) + 33.00) / 3) + (parseFloat(values.insurance_fee) / 3) + (0.075 * ((parseFloat(values.wallet_balance) + parseFloat(values.application_fee) + 33.00) - (((parseFloat(values.wallet_balance) + parseFloat(values.application_fee) + 33.00) / 3) + ((parseFloat(values.wallet_balance) + parseFloat(values.application_fee) + 33.00) / 3)))))


			const current_walletbalance = await farmerService.getWalletBalance({ id_no: values.id_no });
			let mwallet;
			let msubmit_amount
			if (((parseFloat(current_walletbalance) + parseFloat(values.wallet_balance))) > 250000) {
				mwallet = ((parseFloat(current_walletbalance) + parseFloat(values.wallet_balance))) - 250000
				msubmit_amount = 250000
			} else {
				mwallet = 0
				msubmit_amount = ((parseFloat(current_walletbalance) + parseFloat(values.wallet_balance)))
			}
			const timer = (ms: any) => new Promise(res => setTimeout(res, ms));
			const submit = await farmerService.updateWalletLoanDisburse({
				wallet_balance: mwallet,
				id_no: values.id_no,
				msisdn: values.msisdn,
			});
			await farmerService.insertCharges({
				loan_reference: values.reference
			});

			if (submit) {

				const minsert = await loanService.insertintoDomiDB({
					msisdn: values.msisdn,
					amount: msubmit_amount,
					reference: pay_reference,
				});
				if (minsert) {
					await timer(2000);
					const data = await loanService.getProccessedTransaction({ filter_value: pay_reference });
					let status = 'pending';

					if (data != undefined) {
						if (data.ProcessStatus == 2) {
							status = 'success';
						} else if (data.ProcessStatus == 0) {
							status = 'pending';
						} else {
							status = 'failed';
						}
						await loanService.insertIntoWithdrawal({
							transaction_id: data.SafaricomMPESATransactionId,
							working_balance: msubmit_amount.toString(),
							description: "Money was successful disbursed!",
							name: values.msisdn,
							status: status,
							reference: pay_reference,
						});

						// (disbursement_cuts  33 bobs and "application fee 6%") cuts

						let mPayment_date = moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss');


						const texts_guarntor = `Dear ${values.guarantor_name} below loan guranteed by you has been issued by MOBIPESA LTD.\nBorrower ${values.applicant_name}\nTotal Loan issued: ${formatter.format((parseFloat(values.wallet_balance)) + parseFloat(values.application_fee) + 33.00)}\n1st Month Instalment ${formatter.format(monthly_installment)}\n2nd Month Instalment ${formatter.format(second_monthly_installment)}\n3rd Month Instalment ${formatter.format(third_monthly_installment)}\nDuration 3 MONTHS\nLoan Start Date ${mPayment_date} \nLoan End Date ${mdate} \nHelp desk 0748320516`
						const texts = `Dear ${values.applicant_name} your loan number ${values.reference} has been issued by MOBIPESA LTD.\n1st Month Instalment ${formatter.format(monthly_installment)}\n2nd Month Instalment ${formatter.format(second_monthly_installment)}\n3rd Month Instalment ${formatter.format(third_monthly_installment)}\nLoan Duration 3 MONTHS\nLoan Start Date ${mPayment_date}\nLoan End Date ${mdate}\n\nT&C\n1. LOAN DETAILS\nAmount sent ${formatter.format((parseFloat(values.wallet_balance)))}\nLegal fees KSH 200.00\nAnimal identification fees KSH 300.00\nVet fees Ksh 300.00\nAdmin fees KSH 300.00\nInsurance Premium of ${formatter.format(values.insurance_fee)} paid in three instalments of ${formatter.format(parseFloat(values.insurance_fee) / 3)}\nMPESA Charges KSH. 33.00\nTotal Loan Taken ${formatter.format((parseFloat(values.wallet_balance)) + parseFloat(values.application_fee) + 33.00)}\n2. To Pay Using MPESA\nGo to the M - pesa Menu, Select Pay Bill, Enter Business No. 658979, Enter Account No.(National ID number)\nHelp desk 0748320516`

						let formData = { // sms body
							"msisdn": values.msisdn,
							"text": texts
						}

						await axiod
							.post(`${SMS_BaseUrl} `, formData, {
								headers: {
									'Content-Type': 'application/json',
									'Accept': 'application/json',
								},
							})

						let formData_2 = { // sms body
							"msisdn": values.guarantor_msisdn,
							"text": texts_guarntor
						}
						await axiod
							.post(`${SMS_BaseUrl} `, formData_2, {
								headers: {
									'Content-Type': 'application/json',
									'Accept': 'application/json',
								},
							})

						const mbalance = (1.075 * ((parseFloat(values.wallet_balance)) + parseFloat(values.application_fee) + 33.00)) + parseFloat(values.insurance_fee);
						const mdebit = 0.075 * ((parseFloat(values.wallet_balance)) + parseFloat(values.application_fee) + 33.00);
						const text_mobi = `LENDING ALERT\nLoan Issued ${formatter.format((parseFloat(values.wallet_balance)) + parseFloat(values.application_fee) + 33.00)} \nBorrower ${values.applicant_name} \nBorrower Mobile No ${values.msisdn}\nLoan Start Date ${mPayment_date}\n1st Month Instalment ${formatter.format(monthly_installment)}\n2nd Month Instalment ${formatter.format(second_monthly_installment)}\n3rd Month Instalment ${formatter.format(third_monthly_installment)}\nLoan Duration 3 MONTHS\nFinal Instalment Date ${mdate} `;

						await loanService.updateLoanStatus({
							id: values.livestock_id,
							status: values.loan_status
						});
						await loanService.insertIntoStatements({
							credit: 0,
							debit: (parseFloat(values.wallet_balance) + parseFloat(values.application_fee) + 33.00),
							interest: mdebit,
							balance: mbalance,
							insurance_fee: (parseFloat(values.insurance_fee) / 3).toString(),
							insurance_balance: (parseFloat(values.insurance_fee) - parseFloat(values.insurance_fee) / 3),
							loan_id: values.loan_id,
							insurance_instalment_second: (parseFloat(values.insurance_fee) / 3),
							insurance_instalment_third: (parseFloat(values.insurance_fee) / 3),
							monthly_instalment: (((parseFloat(values.wallet_balance)) + parseFloat(values.application_fee) + 33.00) / 3),
							monthly_instalment_second: (((parseFloat(values.wallet_balance)) + parseFloat(values.application_fee) + 33.00) / 3),
							monthly_instalment_third: (((parseFloat(values.wallet_balance)) + parseFloat(values.application_fee) + 33.00) / 3),
							narrative: "Initial loan state",
							farmer_id: values.farmer_id,
							period: 1
						});
						await farmerService.updateLoanTotal({
							id: values.loan_id,
							principal_balance: ((parseFloat(values.wallet_balance)) + parseFloat(values.application_fee) + 33.00),
							insurance_fee: parseFloat(values.insurance_fee),
							insurance_installment: (parseFloat(values.insurance_fee) / 3),
							insurance_balance: (parseFloat(values.insurance_fee) - parseFloat(values.insurance_fee) / 3),
							monthly_instalment: (((parseFloat(values.wallet_balance)) + parseFloat(values.application_fee) + 33.00) / 3),

							monthly_instalment_second: (((parseFloat(values.wallet_balance)) + parseFloat(values.application_fee) + 33.00) / 3),
							monthly_instalment_third: (((parseFloat(values.wallet_balance)) + parseFloat(values.application_fee) + 33.00) / 3),
							insurance_instalment_second: (parseFloat(values.insurance_fee) / 3),
							insurance_instalment_third: (parseFloat(values.insurance_fee) / 3),
							total_amount: ((parseFloat(values.wallet_balance)) + parseFloat(values.application_fee) + 33.00),
							interest: mdebit,
							gender: mdate,
						});


						let formData_3 = { // sms body
							"msisdn": SMS.MOBIPESA,
							"text": text_mobi
						}


						const farmer = await loanService.getFarmerByID({

							id: values.farmer_id,
						});


						await axiod
							.post(`${SMS_BaseUrl} `, formData_3, {
								headers: {
									'Content-Type': 'application/json',
									'Accept': 'application/json',
								},
							})


						let formData3 = {
							"text": text_mobi,
							"user_id": farmer.user_id
						}
						console.log(formData);

						await axiod.post(`${SMS_BaseUrl_Officer} `, formData3, {
							headers: {
								'Content-Type': 'application/json',
								'Accept': 'application/json',
							},
						})


						response.body = {
							status: true,
							message: 'Success!',
						};
					} else {
						response.body = {
							status: false,
							message: 'Failed!',
						};
					}

				}
			}
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error} `,
			};
		}
	},

	//get Withdrawal Requests
	getWithdrawalRequests: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, page_size, filter_value } = getQuery(ctx, { mergeParams: true });
			const total = await farmerService.getWithdrawCount();
			// console.log(total)
			if (filter_value == null || filter_value == '') {
				if (page_number == null) {
					page_number = '1';
					page_size = '20';
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await farmerService.getWithdrawalRequests({
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
					const data = await farmerService.getWithdrawalRequests({
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
				const data = await farmerService.getWithdrawalRFilter({ filter_value: filter_value });
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
				message: `${error} `,
			};
		}
	},

	//get Withdrawal Requests
	getWithdrawalArchive: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, page_size, filter_value } = getQuery(ctx, { mergeParams: true });
			const total = await farmerService.getWithdrawArchiveCount();
			// console.log(total)
			if (filter_value == null || filter_value == '') {
				if (page_number == null) {
					page_number = '1';
					page_size = '20';
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await farmerService.getWithdrawalArchive({
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
					const data = await farmerService.getWithdrawalArchive({
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
				const data = await farmerService.getWithdrawalArchiveFilter({ filter_value: filter_value });
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
				message: `${error} `,
			};
		}
	},

	//get deposits made
	getDeposits: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, page_size, filter_value } = getQuery(ctx, { mergeParams: true });
			const total = await farmerService.getDepsositArchiveCount();
			// console.log(total)
			if (filter_value == null || filter_value == '') {
				if (page_number == null) {
					page_number = '1';
					page_size = '20';
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await farmerService.getDepositsArchvie({
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
					const data = await farmerService.getDepositsArchvie({
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
				const data = await farmerService.getDepositFilter({ filter_value: filter_value });
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
				message: `${error} `,
			};
		}
	},


	//get suspend account
	getSuspendAccount: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, page_size, filter_value } = getQuery(ctx, { mergeParams: true });
			const total = await farmerService.getCOUNT();
			// console.log(total)
			if (filter_value == null || filter_value == '') {
				if (page_number == null) {
					page_number = '1';
					page_size = '100';
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await farmerService.getSuspendAccount({
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
					const data = await farmerService.getSuspendAccount({
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
				const data = await farmerService.getSuspendFilter({ filter_value: filter_value });
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
				message: `${error} `,
			};
		}
	},
};
