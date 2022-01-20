import { Application, HttpServerNative } from "https://deno.land/x/oak/mod.ts";
import { green, gray, yellow } from "https://deno.land/std/fmt/colors.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import loanService from './services/dailyService.ts';
import { Router } from 'https://deno.land/x/oak/mod.ts';
import { cron, start, stop, everyMinute, daily, weekly } from 'https://deno.land/x/deno_cron/cron.ts';
import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";

const app = new Application({
  serverConstructor: HttpServerNative
});

const port = 2310;
app.use(
  oakCors({
    origin: "*",
    maxAge: 8640033
  }),
);



const router = new Router()

daily(async () => {
  console.log(green("Running daily service..."));
  const daily = await loanService.getDaily();  // check any request
  let mPayment_date = moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss');

  for (let i = 0; i < daily.length; i++) {
    await task(i);
  }
  async function task(i: any) {
    await timer(1000);
    let addition_interest = (parseFloat(daily[i].total_interest) / 30);
    // let  = (parseFloat(daily[i].total_interest) / 30).toFixed(2);
    await loanService.updateLoanInterestDefaulting(
      {
        id: daily[i].id,
        interest: daily[i].rollover_fee + Number(addition_interest)
      })
    console.log(gray("The updates ends here one date " + mPayment_date));
    //credit, debit, interest, balance, loan_id, farmer_id, period
    await loanService.updateIntoStatements({
      interest: parseFloat(daily[i].rollover_fee) + Number(addition_interest),
      loan_id: daily[i].id,
      farmer_id: daily[i].farmer_id,
      period: 4
    });
  }
  function timer(ms: any) {
    return new Promise((res) => setTimeout(res, ms));
  }

  const mupdate = await loanService.updateTableLoans();  // check any request
  console.log(yellow(`${JSON.stringify(mupdate)}`));
 
});


router.get('/health', async (ctx: any) => {
  ctx.response.body = {
    status: 'OK',
    message: 'SMS Server is running'
  };
})

app.use(router.routes());
app.use(router.allowedMethods())
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
