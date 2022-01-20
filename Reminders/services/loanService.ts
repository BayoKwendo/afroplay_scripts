import client from "../db/client.ts";
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

  //update loan status
  updateLoanStatus: async ({ id, status }: Loan) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LIVESTOCK} SET 
	    	loan_status = ${status}
        WHERE id =${id}`,
    );
    return query;
  },

  //get loan reference
  getLoanReference: async ({ id }: Loan) => {
    const [query] = await client.query(
      `SELECT IF(COUNT(reference) > 0, reference, 0) reference FROM  ${TABLE.LOAN} WHERE livestock_id =${id} ORDER BY id DESC LIMIT 1`,
    );
    return query.reference;
  },




  //get loan reference
  getLoanLastInsertedStatement: async ({ loan_id }: Loan) => {
    const query = await client.query(
      `SELECT * FROM  ${TABLE.LOAN_STATEMENT} WHERE id AND loan_id =${loan_id} ORDER BY id DESC LIMIT 1`,
    );
    return query;
  },



  insertIntoStatements: async (
    { credit,
      debit,
      interest,
      balance,
      debt_collection,
      rollover_fee,
      insurance_fee,
      monthly_instalment,
      monthly_instalment_second,
      monthly_instalment_third,
      insurance_instalment_second,
      insurance_instalment_third,
      interest_second,
      interest_third,
      insurance_balance,
      narrative,
      loan_id,
      farmer_id,
      period }: Loan,
  ) => {
    const query = await client.query(
      `INSERT INTO ${TABLE.LOAN_STATEMENT} SET 
			 credit=${credit},
			 debit=${debit},
			 interest=${interest},
			 balance=${balance}, 
       debt_collection=${debt_collection},
       rollover_fee=${rollover_fee},
       insurance_fee=${insurance_fee},
       monthly_instalment = ${monthly_instalment},
       monthly_instalment_second = ${monthly_instalment_second},
       monthly_instalment_third = ${monthly_instalment_third},
       insurance_instalment_second = ${insurance_instalment_second},
       insurance_instalment_third =${insurance_instalment_third} ,
       interest_second = ${interest_second},
       interest_third = ${interest_third},     
       insurance_balance=${insurance_balance},
       narrative="${narrative}",
			 loan_id=${loan_id},
			 farmer_id=${farmer_id},
       period= ${period}`,
      [
        credit,
        debit,
        interest,
        balance,
        insurance_fee,
        monthly_instalment,
        monthly_instalment_second,
        monthly_instalment_third,
        insurance_instalment_second,
        insurance_instalment_third,
        interest_second,
        interest_third,
        insurance_balance,
        narrative,
        loan_id,
        farmer_id,
        period
      ]
    );
    return query;
  },
  //update loan status
  updateLoanPrincipal: async ({ id, filter_value }: Loan) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
			paid_amount = paid_amount + ${filter_value} 
            WHERE livestock_id =${id} AND status_paid = 0`,
    );
    return query;
  },

  //update loan status
  getLoanLoanStatus: async () => {
    const query = await client.query(
      `SELECT * FROM  ${TABLE.LOAN} WHERE status_paid = 0 and 
      period_three = 0 AND completion_status =1 AND status =1 ORDER BY id DESC lIMIT 1`,
    );
    return query;
  },


  //update loan statusgetLoa
  getLoanLoanGuarantor: async ({ reference }: Loan) => {
    const query = await client.query(
      `SELECT name, guarantor_msisdn FROM  ${TABLE.GUARANTORS} WHERE loan_reference = "${reference}"`,
    );
    return query;
  },

  //update loan status
  getLoanLoanReminder: async () => {
    const query = await client.query(
      `SELECT * FROM  ${TABLE.LOAN} WHERE status_paid = 0 AND reminder_lock = 0 AND completion_status =1 AND status =1 ORDER BY id DESC lIMIT 1`,
    );
    return query;
  },



  //update loan status
  getLoanGuarantor: async () => {
    const query = await client.query(
      `SELECT * FROM  ${TABLE.GUARANTORS} WHERE status_paid = 0 AND reminder_lock = 0 AND completion_status =1 AND status =1 ORDER BY id DESC lIMIT 1`,
    );
    return query;
  },




  //update loan status
  getLoanLoanDefaulters: async () => {
    const query = await client.query(
      `SELECT * FROM  ${TABLE.LOAN} WHERE status_paid = 0 AND defaulted = 0 ORDER BY id DESC lIMIT 1`,
    );
    return query;
  },

  //update loan status
  getLoanLoanDefaulters_Two: async () => {
    const query = await client.query(
      `SELECT * FROM  ${TABLE.LOAN} WHERE status_paid = 0 AND defaulter_reminder = 1 OR defaulter_reminder = 0 ORDER BY id DESC lIMIT 1`,
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
    { id, amount, interest, check_amount, period_three }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
			period_three = ${period_three},
      check_amount = ${check_amount},
      interest_second = ${interest}
      WHERE id =${id} AND status_paid = 0`,
    );
    return query;
  },


  //update interest third month
  updateLoanPayment_Third: async (
    { id, amount, interest, check_amount, period_three }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
			period_three = ${period_three},
      check_amount = ${check_amount},
      interest_third = ${interest}
      WHERE id =${id} AND status_paid = 0`,
    );
    return query;
  },


  //update debt collection
  updateLoanPaymentDebtCollection: async (
    { id, amount, interest, check_amount, period_three }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
    period_three = ${period_three},
    check_amount = ${check_amount},
    debt_collection = ${interest}
    WHERE id =${id} AND status_paid = 0`,
    );
    return query;
  },


  //update loan status
  updateLockPeriod: async ({ id, filter_value }: Loan) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
			lock_period = ${filter_value} 
            WHERE id =${id}`,
    );
    return query;
  },



  //update principal
  updateLoanReminderMessage: async (
    { id, period_three }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
			reminder_status = ${period_three}
            WHERE id =${id} AND status_paid = 0`,
    );
    return query;
  },

  //update principal
  updateLoanReminderLock: async (
    { id }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
       reminder_lock =1
       WHERE id =${id} AND status_paid = 0`,
    );
    return query;
  },


  updateLoanLock: async (
    { id }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
			status_paid = 3
            WHERE id =${id}`,
    );
    return query;
  },


  //update principal
  updateLoanInterestDefaulting: async (
    { id, amount, interest, total_interest, reminder, period_three }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
      interest = ${interest},
      total_interest = ${total_interest},
      principal_balance = ${amount}
      WHERE id =${id}`,
    );
    return query;
  },

  //update principal
  updateLoan1stInstallment: async (
    { id, amount, interest, check_amount, total_interest, period_three }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
			period_three = ${period_three},
      check_amount = ${check_amount},
      total_interest = ${total_interest},
			rollover_fee = ${interest}
      WHERE id =${id} AND status_paid = 0`,
    );
    return query;
  },



  //insert principal
  updateLoanIsntall: async (
    { id, amount, interest, check_amount, total_interest, period_three }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
      check_amount = ${check_amount},
      total_interest = ${total_interest},
			principal_balance = ${amount},
			interest = ${interest}
      WHERE id =${id} AND status_paid = 0`,
    );
    return query;
  },


  //update principal
  updateLoanReminder: async (
    { id, amount, interest, check_amount, reminder, period_three }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
		  reminder = ${reminder}
            WHERE id =${id}`,
    );
    return query;
  },

  //update principal
  updateLoanInterest: async (
    { id, amount, interest, check_amount, reminder, period_three }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
      interest = ${interest},
      principal_balance = ${amount}
      WHERE id =${id}`,
    );
    return query;
  },

  //update principal
  updateCheckAmount: async (
    { id, amount }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
      check_amount = ${amount},
      period_three = 0
    WHERE id =${id}`,
    );
    return query;
  },


  //update defaulted wallet
  updateLoanPaymentDefaulted: async (
    { id, amount,
      interest,
      interest_second,
      interest_third,
      check_amount,
      insurance_balance,
      monthly_instalment,
      monthly_instalment_second,
      monthly_instalment_third,
      debt_collection,
      rollover_fee,
      insurance_installment,
      insurance_instalment_second,
      insurance_instalment_third,
      reminder, period_three }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
			period_three = ${period_three},
      check_amount = ${check_amount},
      insurance_balance = ${insurance_balance},
      monthly_instalment = ${monthly_instalment},
      monthly_instalment_second = ${monthly_instalment_second},
      monthly_instalment_third = ${monthly_instalment_third},
      debt_collection = ${debt_collection},
      rollover_fee = ${rollover_fee},   
      insurance_installment = ${insurance_installment},
      insurance_instalment_second = ${insurance_instalment_second},
      insurance_instalment_third = ${insurance_instalment_third},
			principal_balance = ${amount},
      interest_second = ${interest_second},
      interest_third = ${interest_third},
			interest = ${interest}
      WHERE id =${id} AND status_paid = 0`,
    );
    return query;
  },


  insertIntoStatementsFromWllet: async (  // defaulted from the wallert
    { credit, debit, interest,
      balance,
      insurance_fee,
      monthly_instalment,
      monthly_instalment_second,
      monthly_instalment_third,
      insurance_instalment_second,
      insurance_instalment_third,
      interest_second,
      rollover_fee,
      debt_collection,
      interest_third,
      insurance_balance, narrative, loan_id, farmer_id, period }: Loan,
  ) => {
    const query = await client.query(
      `INSERT INTO ${TABLE.LOAN_STATEMENT} SET 
			 credit=${credit},
			 debit=${debit},
			 interest=${interest},
			 balance=${balance}, 
       insurance_fee=${insurance_fee},
       monthly_instalment = ${monthly_instalment},
       monthly_instalment_second = ${monthly_instalment_second},
       monthly_instalment_third = ${monthly_instalment_third},
       insurance_instalment_second = ${insurance_instalment_second},
       insurance_instalment_third =${insurance_instalment_third} ,
       interest_second = ${interest_second},
       interest_third = ${interest_third}, 
       debt_collection = ${debt_collection},
       rollover_fee = ${rollover_fee},   
       insurance_balance=${insurance_balance},
       narrative="${narrative}",
			 loan_id=${loan_id},
			 farmer_id=${farmer_id},
       period= ${period}`,
      [
        credit,
        debit,
        interest,
        balance,
        insurance_fee,
        monthly_instalment,
        monthly_instalment_second,
        monthly_instalment_third,
        insurance_instalment_second,
        insurance_instalment_third,
        interest_second,
        interest_third,
        insurance_balance,
        narrative,
        loan_id,
        farmer_id,
        period
      ]
    );
    return query;
  },


  //update checkout
  updateLoanCheckOut: async (
    { id, check_amount }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
      check_amount = ${check_amount}
      WHERE id =${id}`,
    );
    return query;
  },

  //update principal
  updateLoanDefaultReminder: async (
    { id, reminder, default_reminder }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
		  reminder = ${reminder},
      defaulted = 1,
      defaulter_reminder = ${default_reminder}
            WHERE id =${id}`,
    );
    return query;
  },

  //update principal
  updateLoanDefaultAuction: async (
    { id, reminder, default_reminder }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
		  defaulted = 1
            WHERE id =${id}`,
    );
    return query;
  },

  updateLoanPay: async (
    { id }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
			status_paid = 1
            WHERE id =${id}`,
    );
    return query;
  },

  //update principal
  getFarmerNo: async ({ id }: Loan) => {
    const query = await client.query(
      `SELECT name, msisdn, id, user_id, wallet_balance, id_no  FROM ${TABLE.FARMER} 
            WHERE id =${id} `,
    );
    return query;
  },

  //update period
  updateLoan: async ({ id }: Loan) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET period_three = 1
			WHERE id =${id} `,
    );
    return query;
  },

  //update period
  updateDefaulted: async ({ id }: Loan) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET period_three = 1, defaulted = 1
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
};
