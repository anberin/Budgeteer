'use strict';

// Expenses controller
angular.module('expenses').controller('ExpensesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Expenses','Budgets',
	function($scope, $stateParams, $location, Authentication, Expenses, Budgets) {
		$scope.authentication = Authentication;

        $scope.budgets = Budgets.query();
        $scope.budget = $scope.budgets[0];

		// Create new Expense
		$scope.create = function() {
			// Create new Expense object
			var expense = new Expenses ({
				name: this.name,
				expenditure: this.expenditure,
                expenseinfo: this.expenseinfo
			});

			// Redirect after save
			expense.$save(function(response) {
				$location.path('expenses/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.expenditure = 10;
                $scope.expenseinfo = 'Expense Info';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Expense
		$scope.remove = function(expense) {
			if ( expense ) { 
				expense.$remove();

				for (var i in $scope.expenses) {
					if ($scope.expenses [i] === expense) {
						$scope.expenses.splice(i, 1);
					}
				}
			} else {
				$scope.expense.$remove(function() {
					$location.path('expenses');
				});
			}
		};

		// Update existing Expense
		$scope.update = function() {
			var expense = $scope.expense;

			expense.$update(function() {
				$location.path('expenses/' + expense._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Expenses
		$scope.find = function() {
			$scope.expenses = Expenses.query();
		};

		// Find existing Expense
		$scope.findOne = function() {
			$scope.expense = Expenses.get({ 
				expenseId: $stateParams.expenseId
			});
		};
	}
]);
