'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var budgets = require('../../app/controllers/budgets.server.controller');

	// Budgets Routes
	app.route('/budgets')
		.get(budgets.list)
		.post(users.requiresLogin, budgets.create);

	app.route('/budgets/:budgetId')
		.get(budgets.read)
		.put(users.requiresLogin, budgets.hasAuthorization, budgets.update)
		.delete(users.requiresLogin, budgets.hasAuthorization, budgets.delete);

	// Finish by binding the Budget middleware
	app.param('budgetId', budgets.budgetByID);
};
