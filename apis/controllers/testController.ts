import TestService from "../services/testService.ts";
import * as log from "https://deno.land/std/log/mod.ts";

await new Promise((resolve) => setTimeout(resolve, 0));


export default {
    /**
     * @description Get all Employee List
     */
    connectionPool: async (ctx: any) => {
        try {
            // let kw = request.url.searchParams.get('page_number');
            // console.log("bayo", kw)
            const data = await TestService.connectionPool();
            ctx.response.status = 200;
            ctx.response.body = data;
        }
        catch (error) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: `Error: ${error}`,
            };
        }
    },
    /**
    * @description Test post requests
    */
    postRequests: async ({ request, response }: { request: any, response: any }) => {
        const body = await request.body();
        try {
            const values = await body.value;
            console.log("values", values)
            // const data = await TestService.connectionPool();
            response.status = 200;
            response.body = {
                success: true,
                message: "Success",
            };
        }
        catch (error) {
            response.status = 400;
            response.body = {
                success: false,
                message: `Error: ${error}`,
            };
        }
    },
};