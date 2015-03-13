'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Budget Schema
 */
var BudgetSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Budget name',
		trim: true
	},
	amount: {
		type: Number,
		default: 10,
		required: 'Please fill Budget name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Budget', BudgetSchema);
