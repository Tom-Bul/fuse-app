import React from 'react';
import { authRoles } from 'app/auth';

const AuthAppConfig = {
	settings: {
		layout: {}
	},
	auth: authRoles.admin, // ['admin']
	routes: [
		{
			path: '/auth/articles/:articleId',
			component: React.lazy(() => import('./article-item/ArticleItem'))
		},
	]
};

export default AuthAppConfig;
