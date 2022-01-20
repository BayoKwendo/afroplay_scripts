import { getQuery } from 'https://deno.land/x/oak/helpers.ts';
import * as log from 'https://deno.land/std/log/mod.ts';
import livestockService from '../services/liveStockService.ts';
import loanService from '../services/loanService.ts';
import { S3Bucket } from 'https://deno.land/x/s3@0.4.1/mod.ts';
import axiod from 'https://deno.land/x/axiod@0.22/mod.ts';
import { SMS_BaseUrl_Admin_Final } from '../db/config.ts';


export default {
	/**
   * @description Create Livestock
   */
	createLivestock: async (context: any) => {
		try {
			/**
			 * @description get data in form-data including images and data to be stored in memeory
			**/
			const body = await context.request.body();
			const data = await body.value.read({ maxSize: 20000000000 });

			console.log(data);

			// console.log(Date.now())
			// store files in s3 buckets
			const bucket = new S3Bucket({
				accessKeyID: 'AKIAZTX7OWBI4J7EGIVR',
				secretKey: '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',
				bucket: 'ngombeloan',
				region: 'eu-west-1',
			});
			const image_name = Date.now() + data.files[0].originalName;
			const image_name_2 = Date.now() + data.files[1].originalName;
			const image_name_3 = Date.now() + data.files[2].originalName;
			const image_name_4 = Date.now() + data.files[3].originalName;

			const s3push = await bucket.putObject(`ngombe_pics/${image_name}`, data.files[0].content);
			const s3push_2 = await bucket.putObject(`ngombe_pics/${image_name_2}`, data.files[1].content);
			const s3push_3 = await bucket.putObject(`ngombe_pics/${image_name_3}`, data.files[2].content);
			const s3push_4 = await bucket.putObject(`ngombe_pics/${image_name_4}`, data.files[3].content);


			const image_url = `https://ngombeloan.s3.eu-west-1.amazonaws.com/ngombe_pics/${image_name}`;
			const image_url_2 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/ngombe_pics/${image_name_2}`;
			const image_url_3 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/ngombe_pics/${image_name_3}`;
			const image_url_4 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/ngombe_pics/${image_name_4}`;


			/**
			 * @description the below is used to write image in the specific folder. Deno write for server based storage.
			   * const deno = await Deno.writeFile(`temp_uploads/${data.files[0].originalName}`, data.files[0].content);
		   **/
			if (s3push && s3push_2 && s3push_3 && s3push_4) {
				const values = data.fields;
				const db_stored = await livestockService.addLiveStock({
					farmer_id: values.farmer_id,
					breed: values.breed,
					vacinations: values.vacinations,
					health_ratings: values.health_ratings,
					valuations: values.valuations,
					vet_name: values.vet_name,
					vet_reg_no: values.vet_reg_no,
					tag_id: values.tag_id,
					logo_url: image_url,
					logo_url_2: image_url_2,
					logo_url_3: image_url_3,
					next_to_cow: image_url_4,
					gender: values.gender,
					latitude: values.latitude,
					longitude: values.longitude,
					age: values.age,
					location: values.location

				});
				if (db_stored) {
					context.response.body = {
						status: true,
						status_code: 200,
						message: 'Success!',
					};
				}
			}

			else {
				context.response.status = 400;
				context.response.body = {
					success: false,
					message: `You have to upload all portrait first`,
				};
			}
		} catch (error) {
			context.response.status = 400;
			context.response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},


	/**
   * @description Update Livestock
   */
	updateLivestock: async (context: any) => {
		try {
			/**
			 * @description get data in form-data including images and data to be stored in memeory
			**/
			const body = await context.request.body();
			const data = await body.value.read({ maxSize: 20000000000 });
			console.log(data);
			// console.log(Date.now())
			// store files in s3 buckets
			const bucket = new S3Bucket({
				accessKeyID: 'AKIAZTX7OWBI4J7EGIVR',
				secretKey: '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',
				bucket: 'ngombeloan',
				region: 'eu-west-1',
			});
			const image_name = Date.now() + data.files[0].originalName;
			const image_name_2 = Date.now() + data.files[1].originalName;
			const image_name_3 = Date.now() + data.files[2].originalName;

			const s3push = await bucket.putObject(`ngombe_pics/${image_name}`, data.files[0].content);
			const s3push_2 = await bucket.putObject(`ngombe_pics/${image_name_2}`, data.files[1].content);
			const s3push_3 = await bucket.putObject(`ngombe_pics/${image_name_3}`, data.files[2].content);


			const image_url = `https://ngombeloan.s3.eu-west-1.amazonaws.com/ngombe_pics/${image_name}`;
			const image_url_2 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/ngombe_pics/${image_name_2}`;
			const image_url_3 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/ngombe_pics/${image_name_3}`;


			/**
			 * @description the below is used to write image in the specific folder. Deno write for server based storage.
			   * const deno = await Deno.writeFile(`temp_uploads/${data.files[0].originalName}`, data.files[0].content);
		   **/
			if (s3push && s3push_2 && s3push_3) {
				const values = data.fields;
				const db_stored = await livestockService.updateLivestock({
					insurance_url: image_url,
					vet_valuation: image_url_2,
					vaccination_regime_form: image_url_3,
					id: values.id

				});
				if (db_stored) {
					context.response.body = {
						status: true,
						status_code: 200,
						message: 'Success!',
					};
				}
			}

			else {
				context.response.status = 400;
				context.response.body = {
					success: false,
					message: `You have to upload all portrait first`,
				};
			}
		} catch (error) {
			context.response.status = 400;
			context.response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},
	//get All Livestock
	getLivestock: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, page_size, loan_status, filter_value, farmer_id } = getQuery(ctx, { mergeParams: true });

			let mloan_status;
			if (loan_status === '0') {
				mloan_status = '0';
			} else if (loan_status === '1' || loan_status === '3' || loan_status === '5' || loan_status === '6' || loan_status === '9') {
				mloan_status = '1';
			} else {
				mloan_status = '1';
			}

			const total = await livestockService.getLivestockCount({
				loan_status: Number(loan_status),
				mloan_status: Number(mloan_status)

			});

			console.log({
				loan_status: Number(loan_status),
				filter_value: filter_value,
				mloan_status: Number(mloan_status)

			})

			console.log(mloan_status);
			// console.log(total)
			if (filter_value == null || filter_value == '') {
				console.log("here")

				if (page_number == null) {
					page_number = '1';
					page_size = '100';
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await livestockService.getLivestock({
						offset: Number(offset),
						loan_status: Number(loan_status),
						mloan_status: Number(mloan_status),
						page_size: Number(page_size),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total.count,
						loan_issued: total.loan_issued,
						approved_loan: total.approved_loan,
						data: data
					};
				} else {
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await livestockService.getLivestock({
						offset: Number(offset),
						loan_status: Number(loan_status),
						mloan_status: Number(mloan_status),

						page_size: Number(page_size),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total.count,
						loan_issued: total.loan_issued,
						approved_loan: total.approved_loan,
						data: data,
					};
				}
			}
			else {

				console.log("here")

				const total_filter = await livestockService.getLivestockCountFIlter({
					filter_value: filter_value
				});

				console.log(filter_value)
				if (page_number == null) {
					page_number = '1';
					page_size = '5';
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await livestockService.getLivestockFilter({
						offset: Number(offset),
						filter_value: filter_value,
						page_size: Number(page_size),
					});

					console.log(data)

					if (data.length > 0) {
						const loan_reference = await loanService.getLoanReference({ id: data[0].id });
						console.log(loan_reference)

						let loan_status;

						let loan_applicable = (parseFloat(data[0].value.replaceAll(',', '')) * (60 / 100)).toFixed(2);

						let applicant_fee = 1100; //ksh 200 for legal fee, ksh 300 for animal identification fee, ksh 300 for vet fee and ksh 300 for admin fee total application fee is 1100

						if (loan_reference != 0) {
							loan_status = await loanService.getLoanStatusField({ reference: loan_reference });
							console.log(loan_reference)
							ctx.response.body = {
								status: true,
								status_code: 200,
								total: total_filter,
								loan_applicable: loan_applicable,
								applicant_fee: applicant_fee,
								loan_status: loan_status.status,
								reason: loan_status.description,
								data: data,
							};
						} else {
							ctx.response.body = {
								status: true,
								status_code: 200,
								total: total_filter,
								loan_applicable: loan_applicable,
								applicant_fee: applicant_fee,
								loan_status: 'Pending',
								reason: "Reviewing",
								data: data,
							};
						}



					} else {
						ctx.response.body = {
							status: true,
							total: total_filter,
							status_code: 200,
							// loan_applicable: loan_applicable,
							// applicant_fee: applicant_fee,
							data: data,
						};
					}
				} else {
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await livestockService.getLivestockFilter({
						offset: Number(offset),
						page_size: Number(page_size),
						filter_value: filter_value,

					});
					if (data.length > 0) {
						let loan_applicable = (parseFloat(data[0].value.replaceAll(',', '')) * (60 / 100)).toFixed(2);
						let applicant_fee = 1100; //ksh 200 for legal fee, ksh 300 for animal identification fee, ksh 300 for vet fee and ksh 300 for admin fee total application fee is 1100
						ctx.response.body = {
							status: true,
							status_code: 200,
							total: total_filter,
							loan_applicable: loan_applicable,
							applicant_fee: applicant_fee,
							data: data,
						};
					} else {
						ctx.response.body = {
							status: true,
							total: total_filter,
							status_code: 200,
							// loan_applicable: loan_applicable,
							// applicant_fee: applicant_fee,
							data: data,
						};
					}
				}


			}

		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},



	//Loan lists
	getLivestockLoans: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, role_id, user_id, page_size, loan_status, filter_value, ro } = getQuery(ctx, { mergeParams: true });

			let mloan_status;
			if (loan_status === '0') {
				mloan_status = '0';
			} else if (loan_status === '1' || loan_status === '3' || loan_status === '5' || loan_status === '6' || loan_status === '9') {
				mloan_status = '1';
			} else {
				mloan_status = '1';
			}
			if (Number(role_id) === 1 || Number(role_id) === 2) {

				const total = await livestockService.getLivestockCount({
					loan_status: Number(loan_status),
					mloan_status: Number(mloan_status)

				});

				console.log({
					loan_status: Number(loan_status),
					filter_value: filter_value,
					mloan_status: Number(mloan_status)

				})

				console.log(mloan_status);
				// console.log(total)

				if (Number(loan_status) == 22) {
					if (filter_value == null || filter_value == '') {
						console.log("here")

						if (page_number == null) {
							page_number = '1';
							page_size = '100';
							const offset = (Number(page_number) - 1) * Number(page_size);
							const data = await livestockService.getLivestockPaid({
								offset: Number(offset),
								loan_status: Number(loan_status),
								mloan_status: Number(mloan_status),
								page_size: Number(page_size),
							});
							ctx.response.body = {
								status: true,
								status_code: 200,
								total: total.count,
								loan_issued: total.loan_issued,
								approved_loan: total.approved_loan,
								data: data
							};
						} else {
							const offset = (Number(page_number) - 1) * Number(page_size);
							const data = await livestockService.getLivestockPaid({
								offset: Number(offset),
								loan_status: Number(loan_status),
								mloan_status: Number(mloan_status),

								page_size: Number(page_size),
							});
							ctx.response.body = {
								status: true,
								status_code: 200,
								total: total.count,
								loan_issued: total.loan_issued,
								approved_loan: total.approved_loan,
								data: data,
							};
						}
					}
					else {

						const offset = (Number(page_number) - 1) * Number(page_size);

						const data = await livestockService.getLivestockFilterLoanPaid({
							offset: Number(offset),
							loan_status: Number(loan_status),
							mloan_status: Number(mloan_status),
							filter_value: filter_value,
							page_size: Number(page_size),
						});
						ctx.response.body = {
							status: true,
							status_code: 200,
							total: total.count,
							loan_issued: total.loan_issued,
							approved_loan: total.approved_loan,
							data: data,
						};

					}
				}

				else {
					if (filter_value == null || filter_value == '') {
						console.log("here")

						if (page_number == null) {
							page_number = '1';
							page_size = '100';
							const offset = (Number(page_number) - 1) * Number(page_size);
							const data = await livestockService.getLivestock({
								offset: Number(offset),
								loan_status: Number(loan_status),
								mloan_status: Number(mloan_status),
								page_size: Number(page_size),
							});
							ctx.response.body = {
								status: true,
								status_code: 200,
								total: total.count,
								loan_issued: total.loan_issued,
								approved_loan: total.approved_loan,
								data: data
							};
						} else {
							const offset = (Number(page_number) - 1) * Number(page_size);
							const data = await livestockService.getLivestock({
								offset: Number(offset),
								loan_status: Number(loan_status),
								mloan_status: Number(mloan_status),

								page_size: Number(page_size),
							});
							ctx.response.body = {
								status: true,
								status_code: 200,
								total: total.count,
								loan_issued: total.loan_issued,
								approved_loan: total.approved_loan,
								data: data,
							};
						}
					}
					else {


						const offset = (Number(page_number) - 1) * Number(page_size);

						const data = await livestockService.getLivestockFilterLoan({
							offset: Number(offset),
							loan_status: Number(loan_status),
							mloan_status: Number(mloan_status),
							filter_value: filter_value,
							page_size: Number(page_size),
						});
						ctx.response.body = {
							status: true,
							status_code: 200,
							total: total.count,
							loan_issued: total.loan_issued,
							approved_loan: total.approved_loan,
							data: data,
						};

					}
				}
			} else {


				if (Number(loan_status) == 22) {
					console.log("we log here log");

					const total = await livestockService.getLivestockCountBranchPaid({
						user_id: Number(user_id),
						loan_status: Number(loan_status),
						mloan_status: Number(mloan_status)

					});

					console.log({
						loan_status: Number(loan_status),
						filter_value: filter_value,
						mloan_status: Number(mloan_status)

					})

					console.log(mloan_status);
					// console.log(total)

					if (filter_value == null || filter_value == '') {
						console.log("here")

						if (page_number == null) {
							page_number = '1';
							page_size = '100';
							const offset = (Number(page_number) - 1) * Number(page_size);
							const data = await livestockService.getLivestockBranchOnePaid({
								offset: Number(offset),
								user_id: Number(user_id),
								loan_status: Number(loan_status),
								mloan_status: Number(mloan_status),
								page_size: Number(page_size),
							});
							ctx.response.body = {
								status: true,
								status_code: 200,
								total: total.count,
								loan_issued: total.loan_issued,
								approved_loan: total.approved_loan,
								data: data
							};
						} else {
							const offset = (Number(page_number) - 1) * Number(page_size);
							const data = await livestockService.getLivestockBranchOnePaid({
								offset: Number(offset),
								loan_status: Number(loan_status),
								mloan_status: Number(mloan_status),
								user_id: Number(user_id),
								page_size: Number(page_size),
							});
							ctx.response.body = {
								status: true,
								status_code: 200,
								total: total.count,
								loan_issued: total.loan_issued,
								approved_loan: total.approved_loan,
								data: data,
							};
						}
					}
					else {

						console.log("we log here log");
						const offset = (Number(page_number) - 1) * Number(page_size);

						const data = await livestockService.getLivestockFilterLoanPaid({
							offset: Number(offset),
							loan_status: Number(loan_status),
							mloan_status: Number(mloan_status),
							user_id: Number(user_id),
							filter_value: filter_value,
							page_size: Number(page_size),
						});
						ctx.response.body = {
							status: true,
							status_code: 200,
							total: total.count,
							loan_issued: total.loan_issued,
							approved_loan: total.approved_loan,
							data: data,
						};

					}
				} else {


					console.log("we log here log");

					const total = await livestockService.getLivestockCountBranch({
						user_id: Number(user_id),
						loan_status: Number(loan_status),
						mloan_status: Number(mloan_status)

					});

					console.log({
						loan_status: Number(loan_status),
						filter_value: filter_value,
						mloan_status: Number(mloan_status)

					})

					console.log(mloan_status);
					// console.log(total)

					if (filter_value == null || filter_value == '') {
						console.log("here")

						if (page_number == null) {
							page_number = '1';
							page_size = '100';
							const offset = (Number(page_number) - 1) * Number(page_size);
							const data = await livestockService.getLivestockBranchOne({
								offset: Number(offset),
								user_id: Number(user_id),
								loan_status: Number(loan_status),
								mloan_status: Number(mloan_status),
								page_size: Number(page_size),
							});
							ctx.response.body = {
								status: true,
								status_code: 200,
								total: total.count,
								loan_issued: total.loan_issued,
								approved_loan: total.approved_loan,
								data: data
							};
						} else {
							const offset = (Number(page_number) - 1) * Number(page_size);
							const data = await livestockService.getLivestockBranchOne({
								offset: Number(offset),
								loan_status: Number(loan_status),
								mloan_status: Number(mloan_status),
								user_id: Number(user_id),
								page_size: Number(page_size),
							});
							ctx.response.body = {
								status: true,
								status_code: 200,
								total: total.count,
								loan_issued: total.loan_issued,
								approved_loan: total.approved_loan,
								data: data,
							};
						}
					}
					else {

						console.log("we log here log");
						const offset = (Number(page_number) - 1) * Number(page_size);

						const data = await livestockService.getLivestockFilterLoan({
							offset: Number(offset),
							loan_status: Number(loan_status),
							mloan_status: Number(mloan_status),
							user_id: Number(user_id),
							filter_value: filter_value,
							page_size: Number(page_size),
						});
						ctx.response.body = {
							status: true,
							status_code: 200,
							total: total.count,
							loan_issued: total.loan_issued,
							approved_loan: total.approved_loan,
							data: data,
						};

					}
				}
			}


		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},

	/**
	* @description Get Delete livestock
	*/
	deleteLivestock: async (ctx: any) => {
		try {
			let { id } = getQuery(ctx, {
				mergeParams: true,
			});
			const data = await livestockService.deleteLivestock({
				id: Number(id),
			});
			ctx.response.body = {
				status: true,
				status_code: 200,
				message: 'Success',
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

	/**
   * @description Create Livestock
   */
	editLivestock: async ({ request, response }: { request: any, response: any }) => {
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
			await livestockService.editLivestock({
				farmer_id: values.farmer_id,
				breed: values.breed,
				vacinations: values.vacinations,
				health_ratings: values.health_ratings,
				valuations: values.valuations,
				gender: values.gender,
				age: values.age,
				location: values.location,
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
* @description Update Livestock
*/
	updateNgombeValue: async ({ request, response }: { request: any, response: any }) => {
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
			await livestockService.updateCowValue({
				valuations: values.valuations,
				vet_name: values.vet_name,
				vet_reg_no: values.vet_reg_no,
				reason: values.description,
				id: values.id
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

	getRejectedLoans: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, page_size, filter_value } = getQuery(ctx, { mergeParams: true });
			const total = await livestockService.getCOUNT();
			// console.log(total)
			if (filter_value == null || filter_value == '') {
				if (page_number == null) {
					page_number = '1';
					page_size = '100';
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await livestockService.getRejectedLoans({
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
					const data = await livestockService.getRejectedLoans({
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
				const data = await livestockService.getRejectedFilter({ filter_value: filter_value });
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
	updateRejectedLoans: async (context: any) => {
		const body = await context.request.body();
		const values = await body.value;

		console.log({
			id: values.id,
			name: values.description,
		})

		await livestockService.updateRejectedAccount({
			id: values.id,
			name: values.description,
		});

		const mupdate = await livestockService.updatLivestockStatus({
			id: values.livestock_id
		});

		console.log(mupdate, 'mupdate');
		console.log(values)


		context.response.body = {
			status: true,
			status_code: 200,
			message: 'Success!',
		};
	},

	updateRejectedVariete: async (context: any) => {
		const body = await context.request.body();
		const values = await body.value;


		await livestockService.updateRejectedVariete({
			id: values.id
		});
		const text = `, this is to alert you that you have a pending loan to approve. Loan reference ${values.loan_reference}\n\n`;
		let formData = {
			"text": text,
		}
		await axiod.post(`${SMS_BaseUrl_Admin_Final} `, formData, {
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
		})
		context.response.body = {
			status: true,
			status_code: 200,
			message: 'Success!',
		};
	},
};
