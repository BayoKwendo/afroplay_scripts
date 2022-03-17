import { getQuery } from 'https://deno.land/x/oak@v8.0.0/helpers.ts';
import * as log from 'https://deno.land/std/log/mod.ts';
import loanService from '../services/loanService.ts';
import farmerService from '../services/farmerService.ts';
import { S3Bucket } from 'https://deno.land/x/s3@0.4.1/mod.ts';
import { SMS, SMS_BaseUrl, SMS_BaseUrl_Officer, SMS_BaseUrl_Admin_Final, SMS_BaseUrl_Admin, formatter } from '../db/config.ts';
import { MPESA } from '../db/config.ts';
import { Buffer } from 'https://deno.land/std/io/mod.ts';
import { cryptoRandomString } from 'https://github.com/piyush-bhatt/crypto-random-string/raw/main/mod.ts';
import axiod from 'https://deno.land/x/axiod@0.22/mod.ts';
import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";
// import XLSX from 'https://esm.sh/xlsx';


export default {
	/**
   * @description Create Loan
   */
	reconciliationCreate: async (context: any) => {
		const data = await context.request.body();

		const getNumber = await data.value;

		// console.log(getNumber);

		for (let i = 0; i < getNumber.length; i++) {
			try {

				if (!isNaN(getNumber[i].mamount)) {
					if (i % 20 === 0) {
						await task(i);
					}

					let formData_m = {
						"TransID": getNumber[i].mreceipt_no,
						"FirstName": getNumber[i].mname,
						"MiddleName": "",
						"LastName": "",
						"MSISDN": getNumber[i].mreceipt_no,
						"BillRefNumber": getNumber[i].maccount_no,
						"TransAmount": getNumber[i].mamount
					}
					console.log(`Task ${JSON.stringify(formData_m)} done!`);

					const insert = await axiod.post(`https://api.ngombeloan.co.ke/confirmation_mobi`, formData_m, {
						headers: {
							'Content-Type': 'application/json',
							'Accept': 'application/json',
						}
					});

					if (insert) {
						console.log(`Task ${i} done!`);
					} else {
						context.response.status = 200;
					}
				}

				async function task(i: any) {
					await timer(1000);
					console.log(`Task ${i} done!`);
				}

				function timer(ms: any) {
					return new Promise((res) => setTimeout(res, ms));
				}

				context.response.status = 200;

				context.response.body = {
					success: true,
					message: `Success!`,
				};

			} catch (e) {
				context.response.status = 400;
				context.response.body = {
					success: false,
					message: `${e}`,
				};
				console.log(e);
			}
		}
	},


	createLoan: async (context: any) => {
		try {
			/**
			 * @description get data in form-data including images and data to be stored in memeory
			**/
			const body = await context.request.body();
			const data = await body.value.read({ maxSize: 2000000000000000 });

			console.log(data);
			// console.log(Date.now())
			// store files in s3 buckets
			const bucket = new S3Bucket({
				accessKeyID: 'AKIAZTX7OWBI4J7EGIVR',
				secretKey: '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',
				bucket: 'ngombeloan',
				region: 'eu-west-1',
			});

			// Applicant details
			const applicant_form = Date.now() + data.files[0].originalName;
			const kra_form = Date.now() + data.files[1].originalName;
			const mpesa_bank_statement = Date.now() + data.files[2].originalName;

			// const business_permit = Date.now() + data.files[7].originalName;

			// push image object to bitckut
			const s3push = await bucket.putObject(`applicant_pics/${applicant_form}`, data.files[0].content);
			const s3push_24 = await bucket.putObject(`applicant_pics/${kra_form}`, data.files[1].content);
			const s3push_25 = await bucket.putObject(`applicant_pics/${mpesa_bank_statement}`, data.files[2].content);
			const applicant_form_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/applicant_pics/${applicant_form}`;
			const kra_certificate_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/applicant_pics/${kra_form}`;
			const finance_statement_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/applicant_pics/${mpesa_bank_statement}`;

			/**
			 * 
					 * @description the below is used to write image in the specific folder. Deno write for server based storage.
					   * const deno = await Deno.writeFile(`temp_uploads/${data.files[0].originalName}`, data.files[0].content);
				   **/

			const data_reference = cryptoRandomString({ length: 12, type: 'alphanumeric' });
			const values = data.fields;

			if (
				s3push && s3push_24 && s3push_25) {

				let insurance_fee;
				
				if (values.status_paid == 1) {
					insurance_fee = 0;
				} {
					if (parseFloat(values.cow_value) > 50000) {
						insurance_fee = 0.04 * parseFloat(values.cow_value);
					} else {
						insurance_fee = 2000;
					}
				}


				let mtotal_amount = Number(values.total_amount)

				const db_stored = await loanService.addLoan(
					{
						farmer_id: values.farmer_id,
						total_amount: mtotal_amount.toString(),
						applicant_fee: values.applicant_fee,
						livestock_id: values.livestock_id,
						insurance_fee: insurance_fee.toString(),
						applicantion_form: applicant_form_submit,
						oustanding_loan: values.oustanding_loan,
						loan_counts: values.loan_counts,

						loan_purpose: values.loan_purpose,

						defaulted_loans: values.defaulted_loan,
						loan_repament: values.laon_repayment,
						gross_income: values.gross_income,
						created_by: values.created_by,
						reference: data_reference,
						statements: finance_statement_submit,
						business_permit: kra_certificate_submit,
						kra_certificate: kra_certificate_submit,
					}
				);


				if (db_stored) {

					context.response.body = {
						status: true,
						status_code: 200,
						loan_reference: data_reference,
						message: 'Success!',
					};
				}

			} else {
				context.response.status = 400;
				context.response.body = {
					success: false,
					message: `You have to upload neccessary files first`,
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
	   * @description Create Loan
	   */
	createGuarantor: async (context: any) => {
		try {
			/**
			 * @description get data in form-data including images and data to be stored in memeory
			**/
			const body = await context.request.body();
			const data = await body.value.read({ maxSize: 2000000000000000 });
			// store files in s3 buckets
			const bucket = new S3Bucket({
				accessKeyID: 'AKIAZTX7OWBI4J7EGIVR',
				secretKey: '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',
				bucket: 'ngombeloan',
				region: 'eu-west-1',
			});

			// guarantors collections
			const gurantor_photo = Date.now() + data.files[3].originalName;
			const gurantor_id_front_page = Date.now() + data.files[4].originalName;
			const gurantor_photo_2 = Date.now() + data.files[5].originalName;
			const gurantor_id_front_page_2 = Date.now() + data.files[6].originalName;
			const gurantor_photo_3 = Date.now() + data.files[7].originalName;
			const gurantor_id_front_page_3 = Date.now() + data.files[8].originalName;

			const s3push_5 = await bucket.putObject(`gurantor_pics/${gurantor_photo}`, data.files[3].content);
			const s3push_6 = await bucket.putObject(`gurantor_pics/${gurantor_id_front_page}`, data.files[4].content);
			const s3push_8 = await bucket.putObject(`gurantor_pics/${gurantor_photo_2}`, data.files[5].content);
			const s3push_9 = await bucket.putObject(`gurantor_pics/${gurantor_id_front_page_2}`, data.files[6].content);
			const s3push_11 = await bucket.putObject(`gurantor_pics/${gurantor_photo_3}`, data.files[7].content);
			const s3push_12 = await bucket.putObject(`gurantor_pics/${gurantor_id_front_page_3}`, data.files[8].content);

			const gurantor_photo_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/gurantor_pics/${gurantor_photo}`;
			const gurantor_id_front_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/gurantor_pics/${gurantor_id_front_page}`;
			const gurantor_photo_submit_2 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/gurantor_pics/${gurantor_photo_2}`;
			const gurantor_id_front_submit_2 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/gurantor_pics/${gurantor_id_front_page_2}`;
			const gurantor_photo_submit_3 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/gurantor_pics/${gurantor_photo_3}`;
			const gurantor_id_front_submit_3 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/gurantor_pics/${gurantor_id_front_page_3}`;

			const values = data.fields;

			if (s3push_5 && s3push_6 && s3push_8
				&& s3push_9 && s3push_11 && s3push_12) {

				// add guarantor
				const postRequest = await loanService.addGuarantor({
					loan_reference: values.loan_reference,
					name: values.guarantor_name,
					id_no: values.guarantor_id_no,
					guarantor_msisdn: values.guarantor_msisdn,
					guarantor_id_photo: gurantor_photo_submit,
					guarantor_id_front_page: gurantor_id_front_submit,
					name_2: values.guarantor_name_2,
					id_no_2: values.guarantor_id_no_2,
					guarantor_msisdn_2: values.guarantor_msisdn_2,
					passport_photo_2: gurantor_photo_submit_2,
					guarantor_id_front_2: gurantor_id_front_submit_2,
					name_3: values.guarantor_name_3,
					id_no_3: values.guarantor_id_no_3,
					guarantor_msisdn_3: values.guarantor_msisdn_3,
					passport_photo_3: gurantor_photo_submit_3,
					guarantor_id_front_3: gurantor_id_front_submit_3
				});

				if (postRequest) {

					context.response.body = {
						status: true,
						status_code: 200,
						loan_reference: values.loan_reference,
						message: 'Success!',
					};
				}
			} else {
				context.response.status = 400;
				context.response.body = {
					success: false,
					message: `You have to upload neccessary files first`,
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
	   * @description Create Loan
	   */
	createWitness: async (context: any) => {
		try {

			/**
			 * @description get data in form-data including images and data to be stored in memeory
			**/
			const body = await context.request.body();
			const data = await body.value.read({ maxSize: 2000000000000000 });
			const bucket = new S3Bucket({
				accessKeyID: 'AKIAZTX7OWBI4J7EGIVR',
				secretKey: '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',
				bucket: 'ngombeloan',
				region: 'eu-west-1',
			});

			// witness collections
			const witness_photo = Date.now() + data.files[9].originalName;
			const witness_id_front_page = Date.now() + data.files[10].originalName;
			// const witnesst_id_back_page = Date.now() + data.files[14].originalName;
			// const witness_photo_2 = Date.now() + data.files[3].originalName;
			// const witness_id_front_page_2 = Date.now() + data.files[4].originalName;
			// const witnesst_id_back_page_2 = Date.now() + data.files[5].originalName;
			// const witness_photo_3 = Date.now() + data.files[6].originalName;
			// const witness_id_front_page_3 = Date.now() + data.files[7].originalName;
			// const witnesst_id_back_page_3 = Date.now() + data.files[8].originalName;


			const s3push_14 = await bucket.putObject(`witness_pics/${witness_photo}`, data.files[9].content);
			const s3push_15 = await bucket.putObject(`witness_pics/${witness_id_front_page}`, data.files[10].content);
			// const s3push_16 = await bucket.putObject(`witness_pics/${witnesst_id_back_page}`, data.files[14].content);
			// const s3push_17 = await bucket.putObject(`witness_pics/${witness_photo_2}`, data.files[3].content);
			// const s3push_18 = await bucket.putObject(`witness_pics/${witness_id_front_page_2}`, data.files[4].content);
			// const s3push_19 = await bucket.putObject(`witness_pics/${witnesst_id_back_page_2}`, data.files[5].content);
			// const s3push_20 = await bucket.putObject(`witness_pics/${witness_photo_3}`, data.files[6].content);
			// const s3push_21 = await bucket.putObject(`witness_pics/${witness_id_front_page_3}`, data.files[7].content);
			// const s3push_22 = await bucket.putObject(`witness_pics/${witnesst_id_back_page_3}`, data.files[8].content);

			const witness_photo_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witness_photo}`;
			const witness_id_front_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witness_id_front_page}`;
			// const witness_id_back_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witnesst_id_back_page}`;
			// const witness_photo_submit_2 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witness_photo_2}`;
			// const witness_id_front_submit_2 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witness_id_front_page_2}`;
			// const witness_id_back_submit_2 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witnesst_id_back_page_2}`;
			// const witness_photo_submit_3 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witness_photo_3}`;
			// const witness_id_front_submit_3 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witness_id_front_page_3}`;
			// const witness_id_back_submit_3 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witnesst_id_back_page_3}`;
			/**
			 * 
					 * @description the below is used to write image in the specific folder. Deno write for server based storage.
					   * const deno = await Deno.writeFile(`temp_uploads/${data.files[0].originalName}`, data.files[0].content);
				   **/
			const values = data.fields;

			if (s3push_14 && s3push_15
				// && s3push_17 && s3push_18 && s3push_19 && s3push_20 && s3push_21 && s3push_22
			) {
				// add witness
				const db_stored = await loanService.addWitneses({
					loan_reference: values.loan_reference,
					name: values.witness_name,
					id_no: values.witness_id_no,
					witness_id_photo: witness_photo_submit,
					witness_id_front_page: witness_id_front_submit,
					witness_id_back_page: witness_id_front_submit,
					// name_2: values.witness_name_2,
					// id_no_2: values.witness_id_no_2,
					// witness_id_photo_2: witness_photo_submit_2,
					// witness_id_front_page_2: witness_id_front_submit_2,
					// witness_id_back_page_2: witness_id_back_submit_2,
					// name_3: values.witness_name_3,
					// id_no_3: values.witness_id_no_3,
					// witness_2_location: values.witness_2_location,
					// witness_2_sub_location: values.witness_2_sub_location,
					// witness_village: values.witness_village,
					// witness_designation: values.witness_designation,
					// witness_group_name: values.witness_group_name,
					mobipesa_name: values.mobipesa_name,
					mobipesa_designation: values.mobipesa_designation,
					// witness_id_photo_3: witness_photo_submit_3,
					// witness_id_front_page_3: witness_id_front_submit_3,
					// witness_id_back_page_3: witness_id_back_submit_3
				});

				if (db_stored) {
					await loanService.createLoanStatus({
						reported_by: values.created_by,
						loan_reference: values.loan_reference,
						description: '',
						status: 'Pending',
						narative: 'Loan initiation'
					});
					const done = await loanService.updateLoanStatus({
						id: values.livestock_id,
						status: "1"
					});

					let mPayment_date = moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss');

					const text = `Dear ${values.farmer_name}, your application for ngombe loan of ${formatter.format(parseFloat(values.total_amount) + parseFloat(values.applicant_fee) + 33.00)} has been queued for processing. Loan Disbursement expected within three days. Help desk  0748320516`;


					let formData = {
						"msisdn": values.msisdn,
						"text": text
					}
					const sub = await loanService.updateLoanCompletionState({
						reference: values.loan_reference,
					});

					console.log(sub);
					// send sms to the borrower
					await axiod
						.post(`${SMS_BaseUrl}`, formData, {
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

				}
			} else {
				context.response.status = 400;
				context.response.body = {
					success: false,
					message: `You have to upload neccessary files first`,
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





	updateLoan: async (context: any) => {
		try {
			/**
			 * @description get data in form-data including images and data to be stored in memeory
			**/
			const body = await context.request.body();
			const data = await body.value.read({ maxSize: 2000000000000000 });

			console.log(data);
			// console.log(Date.now())
			// store files in s3 buckets
			const bucket = new S3Bucket({
				accessKeyID: 'AKIAZTX7OWBI4J7EGIVR',
				secretKey: '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',
				bucket: 'ngombeloan',
				region: 'eu-west-1',
			});

			// Applicant details
			const applicant_form = Date.now() + data.files[0].originalName;
			const kra_form = Date.now() + data.files[1].originalName;
			const mpesa_bank_statement = Date.now() + data.files[2].originalName;

			// const business_permit = Date.now() + data.files[7].originalName;

			// push image object to bitckut
			const s3push = await bucket.putObject(`applicant_pics/${applicant_form}`, data.files[0].content);
			const s3push_24 = await bucket.putObject(`applicant_pics/${kra_form}`, data.files[1].content);
			const s3push_25 = await bucket.putObject(`applicant_pics/${mpesa_bank_statement}`, data.files[2].content);
			const applicant_form_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/applicant_pics/${applicant_form}`;
			const kra_certificate_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/applicant_pics/${kra_form}`;
			const finance_statement_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/applicant_pics/${mpesa_bank_statement}`;

			/**
			 * 
					 * @description the below is used to write image in the specific folder. Deno write for server based storage.
					   * const deno = await Deno.writeFile(`temp_uploads/${data.files[0].originalName}`, data.files[0].content);
				   **/

			// const data_reference = cryptoRandomString({ length: 12, type: 'alphanumeric' });
			const values = data.fields;

			if (
				s3push && s3push_24 && s3push_25) {

				let insurance_fee;

				if (parseFloat(values.cow_value) > 50000) {
					insurance_fee = 0.04 * parseFloat(values.cow_value);
				} else {
					insurance_fee = 2000;
				}


				let mtotal_amount = Number(values.total_amount)

				const db_stored = await loanService.updateLoanEntry(
					{
						farmer_id: values.farmer_id,
						total_amount: mtotal_amount.toString(),
						applicant_fee: values.applicant_fee,
						livestock_id: values.livestock_id,
						insurance_fee: insurance_fee.toString(),
						applicantion_form: applicant_form_submit,
						oustanding_loan: values.oustanding_loan,
						loan_counts: values.loan_counts,
						loan_purpose: values.loan_purpose,
						defaulted_loans: values.defaulted_loan,
						loan_repament: values.laon_repayment,
						gross_income: values.gross_income,
						created_by: values.created_by,
						reference: values.reference,
						statements: finance_statement_submit,
						business_permit: kra_certificate_submit,
						kra_certificate: kra_certificate_submit,
					}
				);


				if (db_stored) {

					context.response.body = {
						status: true,
						status_code: 200,
						loan_reference: values.reference,
						message: 'Success!',
					};
				}

			} else {
				context.response.status = 400;
				context.response.body = {
					success: false,
					message: `You have to upload neccessary files first`,
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
	   * @description Create Loan
	   */
	updateGuarantor: async (context: any) => {
		try {
			/**
			 * @description get data in form-data including images and data to be stored in memeory
			**/
			const body = await context.request.body();
			const data = await body.value.read({ maxSize: 2000000000000000 });
			// store files in s3 buckets
			const bucket = new S3Bucket({
				accessKeyID: 'AKIAZTX7OWBI4J7EGIVR',
				secretKey: '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',
				bucket: 'ngombeloan',
				region: 'eu-west-1',
			});

			// guarantors collections
			const gurantor_photo = Date.now() + data.files[3].originalName;
			const gurantor_id_front_page = Date.now() + data.files[4].originalName;
			const gurantor_photo_2 = Date.now() + data.files[5].originalName;
			const gurantor_id_front_page_2 = Date.now() + data.files[6].originalName;
			const gurantor_photo_3 = Date.now() + data.files[7].originalName;
			const gurantor_id_front_page_3 = Date.now() + data.files[8].originalName;

			const s3push_5 = await bucket.putObject(`gurantor_pics/${gurantor_photo}`, data.files[3].content);
			const s3push_6 = await bucket.putObject(`gurantor_pics/${gurantor_id_front_page}`, data.files[4].content);
			const s3push_8 = await bucket.putObject(`gurantor_pics/${gurantor_photo_2}`, data.files[5].content);
			const s3push_9 = await bucket.putObject(`gurantor_pics/${gurantor_id_front_page_2}`, data.files[6].content);
			const s3push_11 = await bucket.putObject(`gurantor_pics/${gurantor_photo_3}`, data.files[7].content);
			const s3push_12 = await bucket.putObject(`gurantor_pics/${gurantor_id_front_page_3}`, data.files[8].content);

			const gurantor_photo_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/gurantor_pics/${gurantor_photo}`;
			const gurantor_id_front_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/gurantor_pics/${gurantor_id_front_page}`;
			const gurantor_photo_submit_2 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/gurantor_pics/${gurantor_photo_2}`;
			const gurantor_id_front_submit_2 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/gurantor_pics/${gurantor_id_front_page_2}`;
			const gurantor_photo_submit_3 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/gurantor_pics/${gurantor_photo_3}`;
			const gurantor_id_front_submit_3 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/gurantor_pics/${gurantor_id_front_page_3}`;

			const values = data.fields;

			if (s3push_5 && s3push_6 && s3push_8
				&& s3push_9 && s3push_11 && s3push_12) {

				// add guarantor
				const postRequest = await loanService.updateGuarantor({
					loan_reference: values.reference,
					name: values.guarantor_name,
					id_no: values.guarantor_id_no,
					guarantor_msisdn: values.guarantor_msisdn,
					guarantor_id_photo: gurantor_photo_submit,
					guarantor_id_front_page: gurantor_id_front_submit,
					name_2: values.guarantor_name_2,
					id_no_2: values.guarantor_id_no_2,
					guarantor_msisdn_2: values.guarantor_msisdn_2,
					passport_photo_2: gurantor_photo_submit_2,
					guarantor_id_front_2: gurantor_id_front_submit_2,
					name_3: values.guarantor_name_3,

					id_no_3: values.guarantor_id_no_3,
					guarantor_msisdn_3: values.guarantor_msisdn_3,
					passport_photo_3: gurantor_photo_submit_3,
					guarantor_id_front_3: gurantor_id_front_submit_3
				});

				if (postRequest) {

					context.response.body = {
						status: true,
						status_code: 200,
						loan_reference: values.loan_reference,
						message: 'Success!',
					};
				}
			} else {
				context.response.status = 400;
				context.response.body = {
					success: false,
					message: `You have to upload neccessary files first`,
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
	   * @description Create Loan
	   */
	updateWitness: async (context: any) => {
		try {

			/**
			 * @description get data in form-data including images and data to be stored in memeory
			**/
			const body = await context.request.body();
			const data = await body.value.read({ maxSize: 2000000000000000 });
			const bucket = new S3Bucket({
				accessKeyID: 'AKIAZTX7OWBI4J7EGIVR',
				secretKey: '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',
				bucket: 'ngombeloan',
				region: 'eu-west-1',
			});

			// witness collections
			const witness_photo = Date.now() + data.files[9].originalName;
			const witness_id_front_page = Date.now() + data.files[10].originalName;
			// const witnesst_id_back_page = Date.now() + data.files[14].originalName;
			// const witness_photo_2 = Date.now() + data.files[3].originalName;
			// const witness_id_front_page_2 = Date.now() + data.files[4].originalName;
			// const witnesst_id_back_page_2 = Date.now() + data.files[5].originalName;
			// const witness_photo_3 = Date.now() + data.files[6].originalName;
			// const witness_id_front_page_3 = Date.now() + data.files[7].originalName;
			// const witnesst_id_back_page_3 = Date.now() + data.files[8].originalName;


			const s3push_14 = await bucket.putObject(`witness_pics/${witness_photo}`, data.files[9].content);
			const s3push_15 = await bucket.putObject(`witness_pics/${witness_id_front_page}`, data.files[10].content);
			// const s3push_16 = await bucket.putObject(`witness_pics/${witnesst_id_back_page}`, data.files[14].content);
			// const s3push_17 = await bucket.putObject(`witness_pics/${witness_photo_2}`, data.files[3].content);
			// const s3push_18 = await bucket.putObject(`witness_pics/${witness_id_front_page_2}`, data.files[4].content);
			// const s3push_19 = await bucket.putObject(`witness_pics/${witnesst_id_back_page_2}`, data.files[5].content);
			// const s3push_20 = await bucket.putObject(`witness_pics/${witness_photo_3}`, data.files[6].content);
			// const s3push_21 = await bucket.putObject(`witness_pics/${witness_id_front_page_3}`, data.files[7].content);
			// const s3push_22 = await bucket.putObject(`witness_pics/${witnesst_id_back_page_3}`, data.files[8].content);

			const witness_photo_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witness_photo}`;
			const witness_id_front_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witness_id_front_page}`;
			// const witness_id_back_submit = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witnesst_id_back_page}`;
			// const witness_photo_submit_2 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witness_photo_2}`;
			// const witness_id_front_submit_2 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witness_id_front_page_2}`;
			// const witness_id_back_submit_2 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witnesst_id_back_page_2}`;
			// const witness_photo_submit_3 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witness_photo_3}`;
			// const witness_id_front_submit_3 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witness_id_front_page_3}`;
			// const witness_id_back_submit_3 = `https://ngombeloan.s3.eu-west-1.amazonaws.com/witness_pics/${witnesst_id_back_page_3}`;
			/**
			 * 
					 * @description the below is used to write image in the specific folder. Deno write for server based storage.
					   * const deno = await Deno.writeFile(`temp_uploads/${data.files[0].originalName}`, data.files[0].content);
				   **/
			const values = data.fields;

			if (s3push_14 && s3push_15
				// && s3push_17 && s3push_18 && s3push_19 && s3push_20 && s3push_21 && s3push_22
			) {
				// add witness
				const db_stored = await loanService.UpdateWitneses({

					loan_reference: values.reference,
					name: values.witness_name,
					id_no: values.witness_id_no,
					witness_id_photo: witness_photo_submit,
					witness_id_front_page: witness_id_front_submit,
					witness_id_back_page: witness_id_front_submit,
					// name_2: values.witness_name_2,
					// id_no_2: values.witness_id_no_2,
					// witness_id_photo_2: witness_photo_submit_2,
					// witness_id_front_page_2: witness_id_front_submit_2,
					// witness_id_back_page_2: witness_id_back_submit_2,
					// name_3: values.witness_name_3,
					// id_no_3: values.witness_id_no_3,
					// witness_2_location: values.witness_2_location,
					// witness_2_sub_location: values.witness_2_sub_location,
					// witness_village: values.witness_village,
					// witness_designation: values.witness_designation,
					// witness_group_name: values.witness_group_name,
					mobipesa_name: values.mobipesa_name,
					mobipesa_designation: values.mobipesa_designation,
					// witness_id_photo_3: witness_photo_submit_3,
					// witness_id_front_page_3: witness_id_front_submit_3,
					// witness_id_back_page_3: witness_id_back_submit_3
				});

				if (db_stored) {
					await loanService.createLoanStatus({
						reported_by: values.created_by,
						loan_reference: values.loan_reference,
						description: 'Reupload the loan',
						status: 'Accepted',
						narative: 'Loan amendment'
					});
					const sub = await loanService.updateLoanCompletionState({
						reference: values.loan_reference,
					});

					context.response.body = {
						status: true,
						status_code: 200,
						message: 'Success!',
					};

				}
			} else {
				context.response.status = 400;
				context.response.body = {
					success: false,
					message: `You have to upload neccessary files first`,
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
* @description Update loan
*/
	updateLoanStatusPerson: async ({ request, response }: { request: any, response: any }) => {
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

			const loan_reference = await loanService.getLoanReference({ id: values.livestock_id });

			console.log(loan_reference);


			const loan_status = await loanService.getLoanFeedbackFieldOfficer({ reference: loan_reference });

			console.log(loan_status);

			console.log({ reference: loan_reference });

			if (loan_status < 2) {

				await loanService.createLoanStatus({
					reported_by: values.created_by,
					loan_reference: loan_reference,
					description: values.description,
					status: values.status,
					narative: values.narative
				});

				const done = await loanService.updateLoanStatus({
					id: values.livestock_id,
					status: "3"
				});

				response.status = 200;
				response.body = {
					success: true,
					message: 'Success!',
				};
			} else {
				response.status = 205;
				response.body = {
					success: true,
					message: 'You already submitted feedback!',
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
* @description Update Loan amount
*/
	updateLoanValue: async ({ request, response }: { request: any, response: any }) => {
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
			if (values.status_amount == 1) {

				const farmer = await loanService.getFarmerByID({
					id: values.farmer_id,
				});

				const text = `, this is to alert you that loan amount for ${farmer.name} was changed to ${values.amount_disbursed + 1133} please lias with the customer for confirmation to proceed.\n\n`;

				console.log(text);

				let formData = {
					"text": text,
					"user_id": farmer.user_id
				}
				await axiod.post(`${SMS_BaseUrl_Officer} `, formData, {
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
					},
				})
			}
			const amo = await loanService.updateLoanAmount({
				reference: values.loan_reference,
				amount: values.amount_disbursed
			});

			console.log(amo)

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
* @description Update loan from
*/
	updateLoanStatusFeedback: async ({ request, response }: { request: any, response: any }) => {
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

			if (values.loan_status == 11) {
				const farmer = await loanService.getFarmerByID({
					id: values.farmer_id,
				});
				const text = `Dear ${farmer.name}, kindy dial *849*6#  and select CONFIRM Loan option to complete your loan application process.\n\n`;
				let formData = {
					"msisdn": farmer.msisdn,
					"text": text
				}
				console.log(values.loan_status);
				// send sms to the borrower
				await axiod
					.post(`${SMS_BaseUrl}`, formData, {
						headers: {
							'Content-Type': 'application/json',
							'Accept': 'application/json',
						},
					})



				console.log("here")
				const farmer_2 = await loanService.getFarmerByID({
					id: values.farmer_id,
				});

				const text_2 = `, this is to alert you that your customer ${farmer.name} is awaiting customer approval. Please follow up to make sure everything is seemless to  the customer's end\n\n`;

				console.log(text);

				let formData_2 = {
					"text": text_2,
					"user_id": farmer_2.user_id
				}

				console.log(formData);


				await axiod.post(`${SMS_BaseUrl_Officer} `, formData_2, {
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
					},
				})


			}


			if (values.loan_status === 3) {


				console.log("here")
				const farmer = await loanService.getFarmerByID({
					id: values.farmer_id,
				});

				const text = `, this is to alert you that you have a pending loan to approve. Loan reference ${values.loan_reference}\n\n`;

				console.log(text);

				let formData = {
					"text": text,
					"user_id": farmer.user_id
				}

				console.log(formData);


				await axiod.post(`${SMS_BaseUrl_Officer} `, formData, {
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
					},
				})
			}

			if (values.loan_status === 5) {

				const farmer = await loanService.getFarmerByID({
					id: values.farmer_id,
				});

				const text = `, this is to alert you that you have a pending loan to approve. Loan reference ${values.loan_reference}\n\n`;

				let formData = {
					"text": text,
					"user_id": farmer.user_id
				}

				await axiod.post(`${SMS_BaseUrl_Admin} `, formData, {
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
					},
				})

			}


			if (values.loan_status === 6) {

				const farmer = await loanService.getFarmerByID({
					id: values.farmer_id,
				});

				const text = `, this is to alert you that you have a pending loan to approve. Loan reference ${values.loan_reference}\n\n`;

				let formData = {
					"text": text,
					"user_id": farmer.user_id
				}

				await axiod.post(`${SMS_BaseUrl_Admin_Final} `, formData, {
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
					},
				})

			}


			if (values.loan_status === 9) {

				// const farmer = await loanService.getFarmerByID({
				// 	id: values.farmer_id,
				// });

				// const text = `, this is to alert you that you have a pending loan to disburse. Loan reference ${values.loan_reference}\n\n`;

				// let formData = {
				// 	"text": text,
				// 	"user_id": farmer.user_id
				// }

				// await axiod.post(`${SMS_BaseUrl_Admin_Final} `, formData, {
				// 	headers: {
				// 		'Content-Type': 'application/json',
				// 		'Accept': 'application/json',
				// 	},
				// })

			}




			await loanService.updateLoanStatus({
				id: values.livestock_id,
				status: values.loan_status
			});
			await loanService.createLoanStatus({
				reported_by: values.created_by,
				loan_reference: values.loan_reference,
				description: values.description,
				status: values.status,
				narative: values.narative
			});

			response.status = 200;
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



	//// mpesa confirmation
	mmpesaConfirmation: async ({ request, response }: { request: any, response: any }) => {
		try {
			const body = await request.body();
			const values = await body.value;
			// console.log(body);
			console.log(values);
			const data = await loanService.getMUser({
				filter_value: values.BillRefNumber,
			});
			if (data > 0) {
				console.log("here");

				const data_farmer_id = await loanService.getMUserDetails({
					filter_value: values.BillRefNumber,
				});
				console.log(data_farmer_id);
				const data_livestock_id = await loanService.getLivestockDetails({
					filter_value: data_farmer_id[0].id,
				});
				if (data_livestock_id.length > 0) {
					const data = await loanService.insertDeposits({
						transaction_id: values.TransID,
						name: values.FirstName + ' ' + values.MiddleName + '' + values.LastName,
						msisdn: values.MSISDN,
						user_id_no: values.BillRefNumber,
						amount: Number(values.TransAmount),
					});
					console.log("new")
					if (data) {
						console.log(values);
						console.log(data_livestock_id[0].id);

						const there = await loanService.updateLoanPrincipal({
							id: data_livestock_id[0].id,
							filter_value: Number(values.TransAmount),
						});
						response.status = '202';
						response.body = {
							status: 202,
							ResultCode: 0,
							ResultDesc: 'Accepted',
						};
					}

				} else {
					response.status = '400';
					response.body = {
						status: 400,
						ResultCode: 1,
						ResultDesc: 'Rejected',
					};
				}

			} else {
				console.log("here");

				await loanService.insertDepositsSuspend({
					transaction_id: values.TransID,
					name: values.FirstName + ' ' + values.MiddleName + '' + values.LastName,
					msisdn: values.MSISDN,
					user_id_no: values.BillRefNumber,
					amount: Number(values.TransAmount),
				});

				response.status = '202';

				response.body = {
					status: 202,
					ResultCode: 0,
					ResultDesc: 'Accepted',
				};
			}


		} catch (error) {
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},

	//test connection on marafiki database
	testConnection: async ({ request, response }: { request: any, response: any }) => {
		try {

			await loanService.testConnection(); // connect to the service

			response.status = 200;
			response.body = {
				status: true,
				message: `Connection is ok`,
			};

		} catch (error) {
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},


	//// mpesa confirmation
	mpesaConfirmation: async ({ request, response }: { request: any, response: any }) => {
		try {
			const body = await request.body();
			const values = await body.value;

			// console.log(body);
			console.log(values);

			const data = await loanService.insertDeposits({
				transaction_id: values.transaction_id,
				name: values.name,
				msisdn: values.msisdn,
				user_id_no: values.account,
				amount: Number(values.amount),
			});
			if (data) {
				console.log(values);
				const data_farmer_id = await loanService.getMUserDetails({
					filter_value: values.account,
				});
				console.log(data_farmer_id);
				const data_livestock_id = await loanService.getLivestockDetails({
					filter_value: data_farmer_id[0].id,
				});
				console.log(data_livestock_id[0].id);

				if (data_livestock_id) {
					const there = await loanService.updateLoanPrincipal({
						id: data_livestock_id[0].id,
						filter_value: Number(values.amount),
					});

					// const text = `Dear ${values.name}, Ksh. ${Number(values.amount)} has been received by Mobipesa Ltd`;

					// let formData = {
					// 	"msisdn": values.msisdn,
					// 	"text": text
					// }
					// // send sms to the borrower
					// await axiod
					// 	.post(`${SMS_BaseUrl}`, formData, {
					// 		headers: {
					// 			'Content-Type': 'application/json',
					// 			'Accept': 'application/json',
					// 		},
					// 	})
					response.status = '202';
					response.body = {
						// status: true,
						status: 202,
						ResultCode: 0,
						ResultDesc: 'Accepted',
					};
				}
			}

		} catch (error) {
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},

	////  access .
	mValidation: async ({ request, response }: { request: any, response: any }) => {
		try {
			const body = await request.body();
			const values = await body.value;

			console.log(values);
			const data = await loanService.getMUser({
				filter_value: values.BillRefNumber,
			});
			if (data > 0) {
				response.body = {
					status: true,
					status_code: 200,
					ResultCode: 0,
					ResultDesc: 'Accepted',
				};
			} else {
				response.body = {
					status: true,
					status_code: 200,
					ResultCode: 0,
					ResultDesc: 'Accepted',
				};
			}
		} catch (error) {
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},


	//// mpesa access  token.
	insertToB2CD: async ({ request, response }: { request: any, response: any }) => {
		try {
			const body = await request.body();
			const timer = (ms: any) => new Promise(res => setTimeout(res, ms));

			const values = await body.value;
			const minsert = await loanService.insertintoDomiDB({
				msisdn: values.msisdn,
				amount: values.amount,
				reference: values.reference,
			});
			if (minsert) {
				await timer(2000);
				const data = await loanService.getProccessedTransaction({ filter_value: values.reference });


				let status = 'pending';

				if (data.ProcessStatus == 2) {
					status = 'success';
				} else if (data.ProcessStatus == 0) {
					status = 'pending';
				} else {
					status = 'failed';
				}
				await loanService.insertIntoWithdrawal({
					transaction_id: data.SafaricomMPESATransactionId,
					working_balance: values.amount,
					description: "Successfuly done",
					name: values.msisdn,
					status: status,
					reference: values.reference,
				});

				response.body = {
					status: true,
					status_code: 200,
					ResultCode: 0,
					ResultDesc: 'Accepted',
				};
			}
			console.log(JSON.stringify({
				msisdn: values.msisdn,
				amount: values.amount,
				reference: values.reference,
			}));
			// console.log(`Bearer ${data.access_token}`);
			response.body = {
				status: true,
				status_code: 200,
				data: values,
				message: 'Success!',
			};



		} catch (error) {
			console.log(error);
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},
	//// mpesa access  token.
	createB2C: async ({ request, response }: { request: any, response: any }) => {
		try {
			const body = await request.body();
			const values = await body.value;
			console.log(values);
			var data = new FormData();
			data.append('grant_type', `password`);
			data.append('username', `ngombe_loan`);
			data.append('password', `gJ$rHxCx4mAr_N7E`);
			data.append('client_id', `Xr0mF4qubUfDLZC7AmYjdQvudVU7Ni2x6BmdfSXn`);
			let token;

			const value = await axiod
				.post('https://mobioauth.ml/oauth/token', data)
				.then(async (respnse) => {
					// console.log(respnse);
					token = respnse.data.access_token;

					console.log(token);
					const data_reference = cryptoRandomString({ length: 12, type: 'alphanumeric' });
					// console.log(data_reference.toLowerCase());
					const postB2C = await fetch(`https://ke.luckbox.tk:9443/mpesa/ngombe_loan/b2c`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							client: 'ngombe_loan',
							msisdn: values.msisdn,
							amount: values.amount,
							reference: values.reference,
							callback: 'https://api.ngombeloan.co.ke/loan_callback',
						}),
					});
					if (postB2C) {
						const data_response = await postB2C.json();
						// console.log(data_response);
						// console.log(`Bearer ${data.access_token}`);
						response.body = {
							status: true,
							status_code: 200,
							data: data_response,
							message: 'Success!',
						};
					}
				})
				.catch((error) => {
					response.status = 400;
					response.body = {
						status: false,
						message: `${error}`,
					};
				});
			console.log('ddd');
		} catch (error) {
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},

	//// mpesa access  token.
	createToken: async ({ request, response }: { request: any, response: any }) => {
		try {
			const body = await request.body();
			const values = await body.value;
			// get a base64 encoded string
			const buf = btoa(`${MPESA.b2c_consumer_api}:${MPESA.b2c_secret}`);
			// authentication string
			let auth = `Basic ${buf}`;
			// send a GET request to the URL
			const postRequest = await fetch(`${MPESA.url_token}`, {
				method: 'GET',
				headers: {
					Authorization: `${auth}`,
					Accept: '*/*',
				},
			});

			console.log(postRequest);

			if (postRequest) {
				const data = await postRequest.json();
				console.log(data.access_token);
				const postB2C = await fetch(`${MPESA.b2c_url}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${data.access_token}`,
					},
					body: JSON.stringify({
						InitiatorName: `${MPESA.initiatorName}`,
						SecurityCredential: `${MPESA.securityCredential}`,
						Occassion: 'StallOwner',
						CommandID: 'BusinessPayment',
						PartyA: `${MPESA.b2c_shortcode}`,
						PartyB: values.msisdn,
						Remarks: 'B2C',
						Amount: values.amount,
						QueueTimeOutURL: 'https://api.polarmanpower.com/call_back',
						ResultURL: 'https://api.polarmanpower.com/call_back',
					}),
				});
				if (postB2C) {
					const data_response = await postB2C.json();
					console.log(postB2C);
					response.body = {
						status: true,
						status_code: 200,
						data: data_response,
						message: 'Success!',
					};
				}
			}

			// get the access token from server response
		} catch (error) {
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},
	//get All Livestock
	getLoan: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, page_size, filter_value } = getQuery(ctx, { mergeParams: true });
			const total = await loanService.getLoanCount();
			// console.log(total)
			if (filter_value == null || filter_value == '') {
				if (page_number == null) {
					page_number = '1';
					page_size = '20';
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await loanService.getLoan({
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
					const data = await loanService.getLoan({
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
				const data = await loanService.getLoanFilter({ filter_value: filter_value });

				if (data.length > 0) {
					// let loan_applicable = parseFloat(data[0].value.replaceAll(',', '')) * (60 / 100);

					// let applicant_fee = parseFloat(data[0].value.replaceAll(',', '')) * (60 / 100) * (6 / 100);

					ctx.response.body = {
						status: true,
						status_code: 200,
						data: data,
					};
				} else {
					ctx.response.body = {
						status: true,
						status_code: 200,
						// loan_applicable: loan_applicable,
						// applicant_fee: applicant_fee,
						data: data,
					};
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


	//get All Livestock
	getLoanAuction: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, page_size, filter_value } = getQuery(ctx, { mergeParams: true });
			const total = await loanService.getLoanAuctionSize();
			// console.log(total)
			if (filter_value == null || filter_value == '') {
				if (page_number == null) {
					page_number = '1';
					page_size = '20';
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await loanService.getLoanAuction({
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
					const data = await loanService.getLoanAuction({
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
				const data = await loanService.getLoanAuctionFilter({
					filter_value: filter_value
				});

				console.log(data);

				ctx.response.body = {
					status: true,
					status_code: 200,
					total: total,
					data: data,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},



	//get loan statement
	getLoanStatement: async (ctx: any) => {
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

			if (period == '0') {
				credit_total = await loanService.getLoanStatementSumCredit({  // credit total
					filter_value: Number(filter_value)
				});
				data = await loanService.getLoanStatementSummary({
					filter_value: Number(filter_value)
				});
			} else {
				credit_total = 0;
				data = await loanService.getLoanStatement({
					filter_value: Number(filter_value),
					period: Number(period)
				});
			}

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




	/**
	* @description Create Livestock
	*/
	insertIntoWithdrawal: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();

		// console.log('data', body);

		console.log('body', await body.value);

		console.log('body', JSON.stringify(await body.value));

		console.log('reached');

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
			await loanService.insertIntoWithdrawal({
				transaction_id: values.transaction_id,
				working_balance: values.working_balance,
				description: values.description,
				name: values.name,
				status: values.status,
				reference: values.reference,
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
* @description Create Auction
*/
	insertIntoAuctioning: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();

		console.log('data', body);

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
			await loanService.insertIntoAuction({
				amount: values.amount,
				description: values.description,
				loan_reference: values.loan_reference,
				created_by: values.created_by
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

	//get loan statement
	getLoanInstallmentReport: async (ctx: any) => {
		try {

			let { page_number, page_size, startDate, period, endDate, filter_value } = getQuery(ctx, { mergeParams: true });

			if (Number(period) === 1) {
				// console.log(total)

				if (filter_value == null || filter_value == '') {
					const total = await loanService.getLoanInstallmentNumber({
						startDate: startDate,
						endDate: endDate
					});

					if (page_number == null) {
						page_number = '1';
						page_size = '100';
						const offset = (Number(page_number) - 1) * Number(page_size);
						let data;
						data = await loanService.getLoanInstallment(
							{
								offset: Number(offset),
								startDate: startDate,
								endDate: endDate,
								page_size: Number(page_size)
							}
						);
						// console.log(data);
						ctx.response.body = {
							status: true,
							status_code: 200,
							expected_principal: total.expected_principal,
							paid_principal: parseFloat(total.expected_principal) - (parseFloat(total.paid_principal)),
							expected_interest: total.expected_interest,
							paid_interest: parseFloat(total.expected_interest) - (parseFloat(total.paid_interest)),
							expected_insurance: total.expected_insurance,
							paid_insurance: (parseFloat(total.expected_insurance) - parseFloat(total.paid_insurance)),
							expected_paid_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) +
								parseFloat(total.expected_insurance),
							paid_paid_amount: (parseFloat(total.expected_principal) - (parseFloat(total.paid_principal))) + (parseFloat(total.expected_interest) - (parseFloat(total.paid_interest))) + (parseFloat(total.expected_insurance) - (parseFloat(total.paid_insurance))),

							total: total.count,
							data: data,
						};
					}
					else {
						const offset = (Number(page_number) - 1) * Number(page_size);
						const data = await loanService.getLoanInstallment({
							offset: Number(offset),
							startDate: startDate,
							endDate: endDate,
							page_size: Number(page_size)
						});
						ctx.response.body = {
							status: true,
							status_code: 200,
							expected_principal: total.expected_principal,
							paid_principal: parseFloat(total.expected_principal) - (parseFloat(total.paid_principal)),
							expected_interest: total.expected_interest,
							paid_interest: parseFloat(total.expected_interest) - (parseFloat(total.paid_interest)),
							expected_insurance: total.expected_insurance,
							paid_insurance: (parseFloat(total.expected_insurance) - parseFloat(total.paid_insurance)),
							expected_paid_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) +
								parseFloat(total.expected_insurance),
							paid_paid_amount: (parseFloat(total.expected_principal) - (parseFloat(total.paid_principal))) + (parseFloat(total.expected_interest) - (parseFloat(total.paid_interest))) + (parseFloat(total.expected_insurance) - (parseFloat(total.paid_insurance))),

							total: total.count,
							data: data,
						};
					}
				} else {
					const total = await loanService.getLoanInstallmentNumberFilter({
						startDate: startDate,
						filter_value: filter_value,
						endDate: endDate
					});

					console.log({
						startDate: startDate,
						filter_value: filter_value,
						endDate: endDate
					})

					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await loanService.getLoanInstallmentFilter({
						offset: Number(offset),
						startDate: startDate,
						endDate: endDate,
						filter_value: filter_value,
						page_size: Number(page_size)
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						expected_principal: total.expected_principal,
						paid_principal: parseFloat(total.expected_principal) - (parseFloat(total.paid_principal)),
						expected_interest: total.expected_interest,
						paid_interest: parseFloat(total.expected_interest) - (parseFloat(total.paid_interest)),
						expected_insurance: total.expected_insurance,
						paid_insurance: (parseFloat(total.expected_insurance) - parseFloat(total.paid_insurance)),
						expected_paid_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) +
							parseFloat(total.expected_insurance),
						paid_paid_amount: (parseFloat(total.expected_principal) - (parseFloat(total.paid_principal))) + (parseFloat(total.expected_interest) - (parseFloat(total.paid_interest))) + (parseFloat(total.expected_insurance) - (parseFloat(total.paid_insurance))),

						total: total.count,
						data: data,
					};
				}
			}
			else if (Number(period) === 2) {

				if (filter_value == null || filter_value == '') {
					const total = await loanService.getLoanTwoInstallmentNumber({
						startDate: startDate,
						endDate: endDate
					});


					if (page_number == null) {

						console.log("here");
						page_number = '1';
						page_size = '100';
						const offset = (Number(page_number) - 1) * Number(page_size);
						let data;
						data = await loanService.getLoanTwoInstallment(
							{
								offset: Number(offset),
								startDate: startDate,
								endDate: endDate,
								page_size: Number(page_size)
							}
						);

						console.log({
							offset: Number(offset),
							startDate: startDate,
							endDate: endDate,
							page_size: Number(page_size)
						})
						// console.log(data);
						ctx.response.body = {
							status: true,
							status_code: 200,
							expected_principal: total.expected_principal,
							paid_principal: parseFloat(total.expected_principal) - (parseFloat(total.paid_principal)),
							expected_interest: total.expected_interest,
							paid_interest: parseFloat(total.expected_interest) - (parseFloat(total.paid_interest)),
							expected_insurance: total.expected_insurance,
							paid_insurance: (parseFloat(total.expected_insurance) - parseFloat(total.paid_insurance)),
							expected_paid_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) +
								parseFloat(total.expected_insurance),
							paid_paid_amount: (parseFloat(total.expected_principal) - (parseFloat(total.paid_principal))) + (parseFloat(total.expected_interest) - (parseFloat(total.paid_interest))) + (parseFloat(total.expected_insurance) - (parseFloat(total.paid_insurance))),

							total: total.count,
							data: data,
						};
					}
					else {
						const offset = (Number(page_number) - 1) * Number(page_size);
						const data = await loanService.getLoanTwoInstallment({
							offset: Number(offset),
							startDate: startDate,
							endDate: endDate,
							page_size: Number(page_size)
						});
						ctx.response.body = {
							status: true,
							status_code: 200,
							expected_principal: total.expected_principal,
							paid_principal: parseFloat(total.expected_principal) - (parseFloat(total.paid_principal)),
							expected_interest: total.expected_interest,
							paid_interest: parseFloat(total.expected_interest) - (parseFloat(total.paid_interest)),
							expected_insurance: total.expected_insurance,
							paid_insurance: (parseFloat(total.expected_insurance) - parseFloat(total.paid_insurance)),
							expected_paid_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) +
								parseFloat(total.expected_insurance),
							paid_paid_amount: (parseFloat(total.expected_principal) - (parseFloat(total.paid_principal))) + (parseFloat(total.expected_interest) - (parseFloat(total.paid_interest))) + (parseFloat(total.expected_insurance) - (parseFloat(total.paid_insurance))),

							total: total.count,
							data: data,
						};
					}
				} else {

					const total = await loanService.getLoanTwoInstallmentNumberFilter({
						startDate: startDate,
						filter_value: filter_value,
						endDate: endDate
					});


					const data = await loanService.getLoanTwoInstallmentFilter({
						startDate: startDate,
						filter_value: filter_value,
						endDate: endDate,
					});

					console.log(data);
					ctx.response.body = {
						status: true,
						status_code: 200,
						expected_principal: total.expected_principal,
						paid_principal: parseFloat(total.expected_principal) - (parseFloat(total.paid_principal)),
						expected_interest: total.expected_interest,
						paid_interest: parseFloat(total.expected_interest) - (parseFloat(total.paid_interest)),
						expected_insurance: total.expected_insurance,
						paid_insurance: (parseFloat(total.expected_insurance) - parseFloat(total.paid_insurance)),
						expected_paid_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) +
							parseFloat(total.expected_insurance),
						paid_paid_amount: (parseFloat(total.expected_principal) - (parseFloat(total.paid_principal))) + (parseFloat(total.expected_interest) - (parseFloat(total.paid_interest))) + (parseFloat(total.expected_insurance) - (parseFloat(total.paid_insurance))),

						total: total.count,
						data: data,
					};
				}
			}
			else if (Number(period) === 3) {


				if (filter_value == null || filter_value == '') {
					const total = await loanService.getLoanThirdInstallmentNumber({
						startDate: startDate,
						endDate: endDate
					});

					if (page_number == null) {

						console.log("here");
						page_number = '1';
						page_size = '100';
						const offset = (Number(page_number) - 1) * Number(page_size);
						let data;
						data = await loanService.getLoanThirdInstallment(
							{
								offset: Number(offset),
								startDate: startDate,
								endDate: endDate,
								page_size: Number(page_size)
							}
						);

						console.log({
							offset: Number(offset),
							startDate: startDate,
							endDate: endDate,
							page_size: Number(page_size)
						})
						// console.log(data);
						ctx.response.body = {
							status: true,
							status_code: 200,
							expected_principal: total.expected_principal,
							paid_principal: parseFloat(total.expected_principal) - (parseFloat(total.paid_principal)),
							expected_interest: total.expected_interest,
							paid_interest: parseFloat(total.expected_interest) - (parseFloat(total.paid_interest)),
							expected_insurance: total.expected_insurance,
							paid_insurance: (parseFloat(total.expected_insurance) - parseFloat(total.paid_insurance)),
							expected_paid_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) +
								parseFloat(total.expected_insurance),
							paid_paid_amount: (parseFloat(total.expected_principal) - (parseFloat(total.paid_principal))) + (parseFloat(total.expected_interest) - (parseFloat(total.paid_interest))) + (parseFloat(total.expected_insurance) - (parseFloat(total.paid_insurance))),

							total: total.count,
							data: data,
						};
					}
					else {
						const offset = (Number(page_number) - 1) * Number(page_size);
						const data = await loanService.getLoanThirdInstallment({
							offset: Number(offset),
							startDate: startDate,
							endDate: endDate,
							page_size: Number(page_size)
						});
						ctx.response.body = {
							status: true,
							status_code: 200,
							expected_principal: total.expected_principal,
							paid_principal: parseFloat(total.expected_principal) - (parseFloat(total.paid_principal)),
							expected_interest: total.expected_interest,
							paid_interest: parseFloat(total.expected_interest) - (parseFloat(total.paid_interest)),
							expected_insurance: total.expected_insurance,
							paid_insurance: (parseFloat(total.expected_insurance) - parseFloat(total.paid_insurance)),
							expected_paid_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) +
								parseFloat(total.expected_insurance),
							paid_paid_amount: (parseFloat(total.expected_principal) - (parseFloat(total.paid_principal))) + (parseFloat(total.expected_interest) - (parseFloat(total.paid_interest))) + (parseFloat(total.expected_insurance) - (parseFloat(total.paid_insurance))),

							total: total.count,
							data: data,
						};
					}
				} else {


					const total = await loanService.getLoanThirdInstallmentNumber({
						startDate: startDate,
						filter_value: filter_value,
						endDate: endDate
					});

					const data = await loanService.getLoanThirdInstallmentFilter({
						startDate: startDate,
						filter_value: filter_value,
						endDate: endDate,
					});

					console.log(data);
					ctx.response.body = {
						status: true,
						status_code: 200,
						expected_principal: total.expected_principal,
						paid_principal: parseFloat(total.expected_principal) - (parseFloat(total.paid_principal)),
						expected_interest: total.expected_interest,
						paid_interest: parseFloat(total.expected_interest) - (parseFloat(total.paid_interest)),
						expected_insurance: total.expected_insurance,
						paid_insurance: (parseFloat(total.expected_insurance) - parseFloat(total.paid_insurance)),
						expected_paid_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) +
							parseFloat(total.expected_insurance),
						paid_paid_amount: (parseFloat(total.expected_principal) - (parseFloat(total.paid_principal))) + (parseFloat(total.expected_interest) - (parseFloat(total.paid_interest))) + (parseFloat(total.expected_insurance) - (parseFloat(total.paid_insurance))),

						total: total.count,
						data: data,
					};
				}
			}

			else if (Number(period) === 4) {


				if (filter_value == null || filter_value == '') {
					const total = await loanService.getLoanRollOverNumber({
						startDate: startDate,
						endDate: endDate
					});

					if (page_number == null) {

						console.log("here");
						page_number = '1';
						page_size = '100';
						const offset = (Number(page_number) - 1) * Number(page_size);
						let data;
						data = await loanService.getRollOverReport(
							{
								offset: Number(offset),
								startDate: startDate,
								endDate: endDate,
								page_size: Number(page_size)
							}
						);

						console.log({
							offset: Number(offset),
							startDate: startDate,
							endDate: endDate,
							page_size: Number(page_size)
						})
						// console.log(data);
						ctx.response.body = {
							status: true,
							status_code: 200,
							expected_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_rollver),
							paid_amount: (parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_rollver)) - (parseFloat(total.paid_principal) + parseFloat(total.paid_interest) + parseFloat(total.paid_insurance) + parseFloat(total.paid_rollver)),
							expected_rollover: total.total_rollver,
							paid_rollover: total.total_rollver - total.paid_rollver,
							total: total.count,
							data: data,
						};
					}
					else {
						const offset = (Number(page_number) - 1) * Number(page_size);
						const data = await loanService.getRollOverReport({
							offset: Number(offset),
							startDate: startDate,
							endDate: endDate,
							page_size: Number(page_size)
						});
						ctx.response.body = {
							status: true,
							status_code: 200,
							expected_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_rollver),
							paid_amount: (parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_rollver)) - (parseFloat(total.paid_principal) + parseFloat(total.paid_interest) + parseFloat(total.paid_insurance) + parseFloat(total.paid_rollver)),
							expected_rollover: total.total_rollver,
							paid_rollover: total.total_rollver - total.paid_rollver,
							total: total.count,
							data: data,
						};
					}
				} else {

					const total = await loanService.getLoanRollOverNumberFilter({
						startDate: startDate,
						filter_value: filter_value,
						endDate: endDate
					});

					const data = await loanService.getRollOverReportFilter({
						startDate: startDate,
						filter_value: filter_value,
						endDate: endDate,
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						expected_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_rollver),
						paid_amount: (parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_rollver)) - (parseFloat(total.paid_principal) + parseFloat(total.paid_interest) + parseFloat(total.paid_insurance) + parseFloat(total.paid_rollver)),
						expected_rollover: total.total_rollver,
						paid_rollover: total.total_rollver - total.paid_rollver,
						total: total.count,
						data: data,
					};
				}
			}

			else if (Number(period) === 5) {

				if (filter_value == null || filter_value == '') {
					const total = await loanService.getDebtCollectionNumber({
						startDate: startDate,
						endDate: endDate
					});

					if (page_number == null) {

						console.log("here");
						page_number = '1';
						page_size = '100';
						const offset = (Number(page_number) - 1) * Number(page_size);
						let data;
						data = await loanService.getDebtCollectionReport(
							{
								offset: Number(offset),
								startDate: startDate,
								endDate: endDate,
								page_size: Number(page_size)
							}
						);

						console.log({
							offset: Number(offset),
							startDate: startDate,
							endDate: endDate,
							page_size: Number(page_size)
						})
						// console.log(data);
						ctx.response.body = {
							status: true,
							status_code: 200,
							total: total.count,
							expected_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_debt_collection) + parseFloat(total.total_rollver),
							paid_amount: (parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_debt_collection) + parseFloat(total.total_rollver)) - (parseFloat(total.paid_principal) + parseFloat(total.paid_interest) + parseFloat(total.paid_debt_collection) + parseFloat(total.paid_insurance) + parseFloat(total.paid_rollver)),
							expected_debt_collection: total.total_debt_collection,
							paid_rollover: total.total_debt_collection - total.paid_debt_collection,

							data: data,
						};
					}
					else {
						const offset = (Number(page_number) - 1) * Number(page_size);
						const data = await loanService.getDebtCollectionReport({
							offset: Number(offset),
							startDate: startDate,
							endDate: endDate,
							page_size: Number(page_size)
						});
						ctx.response.body = {
							status: true,
							status_code: 200,
							total: total.count,
							expected_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_debt_collection) + parseFloat(total.total_rollver),
							paid_amount: (parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_debt_collection) + parseFloat(total.total_rollver)) - (parseFloat(total.paid_principal) + parseFloat(total.paid_interest) + parseFloat(total.paid_debt_collection) + parseFloat(total.paid_insurance) + parseFloat(total.paid_rollver)),
							expected_debt_collection: total.total_debt_collection,
							paid_rollover: total.total_debt_collection - total.paid_debt_collection,

							data: data,
						};
					}
				} else {

					const total = await loanService.getDebtCollectionNumberFilter({
						startDate: startDate,
						filter_value: filter_value,
						endDate: endDate
					});

					const data = await loanService.getDebtCollectionReportFilter({
						startDate: startDate,
						filter_value: filter_value,
						endDate: endDate,
					});

					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total.count,
						expected_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_debt_collection) + parseFloat(total.total_rollver),
						paid_amount: (parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_debt_collection) + parseFloat(total.total_rollver)) - (parseFloat(total.paid_principal) + parseFloat(total.paid_interest) + parseFloat(total.paid_debt_collection) + parseFloat(total.paid_insurance) + parseFloat(total.paid_rollver)),
						expected_debt_collection: total.total_debt_collection,
						paid_rollover: total.total_debt_collection - total.paid_debt_collection,

						data: data,
					};
				}
			}

			else if (Number(period) === 0) {

				console.log("here");

				console.log({
					startDate: startDate,
					endDate: endDate
				})


				console.log("hello");

				if (filter_value == null || filter_value == '') {
					const total = await loanService.getDebtGlobalNumber({
						startDate: startDate,
						endDate: endDate
					});

					if (page_number == null) {

						console.log("here");
						page_number = '1';
						page_size = '100';
						const offset = (Number(page_number) - 1) * Number(page_size);
						let data;
						data = await loanService.getGlobalReport(
							{
								offset: Number(offset),
								startDate: startDate,
								endDate: endDate,
								page_size: Number(page_size)
							}
						);

						console.log({
							offset: Number(offset),
							startDate: startDate,
							endDate: endDate,
							page_size: Number(page_size)
						})
						// console.log(data);
						ctx.response.body = {
							status: true,
							status_code: 200,
							total: total.count,
							expected_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_debt_collection) + parseFloat(total.total_rollver),
							paid_amount: (parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_debt_collection) + parseFloat(total.total_rollver)) - (parseFloat(total.paid_principal) + parseFloat(total.paid_interest) + parseFloat(total.paid_debt_collection) + parseFloat(total.paid_insurance) + parseFloat(total.paid_rollver)),

							data: data,
						};
					}
					else {
						const offset = (Number(page_number) - 1) * Number(page_size);
						const data = await loanService.getGlobalReport({
							offset: Number(offset),
							startDate: startDate,
							endDate: endDate,
							page_size: Number(page_size)
						});
						ctx.response.body = {
							status: true,
							status_code: 200,
							total: total.count,
							expected_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_debt_collection) + parseFloat(total.total_rollver),
							paid_amount: (parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_debt_collection) + parseFloat(total.total_rollver)) - (parseFloat(total.paid_principal) + parseFloat(total.paid_interest) + parseFloat(total.paid_debt_collection) + parseFloat(total.paid_insurance) + parseFloat(total.paid_rollver)),

							data: data,
						};
					}
				} else {


					const total = await loanService.getDebtGlobalNumberFilter({
						startDate: startDate,
						filter_value: filter_value,
						endDate: endDate
					});

					console.log(total);


					console.log("here", {
						startDate: startDate,
						filter_value: filter_value,
						endDate: endDate,
					});

					const data = await loanService.getGlobalReportFilter({
						startDate: startDate,
						filter_value: filter_value,
						endDate: endDate,
					});

					console.log(data);
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total.count,
						expected_amount: parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_debt_collection) + parseFloat(total.total_rollver),
						paid_amount: (parseFloat(total.expected_principal) + parseFloat(total.expected_interest) + parseFloat(total.expected_insurance) + parseFloat(total.total_debt_collection) + parseFloat(total.total_rollver)) - (parseFloat(total.paid_principal) + parseFloat(total.paid_interest) + parseFloat(total.paid_debt_collection) + parseFloat(total.paid_insurance) + parseFloat(total.paid_rollver)),

						data: data,
					};
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




	//get loan statement REPORTS
	getLoanStages: async (ctx: any) => {
		try {

			let { page_number, page_size, role_id, user_id, lock_period, startDate, period, endDate, filter_value } = getQuery(ctx, { mergeParams: true });

			// console.log(total)
			const total = await loanService.getUnmaturedLoanTotal({
				startDate: startDate,
				lock_period: Number(lock_period),

				period: Number(period),
				endDate: endDate,

			});



			if (filter_value == null || filter_value == '') {
				if (Number(role_id) === 1 || Number(role_id) === 2) {
					if (page_number == null) {
						page_number = '1';
						page_size = '100';
						const offset = (Number(page_number) - 1) * Number(page_size);
						let data;
						data = await loanService.getUnmaturedLoan(
							{
								offset: Number(offset),
								startDate: startDate,
								lock_period: Number(lock_period),
								period: Number(period),
								endDate: endDate,
								page_size: Number(page_size)
							}
						);
						// console.log(data);
						ctx.response.body = {
							status: true,
							total: total.count,
							status_code: 200,
							data: data,
						};
					}
					else {
						const offset = (Number(page_number) - 1) * Number(page_size);
						let data = await loanService.getUnmaturedLoan(
							{
								offset: Number(offset),
								startDate: startDate,
								lock_period: Number(lock_period),
								period: Number(period),
								endDate: endDate,
								page_size: Number(page_size)
							}
						);
						ctx.response.body = {
							status: true,
							total: total.count,
							status_code: 200,
							data: data,
						};
					}
				} else {
					if (page_number == null) {
						page_number = '1';
						page_size = '100';
						const offset = (Number(page_number) - 1) * Number(page_size);
						let data;
						data = await loanService.getUnmaturedLoanBranch(
							{
								offset: Number(offset),
								startDate: startDate,
								lock_period: Number(lock_period),
								user_id: Number(user_id),
								period: Number(period),
								endDate: endDate,
								page_size: Number(page_size)
							}
						);
						// console.log(data);
						ctx.response.body = {
							status: true,
							total: total.count,
							status_code: 200,
							data: data,
						};
					}
					else {
						const offset = (Number(page_number) - 1) * Number(page_size);
						let data = await loanService.getUnmaturedLoanBranch(
							{
								offset: Number(offset),
								startDate: startDate,
								lock_period: Number(lock_period),
								period: Number(period),
								user_id: Number(user_id),
								endDate: endDate,
								page_size: Number(page_size)
							}
						);
						ctx.response.body = {
							status: true,
							total: total.count,
							status_code: 200,
							data: data,
						};
					}
				}
			} else {
				const offset = (Number(page_number) - 1) * Number(page_size);
				let data = await loanService.getUnmaturedLoanFilter(
					{
						offset: Number(offset),
						startDate: startDate,
						lock_period: Number(lock_period),
						period: Number(period),
						filter_value: filter_value,
						endDate: endDate,
						page_size: Number(page_size)
					}
				);
				ctx.response.body = {
					status: true,
					total: total.count,
					status_code: 200,
					data: data,
				};


			}

		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},

	// statement logs
	getStatementLogs: async (ctx: any) => {
		try {
			let { loan_id } = getQuery(ctx, { mergeParams: true });
			// console.log(total)
			let data;
			data = await loanService.getLoanStatementLogs({
				loan_id: loan_id,
			});
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




	//deposit reports
	getDeposits: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, loan_id, page_size, filter_value } = getQuery(ctx, { mergeParams: true });
			const total = await loanService.getDepositsCounts({
				loan_id: loan_id
			});
			console.log(total)
			if (filter_value == null || filter_value == '') {
				if (page_number == null) {
					page_number = '1';
					page_size = '20';
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await loanService.getLoanDeposits({
						offset: Number(offset),
						loan_id: loan_id,
						page_size: Number(page_size),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total.count,
						data: data,
					};
				} else {
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await loanService.getLoanDeposits({
						offset: Number(offset),
						loan_id,
						page_size: Number(page_size),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total.count,
						data: data,
					};
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


	//deposit reports
	getWithdrawals: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, loan_id, page_size, filter_value } = getQuery(ctx, { mergeParams: true });
			const total = await loanService.getWithdrawalDepositsCounts({
				loan_id: loan_id
			});
			// console.log(total)
			if (filter_value == null || filter_value == '') {
				if (page_number == null) {
					page_number = '1';
					page_size = '20';
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await loanService.getLoanWithdrawalDeposits({
						offset: Number(offset),
						loan_id: loan_id,
						page_size: Number(page_size),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total.count,
						data: data,
					};
				} else {
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await loanService.getLoanWithdrawalDeposits({
						offset: Number(offset),
						loan_id,
						page_size: Number(page_size),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total.count,
						data: data,
					};
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
	// 	/**
	//   * @description Get Delete livestock
	//   */
	// 	deleteLivestock: async (ctx: any) => {
	// 		try {
	// 			let { id } = getQuery(ctx, {
	// 				mergeParams: true,
	// 			});
	// 			const data = await livestockService.deleteLivestock({
	// 				id: Number(id),
	// 			});
	// 			ctx.response.body = {
	// 				status: true,
	// 				status_code: 200,
	// 				message: 'Success',
	// 				data: data,
	// 			};
	// 		} catch (error) {
	// 			ctx.response.status = 400;
	// 			ctx.response.body = {
	// 				success: false,
	// 				message: `${error}`,
	// 			};
	// 		}
	// 	},

	// 	/**
	//    * @description Create Livestock
	//    */
	// 	editLivestock: async ({ request, response }: { request: any, response: any }) => {
	// 		const body = await request.body();
	// 		if (!request.hasBody) {
	// 			response.status = 400;
	// 			response.body = {
	// 				success: false,
	// 				message: 'No data provided',
	// 			};
	// 			return;
	// 		}
	// 		try {
	// 			const values = await body.value;
	// 			await livestockService.editLivestock({
	// 				farmer_id: values.farmer_id,
	// 				breed: values.breed,
	// 				vacinations: values.vacinations,
	// 				health_ratings: values.health_ratings,
	// 				valuations: values.valuations,
	// 				gender: values.gender,
	// 				age: values.age,
	// 				location: values.location,
	// 			});
	// 			response.body = {
	// 				success: true,
	// 				message: 'Success!',
	// 			};
	// 		} catch (error) {
	// 			response.status = 400;
	// 			response.body = {
	// 				success: false,
	// 				message: `${error}`,
	// 			};
	// 		}
	// 	},
};
