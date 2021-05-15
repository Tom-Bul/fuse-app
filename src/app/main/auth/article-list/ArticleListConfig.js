import { authRoles } from 'app/auth';
import ArticleList from './ArticleList';

const ArticleListConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.admin, // ['admin']
	routes: [
		{
			path: '/auth/article-list',
			component: ArticleList
		}
	]
};

export default ArticleListConfig;
