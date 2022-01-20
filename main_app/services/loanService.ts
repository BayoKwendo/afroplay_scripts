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



  insertIntoStatements: async (
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
      `SELECT * FROM  ${TABLE.GUARANTORS} WHERE loan_reference = "${reference}"`,
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


  //update principal
  updateLoanPayment: async (
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

  updateLoanPay: async (
    { id }: Loan,
  ) => {
    const query = await client.query(
      `UPDATE  ${TABLE.LOAN} SET 
			 status_paid = 1, completion_status = 2
       WHERE id =${id}`,
    );
    return query;
  },

  //update principal
  getFarmerNo: async ({ id }: Loan) => {
    const query = await client.query(
      `SELECT f.name, f.msisdn, f.user_id  FROM ngombe_loan.farmers_details f WHERE f.id =${id} `,
    );
    return query;
  },

 
  //update loan officer
  getLoanNo: async ({ id }: Loan) => {
    const query = await client.query(
      `SELECT name, msisdn  FROM users 
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

};
