import { combineReducers } from '@reduxjs/toolkit';
import login from './loginSlice';
import register from './registerSlice';
import user from './userSlice';
import articles from './articlesSlice';
import article from './articleSlice';
import serverStatus from './serverStatusSlice'

const authReducers = combineReducers({
	user,
	login,
	register,
	articles,
	article,
	serverStatus
});

export default authReducers;
