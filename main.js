'use strict'

const express = require('express');
const mid = require('./middleware.js');
const app = express();
const PORT = 8080;

app.use(mid.logger); // logs each received request
app.route('/')
	.get(mid.getRoot) // prints all tables
	.all(mid.methodUnsupported);
app.route('/customers')
	.get(mid.getCustomers) // prints all customers
	.post(express.json(), mid.postCustomers) // adds one or more customers
	.all(mid.methodUnsupported);
app.route('/customers/:id')
	.get(mid.getCustomer) // print specific customer
	.put(express.json(), mid.putCustomer) // update specific customer
	.delete(mid.deleteCustomer) // delete specific customer
	.all(mid.methodUnsupported);
app.use(mid.notFound);

app.listen(PORT);