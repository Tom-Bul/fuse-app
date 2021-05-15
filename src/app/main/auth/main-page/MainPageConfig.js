import { authRoles } from 'app/auth';
import MainPage from './MainPage';

const MainPageConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.admin, // ['admin']
	routes: [
		{
			path: '/auth/main-page',
			component: MainPage
		}
	]
};

export default MainPageConfig;
