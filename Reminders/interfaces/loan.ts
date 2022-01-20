export default interface Loan {
	id?: number,
	page_number?: number,
	offset?: number,
	page_size?: number,
	filter_value?: any,
	farmer_id?: string,
	total_amount?: string,
	applicant_fee?: string,
	check_amount?: number,
	period_two?: number,
	reminder?: number,
	default_reminder?: number,
	period_three?: number,
	total_interest?: number,

	insurance_fee?: string,
	narrative?: string,

	interest_second?: number,
	interest_third?: number,
	insurance_instalment_third?: number,
	insurance_instalment_second?: number,
	monthly_instalment_second?: number,
	monthly_instalment_third?: number,

	debt_collection?: number,
	rollover_fee?: number,


	livestock_id?: string,
	insurance_balance?: number,
	monthly_instalment?: number,
	insurance_installment?: number,
	reported_by?: string,
	loan_reference?: string,
	narative?: string,
	created_by?: string,
	msisdn?: string,
	period?: number,
	amount?: number,
	self_declaration?: string,
	crb_report?: string,
	user_id_no?: string,
	gurantee_name?: string,
	gurantee_id_no?: string,

	witness_name?: string,
	witness_id_no?: string,



	credit?: number,
	interest?: number,
	debit?: number,
	balance?: number,
	loan_id?: string,
	applicantion_form?: string,


	witness_id_back_page?: string,
	witness_id_front_page?: string,
	witness_id_photo?: string,

	witness_id_back_page_2?: string,
	witness_id_front_page_2?: string,
	witness_id_photo_2?: string,

	witness_id_back_page_3?: string,
	witness_id_front_page_3?: string,
	witness_id_photo_3?: string,



	id_no?: number,
	guarantor_id_front_page?: string,
	guarantor_id_back_page?: string,
	guarantor_id_photo?: string,


	name_2?: string,
	id_no_2?: number,
	passport_photo_2?: string,
	guarantor_id_front_2?: string,
	guarantor_id_back_2?: string,
	name_3?: string,
	id_no_3?: number,
	passport_photo_3?: string,
	guarantor_id_front_3?: string,
	guarantor_id_back_3?: string,




	applicant_id_back_page?: string,
	description?: string,
	working_balance?: string,
	transaction_id?: string,
	account?: string,
	name?: string,
	status?: string,
	reference?: string,
	applicant_id_front_page?: string,
	applicant_photo?: string,
	oustanding_loan?: number,
	loan_counts?: number,
	defaulted_loans?: number,
	loan_repament?: number,
	gross_income?: number,
	statements?: string,
	next_to_cow?: string,
	business_permit?: string,
	kra_certificate?: string

}