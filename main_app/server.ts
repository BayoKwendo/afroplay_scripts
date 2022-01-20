
import { Application, HttpServerNative } from "https://deno.land/x/oak/mod.ts";
import { green, yellow } from "https://deno.land/std/fmt/colors.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import loanService from "./services/loanService.ts";
import farmerService from "./services/farmerService.ts";
import { cron, start, stop, everyMinute, daily, weekly } from 'https://deno.land/x/deno_cron/cron.ts';
import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";
import { SMS, formatter, CONFIG, SMS_BaseUrl, SMS_BaseUrl_Officer } from "./db/config.ts";
import axiod from 'https://deno.land/x/axiod/mod.ts';


// const app = new Application();

const app = new Application({
  serverConstructor: HttpServerNative
});

const port = 2001;
app.use(
  oakCors({
    origin: "*",
    maxAge: 8640033
  }),
);

console.log(green("script running..."));

// cron job
everyMinute(async () => {
  stop()
  // console.log(green("cron job running..."));
  // get loans pendings
  const invoice_no = await loanService.getLoanLoanStatus();  // check any request

  if (invoice_no.length > 0) {  // condition to check if the there is any pending request to be processed



    const farmer = await loanService.getFarmerNo(
      {
        id: invoice_no[0].farmer_id,
      });

    const diffInDays = moment(invoice_no[0].due_date).diff(moment(Date.now()), 'days'); // get difference in days
    console.log(diffInDays);
    let mtext;
    let text_mobi;
    let month_period = 0;
    let mPayment_date = moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const loan_due_fisrt_installation = moment(new Date(invoice_no[0].due_date).setDate(new Date(invoice_no[0].due_date).getDate() - 60)).format('YYYY-MM-DD HH:mm:ss');


    console.log(invoice_no[0].due_date);

    console.log(loan_due_fisrt_installation);

    const loan_due_second_installation = moment(new Date(invoice_no[0].due_date).setDate(new Date(invoice_no[0].due_date).getDate() - 30)).format('YYYY-MM-DD HH:mm:ss');

    const loan_due_third_installation = moment(new Date(invoice_no[0].due_date).setDate(new Date(invoice_no[0].due_date).getDate() - 0)).format('YYYY-MM-DD HH:mm:ss');

    // global variables declaration
    let principal;
    let interest;
    let mreminder;
    let mbalance;
    let period_three = 1;
    let total_amount = invoice_no[0].total_amount;
    let insurance_fee;
    let insurance_instalment
    let check_instalment;
    let insurance_balance;
    let submit;
    let monthly_instalment;
    let monthly_instalment_second;
    let interest_second;
    let insurance_instalment_second;

    let rollover_fee;
    let debt_collection;
    let principal_balance;

    let monthly_instalment_third;
    let interest_third;
    let insurance_instalment_third;

    let loan_balance;

    let mwallet_balance = 0;


    // first month instalment
    if (diffInDays > -63) {
      period_three = 1;
      interest = 0;
      month_period = 1;

      if (invoice_no[0].check_amount > invoice_no[0].monthly_instalment) {
        if (invoice_no[0].check_amount > (invoice_no[0].monthly_instalment +
          invoice_no[0].interest + invoice_no[0].insurance_installment)) {

          // first month instalment principal paid fully begin the second month instalment
          // second month instalment
          console.log('checked here');
          let balance = invoice_no[0].check_amount - (invoice_no[0].monthly_instalment +
            invoice_no[0].interest + invoice_no[0].insurance_installment)
          // balance is amount left after 1st instalment was fully paid
          if (balance > invoice_no[0].monthly_instalment_second) {
            if (balance > (invoice_no[0].monthly_instalment_second +
              invoice_no[0].interest_second + invoice_no[0].insurance_instalment_second)) {// if balance is greater than total second month instalment
              // customer pays amount greater than 1st instalment and 2nd instalment balances
              let balance_two = balance - (invoice_no[0].monthly_instalment_second +
                invoice_no[0].interest_second + invoice_no[0].insurance_instalment_second)

              // balance two is the amount left for third month instalment

              /**
               * @description THIRD MONTH INSTALMENT
               */
              if (balance_two > invoice_no[0].monthly_instalment_third) { // balance is greater than the third instalment


                if (balance_two >= (invoice_no[0].monthly_instalment_third + invoice_no[0].rollover_fee +
                  invoice_no[0].debt_collection + invoice_no[0].interest_third + invoice_no[0].insurance_instalment_third)) { // loan full paid

                  // first month instalment principal paid fully 
                  interest = 0;
                  insurance_instalment = 0;
                  monthly_instalment = 0;

                  // second month instalment principal paid fully 
                  interest_second = 0;
                  insurance_instalment_second = 0;
                  monthly_instalment_second = 0;

                  // third month installment
                  interest_third = 0;
                  principal_balance = 0;
                  insurance_instalment_third = 0;
                  monthly_instalment_third = 0;

                  // over three months
                  rollover_fee = 0;
                  debt_collection = 0;

                  mwallet_balance = balance_two - (invoice_no[0].monthly_instalment_third + invoice_no[0].interest_third + insurance_instalment_second)


                  // SEND Text loan was fully paid

                  const text_mobi = `,  loan of ${formatter.format(total_amount + invoice_no[0].insurance_fee)} has been paid by ${farmer[0].name}: Mobile No. ${farmer[0].msisdn} on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The loan is now fully paid up.`;
                  const text = `Dear ${farmer[0].name}, your loan  of ${formatter.format(total_amount + invoice_no[0].insurance_fee)} has been paid on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The loan is now fully paid.\nHelp desk 0748320516`;
                  // 658979 

                  await loanService.updateLoanPay(
                    {
                      id: invoice_no[0].id
                    });
                  await farmerService.updateWalletFarmerEngine(
                    {
                      id: invoice_no[0].farmer_id,
                      wallet_balance: Math.abs(Number(mwallet_balance))
                    });
                  let formData = {
                    "msisdn": farmer[0].msisdn.toString(),
                    "text": text
                  }
                  // send sms to the borrower
                  await axiod
                    .post(`${SMS_BaseUrl}`, formData, CONFIG)

                  let formData_Mobi = {
                    "msisdn": SMS.MOBIPESA.toString(),
                    "text": text_mobi,
                    "user_id": farmer[0].user_id
                  }
                  // send sms to  mobipesa
                  await axiod
                    .post(`${SMS_BaseUrl}`, formData_Mobi, CONFIG)

                  // send sms to mobipesa staffs
                  await axiod.post(`${SMS_BaseUrl_Officer}`, formData_Mobi, CONFIG)

                }

                /**
                 * @description debt collection pending
                 */
                else if (balance_two > (invoice_no[0].monthly_instalment_third +
                  invoice_no[0].interest_third + invoice_no[0].rollover_fee + invoice_no[0].insurance_instalment_third
                )) {

                  // first month instalment principal paid fully 
                  interest = 0;
                  insurance_instalment = 0;
                  monthly_instalment = 0;

                  // second month instalment principal paid fully 
                  interest_second = 0;
                  insurance_instalment_second = 0;
                  monthly_instalment_second = 0;

                  // third month installment
                  interest_third = 0;
                  principal_balance = 0;
                  insurance_instalment_third = 0;

                  monthly_instalment_third = 0;

                  // over three months
                  rollover_fee = 0;
                  debt_collection = invoice_no[0].debt_collection - (balance_two - (invoice_no[0].monthly_instalment_third +
                    invoice_no[0].interest_third + invoice_no[0].rollover_fee + invoice_no[0].insurance_instalment_third));
                }
                /**
                 * @description rollover fee pending
                 */
                else if (balance_two > (invoice_no[0].monthly_instalment_third +
                  invoice_no[0].interest_third + invoice_no[0].insurance_instalment_third
                )) {
                  // first month instalment principal paid fully 
                  interest = 0;
                  insurance_instalment = 0;
                  monthly_instalment = 0;

                  // second month instalment principal paid fully 
                  interest_second = 0;
                  insurance_instalment_second = 0;
                  monthly_instalment_second = 0;

                  // third month installment
                  interest_third = 0;
                  principal_balance = 0;
                  insurance_instalment_third = 0;
                  monthly_instalment_third = 0;

                  // over three months
                  rollover_fee = invoice_no[0].rollover_fee - (balance_two - (invoice_no[0].monthly_instalment_third +
                    invoice_no[0].interest_third + invoice_no[0].insurance_instalment_third));
                  debt_collection = invoice_no[0].debt_collection;

                }

                /**
                 * @description check third installment for the insurance if it was fully paid
                 */
                // rollover calculations
                else if (balance_two > (invoice_no[0].monthly_instalment_third +
                  invoice_no[0].interest_third)) { // check if the balance is greater than monthly instalment + interest for the second month

                  // first month instalment principal paid fully 
                  interest = 0;
                  insurance_instalment = 0;
                  monthly_instalment = 0;

                  // second month instalment principal paid fully 
                  interest_second = 0;
                  insurance_instalment_second = 0;
                  monthly_instalment_second = 0;

                  // third month installment
                  interest_third = 0;
                  principal_balance = 0;
                  insurance_instalment_third = invoice_no[0].insurance_instalment_third - (balance_two - (invoice_no[0].monthly_instalment_third + invoice_no[0].interest_third));
                  monthly_instalment_third = 0;

                  // over three months
                  rollover_fee = invoice_no[0].rollover_fee;
                  debt_collection = invoice_no[0].debt_collection;

                }
                else {
                  // first month instalment principal paid fully 
                  interest = 0;
                  insurance_instalment = 0;
                  monthly_instalment = 0;

                  // second month instalment principal paid fully 
                  interest_second = 0;
                  insurance_instalment_second = 0;
                  monthly_instalment_second = 0;

                  // third month installment
                  interest_third = invoice_no[0].interest_third - (balance_two - invoice_no[0].monthly_instalment_third);
                  principal_balance = 0;
                  insurance_instalment_third = invoice_no[0].insurance_instalment_third;
                  monthly_instalment_third = 0;

                  // over three months
                  rollover_fee = invoice_no[0].rollover_fee;
                  debt_collection = invoice_no[0].debt_collection;

                }

              } else {

                // first month fully paid
                interest = 0;
                insurance_instalment = 0;
                monthly_instalment = 0;

                // second month installment
                interest_second = 0;
                insurance_instalment_second = 0;
                monthly_instalment_second = 0;


                // third month installment
                interest_third = invoice_no[0].interest_third;
                principal_balance = invoice_no[0].principal_balance - (invoice_no[0].monthly_instalment + invoice_no[0].monthly_instalment_second + (invoice_no[0].monthly_instalment_third - balance_two));
                insurance_instalment_third = invoice_no[0].insurance_instalment_third;
                monthly_instalment_third = (invoice_no[0].monthly_instalment_third - balance_two);

                // over three months
                rollover_fee = invoice_no[0].rollover_fee;
                debt_collection = invoice_no[0].debt_collection;

              }
            }
            else if (balance > (invoice_no[0].monthly_instalment_second + invoice_no[0].interest_second)) { // check if the balance is greater than monthly instalment + interest for the second month
              interest = 0;
              insurance_instalment = 0;
              monthly_instalment = 0;

              interest_second = 0;
              principal_balance = invoice_no[0].principal_balance - (invoice_no[0].monthly_instalment_second + invoice_no[0].monthly_instalment);
              insurance_instalment_second = invoice_no[0].insurance_instalment_second - (balance - (invoice_no[0].monthly_instalment_second + invoice_no[0].interest_second));
              monthly_instalment_second = 0;

              // third month installment
              interest_third = invoice_no[0].interest_third;
              insurance_instalment_third = invoice_no[0].insurance_instalment_third;
              monthly_instalment_third = invoice_no[0].monthly_instalment_third;

              // over three months
              rollover_fee = invoice_no[0].rollover_fee;
              debt_collection = invoice_no[0].debt_collection;
            }

            else {
              // first month fully paid
              interest = 0;
              insurance_instalment = 0;
              monthly_instalment = 0;
              // second month installment
              interest_second = invoice_no[0].interest_second - (balance - invoice_no[0].monthly_instalment_second);
              principal_balance = invoice_no[0].principal_balance - (invoice_no[0].monthly_instalment_second + invoice_no[0].monthly_instalment);
              insurance_instalment_second = invoice_no[0].insurance_instalment_second;
              monthly_instalment_second = 0;

              // third month installment
              interest_third = invoice_no[0].interest_third;
              insurance_instalment_third = invoice_no[0].insurance_instalment_third;
              monthly_instalment_third = invoice_no[0].monthly_instalment_third;

              // over three months
              rollover_fee = invoice_no[0].rollover_fee;
              debt_collection = invoice_no[0].debt_collection;
            }

          } else {

            console.log("script runnfffing...");
            // first month fully paid
            interest = 0;
            insurance_instalment = 0;
            monthly_instalment = 0;
            // second month installment
            interest_second = invoice_no[0].interest_second;
            principal_balance = invoice_no[0].principal_balance - (invoice_no[0].monthly_instalment + (invoice_no[0].monthly_instalment_second - balance));
            insurance_instalment_second = invoice_no[0].insurance_instalment_second;
            monthly_instalment_second = (invoice_no[0].monthly_instalment_second - balance);


            // third month installment
            interest_third = invoice_no[0].interest_third;
            insurance_instalment_third = invoice_no[0].insurance_instalment_third;
            monthly_instalment_third = invoice_no[0].monthly_instalment_third;

            // over three months
            rollover_fee = invoice_no[0].rollover_fee;
            debt_collection = invoice_no[0].debt_collection;

          }

        }
        else if (invoice_no[0].check_amount > (invoice_no[0].monthly_instalment + invoice_no[0].interest)) {  //check amount paid if greater than monthly instalment + interest




          interest = 0;
          principal_balance = invoice_no[0].principal_balance - invoice_no[0].monthly_instalment;
          insurance_instalment = invoice_no[0].insurance_installment - (invoice_no[0].check_amount - (invoice_no[0].monthly_instalment + invoice_no[0].interest))
          monthly_instalment = 0;

          // second month instalment principal paid fully 
          interest_second = invoice_no[0].interest_second;
          insurance_instalment_second = invoice_no[0].insurance_instalment_second;
          monthly_instalment_second = invoice_no[0].monthly_instalment_second;

          // third month installment
          interest_third = invoice_no[0].interest_third;
          insurance_instalment_third = invoice_no[0].insurance_instalment_third;
          monthly_instalment_third = invoice_no[0].monthly_instalment_third;
          // console.log("script runnfffing...");

          // over three months
          rollover_fee = invoice_no[0].rollover_fee;
          debt_collection = invoice_no[0].debt_collection;

        }
        else {
          // principal monthly instalment fully covered
          interest = invoice_no[0].interest - (invoice_no[0].check_amount - invoice_no[0].monthly_instalment);
          principal_balance = invoice_no[0].principal_balance - invoice_no[0].monthly_instalment;
          insurance_instalment = invoice_no[0].insurance_installment;
          monthly_instalment = 0;

          // second month instalment principal paid fully 
          interest_second = invoice_no[0].interest_second;
          insurance_instalment_second = invoice_no[0].insurance_instalment_second;
          monthly_instalment_second = invoice_no[0].monthly_instalment_second;

          // third month installment
          interest_third = invoice_no[0].interest_third;
          insurance_instalment_third = invoice_no[0].insurance_instalment_third;
          monthly_instalment_third = invoice_no[0].monthly_instalment_third;

          // over three months
          rollover_fee = invoice_no[0].rollover_fee;
          debt_collection = invoice_no[0].debt_collection;

        }
      } else {

        console.log('second month fully paid');
        // first month installment not fully paid
        interest = invoice_no[0].interest;
        principal_balance = invoice_no[0].principal_balance - invoice_no[0].check_amount;
        insurance_instalment = invoice_no[0].insurance_installment;
        monthly_instalment = (invoice_no[0].monthly_instalment - invoice_no[0].check_amount);


        // second month instalment principal paid fully 
        interest_second = invoice_no[0].interest_second;
        insurance_instalment_second = invoice_no[0].insurance_instalment_second;
        monthly_instalment_second = invoice_no[0].monthly_instalment_second;

        // third month installment
        interest_third = invoice_no[0].interest_third;
        insurance_instalment_third = invoice_no[0].insurance_instalment_third;
        monthly_instalment_third = invoice_no[0].monthly_instalment_third;

        // over three months
        rollover_fee = invoice_no[0].rollover_fee;
        debt_collection = invoice_no[0].debt_collection;
      }


      loan_balance = interest + interest_third + interest_second +
        monthly_instalment + monthly_instalment_second + monthly_instalment_third +
        insurance_instalment + insurance_instalment_second + insurance_instalment_third; // loan balance

      // first month message
      if (diffInDays >= 59 && diffInDays <= 90) {

        if (invoice_no[0].lock_period == 2) {  // second month porccessed already
          month_period = 2;

          let check_instalment = ((invoice_no[0].monthly_instalment + invoice_no[0].interest + invoice_no[0].insurance_installment) + (invoice_no[0].monthly_instalment_second + invoice_no[0].interest_second + invoice_no[0].insurance_instalment_second)) - invoice_no[0].check_amount;

          if (check_instalment > 0) {
            mtext = `Dear ${farmer[0].name}, your loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The loan instalment balance is ${formatter.format(check_instalment)} due on ${loan_due_second_installation}.\nHelp desk 0748320516`;
            text_mobi = `, a loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid by ${farmer[0].name}: Mobile No. ${farmer[0].msisdn} on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The instalment balance is ${formatter.format(check_instalment)} due on ${loan_due_second_installation}`;



          } else {
            mtext = `Dear ${farmer[0].name}, your loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The loan balance is ${formatter.format(loan_balance)}. The instalment is now fully paid up.\nHelp desk 0748320516`;
            text_mobi = `, a loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid by ${farmer[0].name}: Mobile No. ${farmer[0].msisdn} on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The instalment is now fully paid up.`;

          }
        } else {
          month_period = 1;
          console.log('first month message');
          let check_instalment = (invoice_no[0].monthly_instalment + invoice_no[0].interest + invoice_no[0].insurance_installment) - invoice_no[0].check_amount;
          console.log('check_instalment', check_instalment);
          if (check_instalment > 0) {
            mtext = `Dear ${farmer[0].name}, your loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The loan instalment balance is ${formatter.format(check_instalment)} due on ${loan_due_fisrt_installation}.\nHelp desk 0748320516`;
            text_mobi = `, a loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid by ${farmer[0].name}: Mobile No. ${farmer[0].msisdn} on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The instalment balance is ${formatter.format(check_instalment)} due on ${loan_due_fisrt_installation}`;

          } else {
            mtext = `Dear ${farmer[0].name}, your loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The loan balance is ${formatter.format(loan_balance)}. The instalment is now fully paid up.\nHelp desk 0748320516`;
            text_mobi = `, a loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid by ${farmer[0].name}: Mobile No. ${farmer[0].msisdn} on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The instalment is now fully paid up.`;

          }
        }
      }
      // second month message
      else if (diffInDays >= 29 && diffInDays <= 58) {

        if (invoice_no[0].lock_period == 4) { // third month proccessed already
          month_period = 3;

          let check_instalment = ((invoice_no[0].monthly_instalment + invoice_no[0].interest_third + invoice_no[0].interest + invoice_no[0].insurance_installment) + invoice_no[0].monthly_instalment_third + (invoice_no[0].monthly_instalment_second + invoice_no[0].interest_second + invoice_no[0].insurance_instalment_second) + invoice_no[0].insurance_instalment_third) - invoice_no[0].check_amount;

          if (check_instalment > 0) {
            mtext = `Dear ${farmer[0].name}, your loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The loan instalment balance is ${formatter.format(check_instalment)} due on ${loan_due_third_installation}.\nHelp desk 0748320516`;
            text_mobi = `, a loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid by ${farmer[0].name}: Mobile No. ${farmer[0].msisdn} on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The instalment balance is ${formatter.format(check_instalment)} due on ${loan_due_third_installation}`;

          } else {
            mtext = `Dear ${farmer[0].name}, your loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The loan balance is ${formatter.format(loan_balance)}. The instalment is now fully paid up.\nHelp desk 0748320516`;
            text_mobi = `, a loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid by ${farmer[0].name}: Mobile No. ${farmer[0].msisdn} on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The instalment is now fully paid up.`;


          }
        }
        else {
          month_period = 2;

          let check_instalment = ((invoice_no[0].monthly_instalment + invoice_no[0].interest + invoice_no[0].insurance_installment) + (invoice_no[0].monthly_instalment_second + invoice_no[0].interest_second + invoice_no[0].insurance_instalment_second)) - invoice_no[0].check_amount;

          if (check_instalment > 0) {
            mtext = `Dear ${farmer[0].name}, your loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The loan instalment balance is ${formatter.format(check_instalment)} due on ${loan_due_second_installation}.\nHelp desk 0748320516`;
            text_mobi = `, a loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid by ${farmer[0].name}: Mobile No. ${farmer[0].msisdn} on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The instalment balance is ${formatter.format(check_instalment)} due on ${loan_due_second_installation}`;

          } else {
            mtext = `Dear ${farmer[0].name}, your loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The loan balance is ${formatter.format(loan_balance)}. The instalment is now fully paid up.\nHelp desk 0748320516`;
            text_mobi = `, a loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid by ${farmer[0].name}: Mobile No. ${farmer[0].msisdn} on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The instalment is now fully paid up.`;

          }
        }
      }

      // third month message
      else if (diffInDays >= -1 && diffInDays <= 28) {

        if (invoice_no[0].lock_period == 6) {
          month_period = 4;

          console.log(green("script running..."));
          let check_instalment = ((invoice_no[0].monthly_instalment + invoice_no[0].interest + invoice_no[0].interest_third +
            invoice_no[0].insurance_installment) + invoice_no[0].monthly_instalment_third + (invoice_no[0].monthly_instalment_second +
              invoice_no[0].interest_second + invoice_no[0].insurance_instalment_second) + invoice_no[0].insurance_instalment_third +
            invoice_no[0].rollover_fee) - invoice_no[0].check_amount;

          mtext = `Dear ${farmer[0].name}, your loan of ${formatter.format(invoice_no[0].check_amount)} has been paid on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The loan balance is ${formatter.format(check_instalment)}.\nHelp desk 0748320516`;
          text_mobi = `, loan of ${formatter.format(invoice_no[0].check_amount)} has been paid by ${farmer[0].name}: Mobile No. ${farmer[0].msisdn} on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The balance is ${formatter.format(check_instalment)}`;

          const guarantors = await loanService.getLoanLoanGuarantor({ reference: invoice_no[0].reference });  // check any request

          if (guarantors.length > 0) {
            const text_m = `Dear ${guarantors[0].name}, ${formatter.format(invoice_no[0].check_amount)} for the loan you guaranteed has been repaid by ${farmer[0].name} on ${mPayment_date}, The new loan balance is ${formatter.format(check_instalment)}.\nHelp desk 0748320516`;
            let formData_m = {
              "msisdn": guarantors[0].guarantor_msisdn,
              "text": text_m
            }
            await axiod.post(`${SMS_BaseUrl}`, formData_m, CONFIG);
          }
        } else {

          month_period = 3;

          let check_instalment = ((invoice_no[0].monthly_instalment + invoice_no[0].interest + invoice_no[0].interest_third + invoice_no[0].insurance_installment) + invoice_no[0].monthly_instalment_third + (invoice_no[0].monthly_instalment_second + invoice_no[0].interest_second + invoice_no[0].insurance_instalment_second) + invoice_no[0].insurance_instalment_third) - invoice_no[0].check_amount;

          if (check_instalment > 0) {
            mtext = `Dear ${farmer[0].name}, your loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The loan instalment balance is ${formatter.format(check_instalment)} due on ${loan_due_third_installation}.\nHelp desk 0748320516`;
            text_mobi = `, a loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid by ${farmer[0].name}: Mobile No. ${farmer[0].msisdn} on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The instalment balance is ${formatter.format(check_instalment)} due on ${loan_due_third_installation}`;


          } else {
            mtext = `Dear ${farmer[0].name}, your loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The loan balance is ${formatter.format(loan_balance)}. The instalment is now fully paid up.\nHelp desk 0748320516`;
            text_mobi = `, a loan instalment of ${formatter.format(invoice_no[0].check_amount)} has been paid by ${farmer[0].name}: Mobile No. ${farmer[0].msisdn} on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The instalment is now fully paid up.`;
          }
        }
      }
      else if (diffInDays >= -31 && diffInDays <= -2) {

        if (invoice_no[0].lock_period == 8) {

          month_period = 5;
          let check_instalment = ((invoice_no[0].monthly_instalment + invoice_no[0].interest + invoice_no[0].interest_third +
            invoice_no[0].insurance_installment) + invoice_no[0].monthly_instalment_third + (invoice_no[0].monthly_instalment_second +
              invoice_no[0].interest_second + invoice_no[0].insurance_instalment_second) + invoice_no[0].insurance_instalment_third +
            invoice_no[0].rollover_fee + invoice_no[0].debt_collection) - invoice_no[0].check_amount;

          mtext = `Dear ${farmer[0].name}, your loan of ${formatter.format(invoice_no[0].check_amount)} has been paid on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The loan balance is ${formatter.format(check_instalment)}.\nHelp desk 0748320516`;
          text_mobi = `, loan of ${formatter.format(invoice_no[0].check_amount)} has been paid by ${farmer[0].name}: Mobile No. ${farmer[0].msisdn} on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The balance is ${formatter.format(check_instalment)}`;

          const guarantors = await loanService.getLoanLoanGuarantor({ reference: invoice_no[0].reference });  // check any request
          if (guarantors.length > 0) {
            const text_m = `Dear ${guarantors[0].name}, ${formatter.format(invoice_no[0].check_amount)} for the loan you guaranteed has been repaid by ${farmer[0].name} on ${mPayment_date}, The new loan balance is ${formatter.format(check_instalment)}.\nHelp desk 0748320516`;
            let formData_m = {
              "msisdn": guarantors[0].guarantor_msisdn,
              "text": text_m
            }
            await axiod.post(`${SMS_BaseUrl}`, formData_m, CONFIG);
          }

        } else {
          month_period = 4;
          let check_instalment = ((invoice_no[0].monthly_instalment + invoice_no[0].interest + invoice_no[0].interest_third +
            invoice_no[0].insurance_installment) + invoice_no[0].monthly_instalment_third + (invoice_no[0].monthly_instalment_second +
              invoice_no[0].interest_second + invoice_no[0].insurance_instalment_second) +
            invoice_no[0].insurance_instalment_third + invoice_no[0].rollover_fee) - invoice_no[0].check_amount;

          mtext = `Dear ${farmer[0].name}, your loan of ${formatter.format(invoice_no[0].check_amount)} has been paid on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The loan balance is ${formatter.format(check_instalment)}.\nHelp desk 0748320516`;
          text_mobi = `, loan of ${formatter.format(invoice_no[0].check_amount)} has been paid by ${farmer[0].name}: Mobile No. ${farmer[0].msisdn} on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The balance is ${formatter.format(check_instalment)}`;

          const guarantors = await loanService.getLoanLoanGuarantor({ reference: invoice_no[0].reference });  // check any request
          if (guarantors.length > 0) {
            const text_m = `Dear ${guarantors[0].name}, ${formatter.format(invoice_no[0].check_amount)} for the loan you guaranteed has been repaid by ${farmer[0].name} on ${mPayment_date}, The new loan balance is ${formatter.format(check_instalment)}.\nHelp desk 0748320516`;
            let formData_m = {
              "msisdn": guarantors[0].guarantor_msisdn,
              "text": text_m
            }
            await axiod.post(`${SMS_BaseUrl}`, formData_m, CONFIG);
          }
        }
      }
      else if (diffInDays >= -60 && diffInDays <= -32) {
        month_period = 5;
        let check_instalment = ((invoice_no[0].monthly_instalment + invoice_no[0].interest + invoice_no[0].interest_third +
          invoice_no[0].insurance_installment) + invoice_no[0].monthly_instalment_third + (invoice_no[0].monthly_instalment_second +
            invoice_no[0].interest_second + invoice_no[0].insurance_instalment_second) + invoice_no[0].insurance_instalment_third +
          invoice_no[0].rollover_fee + invoice_no[0].debt_collection) - invoice_no[0].check_amount;

        mtext = `Dear ${farmer[0].name}, your loan of ${formatter.format(invoice_no[0].check_amount)} has been paid on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The loan balance is ${formatter.format(check_instalment)}.\nHelp desk 0748320516`;
        text_mobi = `, loan of ${formatter.format(invoice_no[0].check_amount)} has been paid by ${farmer[0].name}: Mobile No. ${farmer[0].msisdn} on ${mPayment_date}, loan number: ${invoice_no[0].reference}. The balance is ${formatter.format(check_instalment)}`;

        const guarantors = await loanService.getLoanLoanGuarantor({ reference: invoice_no[0].reference });  // check any request
        if (guarantors.length > 0) {
          const text_m = `Dear ${guarantors[0].name}, ${formatter.format(invoice_no[0].check_amount)} for the loan you guaranteed has been repaid by ${farmer[0].name} on ${mPayment_date}, The new loan balance is ${formatter.format(check_instalment)}.\nHelp desk 0748320516`;
          let formData_m = {
            "msisdn": guarantors[0].guarantor_msisdn,
            "text": text_m
          }
          await axiod.post(`${SMS_BaseUrl}`, formData_m, CONFIG);
        }
      }


      console.log("reached here")
      console.log({
        credit: invoice_no[0].check_amount,
        debit: principal_balance,
        interest: interest,
        balance: loan_balance,
        insurance_fee: insurance_instalment,
        insurance_balance: (insurance_instalment + insurance_instalment_second + insurance_instalment_third),

        insurance_instalment_second: insurance_instalment_second,
        insurance_instalment_third: insurance_instalment_third,

        monthly_instalment: monthly_instalment,
        monthly_instalment_second: monthly_instalment_second,
        monthly_instalment_third: monthly_instalment_third,

        rollover_fee: rollover_fee,
        debt_collection: debt_collection,


        interest_second: interest_second,
        interest_third: interest_third,

        narrative: `${invoice_no[0].check_amount} deposited by ${farmer[0].name}`,
        loan_id: invoice_no[0].id,
        farmer_id: invoice_no[0].farmer_id,
        period: month_period
      })




      console.log(green("loan payment updated"));

      await loanService.insertIntoStatements({
        credit: invoice_no[0].check_amount,
        debit: principal_balance,
        interest: interest,
        balance: loan_balance,
        insurance_fee: insurance_instalment,
        insurance_balance: (insurance_instalment + insurance_instalment_second + insurance_instalment_third),

        insurance_instalment_second: insurance_instalment_second,
        insurance_instalment_third: insurance_instalment_third,

        monthly_instalment: monthly_instalment,
        monthly_instalment_second: monthly_instalment_second,
        monthly_instalment_third: monthly_instalment_third,

        interest_second: interest_second,
        interest_third: interest_third,


        rollover_fee: rollover_fee,
        debt_collection: debt_collection,

        narrative: `${invoice_no[0].check_amount} deposited by ${farmer[0].name}`,
        loan_id: invoice_no[0].id,
        farmer_id: invoice_no[0].farmer_id,
        period: month_period
      });
      submit = await loanService.updateLoanPayment(
        {
          id: invoice_no[0].id,
          amount: principal_balance,
          interest: interest,
          insurance_balance: (insurance_instalment + insurance_instalment_second + insurance_instalment_third),
          // monthly_instalment: instalment,
          insurance_installment: insurance_instalment,
          insurance_instalment_second: insurance_instalment_second,
          insurance_instalment_third: insurance_instalment_third,

          monthly_instalment: monthly_instalment,
          monthly_instalment_second: monthly_instalment_second,
          monthly_instalment_third: monthly_instalment_third,


          rollover_fee: rollover_fee,
          debt_collection: debt_collection,

          interest_second: interest_second,
          interest_third: interest_third,
          check_amount: 0,
          period_three: period_three
        }
      );

      let formData = {
        "msisdn": farmer[0].msisdn.toString(),
        "text": mtext
      }

      console.log("here", farmer[0].user_id)
      
      // send sms to the borrower
      let formData_Mobi = {
        "msisdn": SMS.MOBIPESA.toString(),
        "text": text_mobi,
        "user_id": farmer[0].user_id
      }

      
      await axiod.post(`${SMS_BaseUrl}`, formData, CONFIG)

      // send sms to mobipesa staffs
      await axiod.post(`${SMS_BaseUrl_Officer}`, formData_Mobi, CONFIG)

      // send sms to  mobipesa
      await axiod.post(`${SMS_BaseUrl}`, formData_Mobi, CONFIG)


      start();
    } else {
      start();
    }
  } else {

    start();
  }
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
  const url = `${protocol}${hostname ?? "localhost"}:${port}`;
  console.log(`${yellow("Listening on:")} ${green(url)}`,);
});
await app.listen({ port });
