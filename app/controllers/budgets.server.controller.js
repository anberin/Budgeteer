'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Budget = mongoose.model('Budget'),
	_ = require('lodash');

/**
 * Create a Budget
 */
exports.create = function(req, res) {
	var budget = new Budget(req.body);
	budget.user = req.user;

	budget.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(budget);
		}
	});
};

/**
 * Show the current Budget
 */
exports.read = function(req, res) {
	res.jsonp(req.budget);
};

/**
 * Update a Budget
 */
exports.update = function(req, res) {
	var budget = req.budget ;

	budget = _.extend(budget , req.body);

	budget.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(budget);
		}
	});
};

/**
 * Delete an Budget
 */
exports.delete = function(req, res) {
	var budget = req.budget ;

	budget.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(budget);
		}
	});
};

/**
 * List of Budgets
 */
exports.list = function(req, res) { 
	Budget.find().sort('-created').populate('user', 'displayName').exec(function(err, budgets) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(budgets);
		}
	});
};

/**
 * Budget middleware
 */
exports.budgetByID = function(req, res, next, id) { 
	Budget.findById(id).populate('user', 'displayName').exec(function(err, budget) {
		if (err) return next(err);
		if (! budget) return next(new Error('Failed to load Budget ' + id));
		req.budget = budget ;
		next();
	});
};

/**
 * Budget authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.budget.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
