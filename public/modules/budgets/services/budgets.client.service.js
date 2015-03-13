'use strict';

//Budgets service used to communicate Budgets REST endpoints
angular.module('budgets').factory('Budgets', ['$resource',
	function($resource) {
		return $resource('budgets/:budgetId', { budgetId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);