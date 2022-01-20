
import { Application, HttpServerNative } from "https://deno.land/x/oak/mod.ts";

import { green, yellow } from "https://deno.land/std/fmt/colors.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import userRouter from "./routes/user.route.ts";
import testRouter from "./routes/connect.route.ts";
import logger from './middlewares/logger.ts';
import notFound from './middlewares/notFound.ts';

const app = new Application({
  serverConstructor: HttpServerNative
});

const port = 2525;
app.use(
  oakCors({
    origin: "*",
    maxAge: 8640033
  }),
);

app.use(logger.logger);
app.use(logger.responseTime);

app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.use(testRouter.routes());
app.use(testRouter.allowedMethods());

// 404 page
app.use(notFound);
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
