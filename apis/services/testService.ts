import client from "../db/client.ts";


export default {
    connectionPool: async () => {
        const [result]= await client.query(`SELECT 1`);
        return result;
    }
};