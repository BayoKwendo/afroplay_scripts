import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import General from "../interfaces/general.ts";

export default {

    // get customers
    getCustomers: async ({ msisdn }: General) => {
        const result = await client.query(
            `SELECT msisdn, balance,active from ${TABLE.CUSTOMERS} WHERE msisdn = ${msisdn}`,
        );
        return result;
    },

    addSessionID: async ({ msisdn, session_id }: General,) => {
        const result = await client.query(`INSERT INTO
        ${TABLE.SESSION}
      SET
        msisdn = ?,
        session_id = ?`, [
            msisdn,
            session_id
        ]);
        return result;
    },

    createCustomer: async ({ msisdn, pin }: General,) => {
        const result = await client.query(`INSERT INTO
        ${TABLE.CUSTOMERS}
      SET
        msisdn = ?,
        pin = ?`, [
            msisdn,
            pin
        ]);
        return result;
    },


    //GAME
    createGame: async ({ name }: General,) => {
        const result = await client.query(`INSERT INTO 
          ${TABLE.GAME} SET name =?`, [
            name
        ]);
        return result;
    },


    editGame: async ({ name, id }: General) => {
        const result = await client.query(`UPDATE 
          ${TABLE.GAME} SET name =? WHERE id = ?`, [
            name,
            id
        ]);
        return result;
    },


    deleteGame: async ({ id }: General,) => {
        const result = await client.query(`DELETE FROM ${TABLE.GAME} WHERE id = ?`, [
            id
        ]);
        return result;
    },

    getGame: async () => {
        const result = await client.query(`SELECT name,id, created_on FROM  ${TABLE.GAME}`);
        return result;
    },

    getRoles: async () => {
        const result = await client.query(`SELECT * FROM  ${TABLE.ROLES}`);
        return result;
    },

    // login user
    loginUser: async ({ username }: General) => {
        const [result] = await client.query(
            `SELECT s.*, s.id user_id, r.name role_name, s.msisdn, r.id role_id FROM users s 
             inner join roles r on s.role_id = r.id
             WHERE s.username = ?`,
            [username],
        );
        return result;
    },


    // get users
    getAllUsers: async () => {
        const result = await client.query(
            `SELECT s.*, s.id user_id, r.name role_name, r.id role_id FROM users s 
             inner join roles r on s.role_id = r.id`,
        );
        return result;
    },

    updateUser: async ({ password, username }: General,) => {
        const query = await client.query(`UPDATE users SET password = ? WHERE username = ? `, [password, username]);
        return query;
    },

    editUser: async ({ username, msisdn, name, role_id, id }: General) => {
        const result = await client.query(`UPDATE 
          users SET username =?, msisdn=?,  name=?,role_id=? WHERE id = ?`, [
            username,
            msisdn,
            name,
            role_id,
            id
        ]);
        return result;
    },


    deleteUser: async ({ id }: General) => {
        const result = await client.query(`DELETE FROM users WHERE id = ?`, [
            id
        ]);
        return result;
    },


    createUser: async ({ username, msisdn, name, role_id, password, repeat_password }: General) => {
        const result = await client.query(`INSERT INTO 
          users SET username =?, msisdn=?, name=?,role_id=?, password=?`, [
            username,
            msisdn,
            name,
            role_id,
            password
        ]);
        return result;
    },




    addTransaction: async ({ msisdn, amount, reference }: General,) => {
        const result = await client.query(`INSERT INTO
        deposit_requests
      SET
        msisdn = ?,
        amount = ?,
        reference = ?`, [
            msisdn,
            amount,
            reference
        ]);
        return result;
    },


    updateTransaction: async ({ status, transaction_id, reference }: General,) => {
        const result = await client.query(`UPDATE deposit_requests
      SET
        status = ?,
        checked=1,
        transaction_id=? WHERE
        reference=? AND checked = 0`, [
            status,
            transaction_id,
            reference
        ]);
        return result;
    },

    getTransaction: async ({ transaction_id, reference }: General,) => {
        const [result] = await client.query(`SELECT amount, msisdn FROM deposit_requests
        WHERE transaction_id=? AND reference=?`, [
            transaction_id,
            reference
        ]);
        return result;
    },

    updateCustomerBalance: async ({ msisdn, amount }: General,) => {
        const result = await client.query(`UPDATE ${TABLE.CUSTOMERS}
            SET balance = balance + ${amount} WHERE msisdn=?`, [
            msisdn
        ]);
        return result;
    },



};
