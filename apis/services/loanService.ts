import client from "../db/client.ts";
import client_mobi from "../db/client_mobi.ts";
import { TABLE } from "../db/config.ts";
import Loan from "../interfaces/loan.ts";

export default {
  // find laon by id
  doesExistById: async ({ id }: Loan) => {
    const [result] = await client.query(
      `SELECT COUNT(*) count FROM ${TABLE.LOAN} WHERE id = ? LIMIT 1`,
      [id],
    );
    return result.count > 0;
  },

  // create loan
  addLoan: async ({
    farmer_id,
    total_amount,
    applicant_fee,
    livestock_id,
    insurance_fee,
    gross_income,
    loan_repament,
    defaulted_loans,
    loan_counts,
    oustanding_loan,
    reference,
    applicantion_form,
    statements,
    business_permit,
    kra_certificate,
    loan_purpose,
    created_by
  }: Loan) => {
    const query = await client.query(
      `INSERT INTO ${TABLE.LOAN} SET 
			farmer_id =?, 
      amount_disbursed =?, 
      total_amount =?, 
      applicant_fee =?, 
      livestock_id =?,
      insurance_fee =?, 
      gross_income =?, 
      loan_repament =?, 
      defaulted_loans =?, 
      loan_counts =?, 
      oustanding_loan=?, 
      reference =?, 
      applicantion_form =?, 
      statements =?, 
      business_permit =?, 
      kra_certificate =?, 
      loan_purpose=?,
      created_by =?`,
      [
        farmer_id,
        total_amount,
        total_amount,
        applicant_fee,
        livestock_id,
        insurance_fee,
        gross_income,
        loan_repament,
        defaulted_loans,
        loan_counts,
        oustanding_loan,
        reference,
        applicantion_form,
        statements,
        business_permit,
        kra_certificate,
        loan_purpose,
        created_by
      ],
    );
    return query;
  },



  //update loan
  updateLoanEntry: async ({
    farmer_id,
    total_amount,
    applicant_fee,
    livestock_id,
    insurance_fee,
    gross_income,
    loan_repament,
    defaulted_loans,
    loan_counts,
    oustanding_loan,
    reference,
    applicantion_form,
    statements,
    business_permit,
    kra_certificate,
    loan_purpose,
    created_by
  }: Loan) => {
    const query = await client.query(
      `UPDATE ${TABLE.LOAN} SET 
			farmer_id =?, 
      amount_disbursed =?, 
      total_amount =?, 
      applicant_fee =?, 
      livestock_id =?,
      insurance_fee =?, 
      gross_income =?, 
      loan_repament =?, 
      defaulted_loans =?, 
      loan_counts =?, 
      oustanding_loan=?, 
      applicantion_form =?, 
      statements =?, 
      business_permit =?, 
      kra_certificate =?, 
      loan_purpose=?,
      created_by =? WHERE reference =?`,
      [
        farmer_id,
        total_amount,
        total_amount,
        applicant_fee,
        livestock_id,
        insurance_fee,
        gross_income,
        loan_repament,
        defaulted_loans,
        loan_counts,
        oustanding_loan,
        applicantion_form,
        statements,
        business_permit,
        kra_certificate,
        loan_purpose,
        created_by,
        reference
      ],
    );
    return query;
  },

  // add guarantors
  updateGuarantor: async ({

    loan_reference,
    name,
    id_no,
    guarantor_id_photo,
    guarantor_id_front_page,
    guarantor_id_back_page,
    guarantor_msisdn,
    name_2,
    id_no_2,
    passport_photo_2,
    guarantor_id_front_2,
    guarantor_id_back_2,
    guarantor_msisdn_2,
    name_3,
    id_no_3,
    passport_photo_3,
    guarantor_id_front_3,
    guarantor_id_back_3,
    guarantor_msisdn_3

  }: Loan) => {
    const query = await client.query(
      `UPDATE ${TABLE.GUARANTORS} SET 
    name =?, 
    id_no =?,
    passport_photo =?,
    guarantor_id_front =?,
    guarantor_msisdn =?,
    guarantor_msisdn_2 =?,
    guarantor_msisdn_3 =?,
    2nd_name =?,
    2nd_id_no =?,
    2nd_passport_photo =?,
    2nd_guarantor_id_front =?,
    3rd_name =?,
    3rd_id_no =?,
    3rd_passport_photo =?,
    3rd_guarantor_id_front =? WHERE loan_reference =?
    `,
      [
        name,
        id_no,
        guarantor_id_photo,
        guarantor_id_front_page,
        guarantor_msisdn,
        guarantor_msisdn_2,
        guarantor_msisdn_3,
        name_2,
        id_no_2,
        passport_photo_2,
        guarantor_id_front_2,
        name_3,
        id_no_3,
        passport_photo_3,
        guarantor_id_front_3,
        loan_reference
      ],
    );
    return query;
  },


   // update witnesses
   UpdateWitneses: async ({
    loan_reference,
    name,
    id_no,
    witness_id_photo,
    witness_id_front_page,
    witness_id_back_page,
    name_2,
    id_no_2,
    witness_id_photo_2,
    witness_id_front_page_2,
    witness_id_back_page_2,
    name_3,
    id_no_3,
    witness_id_photo_3,
    witness_id_front_page_3,
    witness_id_back_page_3,
    witness_2_location,
    witness_2_sub_location,
    witness_village,
    witness_designation,
    witness_group_name,
    mobipesa_name,
    mobipesa_designation
  }: Loan) => {
    const query = await client.query(
      `UPDATE ${TABLE.WITNESSES} SET 
      name =?, 
      id_no =?, 
      passport_photo =?,
       witness_id_front =?, 
       witness_id_back =?, 
       2nd_name =?, 
       2nd_id_no =?, 
       2nd_passport_photo =?, 
       2nd_witness_id_front =?, 
       2nd_witness_id_back =?, 
       3rd_name =?, 
       3rd_id_no =?, 
       3rd_passport_photo =?, 
       3rd_witness_id_front =?, 
       3rd_witness_id_back =?,
       witness_2_location =? ,
    witness_2_sub_location =?,
    witness_village =?,
    witness_designation =?,
    witness_group_name =?,
    mobipesa_name =?,
    mobipesa_designation =? WHERE loan_reference =?`,
      [
        name,
        id_no,
        witness_id_photo,
        witness_id_front_page,
        witness_id_back_page,
        name_2,
        id_no_2,
        witness_id_photo_2,
        witness_id_front_page_2,
        witness_id_back_page_2,
        name_3,
        id_no_3,
        witness_id_photo_3,
        witness_id_front_page_3,
        witness_id_back_page_3,
        witness_2_location,
        witness_2_sub_location,
        witness_village,
        witness_designation,
        witness_group_name,
        mobipesa_name,
        mobipesa_designation,
        loan_reference
      ],
    );
    return query;
  },

  // add guarantors
  addGuarantor: async ({

    loan_reference,
    name,
    id_no,
    guarantor_id_photo,
    guarantor_id_front_page,
    guarantor_id_back_page,
    guarantor_msisdn,
    name_2,
    id_no_2,
    passport_photo_2,
    guarantor_id_front_2,
    guarantor_id_back_2,
    guarantor_msisdn_2,
    name_3,
    id_no_3,
    passport_photo_3,
    guarantor_id_front_3,
    guarantor_id_back_3,
    guarantor_msisdn_3

  }: Loan) => {
    const query = await client.query(
      `INSERT INTO ${TABLE.GUARANTORS} SET 
    loan_reference =?,
    name =?, 
    id_no =?,
    passport_photo =?,
    guarantor_id_front =?,
    guarantor_msisdn =?,
    guarantor_msisdn_2 =?,
    guarantor_msisdn_3 =?,
    2nd_name =?,
    2nd_id_no =?,
    2nd_passport_photo =?,
    2nd_guarantor_id_front =?,
    3rd_name =?,
    3rd_id_no =?,
    3rd_passport_photo =?,
    3rd_guarantor_id_front =?
    `,
      [
        loan_reference,
        name,
        id_no,
        guarantor_id_photo,
        guarantor_id_front_page,
        guarantor_msisdn,
        guarantor_msisdn_2,
        guarantor_msisdn_3,
        name_2,
        id_no_2,
        passport_photo_2,
        guarantor_id_front_2,
        name_3,
        id_no_3,
        passport_photo_3,
        guarantor_id_front_3,
      ],
    );
    return query;
  },



  //witnesses
  // add witnesses
  addWitneses: async ({
    loan_reference,
    name,
    id_no,
    witness_id_photo,
    witness_id_front_page,
    witness_id_back_page,
    name_2,
    id_no_2,
    witness_id_photo_2,
    witness_id_front_page_2,
    witness_id_back_page_2,
    name_3,
    id_no_3,
    witness_id_photo_3,
    witness_id_front_page_3,
    witness_id_back_page_3,
    witness_2_location,
    witness_2_sub_location,
    witness_village,
    witness_designation,
    witness_group_name,
    mobipesa_name,
    mobipesa_designation

  }: Loan) => {
    const query = await client.query(
      `INSERT INTO ${TABLE.WITNESSES} SET 
      loan_reference =?, 
      name =?, 
      id_no =?, 
      passport_photo =?,
       witness_id_front =?, 
       witness_id_back =?, 
       2nd_name =?, 
       2nd_id_no =?, 
       2nd_passport_photo =?, 
       2nd_witness_id_front =?, 
       2nd_witness_id_back =?, 
       3rd_name =?, 
       3rd_id_no =?, 
       3rd_passport_photo =?, 
       3rd_witness_id_front =?, 
       3rd_witness_id_back =?,
       witness_2_location =? ,
    witness_2_sub_location =?,
    witness_village =?,
    witness_designation =?,
    witness_group_name =?,
    mobipesa_name =?,
    mobipesa_designation =?`,
      [
        loan_reference,
        name,
        id_no,
        witness_id_photo,
        witness_id_front_page,
        witness_id_back_page,
        name_2,
        id_no_2,
        witness_id_photo_2,
        witness_id_front_page_2,
        witness_id_back_page_2,
        name_3,
        id_no_3,
        witness_id_photo_3,
        witness_id_front_page_3,
        witness_id_back_page_3,
        witness_2_location,
        witness_2_sub_location,
        witness_village,
        witness_designation,
        witness_group_name,
        mobipesa_name,
        mobipesa_designation
      ],
    );
    return query;
  },



  // edit livestock
  // editLivestock: async ({
  // 	farmer_id,
  // 	breed,
  // 	vacinations,
  // 	health_ratings,
  // 	valuations,
  // 	vet_name,
  // 	vet_reg_no,
  // 	tag_id,
  // 	logo_url,
  // 	insurance_url,
  // 	gender,
  // 	age,
  // 	location,
  // 	id,
  // }: Livestock) => {
  // 	const query = await client.query(
  // 		`UPDATE ${TABLE.LIVESTOCK} SET
  // 		 farmer_id =?,
  // 		 breed=?,
  // 		 vacinations =?,
  // 		 health_ratings =?,
  // 		 value =?,
  // 		 vet_name =?,
  // 		 vet_reg_no =?,
  // 		 tag_id =?,
  // 		 logo_url =?,
  // 		 insurance_url =?,
  // 		 gender =?,
  // 		 age =?,
  // 		 location =?
  // 		 WHERE
  // 		 id=?`,
  // 		[
  // 			farmer_id,
  // 			breed,
  // 			vacinations,
  // 			vet_name,
  // 			vet_reg_no,
  // 			tag_id,
  // 			logo_url,
  // 			insurance_url,
  // 			health_ratings,
  // 			valuations,
  // 			gender,
  // 			age,
  // 			location,
  // 			id,
  // 		]
  // 	);
  // 	return query;
  // },
  // insert into withdrawal archives
  insertIntoWithdrawal: async (
    { transaction_id, name, status, reference, description, working_balance }:
      Loan,
  ) => {
    const query = await client.query(
      `INSERT INTO withdrawal_archives SET 
			 transaction_id=?, 
			 name=?, 
			 status=?, 
			 reference=?,
			 description=?, 
			 working_balance=?`,
      [transaction_id, name, status, reference, description, working_balance],
    );
    return query;
  },

  insertIntoAuction: async (
    { amount, description, loan_reference, created_by }:
      Loan,
  ) => {
    const query = await client.query(
      `INSERT INTO loan_auction SET
      amount=?, 
      description=?, 
      loan_reference=?, 
      created_by=?`,
      [amount, description, loan_reference, created_by],
    );
    return query;
  },

  insertintoDomiDB: async (
    { msisdn, reference, amount, status }:
      Loan,
  ) => {
    const query = await client_mobi.query(
      `INSERT INTO b2ctransactions SET 
       MobileNumber=?, 
       SessionId=?, 
			 TransactionAmount=?, 
			 ProcessStatus=0`,
      [msisdn, reference, amount],
    );
    return query;
  },

  //create loan status
  createLoanStatus: async (
    { reported_by, loan_reference, status, description, narative }: Loan,
  ) => {
    const query = await client.query(
      `INSERT INTO  ${TABLE.LOAN_STATUS} SET 
		 reported_by = ?, 
		 loan_reference  =?, 
		 description =?,
     status =?,
		 narative =?`,
      [reported_by, loan_reference, description, status, narative],
    );
    return query;
  },

  //update loan status
  updateLoanStatus: async ({ id, status }: Loan) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LIVESTOCK} SET 
	    	loan_status = ${status}
        WHERE id =${id}`,
    );
    return query;
  },

  //update loan amount
  updateLoanAmount: async ({ reference, amount }: Loan) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
	    	amount_disbursed = ${amount},
	    	total_amount = ${amount}
        WHERE reference =?`, [reference],
    );
    return query;
  },

  //get farmer
  getFarmerByID: async ({ id }: Loan) => {
    const [query] = await client.query(
      `SELECT name, user_id, msisdn from ${TABLE.FARMER} 
        WHERE id =${id}`,
    );
    return query;
  },


  // //get farmer
  // getFarmerUserID: async ({ id }: Loan) => {
  //   const [query] = await client.query(
  //     `SELECT name, msisdn from ${TABLE.FARMER} 
  //       WHERE id =${id}`,
  //   );
  //   return query;
  // },

  //get loan reference
  getLoanReference: async ({ id }: Loan) => {
    const [query] = await client.query(
      `SELECT IF(COUNT(reference) > 0, reference, 0) reference FROM  ${TABLE.LOAN} WHERE livestock_id =${id} AND completion_status=1 ORDER BY id DESC LIMIT 1`,
    );
    return query.reference;
  },

  //get loan reference
  getLoanFeedbackFieldOfficer: async ({ reference }: Loan) => {
    const [query] = await client.query(
      `SELECT COUNT(loan_reference) reference FROM  ${TABLE.LOAN_STATUS} WHERE loan_reference ="${reference}" AND reported_by like "%Field Officer%"`,
    );
    return query.reference;
  },

  //get loan reference
  getLoanStatusField: async ({ reference }: Loan) => {
    const [query] = await client.query(
      `SELECT status, description FROM  ${TABLE.LOAN_STATUS} WHERE loan_reference ="${reference}" AND reported_by like "%Field Officer%" ORDER BY id DESC LIMIT 1`,
    );
    return query;
  },





  insertDeposits: async (
    { transaction_id, name, msisdn, user_id_no, amount }: Loan,
  ) => {
    const query = await client.query(
      `INSERT INTO ${TABLE.LOAN_DEPOSITS} SET 
			transaction_id=?, 
			name=?, 
			msisdn=?, 
			user_id_no=?,
			amount=?`,
      [transaction_id, name, msisdn, user_id_no, amount],
    );
    return query;
  },


  insertDepositsSuspend: async (
    { transaction_id, name, msisdn, user_id_no, amount }: Loan,
  ) => {
    const query = await client.query(
      `INSERT INTO suspend_account SET 
			transaction_id=?, 
			name=?, 
			msisdn=?, 
			user_id_no=?,
			amount=?`,
      [transaction_id, name, msisdn, user_id_no, amount],
    );
    return query;
  },


  insertIntoStatements: async (
    { credit, debit, interest, insurance_fee, insurance_balance, insurance_instalment_second, insurance_instalment_third, monthly_instalment, monthly_instalment_second, monthly_instalment_third, narrative, balance, period, loan_id, farmer_id }: Loan,
  ) => {
    const query = await client.query(
      `INSERT INTO ${TABLE.LOAN_STATEMENT} SET 
			 credit=?, 
			 debit=?, 
			 interest=?,
       insurance_fee=?,

       insurance_instalment_second=?,
       insurance_instalment_third=?,
       monthly_instalment=?,
       monthly_instalment_second=?,
       monthly_instalment_third=?,
    
       insurance_balance=?,
       narrative=?,
			 balance=?, 
			 loan_id=?, 
			 farmer_id=?, 
       period=?`,
      [
        credit,
        debit,
        interest,
        insurance_fee,
        insurance_instalment_second,
        insurance_instalment_third,
        monthly_instalment,
        monthly_instalment_second,
        monthly_instalment_third,
        insurance_balance, narrative, balance, loan_id, farmer_id, period],
    );
    return query;
  },

  //get all loan
  getLoan: async ({ offset, page_size }: Loan) => {
    return await client.query(`SELECT l.*, ls.status loan_status, ls.description, ls.narative 
    FROM ${TABLE.LOAN} l inner join ${TABLE.LOAN_STATUS} ls on l.reference = ls.loan_reference
WHERE 
(completion_status = 1 OR completion_status = 2) AND 
ls.id = (SELECT MAX(id) FROM ${TABLE.LOAN_STATUS} WHERE loan_reference = l.reference)
ORDER BY l.id DESC LIMIT ${offset},${page_size}`);
  },

  //get auction loan
  getLoanAuction: async ({ offset, page_size }: Loan) => {
    return await client.query(`SELECT * from loan_auction ORDER BY id DESC LIMIT ${offset},${page_size}`);
  },


  //get auction loan size
  getLoanAuctionSize: async () => {
    const [query] = await client.query(`SELECT count(id) count from loan_auction`);

    return query.count
  },

  //get auction loan
  getLoanAuctionFilter: async ({ filter_value }: Loan) => {
    return await client.query(`SELECT * from loan_auction WHERE loan_reference = ? ORDER BY id DESC`, [filter_value]);
  },

  //check if pend withdrawal exist
  getProccessedTransactionPends: async ({ filter_value }: Loan) => {
    const result = await client_mobi.query(
      `SELECT TransactionAmount, ProcessStatus, MobileMoneyTransactionId, SafaricomMPESATransactionId  FROM b2ctransactions WHERE SessionId = ?`, [filter_value]);
    return result;
  },


  //check connection to marafiki db
  testConnection: async () => {
    const result = await client_mobi.query(
      `SELECT TransactionAmount FROM b2ctransactions WHERE TransactionAmount LIMIT 1`);
    return result;
  },



  //updates withdrawal status if success in withrawal archive table
  updateLoanStatement: async (
    { id, transaction_id, reference }: Loan) => {
    const query = await client.query(
      `UPDATE withdrawal_archives SET 
			     status='success',
           transaction_id=?
				WHERE reference=?`, [transaction_id, reference]);
    return query;
  },

  //update withdrawal status
  updateLoanWithdrawalStatus: async (
    { reference }: Loan) => {
    const query = await client.query(
      `UPDATE withdrawal_archives SET 
			     status='rejected'
				WHERE reference=?`, [reference]);
    return query;
  },



  //get customers
  getTransaction: async () => {
    return await client.query(
      `SELECT id,reference FROM withdrawal_archives WHERE status = 'pending' OR status = 'failed' ORDER BY id DESC LIMIT 1`);
  },




  //get loan count
  getLoanCount: async () => {
    const [result] = await client.query(
      `SELECT COUNT(id) count FROM ${TABLE.LOAN} WHERE completion_status = 1`,
    );
    return result.count;
  },

  // (loan_reference, name, id_no, , , guarantor_id_back, `2nd_name`, `2nd_id_no`, `2nd_passport_photo`, 
  // `2nd_guarantor_id_front`, `2nd_guarantor_id_back`, `3rd_name`, `3rd_id_no`, `3rd_passport_photo`, `3rd_guarantor_id_front`, `3rd_guarantor_id_back`, created_on, last_updated_on)

  //filter loan details
  getLoanFilter: async ({ filter_value }: Loan) => {
    return await client.query(`SELECT l.*, 
    ls.status loan_status, ls.description,  ls.narative, 
    g.passport_photo guarantor_id_photo, 
   
    g.name guarantor_name, 
    g.id_no g_id_no, 
    g.guarantor_msisdn guarantor_msisdn, 
   
    g.2nd_name guarantor_name_2, 
    g.2nd_id_no g_id_no_2, 
    g.guarantor_msisdn_2 guarantor_msisdn_2, 
   
    g.3rd_name guarantor_name_3, 
    g.3rd_id_no g_id_no_3, 
    g.guarantor_msisdn_3 guarantor_msisdn_3, 
   

    w.name witness_name, 
    w.id_no w_id_no, 
   

    w.2nd_name witness_name_2, 
    w.2nd_id_no w_id_no_2, 
    w.witness_2_location witness_2_location, 
    w.witness_2_sub_location witness_2_sub_location, 
    w.witness_village witness_village, 
    w.witness_designation witness_designation, 

    w.3rd_name witness_name_3, 
    w.3rd_id_no w_id_no_3,
    w.witness_group_name witness_group_name,
    
    w.mobipesa_name mobipesa_name, 
    w.mobipesa_designation mobipesa_designation,

    
    g.guarantor_id_front guarantor_id_front_page, 
    g.guarantor_id_back guarantor_id_back_page,
    g.2nd_passport_photo guarantor_id_2nd_photo,
    g.2nd_guarantor_id_front guarantor_id_2nd_front_page,
    g.2nd_guarantor_id_back guarantor_id_2nd_back_page,
    g.3rd_passport_photo guarantor_id_3rd_photo,
    g.3rd_guarantor_id_front guarantor_id_3rd_front_page,
    g.3rd_guarantor_id_back guarantor_id_3rd_back_page,
    w.passport_photo witness_id_photo, 
    w.witness_id_front witness_id_front_page, 
    w.witness_id_back witness_id_back_page,
    w.2nd_passport_photo witness_id_2nd_photo,
    w.2nd_witness_id_front witness_id_2nd_front_page,
    w.2nd_witness_id_back witness_id_2nd_back_page,
    w.3rd_passport_photo witness_id_3rd_photo,
    w.3rd_witness_id_front witness_id_3rd_front_page,
    w.3rd_witness_id_back witness_id_3rd_back_page
        FROM ${TABLE.LOAN} l
         inner join ${TABLE.LOAN_STATUS} ls 
         on l.reference = ls.loan_reference
         inner join loan_witnesses w on l.reference = w.loan_reference
         inner join loan_guarantors g on l.reference = g.loan_reference
		WHERE 
    (completion_status = 1 OR completion_status = 2) AND 
    ls.id = (SELECT MAX(id) FROM ${TABLE.LOAN_STATUS} WHERE loan_reference = l.reference) AND
		l.livestock_id = ${filter_value} 
    ORDER BY l.id DESC`);
  },

  //get loan statement
  getLoanStatement: async ({ filter_value, period }: Loan) => {
    return await client.query(`SELECT * FROM ${TABLE.LOAN_STATEMENT} WHERE loan_id = ${filter_value} AND period = ${period}`);
  },

  //get loan statement
  getLoanStatementSummary: async ({ filter_value }: Loan) => {
    return await client.query(`SELECT * FROM ${TABLE.LOAN_STATEMENT} WHERE loan_id = ${filter_value} ORDER BY ID DESC LIMIT 1`);
  },

  //get loan statement
  getLoanStatementSumCredit: async ({ filter_value }: Loan) => {
    const [sum] = await client.query(`SELECT SUM(credit) sum_credit FROM ${TABLE.LOAN_STATEMENT} WHERE loan_id = ${filter_value} ORDER BY ID DESC LIMIT 1`);

    return sum.sum_credit;
  },



  //check farmer
  getProccessedTransaction: async ({ filter_value }: Loan) => {
    const [result] = await client_mobi.query(
      `SELECT  ProcessStatus, MobileMoneyTransactionId, SafaricomMPESATransactionId  FROM b2ctransactions WHERE SessionId = "${filter_value}"`,
    );
    return result;
  },


  //check farmer
  getMUser: async ({ filter_value }: Loan) => {
    const [result] = await client.query(
      `SELECT COUNT(id) count FROM ${TABLE.FARMER} WHERE id_no = "${filter_value}"`,
    );
    return result.count;
  },

  getMUserDetails: async ({ filter_value }: Loan) => {
    const result = await client.query(
      `SELECT id FROM ${TABLE.FARMER} WHERE id_no = ${filter_value}`,
    );
    return result;
  },

  getLivestockDetails: async ({ filter_value }: Loan) => {
    const result = await client.query(
      `SELECT id FROM ${TABLE.LIVESTOCK} WHERE farmer_id = ${filter_value} AND loan_status = 2 ORDER BY id DESC LIMIT 1`,
    );
    return result;
  },

  //update loan status
  updateLoanPrincipal: async ({ id, filter_value }: Loan) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
			paid_amount = paid_amount + ${filter_value},
      period_three = 0,
      check_amount =check_amount + ${filter_value}
      WHERE livestock_id =${id} AND status_paid = 0 AND completion_status = 1`,
    );
    return query;
  },

  //update loan status
  getLoanLoanStatus: async () => {
    const query = await client.query(
      `SELECT * FROM  ${TABLE.LOAN} WHERE status_paid = 0 and period_three = 0 lIMIT 1`,
    );
    return query;
  },

  // for checks
  getLoanLoanChecks: async () => {
    const query = await client.query(
      `SELECT * FROM  ${TABLE.LOAN} WHERE status_paid = 0 lIMIT 1`,
    );
    return query;
  },

  //update principal
  updateLoanPayment: async (
    { id, amount, interest, period, period_two, period_three }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
			period_one = ${period},
			period_two = ${period_two},
			period_three = ${period_three},
			principal_balance = ${amount},
			interest = ${interest}
            WHERE id =${id} AND status_paid = 0`,
    );
    return query;
  },

  //update principal
  getFarmerNo: async ({ id }: Loan) => {
    const query = await client.query(
      `SELECT name, msisdn  FROM ${TABLE.FARMER} 
            WHERE id =${id} `,
    );
    return query;
  },

  //update period
  updateLoan: async ({ id }: Loan) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET period_three = 0
			WHERE id =${id} `,
    );
    return query;
  },

  //update period
  updateLoanCompletionState: async ({ reference }: Loan) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET completion_status = 1
			WHERE reference ="${reference}" `,
    );
    return query;
  },
  // //delete
  // deleteLivestock: async ({ filter_value }: Livestock) => {
  // 	const result = await client.query(`DELETE FROM ${TABLE.LIVESTOCK} WHERE id = ?`, [ filter_value ]);
  // 	return result;
  // },



  //1st installment BI get loan installment
  getLoanInstallment: async ({ startDate, endDate, page_size, offset }: Loan) => {
    const query = await client.query(
      `SELECT
      l.loan_purpose,
l.statements,
l.kra_certificate,
l.created_by,
l.next_to_cow,
l.business_permit,
l.applicantion_form,
l.applicant_id_back_page,
l.applicant_id_front_page,
l.applicant_photo,
l.reference,
l.last_updated_on,
l.reminder_status,
l.status_paid,
l.defaulted,
l.reminder,
l.total_amount,
l.loan_repament,
l.loan_counts,
l.oustanding_loan,
l.defaulted_loans,
l.applicant_fee,
l.farmer_id,
l.status,
l.period_three,
l.reminder_lock,
l.lock_period,
l.defaulter_reminder,
l.completion_status,
l.livestock_id,
l.amount_disbursed,
l.insurance_fee,
l.gross_income,
l.principal_balance,
l.interest,
l.insurance_installment,
l.monthly_instalment,
l.monthly_instalment_third,
l.insurance_instalment_third,
l.interest_third,
l.monthly_instalment_second,
l.insurance_instalment_second,
l.interest_second,
l.debt_collection,
l.rollover_fee,
ROUND(((l.total_amount) * 0.075),2) expected_interest_first,

l.insurance_balance,
l.total_interest,
l.paid_amount,
l.check_amount,
l.created_on,
l.due_date,
      f.name, f.id, 
      f.latitude, 
      f.passport_photo,
      f.id_no,f.longitude, 
      f.msisdn, 
      u.name field_officer, 
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, 
      b.branch_name 
      FROM ${TABLE.LOAN} l 
      inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
      left join ${TABLE.USERS} u ON f.user_id = u.id
      left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
      WHERE 
       completion_status = 1 
       AND 
      status =1
      AND
      l.lock_period = 0 
      AND
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND 
      l.id GROUP BY l.id,f.id ORDER BY l.id DESC LIMIT ${offset}, ${page_size} `,
    );

    return query;
  },





  //1st installment BI get loan installment
  getLoanInstallmentFilter: async ({ startDate, filter_value, endDate, page_size, offset }: Loan) => {
    const query = await client.query(
      `SELECT
      l.loan_purpose,
l.statements,
l.kra_certificate,
l.created_by,
l.next_to_cow,
l.business_permit,
l.applicantion_form,
l.applicant_id_back_page,
l.applicant_id_front_page,
l.applicant_photo,
l.reference,
l.last_updated_on,
l.reminder_status,
l.status_paid,
l.defaulted,
l.reminder,
l.total_amount,
l.loan_repament,
l.loan_counts,
l.oustanding_loan,
l.defaulted_loans,
l.applicant_fee,
l.farmer_id,
l.status,
l.period_three,
l.reminder_lock,
l.lock_period,
l.defaulter_reminder,
l.completion_status,
l.livestock_id,
l.amount_disbursed,
l.insurance_fee,
l.gross_income,
l.principal_balance,
l.interest,
l.insurance_installment,
l.monthly_instalment,
l.monthly_instalment_third,
l.insurance_instalment_third,
l.interest_third,
l.monthly_instalment_second,
l.insurance_instalment_second,
l.interest_second,
l.debt_collection,
l.rollover_fee,
ROUND(((l.total_amount) * 0.075),2) expected_interest_first,

l.insurance_balance,
l.total_interest,
l.paid_amount,
l.check_amount,
l.created_on,
l.due_date,
      f.name, f.id, 
      f.latitude, 
      f.passport_photo,
      f.id_no,f.longitude, 
      f.msisdn, 
      u.name field_officer, 
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, 
      b.branch_name 
      FROM ${TABLE.LOAN} l 
      inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
      left join ${TABLE.USERS} u ON f.user_id = u.id
      left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
      WHERE 
       completion_status = 1 
       AND 
      status =1
      AND
      l.lock_period = 0 
      AND
      b.branch_name LIKE '%${filter_value}%'
      AND
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND 
      l.id GROUP BY l.id,f.id ORDER BY l.id DESC`,
    );

    return query;
  },



  getLoanInstallmentNumberFilter: async ({ startDate, filter_value, endDate }: Loan) => {
    const [query] = await client.query(
      `
      SELECT COUNT(l.id) count, 
      ROUND(SUM(l.total_amount/3),2) expected_principal, 
      ROUND(SUM(l.monthly_instalment), 2) paid_principal,
      ROUND(SUM(l.total_amount * 0.075),2) expected_interest,
      ROUND(SUM(l.interest), 2) paid_interest,
      
      ROUND(SUM((l.insurance_fee)/3),2) expected_insurance,
      ROUND(SUM(l.insurance_installment), 2) paid_insurance
      
      FROM ${TABLE.LOAN} l 
      inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
      left join ${TABLE.USERS} u ON f.user_id = u.id
      left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
      WHERE 
      completion_status = 1 
      AND 
      status = 1
      AND
      l.lock_period = 0 
      AND
      b.branch_name LIKE '%${filter_value}%'
      AND
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate}`,
    );

    return query;
  },


  getLoanInstallmentNumber: async ({ startDate, endDate }: Loan) => {
    const [query] = await client.query(
      `
      SELECT COUNT(l.id) count, 
      ROUND(SUM(l.total_amount/3),2) expected_principal, 
      ROUND(SUM(l.monthly_instalment), 2) paid_principal,
      ROUND(SUM(l.total_amount * 0.075),2) expected_interest,
      ROUND(SUM(l.interest), 2) paid_interest,
      
      ROUND(SUM((l.insurance_fee)/3),2) expected_insurance,
      ROUND(SUM(l.insurance_installment), 2) paid_insurance
      
      FROM ${TABLE.LOAN} l 
      inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
      left join ${TABLE.USERS} u ON f.user_id = u.id
      left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
      WHERE 
      completion_status = 1 
      AND 
      status = 1
      AND
      l.lock_period = 0 
      AND
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate}`,
    );

    return query;
  },


  //2ND installment BI get loan installment

  getLoanTwoInstallment: async ({ startDate, endDate, page_size, offset }: Loan) => {
    const query = await client.query(
      `SELECT
      l.loan_purpose,
l.statements,
l.kra_certificate,
l.created_by,
l.next_to_cow,
l.business_permit,
l.applicantion_form,
l.applicant_id_back_page,
l.applicant_id_front_page,
l.applicant_photo,
l.reference,
l.last_updated_on,
l.reminder_status,
l.status_paid,
l.defaulted,
l.reminder,
l.total_amount,
l.loan_repament,
l.loan_counts,
l.oustanding_loan,
l.defaulted_loans,
l.applicant_fee,
l.farmer_id,
l.status,
l.period_three,
l.reminder_lock,
l.lock_period,
l.defaulter_reminder,
l.completion_status,
l.livestock_id,
l.amount_disbursed,
l.insurance_fee,
l.gross_income,
s.interest_second expected_interest_second,
l.principal_balance,
l.interest,
l.insurance_installment,
l.monthly_instalment,
l.monthly_instalment_third,
l.insurance_instalment_third,
l.interest_third,
l.monthly_instalment_second,
l.insurance_instalment_second,
l.interest_second,
l.debt_collection,
l.rollover_fee,
l.insurance_balance,
l.total_interest,
l.paid_amount,
l.check_amount,
l.created_on,
l.due_date,
      f.name, f.id, f.latitude, 
      f.passport_photo,f.id_no,f.longitude, f.msisdn, u.name field_officer, 
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, b.branch_name FROM ${TABLE.LOAN} l 
      inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
      left join ${TABLE.USERS} u ON f.user_id = u.id
      left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
      inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
      ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 2 AND loan_id = l.id AND id  ORDER BY id LIMIT 1)
      WHERE 
       completion_status = 1 
       AND 
      l.status =1
      AND
      s.interest_second

      AND
      s.period IN (2,3,4,5)
AND
      l.lock_period = 2 AND
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND
      l.id  GROUP BY l.id,f.id ORDER BY l.id  DESC LIMIT ${offset}, ${page_size}  `,
    );

    return query;
  },

  getLoanTwoInstallmentFilter: async ({ startDate, filter_value, endDate, page_size, offset }: Loan) => {
    const query = await client.query(
      `SELECT
      l.loan_purpose,
l.statements,
l.kra_certificate,
l.created_by,
l.next_to_cow,
l.business_permit,
l.applicantion_form,
l.applicant_id_back_page,
l.applicant_id_front_page,
l.applicant_photo,
l.reference,
l.last_updated_on,
l.reminder_status,
l.status_paid,
l.defaulted,
l.reminder,
l.total_amount,
l.loan_repament,
l.loan_counts,
l.oustanding_loan,
l.defaulted_loans,
l.applicant_fee,
l.farmer_id,
l.status,
l.period_three,
l.reminder_lock,
l.lock_period,
l.defaulter_reminder,
l.completion_status,
l.livestock_id,
l.amount_disbursed,
l.insurance_fee,
l.gross_income,
l.principal_balance,
l.interest,
s.interest_second expected_interest_second,
l.insurance_installment,
l.monthly_instalment,
l.monthly_instalment_third,
l.insurance_instalment_third,
l.interest_third,
l.monthly_instalment_second,
l.insurance_instalment_second,
l.interest_second,
l.debt_collection,
l.rollover_fee,
l.insurance_balance,
l.total_interest,
l.paid_amount,
l.check_amount,
l.created_on,
l.due_date,
      f.name, f.id, f.latitude, 
      f.passport_photo,f.id_no,f.longitude, f.msisdn, u.name field_officer, 
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, b.branch_name FROM ${TABLE.LOAN} l 
      inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
      left join ${TABLE.USERS} u ON f.user_id = u.id
      left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
      inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
      ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 2 AND loan_id = l.id AND id  ORDER BY id LIMIT 1)
      WHERE 
       completion_status = 1 
       AND 
      l.status =1
      AND
      b.branch_name LIKE "%${filter_value}%" 
      AND
      s.interest_second
      AND
      s.period IN (2,3,4,5)
     AND
      l.lock_period = 2 AND
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND
      l.id  GROUP BY l.id,f.id ORDER BY l.id  DESC`,
    );

    return query;
  },



  getLoanTwoInstallmentNumber: async ({ startDate, endDate }: Loan) => {
    const [query] = await client.query(
      `
      SELECT COUNT(l.id) count, 
     
      ROUND(SUM(l.total_amount/3 + l.total_amount/3),2) expected_principal, 
     
      ROUND(SUM(l.monthly_instalment_second + l.monthly_instalment), 2) paid_principal,
      
      ROUND(SUM(total_amount * 0.075 + s.interest_second),2) expected_interest,
      
      ROUND(SUM(l.interest + l.interest_second), 2) paid_interest,
      
      ROUND(SUM(((l.insurance_fee)/3) + (l.insurance_fee/3)),2) expected_insurance,
      
      ROUND(SUM(l.insurance_instalment_second + l.insurance_installment), 2) paid_insurance
    
      FROM ${TABLE.LOAN} l 
      inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
      left join ${TABLE.USERS} u ON f.user_id = u.id
      left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
      inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
      ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 2 AND loan_id = l.id AND id  ORDER BY id LIMIT 1)
      WHERE 
      l.completion_status = 1 
      AND 
      l.status =1
      AND
      l.lock_period = 2
      AND
      s.interest_second
      AND
      s.period IN (2,3,4,5)
      AND
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate}
    `,
    );
    return query;
  },




  getLoanTwoInstallmentNumberFilter: async ({ startDate, filter_value, endDate }: Loan) => {
    const [query] = await client.query(
      `
      SELECT COUNT(l.id) count, 
     
      ROUND(SUM(l.total_amount/3 + l.total_amount/3),2) expected_principal, 
     
      ROUND(SUM(l.monthly_instalment_second + l.monthly_instalment), 2) paid_principal,
      
      ROUND(SUM(total_amount * 0.075 + s.interest_second),2) expected_interest,
      
      ROUND(SUM(l.interest + l.interest_second), 2) paid_interest,
      
      ROUND(SUM(((l.insurance_fee)/3) + (l.insurance_fee/3)),2) expected_insurance,
      
      ROUND(SUM(l.insurance_instalment_second + l.insurance_installment), 2) paid_insurance
    
      FROM ${TABLE.LOAN} l 
      inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
      left join ${TABLE.USERS} u ON f.user_id = u.id
      left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
      inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
      ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 2 AND loan_id = l.id AND id  ORDER BY id LIMIT 1)
      WHERE 
      l.completion_status = 1 
      AND 
      l.status =1
      AND
      b.branch_name LIKE '%${filter_value}%'
      AND
      l.lock_period = 2
      AND
      s.interest_second
      AND
      s.period IN (2,3,4,5)
      AND

      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate}
    `,
    );
    return query;
  },



  //3RD installment BI get loan installment

  getLoanThirdInstallment: async ({ startDate, endDate, page_size, offset }: Loan) => {
    const query = await client.query(
      `SELECT
      l.loan_purpose,
l.statements,
l.kra_certificate,
l.created_by,
l.next_to_cow,
l.business_permit,
l.applicantion_form,
l.applicant_id_back_page,
l.applicant_id_front_page,
l.applicant_photo,
l.reference,
l.last_updated_on,
l.reminder_status,
l.status_paid,
l.defaulted,
l.reminder,
l.total_amount,
l.loan_repament,
l.loan_counts,
l.oustanding_loan,
l.defaulted_loans,
l.applicant_fee,
l.farmer_id,
l.status,
l.period_three,
l.reminder_lock,
l.lock_period,
l.defaulter_reminder,
l.completion_status,
l.livestock_id,
l.amount_disbursed,
l.insurance_fee,
l.gross_income,
l.principal_balance,
l.interest,
s.interest_second expected_interest_second,
s.interest_third expected_interest_third,
l.insurance_installment,
l.monthly_instalment,
l.monthly_instalment_third,
l.insurance_instalment_third,
l.interest_third,
l.monthly_instalment_second,
l.insurance_instalment_second,
l.interest_second,
l.debt_collection,
l.rollover_fee,
l.insurance_balance,
l.total_interest,
l.paid_amount,
l.check_amount,
l.created_on,
l.due_date,
      f.name, f.id, f.latitude, 
      f.passport_photo,f.id_no,f.longitude, f.msisdn, u.name field_officer, 
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, b.branch_name FROM ${TABLE.LOAN} l 
      inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
      left join ${TABLE.USERS} u ON f.user_id = u.id
      left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
      inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
      ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 3 AND loan_id = l.id AND id  ORDER BY id LIMIT 1)
      WHERE 
       completion_status = 1 
       AND 
      l.status =1
      AND 
      s.interest_third
      AND
      s.period IN (3,4,5)
      AND
      l.lock_period = 4 
      AND
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND
      l.id  GROUP BY l.id,f.id ORDER BY l.id DESC LIMIT ${offset}, ${page_size}  `,
    );

    return query;
  },


  getLoanThirdInstallmentFilter: async ({ startDate, filter_value, endDate, page_size, offset }: Loan) => {
    const query = await client.query(
      `SELECT
      l.loan_purpose,
l.statements,
l.kra_certificate,
l.created_by,
l.next_to_cow,
l.business_permit,
l.applicantion_form,
l.applicant_id_back_page,
l.applicant_id_front_page,
l.applicant_photo,
l.reference,
l.last_updated_on,
l.reminder_status,
l.status_paid,
l.defaulted,
l.reminder,
l.total_amount,
l.loan_repament,
l.loan_counts,
l.oustanding_loan,
l.defaulted_loans,
l.applicant_fee,
l.farmer_id,
l.status,
l.period_three,
l.reminder_lock,
l.lock_period,
l.defaulter_reminder,
l.completion_status,
l.livestock_id,
l.amount_disbursed,
l.insurance_fee,
l.gross_income,
l.principal_balance,
l.interest,
s.interest_second expected_interest_second,
s.interest_third expected_interest_third,
l.insurance_installment,
l.monthly_instalment,
l.monthly_instalment_third,
l.insurance_instalment_third,
l.interest_third,
l.monthly_instalment_second,
l.insurance_instalment_second,
l.interest_second,
l.debt_collection,
l.rollover_fee,
l.insurance_balance,
l.total_interest,
l.paid_amount,
l.check_amount,
l.created_on,
l.due_date,
      f.name, f.id, f.latitude, 
      f.passport_photo,f.id_no,f.longitude, f.msisdn, u.name field_officer, 
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, b.branch_name FROM ${TABLE.LOAN} l 
      inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
      left join ${TABLE.USERS} u ON f.user_id = u.id
      left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
      inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
      ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 3 AND loan_id = l.id AND id  ORDER BY id LIMIT 1)
      WHERE 
       completion_status = 1 
       AND 
      l.status =1
      AND
      b.branch_name LIKE '%${filter_value}%' 
      AND
      s.interest_third
      AND
      s.period IN (3,4,5)
      AND
      l.lock_period = 4 AND
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND
      l.id  GROUP BY l.id,f.id ORDER BY l.id DESC`,
    );

    return query;
  },

  getLoanThirdInstallmentNumber: async ({ startDate, endDate }: Loan) => {
    const [query] = await client.query(
      `
      SELECT COUNT(l.id) count, 
     
      ROUND(SUM(l.total_amount),2) expected_principal, 
     
      ROUND(SUM(l.monthly_instalment_second +  l.monthly_instalment_third + l.monthly_instalment), 2) paid_principal,
      
      ROUND(SUM(total_amount * 0.075 + s.interest_second + s.interest_third),2) expected_interest,
      
      ROUND(SUM(l.interest + l.interest_second + l.interest_third), 2) paid_interest,
      
      ROUND(SUM(l.insurance_fee),2) expected_insurance,
      
      ROUND(SUM(l.insurance_instalment_second + l.insurance_instalment_third +  l.insurance_installment), 2) paid_insurance
        
      FROM ${TABLE.LOAN} l 
      inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
      left join ${TABLE.USERS} u ON f.user_id = u.id
      left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
      inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
      ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 3 AND loan_id = l.id AND id  ORDER BY id ASC LIMIT 1)
      WHERE 
      l.completion_status = 1 
      AND 
      l.status =1
      AND
      s.interest_third
      AND
      s.period IN (3,4,5)
      AND 
     l.lock_period = 4
      AND
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate}
    `,
    );
    return query;
  },





  getLoanThirdInstallmentNumberFilter: async ({ startDate, filter_value, endDate }: Loan) => {
    const [query] = await client.query(
      `
      SELECT COUNT(l.id) count, 
     
      ROUND(SUM(l.total_amount),2) expected_principal, 
     
      ROUND(SUM(l.monthly_instalment_second +  l.monthly_instalment_third + l.monthly_instalment), 2) paid_principal,
      
      ROUND(SUM(total_amount * 0.075 + s.interest_second + s.interest_third),2) expected_interest,
      
      ROUND(SUM(l.interest + l.interest_second + l.interest_third), 2) paid_interest,
      
      ROUND(SUM(l.insurance_fee),2) expected_insurance,
      
      ROUND(SUM(l.insurance_instalment_second + l.insurance_instalment_third +  l.insurance_installment), 2) paid_insurance
     
      FROM ${TABLE.LOAN} l 
      inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
      left join ${TABLE.USERS} u ON f.user_id = u.id
      left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
      WHERE 
      l.completion_status = 1 
      AND 
      l.status =1
      AND
      b.branch_name LIKE '%${filter_value}%'
      AND     
      l.lock_period = 4
      AND
      s.interest_third
      AND
      s.period IN (3,4,5)
      AND 
     l.lock_period = 4
     AND
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate}
    `,
    );
    return query;
  },


  //Rollvoer report

  getRollOverReport: async ({ startDate, endDate, page_size, offset }: Loan) => {
    const query = await client.query(
      `SELECT
        l.loan_purpose,
  l.statements,
  l.reference,
  ROUND( (DATEDIFF(DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(due_date, '%Y-%m-%d'))) * ((l.total_interest)/30),2) expected_rollover,
  
   ROUND( (DATEDIFF(DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(due_date, '%Y-%m-%d'))) * ((l.total_interest)/30),2) expected_rollover,
    ROUND((l.total_amount + (s.interest) + (s.interest_second) +  (s.interest_third) + l.insurance_fee +  ((DATEDIFF(DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(due_date, '%Y-%m-%d'))) * (l.total_interest)/30)),2) expected_amount,
    ROUND(((l.total_amount + (s.interest_third) + (s.interest) +  (s.interest_second) + l.insurance_fee + ((DATEDIFF(DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(due_date, '%Y-%m-%d'))) * (l.total_interest)/30)) - (l.monthly_instalment_second +  l.monthly_instalment_third + l.monthly_instalment + l.interest + l.interest_second + l.interest_third +  l.insurance_instalment_second + l.insurance_instalment_third +  l.insurance_installment +  l.rollover_fee)),2) paid_amount,     
    ROUND(((((DATEDIFF(DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(due_date, '%Y-%m-%d'))) * (l.total_interest)/30)) - l.rollover_fee ), 2) paid_rollver,
 
    l.farmer_id,
  l.created_on,
  l.due_date,
        f.name, f.id, f.latitude, 
        f.passport_photo,f.id_no,f.longitude, f.msisdn, u.name field_officer, 
        DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, b.branch_name FROM ${TABLE.LOAN} l 
        inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
        left join ${TABLE.USERS} u ON f.user_id = u.id
        left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
        inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
        ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 4 AND loan_id = l.id AND id  ORDER BY id LIMIT 1)
        WHERE 
         completion_status = 1 
         AND 
        l.status =1
        AND
        s.rollover_fee
         AND
        l.lock_period = 6 AND
        DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND
        l.id GROUP BY l.id, f.id ORDER BY l.id  DESC LIMIT ${offset}, ${page_size}  `,
    );

    return query;
  },

  getRollOverReportFilter: async ({ startDate, endDate, filter_value, page_size, offset }: Loan) => {
    const query = await client.query(
      `SELECT
        l.loan_purpose,
  l.statements,
  l.reference,
  ROUND( (DATEDIFF(DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(due_date, '%Y-%m-%d'))) * ((l.total_interest)/30),2) expected_rollover,
 
  ROUND( (DATEDIFF(DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(due_date, '%Y-%m-%d'))) * ((l.total_interest)/30),2) expected_rollover,
  ROUND((l.total_amount + (s.interest) + (s.interest_second) +  (s.interest_third) + l.insurance_fee +  ((DATEDIFF(DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(due_date, '%Y-%m-%d'))) * (l.total_interest)/30)),2) expected_amount,
    ROUND(((l.total_amount + (s.interest_third) + (s.interest) +  (s.interest_second) + l.insurance_fee + ((DATEDIFF(DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(due_date, '%Y-%m-%d'))) * (l.total_interest)/30)) - (l.monthly_instalment_second +  l.monthly_instalment_third + l.monthly_instalment + l.interest + l.interest_second + l.interest_third +  l.insurance_instalment_second + l.insurance_instalment_third +  l.insurance_installment +  l.rollover_fee)),2) paid_amount,     
    ROUND(((((DATEDIFF(DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(due_date, '%Y-%m-%d'))) * (l.total_interest)/30)) - l.rollover_fee ), 2) paid_rollver,

    l.last_updated_on,
  l.farmer_id,
  l.created_on,
  l.due_date,
        f.name, f.id, f.latitude, 
        f.passport_photo,f.id_no,f.longitude, f.msisdn, u.name field_officer, 
        DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, b.branch_name FROM ${TABLE.LOAN} l 
        inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
        left join ${TABLE.USERS} u ON f.user_id = u.id
        left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
        inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
        ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 4 AND loan_id = l.id AND id  ORDER BY id ASC LIMIT 1)
        
        WHERE 
         completion_status = 1 
         AND 
        l.status =1
        AND
        s.rollover_fee
        AND
        b.branch_name LIKE '%${filter_value}%' AND
        l.lock_period = 6 AND
        DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND
        l.id GROUP BY l.id, f.id ORDER BY l.id  DESC`,
    );

    return query;
  },

  getLoanRollOverNumber: async ({ startDate, endDate }: Loan) => {
    const [query] = await client.query(
      `
        SELECT COUNT(l.id) count, 
       
        ROUND(SUM(l.total_amount),2) expected_principal, 
       
        ROUND(SUM(l.monthly_instalment_second +  l.monthly_instalment_third + l.monthly_instalment), 2) paid_principal,
        
        ROUND(SUM(s.interest_third + (s.interest_second) +  (s.interest)),2) expected_interest,
        
        ROUND(SUM(l.interest + l.interest_second + l.interest_third), 2) paid_interest,
        
        ROUND(SUM(l.insurance_fee),2) expected_insurance,
        
        ROUND(SUM(l.insurance_instalment_second + l.insurance_instalment_third +  l.insurance_installment), 2) paid_insurance, 

        ROUND(SUM((DATEDIFF(DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(due_date, '%Y-%m-%d'))) * (l.total_interest)/30) , 2) total_rollver,
        
        ROUND(SUM(l.rollover_fee), 2) paid_rollver
       
        
        FROM ${TABLE.LOAN} l 
        inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
        left join ${TABLE.USERS} u ON f.user_id = u.id
        left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
        inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
        ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 4 AND loan_id = l.id AND id  ORDER BY id ASC LIMIT 1)
      
        WHERE 
        l.completion_status = 1 
        AND 
        l.status =1
        AND
        s.rollover_fee
        AND

        l.lock_period = 6
        AND
        DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate}
      `,
    );
    return query;
  },

  getLoanRollOverNumberFilter: async ({ startDate, filter_value, endDate }: Loan) => {
    const [query] = await client.query(
      `
        SELECT COUNT(l.id) count, 
       
        ROUND(SUM(l.total_amount),2) expected_principal, 
       
        ROUND(SUM(l.monthly_instalment_second +  l.monthly_instalment_third + l.monthly_instalment), 2) paid_principal,
        
        ROUND(SUM(s.interest_third + (s.interest_second) +  (s.interest)),2) expected_interest,
        
        ROUND(SUM(l.interest + l.interest_second + l.interest_third), 2) paid_interest,
        
        ROUND(SUM(l.insurance_fee),2) expected_insurance,
        
        ROUND(SUM(l.insurance_instalment_second + l.insurance_instalment_third +  l.insurance_installment), 2) paid_insurance, 

        ROUND(SUM((DATEDIFF(DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(due_date, '%Y-%m-%d'))) * (l.total_interest)/30) , 2) total_rollver,
        
        ROUND(SUM(l.rollover_fee), 2) paid_rollver
       
        
        FROM ${TABLE.LOAN} l 
        inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
        left join ${TABLE.USERS} u ON f.user_id = u.id
        left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
        inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
        ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 4 AND loan_id = l.id AND id  ORDER BY id ASC LIMIT 1)
      
        WHERE 
        l.completion_status = 1 
        AND 
        l.status =1
        AND
        b.branch_name LIKE '%${filter_value}%' AND
        l.lock_period = 6        
        AND
        s.rollover_fee
        AND

        DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate}
      `,
    );
    return query;
  },



  //Debt collection report

  getDebtCollectionReport: async ({ startDate, endDate, page_size, offset }: Loan) => {
    const query = await client.query(
      `SELECT
        l.loan_purpose,
  l.statements,
  l.reference,
  ROUND((s.debt_collection), 2) total_debt_collection,
  ROUND(((s.debt_collection) - (l.debt_collection)),2) paid_debt_collection,
  ROUND(((l.total_amount) + (s.interest) + (s.interest_second) +  (s.interest_third) +  (s.debt_collection) + l.insurance_fee + l.total_interest ),2) expected_amount, 
  ROUND(((l.total_amount) + (s.interest_third) + (s.interest_second) +  (s.interest) + l.insurance_fee + (s.debt_collection) + l.total_interest) - (l.monthly_instalment_second + l.debt_collection + l.monthly_instalment_third + l.monthly_instalment + l.interest + l.interest_second + l.interest_third +  l.insurance_instalment_second + l.insurance_instalment_third +  l.insurance_installment + l.rollover_fee),2) paid_amount,         
  l.last_updated_on,
  l.farmer_id,
  l.created_on,
  l.due_date,
        f.name, f.id, f.latitude, 
        f.passport_photo,f.id_no,f.longitude, f.msisdn, u.name field_officer, 
        DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, b.branch_name FROM ${TABLE.LOAN} l 
        inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
        left join ${TABLE.USERS} u ON f.user_id = u.id
        left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
        inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
        ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 5 AND loan_id = l.id AND id  ORDER BY id LIMIT 1)
        WHERE 
         completion_status = 1 
         AND 
        l.status =1
        AND   
        s.debt_collection
        AND    
        l.lock_period = 8 AND
        DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND
        l.id GROUP BY l.id, f.id ORDER BY l.id DESC LIMIT ${offset}, ${page_size}`,
    );

    return query;
  },

  getDebtCollectionReportFilter: async ({ startDate, endDate, filter_value, offset }: Loan) => {
    const query = await client.query(
      `SELECT
        l.loan_purpose,
  l.statements,
  l.reference,

  ROUND((s.debt_collection), 2) total_debt_collection,
  ROUND(((s.debt_collection) - (l.debt_collection)),2) paid_debt_collection,
  ROUND(((l.total_amount) + (s.interest) + (s.interest_second) +  (s.interest_third) +  (s.debt_collection) + l.insurance_fee + l.total_interest ),2) expected_amount, 
  ROUND(((l.total_amount) + (s.interest_third) + (s.interest_second) +  (s.interest) + l.insurance_fee + (s.debt_collection) + l.total_interest) - (l.monthly_instalment_second + l.debt_collection + l.monthly_instalment_third + l.monthly_instalment + l.interest + l.interest_second + l.interest_third +  l.insurance_instalment_second + l.insurance_instalment_third +  l.insurance_installment + l.rollover_fee),2) paid_amount,         

  l.last_updated_on,
  l.farmer_id,
  l.created_on,
  l.due_date,
        f.name, f.id, f.latitude, 
        f.passport_photo,f.id_no,f.longitude, f.msisdn, u.name field_officer, 
        DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, b.branch_name FROM ${TABLE.LOAN} l 
        inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
        left join ${TABLE.USERS} u ON f.user_id = u.id
        left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
        inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
        ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 5 AND loan_id = l.id AND id  ORDER BY id LIMIT 1)
        WHERE 
         completion_status = 1 
         AND 
        l.status =1
        AND 
        s.debt_collection
        AND      
        b.branch_name LIKE "%${filter_value}%" AND
        l.lock_period = 8 AND
        DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND
        l.id GROUP BY l.id, f.id ORDER BY l.id DESC`,
    );

    return query;
  },

  getDebtCollectionNumber: async ({ startDate, endDate }: Loan) => {
    const [query] = await client.query(
      `
        SELECT COUNT(l.id) count, 
       
        ROUND(SUM(l.total_amount),2) expected_principal, 
       
        ROUND(SUM(l.monthly_instalment_second +  l.monthly_instalment_third + l.monthly_instalment), 2) paid_principal,
        
        ROUND(SUM(s.interest_third + (s.interest_second) +  (s.interest)),2) expected_interest,
        
        ROUND(SUM(l.interest + l.interest_second + l.interest_third), 2) paid_interest,
        
        ROUND(SUM(l.insurance_fee),2) expected_insurance,
        
        ROUND(SUM(l.insurance_instalment_second + l.insurance_instalment_third +  l.insurance_installment), 2) paid_insurance, 

        ROUND(SUM(l.total_interest) , 2) total_rollver,
        
        ROUND(SUM(l.rollover_fee), 2) paid_rollver,

        ROUND(SUM(s.debt_collection), 2) total_debt_collection,
     
        ROUND(SUM(l.debt_collection), 2) paid_debt_collection
        
      
        FROM ${TABLE.LOAN} l 
        inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
        left join ${TABLE.USERS} u ON f.user_id = u.id
        left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
        inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
        ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 5 AND loan_id = l.id AND id  ORDER BY id LIMIT 1)
       
        WHERE 
        l.completion_status = 1 
        AND 
        l.status =1
        AND
        s.debt_collection
        AND
        l.lock_period = 8
        AND
        DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate}
      `,
    );
    return query;
  },



  getDebtCollectionNumberFilter: async ({ startDate, filter_value, endDate }: Loan) => {
    const [query] = await client.query(
      `
        SELECT COUNT(l.id) count, 
       
        ROUND(SUM(l.total_amount),2) expected_principal, 
       
        ROUND(SUM(l.monthly_instalment_second +  l.monthly_instalment_third + l.monthly_instalment), 2) paid_principal,
        
        ROUND(SUM(s.interest_third + (s.interest_second) +  (s.interest)),2) expected_interest,
        
        ROUND(SUM(l.interest + l.interest_second + l.interest_third), 2) paid_interest,
        
        ROUND(SUM(l.insurance_fee),2) expected_insurance,
        
        ROUND(SUM(l.insurance_instalment_second + l.insurance_instalment_third +  l.insurance_installment), 2) paid_insurance, 

        ROUND(SUM(l.total_interest) , 2) total_rollver,
        
        ROUND(SUM(l.rollover_fee), 2) paid_rollver,

        ROUND(SUM(s.debt_collection), 2) total_debt_collection,
     
        ROUND(SUM(l.debt_collection), 2) paid_debt_collection        
      
        FROM ${TABLE.LOAN} l 
        inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
        left join ${TABLE.USERS} u ON f.user_id = u.id
        left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
        inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
        ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 5 AND loan_id = l.id AND id  ORDER BY id LIMIT 1)
       
        WHERE 
        l.completion_status = 1 
        AND 
        l.status =1
        AND
        b.branch_name LIKE '%${filter_value}%'
AND
s.debt_collection
AND

        l.lock_period = 8
        AND
        DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate}
      `,
    );
    return query;
  },




  //Global ANalysis


  getGlobalReport: async ({ startDate, endDate, page_size, offset }: Loan) => {
    const query = await client.query(
      `SELECT

      r.loan_purpose,
      r.statements,
      r.id,
      r.reference,
      
      SUM(r.interest_second),
      SUM(r.interest_third),
      (r.expected_amount + r.debt_collection + r.interest_second + r.interest_third + r.interest) expected_amount, 
      SUM(r.paid_amount) paid_amount,
      r.name,
      r.last_updated_on,
      r.farmer_id,
      r.created_on,
       r.latitude, 
          r.passport_photo,r.id_no,r.longitude, r.msisdn, r.field_officer, 
          DATE_FORMAT(DATE_SUB(r.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, r.branch_name
      FROM
      (
       (
    SELECT
      l.loan_purpose,
      l.statements,
      l.reference,
      IFNULL(s.debt_collection,0) debt_collection,
      IFNULL((l.total_amount * 0.075),0) interest,
      s.interest_second,
      IFNULL(s.interest_third,0) interest_third,
      ROUND(((l.total_amount)  + IFNULL(l.insurance_fee,0) + IFNULL(l.total_interest,0)),2) expected_amount,
      ROUND(((l.total_amount) +   IFNULL(s.interest_second,0) + IFNULL(s.interest_third,0) +  (IFNULL((l.total_amount * 0.075),0)) + IFNULL(l.insurance_fee,0) + IFNULL((s.debt_collection),0) + l.total_interest) - (l.monthly_instalment_second + l.debt_collection + l.monthly_instalment_third + l.monthly_instalment + l.interest + l.interest_second + l.interest_third +  l.insurance_instalment_second + l.insurance_instalment_third +  l.insurance_installment + l.rollover_fee),2) paid_amount,          

      l.last_updated_on,
      l.farmer_id,
      l.created_on,
      l.due_date,
          f.name, f.id, f.latitude, 
          f.passport_photo,f.id_no,f.longitude, f.msisdn, u.name field_officer, 
          DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, b.branch_name
          FROM ${TABLE.LOAN} l 
          inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
          left join ${TABLE.USERS} u ON f.user_id = u.id
          left join ${TABLE.BRANCHES} b ON f.branch_id = b.id
          left join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
          ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE  loan_id = l.id AND id  ORDER BY id LIMIT 1)
          WHERE 
           completion_status = 1 
          AND 
          l.status = 1
          AND
          s.interest_second
          AND
          l.interest
          AND
          DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND
          l.id GROUP BY l.id 
          )
          UNION ALL
          (
            SELECT
              l.loan_purpose,
              l.statements,
              l.reference,
              IFNULL(s.debt_collection,0) debt_collection,
              IFNULL((l.total_amount * 0.075),0) interest,
              IFNULL(s.interest_second,0) interest_second,
              IFNULL(s.interest_third,0) interest_third,
              ROUND(((l.total_amount)  + IFNULL(l.insurance_fee,0) + IFNULL(l.total_interest,0)),2) expected_amount,

              ROUND(((l.total_amount) +   IFNULL(s.interest_second,0) + IFNULL(s.interest_third,0) +  (IFNULL((l.total_amount * 0.075),0)) + IFNULL(l.insurance_fee,0) + IFNULL((s.debt_collection),0) + l.total_interest) - (l.monthly_instalment_second + l.debt_collection + l.monthly_instalment_third + l.monthly_instalment + l.interest + l.interest_second + l.interest_third +  l.insurance_instalment_second + l.insurance_instalment_third +  l.insurance_installment + l.rollover_fee),2) paid_amount,          

              l.last_updated_on,
              l.farmer_id,
              l.created_on,
              l.due_date,
                  f.name, f.id, f.latitude, 
                  f.passport_photo,f.id_no,f.longitude, f.msisdn, u.name field_officer, 
                  DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, b.branch_name
                  FROM ${TABLE.LOAN} l 
                  inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
                  left join ${TABLE.USERS} u ON f.user_id = u.id
                  left join ${TABLE.BRANCHES} b ON f.branch_id = b.id
                  left join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
                  ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE  loan_id = l.id AND id  ORDER BY id LIMIT 1)
                  WHERE 
                   completion_status = 1 
                  AND 
                  l.status = 1
                  AND
                  l.interest
                  AND
                  DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND
                  l.id GROUP BY l.id 
                  )

                  UNION ALL

                  (
                    SELECT
                      l.loan_purpose,
                      l.statements,
                      l.reference,
                      IFNULL(s.debt_collection,0) debt_collection,
                      IFNULL((l.total_amount * 0.075),0) interest,
                      IFNULL(s.interest_second,0) interest_second,
                      IFNULL(s.interest_third,0) interest_third,
                      ROUND(((l.total_amount)  + IFNULL(l.insurance_fee,0) + IFNULL(l.total_interest,0)),2) expected_amount,
                      ROUND(((l.total_amount) +   IFNULL(s.interest_second,0) + IFNULL(s.interest_third,0) +  (IFNULL((l.total_amount * 0.075),0)) + IFNULL(l.insurance_fee,0) + IFNULL((s.debt_collection),0) + l.total_interest) - (l.monthly_instalment_second + l.debt_collection + l.monthly_instalment_third + l.monthly_instalment + l.interest + l.interest_second + l.interest_third +  l.insurance_instalment_second + l.insurance_instalment_third +  l.insurance_installment + l.rollover_fee),2) paid_amount,          

                      l.last_updated_on,
                      l.farmer_id,
                      l.created_on,
                      l.due_date,
                          f.name, f.id, f.latitude, 
                          f.passport_photo,f.id_no,f.longitude, f.msisdn, u.name field_officer, 
                          DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, b.branch_name
                          FROM ${TABLE.LOAN} l 
                          inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
                          left join ${TABLE.USERS} u ON f.user_id = u.id
                          left join ${TABLE.BRANCHES} b ON f.branch_id = b.id
                          left join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
                          ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE  loan_id = l.id AND id  ORDER BY id LIMIT 1)
                          WHERE 
                           completion_status = 1 
                          AND 
                          l.status = 1
                          AND
                          s.interest_third
                          AND
                          l.interest
                          AND
                          DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND
                          l.id GROUP BY l.id 
                  )
                  UNION ALL
                  (
                    SELECT
                      l.loan_purpose,
                      l.statements,
                      l.reference,
                      IFNULL(s.debt_collection,0) debt_collection,
                      IFNULL((l.total_amount * 0.075),0) interest,
                      IFNULL(s.interest_second,0) interest_second,
                      IFNULL(s.interest_third,0) interest_third,
                      ROUND(((l.total_amount)  + IFNULL(l.insurance_fee,0) + IFNULL(l.total_interest,0)),2) expected_amount,
                      ROUND(((l.total_amount) +   IFNULL(s.interest_second,0) + IFNULL(s.interest_third,0) +  (IFNULL((l.total_amount * 0.075),0)) + IFNULL(l.insurance_fee,0) + IFNULL((s.debt_collection),0) + l.total_interest) - (l.monthly_instalment_second + l.debt_collection + l.monthly_instalment_third + l.monthly_instalment + l.interest + l.interest_second + l.interest_third +  l.insurance_instalment_second + l.insurance_instalment_third +  l.insurance_installment + l.rollover_fee),2) paid_amount,          

                      l.last_updated_on,
                      l.farmer_id,
                      l.created_on,
                      l.due_date,
                          f.name, f.id, f.latitude, 
                          f.passport_photo,f.id_no,f.longitude, f.msisdn, u.name field_officer, 
                          DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, b.branch_name
                          FROM ${TABLE.LOAN} l 
                          inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
                          left join ${TABLE.USERS} u ON f.user_id = u.id
                          left join ${TABLE.BRANCHES} b ON f.branch_id = b.id
                          left join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
                          ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE  loan_id = l.id AND id  ORDER BY id LIMIT 1)
                          WHERE 
                           completion_status = 1 
                          AND 
                          l.status = 1
                          AND
                          s.debt_collection
                          AND
                          l.interest
                          AND
                          DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND
                          l.id GROUP BY l.id 
                  )
          ) AS r
        `,
    );

    return query;
  },

  getGlobalReportFilter: async ({ startDate, filter_value, endDate, page_size, offset }: Loan) => {
    const query = await client.query(
      `SELECT
          l.loan_purpose,
    l.statements,
    l.reference,
    ROUND(((l.total_amount) + (s.interest_third) + (s.interest_second) +  (s.interest) + IFNULL((s.debt_collection),0)  + IFNULL(l.insurance_fee,0) + IFNULL(l.total_interest,0)),2) expected_amount, 
    ROUND(((l.total_amount) + (s.interest_second) + (s.interest_third) +  (s.interest) + IFNULL(l.insurance_fee,0) + IFNULL((s.debt_collection),0) + l.total_interest) - (l.monthly_instalment_second + l.debt_collection + l.monthly_instalment_third + l.monthly_instalment + l.interest + l.interest_second + l.interest_third +  l.insurance_instalment_second + l.insurance_instalment_third +  l.insurance_installment + l.rollover_fee),2) paid_amount,          
    l.last_updated_on,
    l.farmer_id,
    l.created_on,
    l.due_date,
          f.name, f.id, f.latitude, 
          f.passport_photo,f.id_no,f.longitude, f.msisdn, u.name field_officer, 
          DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, b.branch_name FROM ${TABLE.LOAN} l 
          inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
          left join ${TABLE.USERS} u ON f.user_id = u.id
          left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
          inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
          ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 5 AND loan_id = l.id AND id  ORDER BY id LIMIT 1)
      
          WHERE 
           completion_status = 1 
          AND 
          l.status = 1
          AND
          b.branch_name LIKE '%${filter_value}%' AND
          l.interest
          AND
          DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND
          l.id GROUP BY l.id  ORDER BY l.id DESC`,
    );

    return query;
  },

  getDebtGlobalNumber: async ({ startDate, endDate }: Loan) => {
    const [query] = await client.query(
      `
          SELECT COUNT(l.id) count, 
         
          ROUND(SUM(l.total_amount),2) expected_principal, 
         
          ROUND(SUM(l.monthly_instalment_second +  l.monthly_instalment_third + l.monthly_instalment), 2) paid_principal,
          
          ROUND(SUM((s.interest_third) + (s.interest_second) +  (s.interest)),2) expected_interest,
          
          ROUND(SUM(l.interest + l.interest_second + l.interest_third), 2) paid_interest,
          
          ROUND(SUM(l.insurance_fee),2) expected_insurance,
          
          ROUND(SUM(l.insurance_instalment_second + l.insurance_instalment_third +  l.insurance_installment), 2) paid_insurance, 
  
          ROUND(SUM(l.total_interest) , 2) total_rollver,
          
          ROUND(SUM(l.rollover_fee), 2) paid_rollver,

          ROUND(SUM(s.debt_collection), 2) total_debt_collection,
     
        ROUND(SUM(l.debt_collection), 2) paid_debt_collection 
          
          FROM ${TABLE.LOAN} l 
          inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
          left join ${TABLE.USERS} u ON f.user_id = u.id
          left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
          inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
          ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 5 AND loan_id = l.id AND id  ORDER BY id LIMIT 1)
      
          WHERE 
          l.completion_status = 1 
          AND 
          l.status =1
          AND
          DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate}
        `,
    );
    return query;
  },


  getDebtGlobalNumberFilter: async ({ startDate, filter_value, endDate }: Loan) => {
    const [query] = await client.query(
      `
          SELECT COUNT(l.id) count, 
         
          ROUND(SUM(l.total_amount),2) expected_principal, 
         
          ROUND(SUM(l.monthly_instalment_second +  l.monthly_instalment_third + l.monthly_instalment), 2) paid_principal,
      
          ROUND(SUM((s.interest_third) + (s.interest_second) +  (s.interest)),2) expected_interest,
          
          ROUND(SUM(l.interest + l.interest_second + l.interest_third), 2) paid_interest,
          
          ROUND(SUM(l.insurance_fee),2) expected_insurance,
          
          ROUND(SUM(l.insurance_instalment_second + l.insurance_instalment_third +  l.insurance_installment), 2) paid_insurance, 
  
          ROUND(SUM(l.total_interest) , 2) total_rollver,
          
          ROUND(SUM(l.rollover_fee), 2) paid_rollver,
  

          ROUND(SUM(s.debt_collection), 2) total_debt_collection,
     
        ROUND(SUM(l.debt_collection), 2) paid_debt_collection 
          
          FROM ${TABLE.LOAN} l 
          inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
          left join ${TABLE.USERS} u ON f.user_id = u.id
          left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
          inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
          ( SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = 5 AND loan_id = l.id AND id  ORDER BY id LIMIT 1)
      
          WHERE 
          l.completion_status = 1 
          AND 
          b.branch_name LIKE '%${filter_value}%' AND
          l.status =1
          AND
          DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate}
        `,
    );
    return query;
  },








  //Unmatured 
  getUnmaturedLoan: async ({ startDate, lock_period, period, endDate, page_size, offset }: Loan) => {
    const query = await client.query(
      `SELECT
l.total_amount,
l.amount_disbursed,
l.insurance_fee,
l.gross_income,
l.principal_balance,
l.interest,
ROUND( (DATEDIFF(DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(due_date, '%Y-%m-%d'))) * ((l.total_interest)/30),2) expected_rollover,
s.interest expected_interest_first,
s.interest_second expected_interest_second,
s.interest_third expected_interest_third,
l.insurance_installment,
l.monthly_instalment,
l.monthly_instalment_third,
l.insurance_instalment_third,
l.interest_third,
l.reference,
l.monthly_instalment_second,
l.insurance_instalment_second,
l.interest_second,
l.debt_collection,
((l.monthly_instalment_second +  l.monthly_instalment_third + l.monthly_instalment + l.insurance_instalment_second + l.insurance_instalment_third +   l.insurance_installment + l.interest + l.interest_second + l.interest_third + l.total_interest) * 0.25) expected_debt_collection,
DATEDIFF(DATE_FORMAT(l.due_date, '%Y-%m-%d'), DATE_FORMAT(NOW(), '%Y-%m-%d')) days,
l.rollover_fee,
l.insurance_balance,
l.total_interest,
l.farmer_id,
l.paid_amount,
l.created_on,
l.due_date,
      f.name, f.id, f.latitude, 
      f.passport_photo,f.id_no,f.longitude, f.msisdn, u.name field_officer, 
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, b.branch_name 
      FROM ${TABLE.LOAN} l 
      inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
      left join ${TABLE.USERS} u ON f.user_id = u.id
      left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
      inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
      (SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = ${period} AND loan_id = l.id AND id  ORDER BY id LIMIT 1)
      WHERE 
       completion_status = 1 
       AND 
      l.status =1
      AND l.status_paid = 0
      AND 
      s.period = ${period}
      AND
      
      l.lock_period = ${lock_period} AND
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND
      l.id  GROUP BY l.id,f.id  ORDER BY l.id DESC LIMIT ${offset}, ${page_size}  `,
    );
    return query;
  },


  //Unmatured 
  getUnmaturedLoanBranch: async ({ startDate, user_id, lock_period, period, endDate, page_size, offset }: Loan) => {
    const query = await client.query(
      `SELECT
l.total_amount,
l.amount_disbursed,
l.insurance_fee,
l.gross_income,
l.principal_balance,
l.interest,
ROUND( (DATEDIFF(DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(due_date, '%Y-%m-%d'))) * ((l.total_interest)/30),2) expected_rollover,
s.interest expected_interest_first,
s.interest_second expected_interest_second,
s.interest_third expected_interest_third,
l.insurance_installment,
l.monthly_instalment,
l.monthly_instalment_third,
l.insurance_instalment_third,
l.interest_third,
l.reference,
l.monthly_instalment_second,
l.insurance_instalment_second,
l.interest_second,
l.debt_collection,
((l.monthly_instalment_second +  l.monthly_instalment_third + l.monthly_instalment + l.insurance_instalment_second + l.insurance_instalment_third +   l.insurance_installment + l.interest + l.interest_second + l.interest_third + l.total_interest) * 0.25) expected_debt_collection,
DATEDIFF(DATE_FORMAT(l.due_date, '%Y-%m-%d'), DATE_FORMAT(NOW(), '%Y-%m-%d')) days,
l.rollover_fee,
l.insurance_balance,
l.total_interest,
l.farmer_id,
l.paid_amount,
l.created_on,
l.due_date,
      f.name, f.id, f.latitude, 
      f.passport_photo,f.id_no,f.longitude, f.msisdn, u.name field_officer, 
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date,
       b.branch_name 
      FROM ${TABLE.LOAN} l 
      inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
      left join ${TABLE.USERS} u ON f.user_id = u.id
      left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
      inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
      (SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = ${period} AND loan_id = l.id AND id  ORDER BY id LIMIT 1)
      WHERE 
      u.branch_id = (SELECT branch_id FROM ${TABLE.USERS} WHERE id = ${user_id})
     AND
       completion_status = 1 
       AND 
      l.status =1
      AND l.status_paid = 0
      AND 
      s.period = ${period}
      AND
     
      l.lock_period = ${lock_period} AND
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND
      l.id  GROUP BY l.id,f.id  ORDER BY l.id DESC LIMIT ${offset}, ${page_size}  `,
    );
    return query;
  },


  getUnmaturedLoanTotal: async ({ startDate, lock_period, period, endDate }: Loan) => {
    const [query] = await client.query(
      `SELECT COUNT(l.id) count
          FROM ${TABLE.LOAN} l 
          WHERE 
          completion_status = 1 
          AND 
          l.status =1
          AND     
          l.lock_period = ${lock_period} AND
          DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND
          l.id`,
    );

    return query;
  },


  getUnmaturedLoanFilter: async ({ startDate, filter_value, lock_period, period, endDate, page_size, offset }: Loan) => {
    const query = await client.query(
      `SELECT
l.total_amount,
l.amount_disbursed,
l.insurance_fee,
l.gross_income,
l.principal_balance,
l.interest,
ROUND( (DATEDIFF(DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(due_date, '%Y-%m-%d'))) * ((l.total_interest)/30),2) expected_rollover,
s.interest expected_interest_first,
s.interest_second expected_interest_second,
s.interest_third expected_interest_third,
l.insurance_installment,
l.monthly_instalment,
l.monthly_instalment_third,
l.insurance_instalment_third,
l.interest_third,
l.reference,
s.debt_collection expected_debt_collection,
l.monthly_instalment_second,
l.insurance_instalment_second,
l.interest_second,
l.debt_collection,
((l.monthly_instalment_second +  l.monthly_instalment_third + l.monthly_instalment + l.insurance_instalment_second + l.insurance_instalment_third +   l.insurance_installment + l.interest + l.interest_second + l.interest_third + l.total_interest) * 0.25) expected_debt_collection,
DATEDIFF(DATE_FORMAT(l.due_date, '%Y-%m-%d'), DATE_FORMAT(NOW(), '%Y-%m-%d')) days,
l.rollover_fee,
l.insurance_balance,
l.total_interest,
l.farmer_id,
l.paid_amount,
l.created_on,
l.due_date,
      f.name, f.id, f.latitude, 
      f.passport_photo,f.id_no,f.longitude, f.msisdn, u.name field_officer, 
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') start_date, b.branch_name 
      FROM ${TABLE.LOAN} l 
      inner join ${TABLE.FARMER} f ON l.farmer_id = f.id
      left join ${TABLE.USERS} u ON f.user_id = u.id
      left join ${TABLE.BRANCHES} b ON u.branch_id = b.id
      inner join  ${TABLE.LOAN_STATEMENT} s ON s.loan_id = 
      (SELECT loan_id FROM ${TABLE.LOAN_STATEMENT} WHERE period = ${period} AND loan_id = l.id AND id  ORDER BY id LIMIT 1)
      WHERE 
       completion_status = 1 
       AND 
      l.status =1
      AND l.status_paid = 0
      AND
      s.period = ${period}
      AND
     
      l.lock_period = ${lock_period} AND
      b.branch_name LIKE '%${filter_value}%' AND
      DATE_FORMAT(DATE_SUB(l.due_date, INTERVAL 90 DAY), '%Y-%m-%d') BETWEEN ${startDate} AND ${endDate} AND
      l.id  GROUP BY l.id,f.id  ORDER BY l.id DESC LIMIT ${offset}, ${page_size}  `,
    );
    return query;
  },




  getLoanStatementLogs: async ({ loan_id }: Loan) => {
    const query = await client.query(
      `SELECT s.credit,
      (s.monthly_instalment_third + s.monthly_instalment + 
        s.monthly_instalment_second + s.insurance_instalment_second + 
        s.insurance_instalment_third + s.interest + s.interest_second + 
        s.interest_third + s.insurance_fee + 
        s.rollover_fee + s.debt_collection) as total,
      s.narrative,
      f.name,
      s.id,
      s.created_on,
      s.loan_id,
      s.farmer_id,
      f.id_no 
from ${TABLE.LOAN_STATEMENT} s 
left join  
${TABLE.FARMER} f 
on s.farmer_id = f.id
WHERE
s.farmer_id =${loan_id} AND s.id  GROUP BY s.id`,
    );
    return query;
  },

  getLoanDeposits: async ({ offset, page_size, loan_id }: Loan) => {
    const query = await client.query(
      `SELECT f.id, f.name, w.transaction_id, w.amount, w.created_on 
      from ngombe_loan.transactions_deposits w 
      left join ngombe_loan.farmers_details f 
      on f.id_no = w.user_id_no WHERE f.id = ${loan_id} ORDER BY id DESC LIMIT ${offset}, ${page_size}`,
    );
    return query;
  },

  getDepositsCounts: async ({ loan_id }: Loan) => {
    const [query] = await client.query(
      `SELECT COUNT(w.id) count 
      from ngombe_loan.transactions_deposits w 
      left join ngombe_loan.farmers_details f 
      on f.id_no = w.user_id_no WHERE f.id = ${loan_id}`,
    );
    return query;
  },

  getLoanWithdrawalDeposits: async ({ offset, page_size, loan_id }: Loan) => {
    const query = await client.query(
      `SELECT f.id, f.name, w.transaction_id, w.working_balance amount, w.created_on 
      from ${TABLE.WITHDRAWAL_ARCHIVES} w 
      left join ngombe_loan.farmers_details f 
      on f.msisdn = w.name WHERE f.id = ${loan_id} ORDER BY id DESC LIMIT ${offset}, ${page_size}`,
    );
    return query;
  },

  getWithdrawalDepositsCounts: async ({ loan_id }: Loan) => {
    const [query] = await client.query(
      `SELECT COUNT(w.id) count
      from ${TABLE.WITHDRAWAL_ARCHIVES} w 
      left join ${TABLE.FARMER} f 
      on f.msisdn = w.name WHERE f.id = ${loan_id}`,
    );
    return query;
  },


};
