import { Application, HttpServerNative } from "https://deno.land/x/oak/mod.ts";

import { green, yellow } from "https://deno.land/std/fmt/colors.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import loanService from "./services/loanService.ts";
import farmerService from "./services/farmerService.ts";

import { cron, start, stop, every15Minute, everyMinute, daily, weekly } from 'https://deno.land/x/deno_cron/cron.ts';
import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";
import { SMS, SMS_BaseUrl, formatter, SMS_BaseUrl_Officer, CONFIG } from "./db/config.ts";
import axiod from 'https://deno.land/x/axiod/mod.ts';

const app = new Application({
  serverConstructor: HttpServerNative
});

const port = 3218;
app.use(
  oakCors({
    origin: "*",
    maxAge: 8640033
  }),
);

// cron job

everyMinute(async () => {
  stop()
  // console.log(green("Cron job started"));
  const invoice_no = await loanService.getLoanLoanReminder();  // check any request

  if (invoice_no.length > 0) {  // condition to check if the there is any pending request to be processed
    const farmer = await loanService.getFarmerNo(
      {
        id: invoice_no[0].farmer_id,
      });
    const diffInDays = moment(invoice_no[0].due_date).diff(moment(Date.now()), 'days'); // get difference in days
    console.log(diffInDays);

    let total_loan_balance = (invoice_no[0].monthly_instalment +
      invoice_no[0].monthly_instalment_second +
      invoice_no[0].monthly_instalment_third +
      invoice_no[0].interest +
      invoice_no[0].interest_second +
      invoice_no[0].interest_third +
      invoice_no[0].insurance_installment +
      invoice_no[0].insurance_instalment_second +
      invoice_no[0].insurance_instalment_third + invoice_no[0].rollover_fee + invoice_no[0].debt_collection);
    const loan_due_fisrt_installation = moment(new Date(Date.now()).setDate(new Date(Date.now()).getDate() + 2)).format('YYYY-MM-DD HH:mm:ss');

    // console.log(invoice_no[0].lock_period)
    if (diffInDays == 59 && invoice_no[0].lock_period == 0) {


      let interest = 0; // calculate interest
      let principal = invoice_no[0].principal_balance; // condition to check if the amount is greater than interest
      let mreminder = 2;

      interest = 0.075 * (invoice_no[0].principal_balance); // calculate interest
      // let check_instalment = ((invoice_no[0].monthly_instalment + (invoice_no[0].interest) + (invoice_no[0].insurance_installment)) - (invoice_no[0].check_amount - (invoice_no[0].interest + invoice_no[0].insurance_installment)))

      const statement = await loanService.getLoanLastInsertedStatement({
        loan_id: invoice_no[0].id
      });

      console.log(statement)

      console.log(`First month instalment loan id${invoice_no[0].id} `);

      await loanService.insertIntoStatements({
        credit: invoice_no[0].check_amount,
        debit: statement[0].debit,
        interest: statement[0].interest,
        balance: statement[0].balance,
        insurance_fee: statement[0].insurance_fee,
        insurance_balance: statement[0].insurance_balance,

        debt_collection: statement[0].debt_collection,
        rollover_fee: statement[0].rollover_fee,

        insurance_instalment_second: statement[0].insurance_instalment_second,
        insurance_instalment_third: statement[0].insurance_instalment_third,

        monthly_instalment: statement[0].monthly_instalment,
        monthly_instalment_second: statement[0].monthly_instalment_second,
        monthly_instalment_third: statement[0].monthly_instalment_third,

        interest_second: interest,
        interest_third: statement[0].interest_third,

        narrative: `Begin of Second Month`,
        loan_id: invoice_no[0].id,
        farmer_id: invoice_no[0].farmer_id,
        period: 2
      });

      await loanService.updateLoanReminder(  // update reminder
        {
          id: invoice_no[0].id,
          reminder: mreminder
        });


      await loanService.updateLoanPayment(
        {
          id: invoice_no[0].id,
          amount: principal,
          interest: interest,
          check_amount: 0,
          period_three: 1
        })
      await loanService.updateLockPeriod(
        {
          id: invoice_no[0].id,
          filter_value: 2
        });
      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });
    }


    else if (diffInDays == 29 && invoice_no[0].lock_period == 2) {


      let interest = 0; // calculate interest
      let principal = invoice_no[0].principal_balance; // condition to check if the amount is greater than interest
      let mreminder = 3;

      interest = 0.075 * (invoice_no[0].principal_balance); // calculate interest
      // let check_instalment = ((invoice_no[0].monthly_instalment + (invoice_no[0].interest) + (invoice_no[0].insurance_installment)) - (invoice_no[0].check_amount - (invoice_no[0].interest + invoice_no[0].insurance_installment)))

      const statement = await loanService.getLoanLastInsertedStatement({
        loan_id: invoice_no[0].id
      });
      // console.log(statement)
      console.log(`Second month instalment loan id${invoice_no[0].id} `);

      await loanService.insertIntoStatements({
        credit: invoice_no[0].check_amount,
        debit: statement[0].debit,
        interest: statement[0].interest,
        balance: statement[0].balance,
        insurance_fee: statement[0].insurance_fee,
        insurance_balance: statement[0].insurance_balance,

        debt_collection: statement[0].debt_collection,
        rollover_fee: statement[0].rollover_fee,

        insurance_instalment_second: statement[0].insurance_instalment_second,
        insurance_instalment_third: statement[0].insurance_instalment_third,

        monthly_instalment: statement[0].monthly_instalment,
        monthly_instalment_second: statement[0].monthly_instalment_second,
        monthly_instalment_third: statement[0].monthly_instalment_third,

        interest_second: statement[0].interest_second,

        interest_third: interest,

        narrative: `Begin of Third Month`,
        loan_id: invoice_no[0].id,
        farmer_id: invoice_no[0].farmer_id,
        period: 3
      });

      await loanService.updateLoanReminder(  // update reminder
        {
          id: invoice_no[0].id,
          reminder: mreminder
        });


      await loanService.updateLoanPayment_Third(
        {
          id: invoice_no[0].id,
          amount: principal,
          interest: interest,
          check_amount: 0,
          period_three: 1
        })
      await loanService.updateLockPeriod(
        {
          id: invoice_no[0].id,
          filter_value: 4
        });
      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });
    }

    else if (diffInDays == -31 && invoice_no[0].lock_period == 6) {

      await loanService.updateLockPeriod(
        {
          id: invoice_no[0].id,
          filter_value: 8
        });

      let interest = 0.25 * (total_loan_balance); // calculate interest
      // let principal = total_loan_balance; // condition to check if the amount is greater than interest
      const text = `Dear ${farmer[0].name}, ${formatter.format(interest)} has been charged on your loan balance as penalty, your new loan balance is ${formatter.format(total_loan_balance + interest)}. Kindly pay to avoid forceful recovery.\nHelp desk 0748320516`;



      let formData = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": text,
        "user_id": farmer[0].user_id
      }

      const mobi_text = `, ${formatter.format(interest)} has been charged on ${farmer[0].name}'s loan balance as penalty, new loan balance is ${formatter.format(total_loan_balance + interest)}. Kindly make a follow up`;
      let formData_Mobi = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": mobi_text,
        "user_id": farmer[0].user_id
      }
      
      await axiod.post(`${SMS_BaseUrl_Officer} `, formData_Mobi, CONFIG)

      await axiod.post(`${SMS_BaseUrl} `, formData, CONFIG)


      let mreminder = 5;

      await loanService.updateLoanReminder(  // update reminder
        {
          id: invoice_no[0].id,
          reminder: mreminder
        });

      await loanService.updateLoanPaymentDebtCollection(
        {
          id: invoice_no[0].id,
          interest: interest,
          check_amount: 0,
          period_three: 1
        })
      const statement = await loanService.getLoanLastInsertedStatement({
        loan_id: invoice_no[0].id
      });

      console.log(statement)

      console.log(`2nd  Month Debt collection`);

      // insert into statement
      await loanService.insertIntoStatements({
        credit: invoice_no[0].check_amount,
        debit: statement[0].debit,
        interest: statement[0].interest,
        balance: statement[0].balance,
        insurance_fee: statement[0].insurance_fee,
        insurance_balance: statement[0].insurance_balance,

        debt_collection: interest,
        rollover_fee: statement[0].rollover_fee,

        insurance_instalment_second: statement[0].insurance_instalment_second,
        insurance_instalment_third: statement[0].insurance_instalment_third,

        monthly_instalment: statement[0].monthly_instalment,
        monthly_instalment_second: statement[0].monthly_instalment_second,
        monthly_instalment_third: statement[0].monthly_instalment_third,

        interest_second: statement[0].interest_second,
        interest_third: statement[0].interest_third,

        narrative: `Debt collection`,
        loan_id: invoice_no[0].id,
        farmer_id: invoice_no[0].farmer_id,
        period: 5
      });
      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });

    }

    if (diffInDays == 62 && invoice_no[0].reminder_status == 0) {

      console.log("62 days")


      let instalment = (invoice_no[0].monthly_instalment + (invoice_no[0].interest) + (invoice_no[0].insurance_installment))


      // let instalment = (((total_amount) / 3) + (invoice_no[0].interest))

      if (instalment > 0) {
        const text = `Dear ${farmer[0].name}, your loan instalment of ${formatter.format(instalment)}  is due on the ${loan_due_fisrt_installation} , Kindly pay before due date to avoid any extra charges.\nTo Pay Using MPESA\nGo to the M - pesa Menu, Select Pay Bill, Enter Business No. 658979, Enter Account No.(National ID number) \nHelp desk 0748320516`;

        let formData = {
          "msisdn": farmer[0].msisdn.toString(),
          "text": text,
          "user_id": farmer[0].user_id
        }

        const mobi_text = `,  ${farmer[0].name}'s loan instalment of ${formatter.format(instalment)}  is due on the ${loan_due_fisrt_installation}. Kindly make a follow up`;
        let formData_Mobi = {
          "msisdn": farmer[0].msisdn.toString(),
          "text": mobi_text,
          "user_id": farmer[0].user_id
        }
        await axiod.post(`${SMS_BaseUrl_Officer} `, formData_Mobi, CONFIG)

        // send sms to  mobipesa
        await axiod.post(`${SMS_BaseUrl} `, formData, CONFIG)

        const guarantors = await loanService.getLoanLoanGuarantor({ reference: invoice_no[0].reference });  // check any request

        if (guarantors.length > 0) {
          const text_m = `Dear ${guarantors[0].name}, kindly remind  ${farmer[0].name} of mobile no.${farmer[0].msisdn} to pay his loan instalment of ${formatter.format(instalment)} that you guaranteed and is due on the ${loan_due_fisrt_installation} `
          let formData_m = {
            "msisdn": guarantors[0].guarantor_msisdn,
            "text": text_m
          }
          await axiod.post(`${SMS_BaseUrl} `, formData_m, CONFIG)
        }
      }
      await loanService.updateLoanReminderMessage(
        {
          id: invoice_no[0].id,
          period_three: 1
        });
      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });
    }// condition to check if the due date is between 60 and 62 days and the reminder is 0
    else if (diffInDays == 60 && invoice_no[0].reminder_status == 1) {
      console.log("60 days")

      let instalment = (invoice_no[0].monthly_instalment + (invoice_no[0].interest) + (invoice_no[0].insurance_installment))

      // let instalment = (((total_amount) / 3) + (invoice_no[0].interest))
      if (instalment > 0) {
        const text = `Dear ${farmer[0].name}, your loan instalment of ${formatter.format(instalment)} is due today, Kindly pay today to avoid any extra charges.\nHelp desk 0748320516`;

        let formData = {
          "msisdn": farmer[0].msisdn.toString(),
          "text": text,
          "user_id": farmer[0].user_id
        }
        const mobi_text = `,  ${farmer[0].name}'s loan instalment of ${formatter.format(instalment)}  is due today. Kindly make a follow up`;
        let formData_Mobi = {
          "msisdn": farmer[0].msisdn.toString(),
          "text": mobi_text,
          "user_id": farmer[0].user_id
        }
        await axiod.post(`${SMS_BaseUrl_Officer} `, formData_Mobi, CONFIG)

        await axiod.post(`${SMS_BaseUrl} `, formData, CONFIG)
      }
      await loanService.updateLoanReminderMessage(
        {
          id: invoice_no[0].id,
          period_three: 2
        });
      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });
    }// condition to check if the due date is between 60 and 62 days and the reminder is 0


    else if (diffInDays == 32 && invoice_no[0].reminder_status == 2) {


      let instalment = (invoice_no[0].monthly_instalment +
        invoice_no[0].monthly_instalment_second +
        invoice_no[0].interest +
        invoice_no[0].interest_second +
        invoice_no[0].insurance_installment +
        invoice_no[0].insurance_instalment_second)


      if (instalment > 0) {
        const text = `Dear ${farmer[0].name}, your loan instalment of ${formatter.format(instalment)}  is due on the ${loan_due_fisrt_installation}, Kindly pay before due date to avoid any extra charges.\nTo Pay Using MPESA\nGo to the M - pesa Menu, Select Pay Bill, Enter Business No. 658979, Enter Account No.(National ID number) \nHelp desk 0748320516`;
        let formData = {
          "msisdn": farmer[0].msisdn.toString(),
          "text": text,
          "user_id": farmer[0].user_id
        }

        const mobi_text = `, ${farmer[0].name}'s loan instalment of ${formatter.format(instalment)}  is due on the ${loan_due_fisrt_installation}. Kindly make a follow up`;
        let formData_Mobi = {
          "msisdn": farmer[0].msisdn.toString(),
          "text": mobi_text,
          "user_id": farmer[0].user_id
        }
        await axiod.post(`${SMS_BaseUrl_Officer} `, formData_Mobi, CONFIG)

        await axiod.post(`${SMS_BaseUrl} `, formData, CONFIG)

        const guarantors = await loanService.getLoanLoanGuarantor({ reference: invoice_no[0].reference });  // check any request
        if (guarantors.length > 0) {
          const text_m = `Dear ${guarantors[0].name}, kindly remind  ${farmer[0].name} of mobile no.${farmer[0].msisdn} to pay his loan instalment of ${formatter.format(instalment)} that you guaranteed and is due on the ${loan_due_fisrt_installation} `
          let formData_m = {
            "msisdn": guarantors[0].guarantor_msisdn,
            "text": text_m
          }
          await axiod.post(`${SMS_BaseUrl} `, formData_m, CONFIG)
        }
      }

      await loanService.updateLoanReminderMessage(
        {
          id: invoice_no[0].id,
          period_three: 3
        });
      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });

    }// condition to check if the due date is between 60 and 62 days and the reminder is 0
    else if (diffInDays == 30 && invoice_no[0].reminder_status == 3) {

      let instalment = (invoice_no[0].monthly_instalment +
        invoice_no[0].monthly_instalment_second +
        invoice_no[0].interest +
        invoice_no[0].interest_second +
        invoice_no[0].insurance_installment +
        invoice_no[0].insurance_instalment_second)

      if (instalment > 0) {
        const text = `Dear ${farmer[0].name}, your loan instalment of ${formatter.format(instalment)}  is due today, Kindly pay today to avoid any extra charges.\nTo Pay Using MPESA\nGo to the M - pesa Menu, Select Pay Bill, Enter Business No. 658979, Enter Account No.(National ID number) \nHelp desk 0748320516`;

        let formData = {
          "msisdn": farmer[0].msisdn.toString(),
          "text": text,
          "user_id": farmer[0].user_id
        }

        const mobi_text = `,  ${farmer[0].name}'s loan instalment of ${formatter.format(instalment)}  is due today. Kindly make a follow up`;
        let formData_Mobi = {
          "msisdn": farmer[0].msisdn.toString(),
          "text": mobi_text,
          "user_id": farmer[0].user_id
        }
        await axiod.post(`${SMS_BaseUrl_Officer} `, formData_Mobi, CONFIG)

        await axiod.post(`${SMS_BaseUrl} `, formData, CONFIG)

      }
      await loanService.updateLoanReminderMessage(
        {
          id: invoice_no[0].id,
          period_three: 4
        });
      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });


    }// condition to check if the due date is between 60 and 62 days and the reminder is 0

    else if (diffInDays == 2 && invoice_no[0].reminder_status == 4) {

      let instalment = (
        invoice_no[0].monthly_instalment +
        invoice_no[0].monthly_instalment_second +
        invoice_no[0].monthly_instalment_third +
        invoice_no[0].interest +
        invoice_no[0].interest_second +
        invoice_no[0].interest_third +
        invoice_no[0].insurance_installment +
        invoice_no[0].insurance_instalment_second +
        invoice_no[0].insurance_instalment_third)

      if (instalment > 0) {

        const text = `Dear ${farmer[0].name}, your loan instalment of ${formatter.format(instalment)}  is due on the ${loan_due_fisrt_installation} , Kindly pay before due date to avoid any extra charges\nTo Pay Using MPESA\nGo to the M - pesa Menu, Select Pay Bill, Enter Business No. 658979, Enter Account No.(National ID number) \nHelp desk 0748320516`;

        let formData = {
          "msisdn": farmer[0].msisdn.toString(),
          "text": text,
          "user_id": farmer[0].user_id
        }

        const mobi_text = `,  ${farmer[0].name}'s loan instalment of ${formatter.format(instalment)}  is due on the ${loan_due_fisrt_installation}. Kindly make a follow up`;
        let formData_Mobi = {
          "msisdn": farmer[0].msisdn.toString(),
          "text": mobi_text,
          "user_id": farmer[0].user_id
        }
        await axiod.post(`${SMS_BaseUrl_Officer} `, formData_Mobi, CONFIG)

        await axiod.post(`${SMS_BaseUrl} `, formData, CONFIG)

        const guarantors = await loanService.getLoanLoanGuarantor({ reference: invoice_no[0].reference });  // check any request

        if (guarantors.length > 0) {
          const text_m = `Dear ${guarantors[0].name}, kindly remind  ${farmer[0].name} of mobile no.${farmer[0].msisdn} to pay his loan instalment of ${formatter.format(instalment)} that you guaranteed and is due on the ${loan_due_fisrt_installation} `
          let formData_m = {
            "msisdn": guarantors[0].guarantor_msisdn,
            "text": text_m
          }
          await axiod.post(`${SMS_BaseUrl} `, formData_m, CONFIG)
        }
      }

      await loanService.updateLoanReminderMessage(
        {
          id: invoice_no[0].id,
          period_three: 5
        });
      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });
    }// condition to check if the due date is between 60 and 62 days and the reminder is 0
    else if (diffInDays == 0 && invoice_no[0].reminder_status == 5) {
      let instalment = (
        invoice_no[0].monthly_instalment +
        invoice_no[0].monthly_instalment_second +
        invoice_no[0].monthly_instalment_third +
        invoice_no[0].interest +
        invoice_no[0].interest_second +
        invoice_no[0].interest_third +
        invoice_no[0].insurance_installment +
        invoice_no[0].insurance_instalment_second +
        invoice_no[0].insurance_instalment_third)

      if (instalment > 0) {

        const text = `Dear ${farmer[0].name}, your loan instalment of ${formatter.format(instalment)} is due today, Kindly pay today to avoid any extra charges.\nTo Pay Using MPESA\nGo to the M - pesa Menu, Select Pay Bill, Enter Business No. 658979, Enter Account No.(National ID number) \nHelp desk 0748320516`;

        let formData = {
          "msisdn": farmer[0].msisdn.toString(),
          "text": text,
          "user_id": farmer[0].user_id
        }

        const mobi_text = `,  ${farmer[0].name}'s loan instalment of ${formatter.format(instalment)} is due today. Kindly make a follow up`;
        let formData_Mobi = {
          "msisdn": farmer[0].msisdn.toString(),
          "text": mobi_text,
          "user_id": farmer[0].user_id
        }
        await axiod.post(`${SMS_BaseUrl_Officer} `, formData_Mobi, CONFIG)

        await axiod.post(`${SMS_BaseUrl} `, formData, CONFIG)
      }
      await loanService.updateLoanReminderMessage(
        {
          id: invoice_no[0].id,
          period_three: 6
        });
      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });

    }// condition to check if the due date is between 60 and 62 days and the reminder is 0


    //rollover balance reminder  and charge fee
    else if (diffInDays == -1 && invoice_no[0].reminder_status == 6) {
      const defaulter = await loanService.getLoanLoanDefaulters();  // check any request
      let loan_charge;
      let loan_total;

      let interest = 0.075 * (invoice_no[0].monthly_instalment +
        invoice_no[0].monthly_instalment_second +
        invoice_no[0].monthly_instalment_third +
        invoice_no[0].interest +
        invoice_no[0].interest_second +
        invoice_no[0].interest_third +
        invoice_no[0].insurance_installment +
        invoice_no[0].insurance_instalment_second +
        invoice_no[0].insurance_instalment_third); // calculate interest

      loan_charge = interest;

      let total_interest = (loan_charge / 30);

      let mreminder = 4;

      loan_total = (invoice_no[0].monthly_instalment +
        invoice_no[0].monthly_instalment_second +
        invoice_no[0].monthly_instalment_third +
        invoice_no[0].interest +
        invoice_no[0].interest_second +
        invoice_no[0].interest_third +
        invoice_no[0].insurance_installment +
        invoice_no[0].insurance_instalment_second +
        invoice_no[0].insurance_instalment_third);

      const statement = await loanService.getLoanLastInsertedStatement({
        loan_id: invoice_no[0].id
      });

      console.log(statement)

      console.log(`1st Month Defaulted month instalment loan id${invoice_no[0].id} `);

      // insert into statement
      await loanService.insertIntoStatements({
        credit: invoice_no[0].check_amount,
        debit: statement[0].debit,
        interest: statement[0].interest,
        balance: statement[0].balance,
        insurance_fee: statement[0].insurance_fee,
        insurance_balance: statement[0].insurance_balance,

        debt_collection: statement[0].debt_collection,
        rollover_fee: total_interest,

        insurance_instalment_second: statement[0].insurance_instalment_second,
        insurance_instalment_third: statement[0].insurance_instalment_third,

        monthly_instalment: statement[0].monthly_instalment,
        monthly_instalment_second: statement[0].monthly_instalment_second,
        monthly_instalment_third: statement[0].monthly_instalment_third,

        interest_second: statement[0].interest_second,
        interest_third: statement[0].interest_third,

        narrative: `Rollover Month`,
        loan_id: invoice_no[0].id,
        farmer_id: invoice_no[0].farmer_id,
        period: 4
      });


      await loanService.updateLoanReminder(  // update reminder
        {
          id: invoice_no[0].id,
          reminder: mreminder
        });
      await loanService.updateLoan1stInstallment(
        {
          id: invoice_no[0].id,
          interest: Number(total_interest),
          total_interest: loan_charge,
          check_amount: 0,
          period_three: 1
        })
      if (invoice_no[0].lock_period == 4) {
        await loanService.updateLockPeriod(
          {
            id: invoice_no[0].id,
            filter_value: 6
          });
      }


      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });
      const guarantors = await loanService.getLoanLoanGuarantor({ reference: invoice_no[0].reference });  // check any request
      if (guarantors.length > 0) {
        const text_m = `Dear ${guarantors[0].name}, Please remind ${farmer[0].name} to pay a defaulted loan of ${formatter.format(loan_total)} that you guaranteed and fell due on  ${loan_due_fisrt_installation}.\nHelp desk 0748320516`;
        let formData_m = {
          "msisdn": guarantors[0].guarantor_msisdn,
          "text": text_m
        }
        await axiod.post(`${SMS_BaseUrl} `, formData_m, CONFIG)
      }

      await loanService.updateLoanReminderMessage(
        {
          id: invoice_no[0].id,
          period_three: 7
        });

      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });
    }// condition to check if the due date is between 60 and 62 days and the reminder is 0

    else if (diffInDays == -7 && invoice_no[0].reminder_status == 7) {

      // let instalment = (invoice_no[0].monthly_instalment + (invoice_no[0].interest) + (invoice_no[0].insurance_installment) )

      const text = `Dear ${farmer[0].name}, your loan  of ${formatter.format(total_loan_balance)} is past due date, Kindly pay to avoid any extra charges.\nTo Pay Using MPESA\nGo to the M - pesa Menu, Select Pay Bill, Enter Business No. 658979, Enter Account No.(National ID number) \nHelp desk 0748320516`;

      let formData = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": text,
        "user_id": farmer[0].user_id
      }
      const mobi_text = `,  ${farmer[0].name}'s loan instalment of ${formatter.format(total_loan_balance)}  is past due date. Kindly make a follow up`;
      let formData_Mobi = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": mobi_text,
        "user_id": farmer[0].user_id
      }
      await axiod.post(`${SMS_BaseUrl_Officer} `, formData_Mobi, CONFIG)

      await axiod.post(`${SMS_BaseUrl} `, formData, CONFIG)
      await loanService.updateLoanReminderMessage(
        {
          id: invoice_no[0].id,
          period_three: 8
        });
      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });

    }// condition to check if the due date is between 60 and 62 days and the reminder is 0

    else if (diffInDays == -14 && invoice_no[0].reminder_status == 8) {

      const text = `Dear ${farmer[0].name}, your loan  of ${formatter.format(total_loan_balance)} is past due date, Kindly pay to avoid any extra charges.\nTo Pay Using MPESA\nGo to the M - pesa Menu, Select Pay Bill, Enter Business No. 658979, Enter Account No.(National ID number) \nHelp desk 0748320516`;
      let formData = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": text,
        "user_id": farmer[0].user_id
      }


      const guarantors = await loanService.getLoanLoanGuarantor({ reference: invoice_no[0].reference });  // check any request

      if (guarantors.length > 0) {
        const text_m = `Dear ${guarantors[0].name}, Please remind ${farmer[0].name} to pay a defaulted loan of ${formatter.format(total_loan_balance)} that you guaranteed and fell due on  ${loan_due_fisrt_installation}.\nHelp desk 0748320516`;
        let formData_m = {
          "msisdn": guarantors[0].guarantor_msisdn,
          "text": text_m
        }
        await axiod.post(`${SMS_BaseUrl} `, formData_m, CONFIG)
      }

      const mobi_text = `,  ${farmer[0].name}'s loan instalment of ${formatter.format(total_loan_balance)}  is past due date. Kindly make a follow up`;
      let formData_Mobi = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": mobi_text,
        "user_id": farmer[0].user_id
      }
      await axiod.post(`${SMS_BaseUrl_Officer} `, formData_Mobi, CONFIG)


      await axiod.post(`${SMS_BaseUrl} `, formData, CONFIG)
      await loanService.updateLoanReminderMessage(
        {
          id: invoice_no[0].id,
          period_three: 9
        });

      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });
    }// condition to check if the due date is between 60 and 62 days and the reminder is 0

    else if (diffInDays == -21 && invoice_no[0].reminder_status == 9) {

      const text = `Dear ${farmer[0].name}, your loan  of ${formatter.format(total_loan_balance)} is past due date, Kindly pay to avoid any extra charges.\nTo Pay Using MPESA\nGo to the M - pesa Menu, Select Pay Bill, Enter Business No. 658979, Enter Account No.(National ID number) \nHelp desk 0748320516`;



      let formData = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": text,
        "user_id": farmer[0].user_id
      }


      const mobi_text = `,  ${farmer[0].name}'s loan instalment of ${formatter.format(total_loan_balance)}  is past due date. Kindly make a follow up`;
      let formData_Mobi = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": mobi_text,
        "user_id": farmer[0].user_id
      }
      await axiod.post(`${SMS_BaseUrl_Officer} `, formData_Mobi, CONFIG)



      await axiod.post(`${SMS_BaseUrl} `, formData, CONFIG)
      console.log("here")

      await loanService.updateLoanReminderMessage(
        {
          id: invoice_no[0].id,
          period_three: 10
        });
      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });

      const defaulter = await loanService.getLoanLoanDefaulters_Two();  // check any request

      let loan_charge;
      let loan_total;

      if (defaulter.length > 0) {
        loan_charge = invoice_no[0].interest;

        loan_total = invoice_no[0].principal_balance + invoice_no[0].interest;

      } else {
        let interest_balance = invoice_no[0].interest - invoice_no[0].check_amount;

        loan_total = invoice_no[0].principal_balance + ((invoice_no[0].principal_balance + interest_balance) * 0.25) + interest_balance;

        loan_charge = ((invoice_no[0].principal_balance + interest_balance) * 0.25) + interest_balance;
      }

      // const text_two = `Dear ${ farmer[0].name },  ${ formatter.format(loan_charge) } has been charged on your loan balance as a as penalty, your new loan balance is ${ formatter.format(loan_total) }. Kindly pay to avoid forceful recovery.\nHelp desk 0748320516`;
      // let formData = {
      //   "msisdn": farmer[0].msisdn.toString(),
      //   "text": text_two
      // }

      // await axiod.post(`${ SMS_BaseUrl } `, formData, CONFIG)
      console.log("hevvvre")

      await loanService.updateLoanReminderMessage(
        {
          id: invoice_no[0].id,
          period_three: 10
        });

      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });

    }// condition to check if the due date is between 60 and 62 days and the reminder is 0

    else if (diffInDays == -28 && invoice_no[0].reminder_status == 10) {

      const text = `Dear ${farmer[0].name}, your loan  of ${formatter.format(total_loan_balance)} is past due date, Kindly pay to avoid any extra charges.\nTo Pay Using MPESA\nGo to the M - pesa Menu, Select Pay Bill, Enter Business No. 658979, Enter Account No.(National ID number) \nHelp desk 0748320516`;

      let formData = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": text,
        "user_id": farmer[0].user_id
      }


      const mobi_text = `,  ${farmer[0].name}'s loan instalment of ${formatter.format(total_loan_balance)}  is past due date. Kindly make a follow up`;
      let formData_Mobi = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": mobi_text,
        "user_id": farmer[0].user_id
      }
      await axiod.post(`${SMS_BaseUrl_Officer} `, formData_Mobi, CONFIG)
      
      await axiod.post(`${SMS_BaseUrl} `, formData, CONFIG)
      await loanService.updateLoanReminderMessage(
        {
          id: invoice_no[0].id,
          period_three: 11
        });
      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });

      const guarantors = await loanService.getLoanLoanGuarantor({ reference: invoice_no[0].reference });  // check any request

      if (guarantors.length > 0) {

        const text_m = `Dear ${guarantors[0].name}, Please remind ${farmer[0].name} to pay a defaulted loan of ${formatter.format(total_loan_balance)} that you guaranteed and fell due on  ${loan_due_fisrt_installation}.\nHelp desk 0748320516`;

        let formData_m = {
          "msisdn": guarantors[0].guarantor_msisdn,
          "text": text_m
        }
        await axiod.post(`${SMS_BaseUrl} `, formData_m, CONFIG);

      }
    }// condition to check if the due date is between 60 and 62 days and the reminder is 0

    else if (diffInDays == -35 && invoice_no[0].reminder_status == 11) {

      const text = `Dear ${farmer[0].name}, your loan  of ${formatter.format(total_loan_balance)} is past due date, Kindly pay to avoid any extra charges.\nTo Pay Using MPESA\nGo to the M - pesa Menu, Select Pay Bill, Enter Business No. 658979, Enter Account No.(National ID number) \nHelp desk 0748320516`;


      let formData = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": text,
        "user_id": farmer[0].user_id
      }


      const mobi_text = `,  ${farmer[0].name}'s loan instalment of ${formatter.format(total_loan_balance)}  is past due date. Kindly make a follow up`;
      let formData_Mobi = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": mobi_text,
        "user_id": farmer[0].user_id
      }
      await axiod.post(`${SMS_BaseUrl_Officer} `, formData_Mobi, CONFIG)
      

      await axiod.post(`${SMS_BaseUrl} `, formData, CONFIG)

      await loanService.updateLoanReminderMessage(
        {
          id: invoice_no[0].id,
          period_three: 12
        });
      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });

    }// condition to check if the due date is between 60 and 62 days and the reminder is 0

    else if (diffInDays == -42 && invoice_no[0].reminder_status == 12) {

      const text = `Dear ${farmer[0].name}, your loan  of ${formatter.format(total_loan_balance)} is past due date, Kindly pay to avoid any extra charges.\nTo Pay Using MPESA\nGo to the M - pesa Menu, Select Pay Bill, Enter Business No. 658979, Enter Account No.(National ID number) \nHelp desk 0748320516`;

      let formData = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": text,
        "user_id": farmer[0].user_id
      }


      const mobi_text = `,  ${farmer[0].name}'s loan instalment of ${formatter.format(total_loan_balance)}  is past due date. Kindly make a follow up`;
      let formData_Mobi = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": mobi_text,
        "user_id": farmer[0].user_id
      }
      await axiod.post(`${SMS_BaseUrl_Officer} `, formData_Mobi, CONFIG)
        await axiod.post(`${SMS_BaseUrl} `, formData, CONFIG)
      await loanService.updateLoanReminderMessage(
        {
          id: invoice_no[0].id,
          period_three: 13
        });
      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });
      const guarantors = await loanService.getLoanLoanGuarantor({ reference: invoice_no[0].reference });  // check any request


      if (guarantors.length > 0) {
        const text_m = `Dear ${guarantors[0].name}, Please remind ${farmer[0].name} to pay a defaulted loan of ${formatter.format(total_loan_balance)} that you guaranteed and fell due on  ${loan_due_fisrt_installation}.\nHelp desk 0748320516`;
        let formData_m = {
          "msisdn": guarantors[0].guarantor_msisdn,
          "text": text_m
        }
        await axiod.post(`${SMS_BaseUrl} `, formData_m, CONFIG);
      }

    }// condition to check if the due date is between 60 and 62 days and the reminder is 0

    else if (diffInDays == -49 && invoice_no[0].reminder_status == 13) {

      const text = `Dear ${farmer[0].name}, your loan  of ${formatter.format(total_loan_balance)} is past due date, Kindly pay to avoid any extra charges.\nTo Pay Using MPESA\nGo to the M - pesa Menu, Select Pay Bill, Enter Business No. 658979, Enter Account No.(National ID number) \nHelp desk 0748320516`;

      let formData = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": text,
        "user_id": farmer[0].user_id
      }

      const mobi_text = `, ${farmer[0].name}'s loan instalment of ${formatter.format(total_loan_balance)}  is past due date. Kindly make a follow up`;
      let formData_Mobi = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": mobi_text,
        "user_id": farmer[0].user_id
      }
      await axiod.post(`${SMS_BaseUrl_Officer} `, formData_Mobi, CONFIG)
      await axiod.post(`${SMS_BaseUrl} `, formData, CONFIG)
      await loanService.updateLoanReminderMessage(
        {
          id: invoice_no[0].id,
          period_three: 14
        });
      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });

    }// condition to check if the due date is between 60 and 62 days and the reminder is 0

    else if (diffInDays == -56 && invoice_no[0].reminder_status == 14) {

      const text = `Dear ${farmer[0].name}, your loan  of ${formatter.format(total_loan_balance)} is past due date, Kindly pay to avoid any extra charges.\nTo Pay Using MPESA\nGo to the M - pesa Menu, Select Pay Bill, Enter Business No. 658979, Enter Account No.(National ID number) \nHelp desk 0748320516`;


      let formData = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": text,
        "user_id": farmer[0].user_id
      }


      const mobi_text = `,  ${farmer[0].name}'s loan instalment of ${formatter.format(total_loan_balance)}  is past due date. Kindly make a follow up`;
      let formData_Mobi = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": mobi_text,
        "user_id": farmer[0].user_id
      }
      await axiod.post(`${SMS_BaseUrl_Officer} `, formData_Mobi, CONFIG)



      await axiod.post(`${SMS_BaseUrl} `, formData, CONFIG)
      await loanService.updateLoanReminderMessage(
        {
          id: invoice_no[0].id,
          period_three: 15
        });

      await loanService.updateLoanReminderLock(
        {
          id: invoice_no[0].id
        });
    }// condition to check if the due date is between 60 and 62 days and the reminder is 0
    else if (diffInDays < -61) {

      let total = total_loan_balance;

      let mbalance = parseFloat(farmer[0].wallet_balance) - total; //get wallet balance

      let mtotal = total - parseFloat(farmer[0].wallet_balance); // get balance to be deducted

      if (mtotal < 0) {
        mtotal = 0
      }


      if (mbalance > 0) {
        await loanService.updateLoanPaymentDefaulted(
          {
            id: invoice_no[0].id,
            amount: 0,
            interest: 0,
            insurance_balance: 0,
            // monthly_instalment: instalment,
            insurance_installment: 0,
            insurance_instalment_second: 0,
            insurance_instalment_third: 0,
            monthly_instalment: 0,
            monthly_instalment_second: 0,
            monthly_instalment_third: 0,
            rollover_fee: 0,
            debt_collection: 0,
            interest_second: 0,
            interest_third: 0,
            check_amount: 0,
            period_three: 1
          }
        );



        await farmerService.updateWalletFarmerDefault(
          {
            id_no: farmer[0].id_no,
            wallet_balance: mbalance
          });


        await loanService.insertIntoStatements({
          credit: invoice_no[0].check_amount,
          debit: 0,
          interest: 0,
          balance: 0,
          insurance_fee: "0",
          insurance_balance: 0,
          insurance_instalment_second: 0,
          insurance_instalment_third: 0,
          monthly_instalment: 0,
          monthly_instalment_second: 0,
          monthly_instalment_third: 0,
          interest_second: 0,
          interest_third: 0,
          rollover_fee: 0,
          debt_collection: 0,
          narrative: `${invoice_no[0].check_amount} deposited by from wallet ${farmer[0].name}`,
          loan_id: invoice_no[0].id,
          farmer_id: invoice_no[0].farmer_id,
          period: 5
        });


        const text_m = `Dear ${farmer[0].name} ${formatter.format(total)}  has been deducted from your e-wallet to pay loan no.${invoice_no[0].reference}.\nHelp desk 0748320516`;
        let formData_m = {
          "msisdn": farmer[0].msisdn,
          "text": text_m
        }
       
        let formData = {
          "msisdn": farmer[0].msisdn.toString(),
          "text": text_m,
          "user_id": farmer[0].user_id
        }

        const mobi_text = `, ${formatter.format(total)}  was deducted from ${farmer[0].name}'s e-wallet to pay loan no.${invoice_no[0].reference}. Kindly make a follow up`;

        let formData_Mobi = {
          "msisdn": farmer[0].msisdn.toString(),
          "text": mobi_text,
          "user_id": farmer[0].user_id
        }
        await axiod.post(`${SMS_BaseUrl_Officer} `, formData_Mobi, CONFIG)
        
        await axiod.post(`${SMS_BaseUrl} `, formData_m, CONFIG)

      }
      else {  // else wallet amount is less than the loan balance
        await farmerService.updateWalletFarmerReminder(
          {
            id_no: farmer[0].id_no
          });

        await loanService.updateCheckAmount(
          {
            id: invoice_no[0].id,
            amount: mtotal
          });
        const text_m = `Dear ${farmer[0].name} ${formatter.format(farmer[0].wallet_balance)}  has been deducted from your e - wallet to pay loan no.${invoice_no[0].reference}.\nHelp desk 0748320516`;
        let formData_m = {
          "msisdn": farmer[0].msisdn,
          "text": text_m
        }

        let formData = {
          "msisdn": farmer[0].msisdn.toString(),
          "text": text_m,
          "user_id": farmer[0].user_id
        }

        const mobi_text = `, ${formatter.format(total)}  was deducted from ${farmer[0].name}'s e-wallet to pay loan no.${invoice_no[0].reference}. Kindly make a follow up`;

        let formData_Mobi = {
          "msisdn": farmer[0].msisdn.toString(),
          "text": mobi_text,
          "user_id": farmer[0].user_id
        }
        await axiod.post(`${SMS_BaseUrl_Officer} `, formData_Mobi, CONFIG)
       

        await axiod.post(`${SMS_BaseUrl} `, formData_m, CONFIG)
      }


      await loanService.updateLoanLock(
        {
          id: invoice_no[0].id
        });

    }

    else {
      if (diffInDays == 60 && invoice_no[0].reminder_status == 0) {
        await loanService.updateLoanReminderMessage(
          {
            id: invoice_no[0].id,
            period_three: 1
          });
      }
      else if (diffInDays == 32 && (invoice_no[0].reminder_status == 0 || invoice_no[0].reminder_status == 1)) {
        await loanService.updateLoanReminderMessage(
          {
            id: invoice_no[0].id,
            period_three: 2
          });

      }

      else if (diffInDays == 30 && (invoice_no[0].reminder_status == 0 || invoice_no[0].reminder_status == 1 || invoice_no[0].reminder_status == 2)) {
        await loanService.updateLoanReminderMessage(
          {
            id: invoice_no[0].id,
            period_three: 3
          });
      }

      else if (diffInDays == 2 && (invoice_no[0].reminder_status == 0 || invoice_no[0].reminder_status == 1 || invoice_no[0].reminder_status == 2 || invoice_no[0].reminder_status == 3)) {
        await loanService.updateLoanReminderMessage(
          {
            id: invoice_no[0].id,
            period_three: 4
          });
      }


      else if (diffInDays == 0 && (invoice_no[0].reminder_status == 0 || invoice_no[0].reminder_status == 1 || invoice_no[0].reminder_status == 2 || invoice_no[0].reminder_status == 3 || invoice_no[0].reminder_status == 4)) {
        await loanService.updateLoanReminderMessage(
          {
            id: invoice_no[0].id,
            period_three: 5
          });
      }


      else if (diffInDays == -1 && (invoice_no[0].reminder_status == 0 || invoice_no[0].reminder_status == 1 || invoice_no[0].reminder_status == 2 || invoice_no[0].reminder_status == 3 || invoice_no[0].reminder_status == 4 || invoice_no[0].reminder_status == 5)) {
        await loanService.updateLoanReminderMessage(
          {
            id: invoice_no[0].id,
            period_three: 6
          });
      }
      else if (diffInDays == -7 && (invoice_no[0].reminder_status == 0 || invoice_no[0].reminder_status == 1 || invoice_no[0].reminder_status == 2 || invoice_no[0].reminder_status == 3 || invoice_no[0].reminder_status == 4 || invoice_no[0].reminder_status == 5)) {
        await loanService.updateLoanReminderMessage(
          {
            id: invoice_no[0].id,
            period_three: 7
          });
      }
      else if (diffInDays == -14 && (invoice_no[0].reminder_status == 0 || invoice_no[0].reminder_status == 1 || invoice_no[0].reminder_status == 2 || invoice_no[0].reminder_status == 3 || invoice_no[0].reminder_status == 4 || invoice_no[0].reminder_status == 5 || invoice_no[0].reminder_status == 6)) {
        await loanService.updateLoanReminderMessage(
          {
            id: invoice_no[0].id,
            period_three: 8
          });
      }
      else if (diffInDays == -21 && (invoice_no[0].reminder_status == 0 || invoice_no[0].reminder_status == 1 || invoice_no[0].reminder_status == 2 || invoice_no[0].reminder_status == 3 || invoice_no[0].reminder_status == 4 || invoice_no[0].reminder_status == 5 || invoice_no[0].reminder_status == 6 || invoice_no[0].reminder_status == 7)) {
        await loanService.updateLoanReminderMessage(
          {
            id: invoice_no[0].id,
            period_three: 9
          });
      }
      else if (diffInDays == -28 && (invoice_no[0].reminder_status == 0 || invoice_no[0].reminder_status == 1 || invoice_no[0].reminder_status == 2 || invoice_no[0].reminder_status == 3 || invoice_no[0].reminder_status == 4 || invoice_no[0].reminder_status == 5 || invoice_no[0].reminder_status == 6 || invoice_no[0].reminder_status == 7 || invoice_no[0].reminder_status == 8)) {
        console.log("heherre")
        await loanService.updateLoanReminderMessage(
          {
            id: invoice_no[0].id,
            period_three: 10
          });
      }


      else if (diffInDays == -35 && (invoice_no[0].reminder_status == 0 || invoice_no[0].reminder_status == 1 || invoice_no[0].reminder_status == 2 || invoice_no[0].reminder_status == 3 || invoice_no[0].reminder_status == 4 || invoice_no[0].reminder_status == 5 || invoice_no[0].reminder_status == 6 || invoice_no[0].reminder_status == 7 || invoice_no[0].reminder_status == 8 || invoice_no[0].reminder_status == 9)) {
        await loanService.updateLoanReminderMessage(
          {
            id: invoice_no[0].id,
            period_three: 11
          });

      }

      else if (diffInDays == -42 && (invoice_no[0].reminder_status == 0 || invoice_no[0].reminder_status == 1 || invoice_no[0].reminder_status == 2 || invoice_no[0].reminder_status == 3 || invoice_no[0].reminder_status == 4 || invoice_no[0].reminder_status == 5 || invoice_no[0].reminder_status == 6 || invoice_no[0].reminder_status == 7 || invoice_no[0].reminder_status == 8 || invoice_no[0].reminder_status == 9 || invoice_no[0].reminder_status == 10)) {
        await loanService.updateLoanReminderMessage(
          {
            id: invoice_no[0].id,
            period_three: 12
          });
      }

      else if (diffInDays == -49 && (invoice_no[0].reminder_status == 0 || invoice_no[0].reminder_status == 1 || invoice_no[0].reminder_status == 2 || invoice_no[0].reminder_status == 3 || invoice_no[0].reminder_status == 4 || invoice_no[0].reminder_status == 5 || invoice_no[0].reminder_status == 6 || invoice_no[0].reminder_status == 7 || invoice_no[0].reminder_status == 8 || invoice_no[0].reminder_status == 9 || invoice_no[0].reminder_status == 10)) {
        await loanService.updateLoanReminderMessage(
          {
            id: invoice_no[0].id,
            period_three: 13
          });
      } else {
        await loanService.updateLoanReminderLock(
          {
            id: invoice_no[0].id
          });

        console.log(green("locked"));
      }
    }
    start();
  }
  start();
});






// 404 page
app.addEventListener("error", (evt) => {
  console.log(evt.error);
});
app.use((ctx) => {
  ctx.throw(500);
});


app.addEventListener("listen", ({ secure, hostname, port }) => {
  const protocol = secure ? "https://" : "http://";
  const url = `${protocol}${hostname ?? "localhost"}:${port} `;
  console.log(`${yellow("Listening on:")} ${green(url)} `,);
});
await app.listen({ port });
