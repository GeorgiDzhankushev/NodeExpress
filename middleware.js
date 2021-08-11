module.exports = {
	logger: (req, res, next) => {
		const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
		console.log(`${timestamp}\t${req.ip}\t${req.method} ${req.originalUrl}`);
		next();
	},

	notFound: (req, res) => res.status(404).send(),

	methodUnsupported: (req, res) => res.status(405).send(),

	handleError: (err, req, res, next) => {
		if ( err.message.includes('Unexpected token') && err.message.includes('in JSON') )
			res.status(400).send();
		else {
			console.log(err);
			res.status(500).send('There was a problem on our end');
		}
	},

	getRoot: (req, res) => {
		sql.query('SHOW TABLES', (err, results) => {
			// key contains the name of the db; better to get it this way than hard-code it
			const key = Object.keys( results[0] )[0]; 
			let tables = [];
			results.forEach(row => tables.push( row[key] ));
			res.send( {tables: tables} );
		});
	},

	getCustomers: (req, res) => {
		sql.query('SELECT name, age FROM customers', (err, results) => {
			let customers = [];
			results.forEach(row => customers.push( {name: row.name, age: row.age} ));
			res.send( {customers: customers} );
		});
	},

	postCustomers: (req, res) => {
		if (Object.keys(req.body).length < 2)
			return res.status(400).send();

		const name = req.body.name;
		const age = parseInt(req.body.age);
		if ( !name.length || isNaN(age) )
			return res.status(400).send();

		sql.query("INSERT INTO customers (name, age) VALUES (?, ?)", [name, age], (err, results) => {
			res.status(201).send( {id: results.insertId} );
		});
	},

	getCustomer: (req, res) => {
		const id = parseInt(req.params.id);
		if (isNaN(id))
			res.status(400).send();
		else sql.query(`SELECT name, age FROM customers WHERE id = ${id}`, (err, results) => {
			if (!results.length)
				res.status(404).send();
			else res.send( {name: results[0].name, age: results[0].age} );
		});
	},

	putCustomer: (req, res) => {
		const id = parseInt(req.params.id);
		if (isNaN(id) || Object.keys(req.body).length < 2)
			return res.status(400).send();

		const name = req.body.name;
		const age = parseInt(req.body.age);
		if ( !name.length || isNaN(age) )
			return res.status(400).send();

		sql.query("UPDATE customers SET name = ?, age = ? WHERE id = ?", [name, age, id], (err, results) => {
			if (results.changedRows)
				res.send();
			else if (results.affectedRows)
				res.send('nothing changed');
			else res.status(404).send();
		});
	},

	deleteCustomer: (req, res) => {
		const id = parseInt(req.params.id);
		if (isNaN(id))
			res.status(400).send();
		else sql.query(`DELETE FROM customers WHERE id = ${id}`, (err, results) => {
			results.affectedRows ? res.send() : res.status(404).send();
		});
	}
}