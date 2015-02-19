'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Budget = mongoose.model('Budget'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, budget;

/**
 * Budget routes tests
 */
describe('Budget CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Budget
		user.save(function() {
			budget = {
				name: 'Budget Name'
			};

			done();
		});
	});

	it('should be able to save Budget instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Budget
				agent.post('/budgets')
					.send(budget)
					.expect(200)
					.end(function(budgetSaveErr, budgetSaveRes) {
						// Handle Budget save error
						if (budgetSaveErr) done(budgetSaveErr);

						// Get a list of Budgets
						agent.get('/budgets')
							.end(function(budgetsGetErr, budgetsGetRes) {
								// Handle Budget save error
								if (budgetsGetErr) done(budgetsGetErr);

								// Get Budgets list
								var budgets = budgetsGetRes.body;

								// Set assertions
								(budgets[0].user._id).should.equal(userId);
								(budgets[0].name).should.match('Budget Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Budget instance if not logged in', function(done) {
		agent.post('/budgets')
			.send(budget)
			.expect(401)
			.end(function(budgetSaveErr, budgetSaveRes) {
				// Call the assertion callback
				done(budgetSaveErr);
			});
	});

	it('should not be able to save Budget instance if no name is provided', function(done) {
		// Invalidate name field
		budget.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Budget
				agent.post('/budgets')
					.send(budget)
					.expect(400)
					.end(function(budgetSaveErr, budgetSaveRes) {
						// Set message assertion
						(budgetSaveRes.body.message).should.match('Please fill Budget name');
						
						// Handle Budget save error
						done(budgetSaveErr);
					});
			});
	});

	it('should be able to update Budget instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Budget
				agent.post('/budgets')
					.send(budget)
					.expect(200)
					.end(function(budgetSaveErr, budgetSaveRes) {
						// Handle Budget save error
						if (budgetSaveErr) done(budgetSaveErr);

						// Update Budget name
						budget.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Budget
						agent.put('/budgets/' + budgetSaveRes.body._id)
							.send(budget)
							.expect(200)
							.end(function(budgetUpdateErr, budgetUpdateRes) {
								// Handle Budget update error
								if (budgetUpdateErr) done(budgetUpdateErr);

								// Set assertions
								(budgetUpdateRes.body._id).should.equal(budgetSaveRes.body._id);
								(budgetUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Budgets if not signed in', function(done) {
		// Create new Budget model instance
		var budgetObj = new Budget(budget);

		// Save the Budget
		budgetObj.save(function() {
			// Request Budgets
			request(app).get('/budgets')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Budget if not signed in', function(done) {
		// Create new Budget model instance
		var budgetObj = new Budget(budget);

		// Save the Budget
		budgetObj.save(function() {
			request(app).get('/budgets/' + budgetObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', budget.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Budget instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Budget
				agent.post('/budgets')
					.send(budget)
					.expect(200)
					.end(function(budgetSaveErr, budgetSaveRes) {
						// Handle Budget save error
						if (budgetSaveErr) done(budgetSaveErr);

						// Delete existing Budget
						agent.delete('/budgets/' + budgetSaveRes.body._id)
							.send(budget)
							.expect(200)
							.end(function(budgetDeleteErr, budgetDeleteRes) {
								// Handle Budget error error
								if (budgetDeleteErr) done(budgetDeleteErr);

								// Set assertions
								(budgetDeleteRes.body._id).should.equal(budgetSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Budget instance if not signed in', function(done) {
		// Set Budget user 
		budget.user = user;

		// Create new Budget model instance
		var budgetObj = new Budget(budget);

		// Save the Budget
		budgetObj.save(function() {
			// Try deleting Budget
			request(app).delete('/budgets/' + budgetObj._id)
			.expect(401)
			.end(function(budgetDeleteErr, budgetDeleteRes) {
				// Set message assertion
				(budgetDeleteRes.body.message).should.match('User is not logged in');

				// Handle Budget error error
				done(budgetDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Budget.remove().exec();
		done();
	});
});