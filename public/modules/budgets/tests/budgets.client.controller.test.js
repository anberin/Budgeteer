'use strict';

(function() {
	// Budgets Controller Spec
	describe('Budgets Controller Tests', function() {
		// Initialize global variables
		var BudgetsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Budgets controller.
			BudgetsController = $controller('BudgetsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Budget object fetched from XHR', inject(function(Budgets) {
			// Create sample Budget using the Budgets service
			var sampleBudget = new Budgets({
				name: 'New Budget',
				amount: 10
			});

			// Create a sample Budgets array that includes the new Budget
			var sampleBudgets = [sampleBudget];

			// Set GET response
			$httpBackend.expectGET('budgets').respond(sampleBudgets);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.budgets).toEqualData(sampleBudgets);
		}));

		it('$scope.findOne() should create an array with one Budget object fetched from XHR using a budgetId URL parameter', inject(function(Budgets) {
			// Define a sample Budget object
			var sampleBudget = new Budgets({
				name: 'New Budget',
				amount: 10
			});

			// Set the URL parameter
			$stateParams.budgetId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/budgets\/([0-9a-fA-F]{24})$/).respond(sampleBudget);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.budget).toEqualData(sampleBudget);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Budgets) {
			// Create a sample Budget object
			var sampleBudgetPostData = new Budgets({
				name: 'New Budget',
				amount: 10
			});

			// Create a sample Budget response
			var sampleBudgetResponse = new Budgets({
				_id: '525cf20451979dea2c000001',
				name: 'New Budget',
				amount: 10
			});

			// Fixture mock form input values
			scope.name = 'New Budget';
			scope.amount = 10;

			// Set POST response
			$httpBackend.expectPOST('budgets', sampleBudgetPostData).respond(sampleBudgetResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');
			expect(scope.amount).toEqual(10);

			// Test URL redirection after the Budget was created
			expect($location.path()).toBe('/budgets/' + sampleBudgetResponse._id);
		}));

		it('$scope.update() should update a valid Budget', inject(function(Budgets) {
			// Define a sample Budget put data
			var sampleBudgetPutData = new Budgets({
				_id: '525cf20451979dea2c000001',
				name: 'New Budget',
				amount: 10
			});

			// Mock Budget in scope
			scope.budget = sampleBudgetPutData;

			// Set PUT response
			$httpBackend.expectPUT(/budgets\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/budgets/' + sampleBudgetPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid budgetId and remove the Budget from the scope', inject(function(Budgets) {
			// Create new Budget object
			var sampleBudget = new Budgets({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Budgets array and include the Budget
			scope.budgets = [sampleBudget];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/budgets\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleBudget);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.budgets.length).toBe(0);
		}));
	});
}());
