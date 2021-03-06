'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Expense Schema
 */
var ExpenseSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Expense name',
		trim: true
	},
	expenditure: {
		type: Number,
		default:10,
		required: 'Please fill expenditure amount',
		trim: true
	},
    expenseinfo: {
        type: String,
        default: '',
        trim: true
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    budget: {
        type: Schema.ObjectId,
        ref:'Budget'

    }
});

mongoose.model('Expense', ExpenseSchema);
