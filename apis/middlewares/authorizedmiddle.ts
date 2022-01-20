import { Status } from 'https://deno.land/x/oak/mod.ts';

import { verify, decode } from 'https://deno.land/x/djwt/mod.ts';

import { key } from '../exports.ts';

export default async (ctx: any, next: any) => {
	const jwt = ctx.request.headers.get('Authorization');
	if (!jwt) {
		ctx.response.status = 401;
		ctx.response.body = {
			status: false,
			status_code: 401,
			message: 'Token Missing!',
		};
	} else {
		try {
			const data: any = await verify(jwt, key);
			ctx.cookies.delete('jwt');
			ctx.response.body = data;
			await next();
		} catch (error) {
			await next();
			// ctx.response.status = 401;
			// ctx.response.body = {
			// 	status_code: 401,
			// 	status: false,
			// 	message: `${error}`,
			// };
		}
	}
};
