'use strict';

//Setting up route
angular.module('budgets').config(['$stateProvider',
	function($stateProvider) {
		// Budgets state routing
		$stateProvider.
		state('listBudgets', {
			url: '/budgets',
			templateUrl: 'modules/budgets/views/list-budgets.client.view.html'
		}).
		state('createBudget', {
			url: '/budgets/create',
			templateUrl: 'modules/budgets/views/create-budget.client.view.html'
		}).
		state('viewBudget', {
			url: '/budgets/:budgetId',
			templateUrl: 'modules/budgets/views/view-budget.client.view.html'
		}).
		state('editBudget', {
			url: '/budgets/:budgetId/edit',
			templateUrl: 'modules/budgets/views/edit-budget.client.view.html'
		});
	}
]);