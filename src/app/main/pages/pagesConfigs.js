import ForgotPassword2PageConfig from './auth/forgot-password-2/ForgotPassword2PageConfig';
import ForgotPasswordPageConfig from './auth/forgot-password/ForgotPasswordPageConfig';
import LockPageConfig from './auth/lock/LockPageConfig';
import LoginPageConfig from './auth/login/LoginPageConfig';
import Login2PageConfig from './auth/login-2/Login2PageConfig';
import Login3PageConfig from './auth/login-3/Login3PageConfig';
import MailConfirmPageConfig from './auth/mail-confirm/MailConfirmPageConfig';
import Register2PageConfig from './auth/register-2/Register2PageConfig';
import Register3PageConfig from './auth/register-3/Register3PageConfig';
import RegisterPageConfig from './auth/register/RegisterPageConfig';
import ResetPassword2PageConfig from './auth/reset-password-2/ResetPassword2PageConfig';
import ResetPasswordPageConfig from './auth/reset-password/ResetPasswordPageConfig';
import Error404PageConfig from './errors/404/Error404PageConfig';
import Error500PageConfig from './errors/500/Error500PageConfig';
import MaintenancePageConfig from './maintenance/MaintenancePageConfig';
import ProfilePageConfig from './profile/ProfilePageConfig';
import ClassicSearchPageConfig from './search/classic/ClassicSearchPageConfig';
import ModernSearchPageConfig from './search/modern/ModernSearchPageConfig';

const pagesConfigs = [
	LoginPageConfig,
	RegisterPageConfig,
	ResetPasswordPageConfig,
	ForgotPasswordPageConfig,
	MailConfirmPageConfig,
	LockPageConfig,
	Login2PageConfig,
	Login3PageConfig,
	Register2PageConfig,
	Register3PageConfig,
	ForgotPassword2PageConfig,
	ResetPassword2PageConfig,
	Error404PageConfig,
	Error500PageConfig,
	MaintenancePageConfig,
	ProfilePageConfig,
	ClassicSearchPageConfig,
	ModernSearchPageConfig,
];

export default pagesConfigs;
