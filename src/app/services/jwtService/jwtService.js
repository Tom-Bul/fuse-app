import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		axios.interceptors.response.use(
			response => {
				return response;
			},
			err => {
				return new Promise((resolve, reject) => {
					if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						this.setSession(null);
					}
					throw err;
				});
			}
		);
	};

	handleAuthentication = () => {
		const access_token = this.getAccessToken();

		if (!access_token) {
			this.emit('onNoAccessToken');

			return;
		}

		if (this.isAuthTokenValid(access_token)) {
			this.setSession(access_token);

			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	createUser = data => {
		const newUser = {
			username: data.username,
			password: data.password
		};
		return new Promise((resolve, reject) => {
			axios.post('http://gn-test.crem.pl/auth/sign-up', newUser).then(
				response => {
					console.log(response);
					axios.post('http://gn-test.crem.pl/auth/sign-in', newUser).then(
						response => {
							this.setSession(response.data.token);
							resolve(response.data);
						},
						error => {
							reject(error.response.data.error);
						}
					);
				},
				err => {
					reject(err.response);
					return err.response.data.error;
				}
			);
		});
	};

	signInWithEmailAndPassword = (username, password) => {
		return new Promise((resolve, reject) => {
			const newUser = {
				username: username,
				password: password
			};
			axios.post('http://gn-test.crem.pl/auth/sign-in', newUser).then(
				response => {
					this.setSession(response.data.token);
					resolve(response.data);
				},
				error => {
					reject(error.response.data.error);
				}
			);
		});
	};

	signInWithToken = () => {
		const token = this.getAccessToken();

		return new Promise((resolve, reject) => {
			if (!token) {
				this.logout();
				reject(new Error('Failed to login with token.'));
			}

			const decoded = jwtDecode(token);
			this.setSession(token);
			resolve({ userName: decoded.username, token: token });
		});
	};

	setSession = access_token => {
		if (access_token) {
			localStorage.setItem('jwt_access_token', access_token);
			axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			localStorage.removeItem('jwt_access_token');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		this.setSession(null);
	};

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;

		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		}

		return true;
	};

	getAccessToken = () => {
		return window.localStorage.getItem('jwt_access_token');
	};
}

const instance = new JwtService();

export default instance;
