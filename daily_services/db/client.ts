import { Client, ClientConfig } from "https://deno.land/x/mysql/mod.ts";
// config
import { DATABASE, TABLE } from "./config.ts";

// const config: ClientConfig = {
//   hostname: "157.230.229.119",
//   username: "root",
//   password: "VF3ax6geGdfg32dufgf8",
//   db: "ngombe_loan",
//   port: 10330,
  
//   debug: true
// }


// const config: ClientConfig = {
//   hostname: "localhost",
//   username: "root",
//   password: "BrianKwendo@96",
//   db: "ngombe_loan",
//   debug: true
// }

const config: ClientConfig = {
  hostname: "localhost",
  username: "root",
  password: "cLCs26bFTHnHSQuT",
  db: DATABASE,
  port: 3306,
  debug: true
}

const client = await new Client().connect(config);

const run = async () => {
  await client.execute(`CREATE DATABASE IF NOT EXISTS ${DATABASE}`);

  await client.execute(`USE ${DATABASE}`);

 /**  
   * @todo Uncomment to create table if needed
   */

  // delete table if it exists before

  // await client.execute(`DROP TABLE IF EXISTS ${TABLE.EMPLOYEE}`);

  // create table

  // await client.execute(`
  //   CREATE TABLE ${TABLE.EMPLOYEE} (
  //       id int(11) NOT NULL AUTO_INCREMENT,
  //       name varchar(100) NOT NULL,
  //       department varchar(100),
  //       isActive boolean NOT NULL default false,
  //       PRIMARY KEY (id)
  //   ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  // `);
  
};



run();



export default client;
