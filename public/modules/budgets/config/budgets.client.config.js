'use strict';

// Configuring the Articles module
angular.module('budgets').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Budgets', 'budgets', 'dropdown', '/budgets(/create)?');
		Menus.addSubMenuItem('topbar', 'budgets', 'List Budgets', 'budgets');
		Menus.addSubMenuItem('topbar', 'budgets', 'New Budget', 'budgets/create');
	}
]);