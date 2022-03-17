import { SMS } from './db/config.ts';
import { Application, HttpServerNative } from "https://deno.land/x/oak/mod.ts";
import { green, yellow } from "https://deno.land/std/fmt/colors.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import smsService from './services/smsService.ts';
import { Router } from 'https://deno.land/x/oak/mod.ts';
import axiod from 'https://deno.land/x/axiod/mod.ts';

const app = new Application({
  serverConstructor: HttpServerNative
});

const port = 1204;
app.use(
  oakCors({
    origin: "*",
    maxAge: 8640033
  }),
);
const router = new Router();

router.get('/health', async (ctx: any) => {
  ctx.response.body = {
    status: 'OK',
    message: 'SMS Server is running'
  };
})

router
  .post('/send_sms', async (ctx: any) => {
    console.log(ctx.request.body);
    try {
      const body = await ctx.request.body();
      const values = await body.value;

      let formData =
      {
        apikey: `afb20f472aeb3706b8bfb5f3178c94808c459d7479c46b5a4b3e73a8abcd70e2`,
        server: `AFMTNVETH`,
        sim: `1`,
        number: `2348103431619`,
        message: `test`,
        url: ""
      }

    const sms =  await axiod.post(`https://simhostng.com/api/sms`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      ctx.response.status = 200;
      ctx.response.body = {
        success: true,
        message: sms,
      };

    } catch (error) {
      // ctx.response.status = 200;
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
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