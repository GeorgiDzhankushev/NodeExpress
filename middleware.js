module.exports = {
	logger: (req, res, next) => {
		const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
		console.log(`${timestamp}\t${req.ip}\t${req.method} ${req.originalUrl}`);
		next();
	},
	notFound: (req, res) => {
		res.status(404).send();
	},
	methodUnsupported: (req, res) => {
		res.status(405).send();
	},
	getRoot: (req, res) => {
		res.send('Hello from GET root handler');
	},
	getCustomers: (req, res) => {
		res.send('Hello from GET customers handler');
	},
	postCustomers: (req, res) => {
		res.send(`POST customers received: ${ JSON.stringify(req.body) }`);
	},
	getCustomer: (req, res) => {
		res.send(`Hello from GET customer ${req.params.id}`);
	},
	putCustomer: (req, res) => {
		res.send(`Hello from PUT customer ${req.params.id}`);
	},
	deleteCustomer: (req, res) => {
		res.send(`Hello from DELETE customer ${req.params.id}`);
	}
}