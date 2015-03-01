'use strict';

// Budgets controller
angular.module('budgets').controller('BudgetsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Budgets',
	function($scope, $stateParams, $location, Authentication, Budgets) {
		$scope.authentication = Authentication;

		// Create new Budget
		$scope.create = function() {
			// Create new Budget object
			var budget = new Budgets ({
				name: this.name,
				amount: this.amount
			});

			// Redirect after save
			budget.$save(function(response) {
				$location.path('budgets/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.amount = 10;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Budget
		$scope.remove = function(budget) {
			if ( budget ) { 
				budget.$remove();

				for (var i in $scope.budgets) {
					if ($scope.budgets [i] === budget) {
						$scope.budgets.splice(i, 1);
					}
				}
			} else {
				$scope.budget.$remove(function() {
					$location.path('budgets');
				});
			}
		};

		// Update existing Budget
		$scope.update = function() {
			var budget = $scope.budget;

			budget.$update(function() {
				$location.path('budgets/' + budget._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Budgets
		$scope.find = function() {
			$scope.budgets = Budgets.query();
		};

		// Find existing Budget
		$scope.findOne = function() {
			$scope.budget = Budgets.get({ 
				budgetId: $stateParams.budgetId
			});
		};
	}
]);
