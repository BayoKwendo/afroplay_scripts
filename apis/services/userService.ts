import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import General from "../interfaces/general.ts";

export default {

    // get customers
    getCustomers: async ({ msisdn }: General) => {
        const result = await client.query(
            `SELECT msisdn from ${TABLE.CUSTOMERS} WHERE msisdn = ${msisdn}`,
        );
        return result;
    },


    createCustomer: async ({ msisdn, pin }: General,) => {
        const result = await client.query(`INSERT INTO
        ${TABLE.CUSTOMERS}
      SET
        msisdn = ?
        pin = ?`, [
            msisdn,
            pin
        ]);
        return result;
    },

    // editUser: async ({ username, msisdn, name, branch_id, role_id, id, repeat_password }: User,) => {
    //     const result = await client.query(`UPDATE 
    //       users SET username =?, msisdn=?, branch_id=?, name=?,role_id=? WHERE id = ?`, [
    //         username,
    //         msisdn,
    //         branch_id,
    //         name,
    //         role_id,
    //         id
    //     ]);
    //     return result;
    // },


    // deleteUser: async ({ id }: User,) => {
    //     const result = await client.query(`DELETE FROM users WHERE id = ?`, [
    //         id
    //     ]);
    //     return result;
    // },


    // createBranch: async ({ branch_name }: User,) => {
    //     const result = await client.query(`INSERT INTO 
    //       ${TABLE.BRANCHES} SET branch_name =?`, [
    //         branch_name
    //     ]);
    //     return result;
    // },


    // // get braches
    // getBranch: async () => {
    //     const result = await client.query(`SELECT * FROM  ${TABLE.BRANCHES}`);
    //     return result;
    // },

    // getRoles: async () => {
    //     const result = await client.query(`SELECT * FROM  ${TABLE.ROLES}`);
    //     return result;
    // },

    // // login user
    // loginUser: async ({ username }: User) => {
    //     const [result] = await client.query(
    //         `SELECT s.*, s.id user_id, r.name role_name, s.msisdn, r.id role_id, b.id branch_id, b.branch_name FROM users s 
    //          inner join roles r on s.role_id = r.id
    //          inner join ${TABLE.BRANCHES} b on s.branch_id = b.id  
    //          WHERE s.username = ?`,
    //         [username],
    //     );
    //     return result;
    // },


    // // get users
    // getAllUsers: async () => {
    //     const result = await client.query(
    //         `SELECT s.*, s.id user_id, r.name role_name, r.id role_id, b.id branch_id, b.branch_name FROM users s 
    //          inner join roles r on s.role_id = r.id
    //          inner join ${TABLE.BRANCHES} b on s.branch_id = b.id`,
    //     );
    //     return result;
    // },

    // updateUser: async ({ password, username }: User,) => {
    //     const query = await client.query(`UPDATE users SET password = ? WHERE username = ? `, [password, username]);
    //     return query;
    // },


};
