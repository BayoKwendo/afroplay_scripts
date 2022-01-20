import client from '../db/client.ts';
import { TABLE } from '../db/config.ts';
import Livestock from '../interfaces/livestock.ts';

export default {
	// find livestock by id
	doesExistById: async ({ id }: Livestock) => {
		const [result] = await client.query(`SELECT COUNT(*) count FROM ${TABLE.LIVESTOCK} WHERE id = ? LIMIT 1`, [
			id,
		]);
		return result.count > 0;
	},

	// create livestock
	addLiveStock: async ({
		farmer_id,
		breed,
		vacinations,
		vet_name,
		vet_reg_no,
		tag_id,
		logo_url,
		logo_url_2,
		logo_url_3,
		next_to_cow,
		health_ratings,
		valuations,
		gender,
		age,
		latitude,
		longitude,
		location
	}: Livestock) => {
		const query = await client.query(
			`INSERT INTO ${TABLE.LIVESTOCK} SET 
			 farmer_id =?,
			 breed=?,
			 vacinations =?, 
			 vet_name =?,
			 vet_reg_no =?,
			 tag_id =?,
			 logo_url =?,
			 logo_url_2 =?,
			 logo_url_3 =?,
			 next_to_cow =?,
			 health_ratings =?, 
			 value =?, 
			 gender =?, 
			 age =?, 
			 location =?,
			 latitude =?,
			 longitude=?
			 `,
			[
				farmer_id,
				breed,
				vacinations,
				vet_name,
				vet_reg_no,
				tag_id,
				logo_url,
				logo_url_2,
				logo_url_3,
				next_to_cow,
				health_ratings,
				valuations,
				gender,
				age,
				location,
				latitude,
				longitude
			]
		);
		return query;
	},



	// create livestock
	updateLivestock: async ({
		id,
		insurance_url,
		vet_valuation,
		vaccination_regime_form
	}: Livestock) => {
		const query = await client.query(
			`UPDATE ${TABLE.LIVESTOCK} SET 
			insurance_url =?,
			vet_valuation_form=?,
			complete=1,
			vacination_regime_report=? WHERE id = ${id}`,
			[
				insurance_url,
				vet_valuation,
				vaccination_regime_form
			]
		);
		return query;
	},


	//update loan status
	updateCowValue: async ({ valuations,
		vet_name,
		vet_reg_no, reason, id }: Livestock) => {
		const query = await client.query(
			`UPDATE  ${TABLE.LIVESTOCK} SET 
		  value =?,
		  vet_name =?,
		  description=?,
		  vet_reg_no =? WHERE id =${id}`,
			[
				valuations,
				vet_name,
				reason,
				vet_reg_no
			]
		);
		return query;
	},

	// edit livestock
	editLivestock: async ({
		farmer_id,
		breed,
		vacinations,
		health_ratings,
		valuations,

		vet_name,
		vet_reg_no,
		tag_id,
		logo_url,
		insurance_url,

		gender,
		age,
		location,
		id,
	}: Livestock) => {
		const query = await client.query(
			`UPDATE ${TABLE.LIVESTOCK} SET 
			 farmer_id =?,
			 breed=?,
			 vacinations =?, 
			 health_ratings =?, 
			 value =?, 
			 vet_name =?,
			 vet_reg_no =?,
			 tag_id =?,
			 logo_url =?,
			 insurance_url =?,
			 gender =?, 
			 age =?, 
			 location =?
			 WHERE
			 id=?`,
			[
				farmer_id,
				breed,
				vacinations,
				vet_name,
				vet_reg_no,
				tag_id,
				logo_url,
				insurance_url,
				health_ratings,
				valuations,
				gender,
				age,
				location,
				id,
			]
		);
		return query;
	},


	//get all livestock
	getLivestock: async ({ offset, loan_status, mloan_status, page_size }: Livestock) => {
		return await client.query(`
		SELECT 
		ln.amount_disbursed,
		ls.status,
		 ls.description,  
		 ls.narative, 
		ln.due_date, 
		l.*, 
		f.name,
		b.branch_name, 
		f.id farmer_id,
		ln.reference,
		ln.id loan_id,
		f.id_front_photo, 
		f.id_no, 
		f.latitude,
		f.longitude,
		f.passport_photo, 
		f.msisdn
        FROM ${TABLE.LIVESTOCK} l 
		inner join ${TABLE.FARMER} f on l.farmer_id = f.id
		left join ${TABLE.LOAN} ln on ln.livestock_id = l.id
		INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
		LEFT JOIN ${TABLE.BRANCHES} b ON b.id = u.branch_id 
	
		inner join ${TABLE.LOAN_STATUS} ls 
		on ln.reference = ls.loan_reference
		WHERE 
		l.loan_status = ${loan_status} AND
		ln.completion_status = ${mloan_status} AND
		ls.id = (SELECT MAX(id) FROM ${TABLE.LOAN_STATUS} WHERE loan_reference = ln.reference) AND
		l.id GROUP BY l.tag_id ORDER BY id DESC LIMIT ${offset},${page_size}`);
	},

	//get livestock count
	getLivestockCount: async ({ loan_status, mloan_status }: Livestock) => {
		const [result] = await client.query(`
		SELECT 
		COUNT(l.id) count,
		SUM(ln.amount_disbursed + 1133) approved_loan, 
	    SUM(ln.amount_disbursed) loan_issued 
		FROM 
		${TABLE.LIVESTOCK} l 
		inner join ${TABLE.FARMER} f on l.farmer_id = f.id
		left join ${TABLE.LOAN} ln on ln.livestock_id = l.id
		WHERE 
		l.loan_status = ${loan_status} AND
		ln.completion_status = ${mloan_status} AND
		l.id`);
		return result;
	},


	getLivestockCountBranch: async ({ loan_status, user_id, mloan_status }: Livestock) => {
		const [result] = await client.query(`
		SELECT 
		COUNT(l.id) count,
		SUM(ln.amount_disbursed + 1133) approved_loan, 
	    SUM(ln.amount_disbursed) loan_issued 
		FROM 
		${TABLE.LIVESTOCK} l 
		inner join ${TABLE.FARMER} f on l.farmer_id = f.id
		left join ${TABLE.LOAN} ln on ln.livestock_id = l.id
		INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
		WHERE  u.branch_id = (SELECT branch_id FROM ${TABLE.USERS} WHERE id = ${user_id})
		AND
		l.loan_status = ${loan_status} AND
		ln.completion_status = ${mloan_status} AND
		l.id`);
		return result;
	},

	//get per branch
	getLivestockBranchOne: async ({ offset, user_id, loan_status, mloan_status, page_size }: Livestock) => {
		return await client.query(`
			SELECT 
			ln.amount_disbursed,
			ls.status,
			 ls.description,  
			 ls.narative, 
			ln.due_date, 
			l.*, 
			f.name,
			b.branch_name, 
			f.id farmer_id,
			ln.reference,
			ln.id loan_id,
			f.id_front_photo, 
			f.id_no, 
			f.latitude,
			f.longitude,
			f.passport_photo, 
			f.msisdn
			FROM ${TABLE.LIVESTOCK} l 
			inner join ${TABLE.FARMER} f on l.farmer_id = f.id
			left join ${TABLE.LOAN} ln on ln.livestock_id = l.id
			INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
			LEFT JOIN ${TABLE.BRANCHES} b ON b.id = u.branch_id 
			inner join ${TABLE.LOAN_STATUS} ls 
			on ln.reference = ls.loan_reference
			WHERE 
			l.loan_status = ${loan_status} AND
            u.branch_id = (SELECT branch_id FROM ${TABLE.USERS} WHERE id = ${user_id})
			AND
			ln.completion_status = ${mloan_status} AND
			ls.id = (SELECT MAX(id) FROM ${TABLE.LOAN_STATUS} WHERE loan_reference = ln.reference) AND
			l.id GROUP BY l.tag_id ORDER BY id DESC LIMIT ${offset},${page_size}`);
	},









	getLivestockPaid: async ({ offset, page_size }: Livestock) => {
		return await client.query(`
		SELECT 
		ln.amount_disbursed,
		ls.status,
		 ls.description,  
		 ls.narative, 
		ln.due_date, 
		l.*, 
		f.name,
		b.branch_name, 
		f.id farmer_id,
		ln.reference,
		ln.id loan_id,
		f.id_front_photo, 
		f.id_no, 
		f.latitude,
		f.longitude,
		f.passport_photo, 
		f.msisdn
        FROM ${TABLE.LIVESTOCK} l 
		inner join ${TABLE.FARMER} f on l.farmer_id = f.id
		left join ${TABLE.LOAN} ln on ln.livestock_id = l.id
		INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
		LEFT JOIN ${TABLE.BRANCHES} b ON b.id = u.branch_id 
	
		inner join ${TABLE.LOAN_STATUS} ls 
		on ln.reference = ls.loan_reference
		WHERE 
		ln.status_paid = 1 AND
		ln.completion_status = 2 AND
		ls.id = (SELECT MAX(id) FROM ${TABLE.LOAN_STATUS} WHERE loan_reference = ln.reference) AND
		l.id GROUP BY l.tag_id ORDER BY id DESC LIMIT ${offset},${page_size}`);
	},

	//get livestock count
	getLivestockCountPaid: async ({ loan_status, mloan_status }: Livestock) => {
		const [result] = await client.query(`
		SELECT 
		COUNT(l.id) count,
		SUM(ln.amount_disbursed + 1133) approved_loan, 
	    SUM(ln.amount_disbursed) loan_issued 
		FROM 
		${TABLE.LIVESTOCK} l 
		inner join ${TABLE.FARMER} f on l.farmer_id = f.id
		left join ${TABLE.LOAN} ln on ln.livestock_id = l.id
		WHERE 
		ln.status_paid = 1 AND
		ln.completion_status = 2 AND
		l.id`);
		return result;
	},


	getLivestockCountBranchPaid: async ({ loan_status, user_id, mloan_status }: Livestock) => {
		const [result] = await client.query(`
		SELECT 
		COUNT(l.id) count,
		SUM(ln.amount_disbursed + 1133) approved_loan, 
	    SUM(ln.amount_disbursed) loan_issued 
		FROM 
		${TABLE.LIVESTOCK} l 
		inner join ${TABLE.FARMER} f on l.farmer_id = f.id
		left join ${TABLE.LOAN} ln on ln.livestock_id = l.id
		INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
		WHERE  u.branch_id = (SELECT branch_id FROM ${TABLE.USERS} WHERE id = ${user_id})
		AND
		ln.status_paid = 1 AND
		ln.completion_status = 2 AND
		l.id`);
		return result;
	},

	//get per branch
	getLivestockBranchOnePaid: async ({ offset, user_id, loan_status, mloan_status, page_size }: Livestock) => {
		return await client.query(`
			SELECT 
			ln.amount_disbursed,
			ls.status,
			 ls.description,  
			 ls.narative, 
			ln.due_date, 
			l.*, 
			f.name,
			b.branch_name, 
			f.id farmer_id,
			ln.reference,
			ln.id loan_id,
			f.id_front_photo, 
			f.id_no, 
			f.latitude,
			f.longitude,
			f.passport_photo, 
			f.msisdn
			FROM ${TABLE.LIVESTOCK} l 
			inner join ${TABLE.FARMER} f on l.farmer_id = f.id
			left join ${TABLE.LOAN} ln on ln.livestock_id = l.id
			INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
			LEFT JOIN ${TABLE.BRANCHES} b ON b.id = u.branch_id 
			inner join ${TABLE.LOAN_STATUS} ls 
			on ln.reference = ls.loan_reference
			WHERE 
			l.loan_status = ${loan_status} AND
            u.branch_id = (SELECT branch_id FROM ${TABLE.USERS} WHERE id = ${user_id})
			AND
			ln.status_paid = 1 AND
			ln.completion_status = 2 AND
			ls.id = (SELECT MAX(id) FROM ${TABLE.LOAN_STATUS} WHERE loan_reference = ln.reference) AND
			l.id GROUP BY l.tag_id ORDER BY id DESC LIMIT ${offset},${page_size}`);
	},



	//get livestock filter count
	getLivestockCountFIlter: async ({ filter_value }: Livestock) => {
		const [result] = await client.query(`SELECT COUNT(id) count FROM ${TABLE.LIVESTOCK} WHERE 
		farmer_id = ${filter_value} OR tag_id = ${filter_value}`);
		return result.count;
	},

	//filter livestock details
	getLivestockFilter: async ({ filter_value, offset, page_size }: Livestock) => {
		return await client.query(`SELECT l.*, ln.status_paid, f.id_front_photo, f.name, f.id_no, f.msisdn ,f.passport_photo, f.msisdn
        FROM 
		${TABLE.LIVESTOCK} l 
		inner join ${TABLE.FARMER} f on l.farmer_id = f.id
		left join (SELECT status_paid,livestock_id, completion_status, id FROM ${TABLE.LOAN} WHERE completion_status IN (1,2) ORDER BY id) ln on ln.livestock_id = l.id
		WHERE 
		l.farmer_id = ${filter_value} OR 
		l.tag_id = ${filter_value} AND l.id ORDER BY l.id DESC LIMIT ${offset}, ${page_size}`);
	},



	//filter livestock details loand
	getLivestockFilterLoan: async ({ offset, filter_value, loan_status, mloan_status, page_size }: Livestock) => {
		return await client.query(`
		SELECT 
		ln.amount_disbursed,
		ls.status,
		 ls.description,  
		 ls.narative, 
		ln.due_date, 
		l.*, 
		f.name,
		b.branch_name, 
		f.id farmer_id,
		ln.reference,
		ln.id loan_id,
		f.id_front_photo, 
		f.id_no, 
		f.latitude,
		f.longitude,
		f.passport_photo, 
		f.msisdn
        FROM ${TABLE.LIVESTOCK} l 
		inner join ${TABLE.FARMER} f on l.farmer_id = f.id
		left join ${TABLE.LOAN} ln on ln.livestock_id = l.id
		INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
		LEFT JOIN ${TABLE.BRANCHES} b ON b.id = u.branch_id 
		inner join ${TABLE.LOAN_STATUS} ls 
		on ln.reference = ls.loan_reference
		WHERE 
		l.loan_status = ${loan_status} AND
		ln.completion_status = ${mloan_status} AND
		ls.id = (SELECT MAX(id) FROM ${TABLE.LOAN_STATUS} WHERE loan_reference = ln.reference) AND
		l.id AND 
			(f.name LIKE "%${filter_value}%" OR
			f.msisdn LIKE "%${filter_value}%" OR
			f.id_no LIKE "%${filter_value}%" OR 
			ln.reference LIKE "%${filter_value}%" OR 
			b.branch_name LIKE "%${filter_value}%")
		GROUP BY l.tag_id ORDER BY id DESC`);
	},


	//filter paid
	getLivestockFilterLoanPaid: async ({ offset, filter_value, loan_status, mloan_status, page_size }: Livestock) => {
		return await client.query(`
		SELECT 
		ln.amount_disbursed,
		ls.status,
		 ls.description,  
		 ls.narative, 
		ln.due_date, 
		l.*, 
		f.name,
		b.branch_name, 
		f.id farmer_id,
		ln.reference,
		ln.id loan_id,
		f.id_front_photo, 
		f.id_no, 
		f.latitude,
		f.longitude,
		f.passport_photo, 
		f.msisdn
        FROM ${TABLE.LIVESTOCK} l 
		inner join ${TABLE.FARMER} f on l.farmer_id = f.id
		left join ${TABLE.LOAN} ln on ln.livestock_id = l.id
		INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
		LEFT JOIN ${TABLE.BRANCHES} b ON b.id = u.branch_id 
		inner join ${TABLE.LOAN_STATUS} ls 
		on ln.reference = ls.loan_reference
		WHERE 
		ln.status_paid = 1 AND
			ln.completion_status = 2 AND
			ls.id = (SELECT MAX(id) FROM ${TABLE.LOAN_STATUS} WHERE loan_reference = ln.reference) AND
		l.id AND 
			(f.name LIKE "%${filter_value}%" OR
			f.msisdn LIKE "%${filter_value}%" OR
			f.id_no LIKE "%${filter_value}%" OR 
			ln.reference LIKE "%${filter_value}%" OR 
			b.branch_name LIKE "%${filter_value}%")
		GROUP BY l.tag_id ORDER BY id DESC`);
	},
	//get all livestock loans
	getLivestockBranch: async ({ offset, loan_status, mloan_status, page_size }: Livestock) => {
		return await client.query(`
			SELECT 
			ln.amount_disbursed,
			ls.status,
			 ls.description,  
			 ls.narative, 
			ln.due_date, 
			l.*, 
			f.name, 
			f.id farmer_id,
			ln.reference,
			ln.id loan_id,
			f.id_front_photo, 
			f.id_no, 
			f.latitude,
	
			f.longitude,
			f.passport_photo, 
			f.msisdn
			FROM ${TABLE.LIVESTOCK} l 
			inner join ${TABLE.FARMER} f on l.farmer_id = f.id
			INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
		    LEFT JOIN ${TABLE.BRANCHES} b ON b.id = u.branch_id 
			left join ${TABLE.LOAN} ln on ln.livestock_id = l.id
			inner join ${TABLE.LOAN_STATUS} ls 
			on ln.reference = ls.loan_reference
			WHERE 
			l.loan_status = ${loan_status} AND
			ln.completion_status = ${mloan_status} AND
			ls.id = (SELECT MAX(id) FROM ${TABLE.LOAN_STATUS} WHERE loan_reference = ln.reference) AND
			l.id GROUP BY l.tag_id ORDER BY id DESC LIMIT ${offset},${page_size}`);
	},



	//filter livestock details
	getLivestockFilterFilter: async ({ filter_value, offset, page_size }: Livestock) => {
		return await client.query(`SELECT l.*, f.id_front_photo, f.name, f.id_no, f.msisdn ,f.passport_photo, f.msisdn
        FROM ${TABLE.LIVESTOCK} l inner join ${TABLE.FARMER} f on l.farmer_id = f.id
		WHERE 
		l.farmer_id = ${filter_value} OR 
		l.tag_id = ${filter_value} AND l.id ORDER BY l.id DESC LIMIT ${offset}, ${page_size}`);
	},


	//delete
	deleteLivestock: async ({ filter_value }: Livestock) => {
		const result = await client.query(`DELETE FROM ${TABLE.LIVESTOCK} WHERE id = ?`, [filter_value]);
		return result;
	},




	//REJECTED ACCOUNT
	getRejectedLoans: async ({ offset, page_size }: Livestock) => {
		return await client.query(`SELECT ls.*, f.name, f.id farmer_id, ln.livestock_id, 
		f.id_no, f.msisdn, ln.total_amount, ln.amount_disbursed, ln.applicant_fee, lv.value
						FROM ${TABLE.LOAN_STATUS} ls
						inner join ${TABLE.LOAN} ln on ln.reference = ls.loan_reference
						inner join ${TABLE.FARMER} f on ln.farmer_id = f.id
						inner join ${TABLE.LIVESTOCK} lv on lv.id = ln.livestock_id
						INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
						LEFT JOIN ${TABLE.BRANCHES} b ON b.id = u.branch_id 		
					    where ln.completion_status = 1 AND
						ls.status = "Rejected" OR ls.status = "Variete"   
				ORDER BY id DESC LIMIT ${offset},${page_size}`);
	},

	getCOUNT: async () => {
		const [result] = await client.query(
			`SELECT COUNT(ls.id) COUNT	FROM ${TABLE.LOAN_STATUS} ls
			inner join ${TABLE.LOAN} ln on ln.reference = ls.loan_reference
			inner join ${TABLE.FARMER} f on ln.farmer_id = f.id
			INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
			LEFT JOIN ${TABLE.BRANCHES} b ON b.id = u.branch_id 		
			where ln.completion_status = 1 AND 
			ls.status = "Rejected"`
		);
		return result.count;
	},

	//filter  details
	getRejectedFilter: async ({ filter_value }: Livestock) => {
		return await client.query(`SELECT ls.*, f.name, f.id_no, f.msisdn, ln.total_amount, ln.amount_disbursed
		FROM ${TABLE.LOAN_STATUS} ls
		inner join ${TABLE.LOAN} ln on ln.reference = ls.loan_reference
		inner join ${TABLE.FARMER} f on ln.farmer_id = f.id
		INNER JOIN ${TABLE.USERS} u ON u.id = f.user_id
		LEFT JOIN ${TABLE.BRANCHES} b ON b.id = u.branch_id 		
		where  ln.completion_status = 1 AND
		ls.status = "Rejected" 
		AND 
		(f.name LIKE "%${filter_value}%" OR
		f.id_no LIKE "%${filter_value}%" OR
		f.msisdn LIKE "%${filter_value}%" OR
		b.branch_name LIKE "%${filter_value}%")
		ls.loan_reference LIKE "%${filter_value}%"
ORDER BY id DESC LIMIT `);
	},


	updateRejectedAccount: async ({ id, name }: Livestock) => {
		const query = await client.query(
			`UPDATE ${TABLE.LOAN_STATUS} SET status = "Accepted" , description = "${name}" WHERE id = ${id}`,
		);
		return query;
	},
	
	updateRejectedVariete: async ({ id, name }: Livestock) => {
		const query = await client.query(
			`UPDATE ${TABLE.LOAN_STATUS} SET status = "Accepted" WHERE id = ${id}`,
		);
		return query;
	},


	updatLivestockStatus: async ({ id, name }: Livestock) => {
		const query = await client.query(
			`UPDATE ${TABLE.LIVESTOCK} SET loan_status = 5 WHERE id = ${id}`,
		);
		return query;
	}

};
