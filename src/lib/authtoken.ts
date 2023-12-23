import Cookies from 'js-cookie';

export const getToken = (): string | undefined => {
	const token = Cookies.get('token');

	return token;
};
