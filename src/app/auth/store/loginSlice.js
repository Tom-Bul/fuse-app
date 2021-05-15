import { createSlice } from '@reduxjs/toolkit';
import jwtService from 'app/services/jwtService';
import { setUserData } from './userSlice';

export const submitLogin = ({ username, password }) => async dispatch => {
	return jwtService
		.signInWithEmailAndPassword(username, password)
		.then(user => {
			dispatch(setUserData(user));

			window.location.reload();
			return dispatch(loginSuccess());
		})
		.catch(error => {
			return (dispatch(loginError(error)), error);
		});
};

const initialState = {
	success: false,
	error: {
		username: null,
		password: null
	}
};

const loginSlice = createSlice({
	name: 'auth/login',
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.success = true;
		},
		loginError: (state, action) => {
			state.success = false;
			state.error = action.payload;
		}
	},
	extraReducers: {}
});

export const { loginSuccess, loginError } = loginSlice.actions;

export default loginSlice.reducer;
