import { authRoles } from 'app/auth';
import i18next from 'i18next';

import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
	{
		id: 'auth',
		title: 'MENU',
		type: 'group',
		icon: 'apps',
		children: [
			{
				id: 'login',
				title: 'Login',
				type: 'item',
				url: '/login',
				auth: authRoles.onlyGuest,
				icon: 'lock'
			},
			{
				id: 'register',
				title: 'Register',
				type: 'item',
				url: '/register',
				auth: authRoles.onlyGuest,
				icon: 'person_add'
			},
			{
				id: 'main-page',
				title: 'Main Page',
				type: 'item',
				auth: authRoles.admin,
				url: '/auth/main-page',
				icon: 'verified_user'
			},
			{
				id: 'article-list',
				title: 'Article List',
				type: 'item',
				auth: authRoles.admin,
				url: '/auth/article-list',
				icon: 'verified_user'
			},
			{
				id: 'add-article',
				title: 'Add Article',
				type: 'item',
				auth: authRoles.admin,
				url: '/auth/articles/new',
				icon: 'verified_user'
			},
			{
				id: 'logout',
				title: 'Logout',
				type: 'item',
				auth: authRoles.user,
				url: '/logout',
				icon: 'exit_to_app'
			}
		]
	},
];

export default navigationConfig;
