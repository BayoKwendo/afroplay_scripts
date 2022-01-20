import { Client, ClientConfig } from "https://deno.land/x/mysql/mod.ts";
// config
import { DATABASE,MYSQL } from "./config.ts"; 

const config: ClientConfig = {
  hostname: MYSQL.host,
  username: MYSQL.user,
  password: MYSQL.password,
  db: MYSQL.database,
  port: MYSQL.port,
  debug: true
}

const client = await new Client().connect(config);
const run = async () => {
  await client.execute(`USE ${DATABASE}`);
};
run();

export default client;
