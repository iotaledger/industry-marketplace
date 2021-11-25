//TODO: I dont think it is needed anymore, as we dont do any handshakes, but leaving it here for now	
import axios from 'axios';

export const client = axios.create();

client.defaults.headers.post['Content-Type'] = 'application/json';

export const setAuthHeader = (jwt: string) => {
	client.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
	const localStorage = window.localStorage;
	localStorage.setItem('jwt', jwt);
};

export const removeAuthHeader = () => {
	delete client.defaults.headers.common['Authorization'];
	const localStorage = window.localStorage;
	localStorage.removeItem('jwt');
};

const localStorage = window.localStorage;
const jwt = localStorage.getItem('jwt');
if (jwt) {
	setAuthHeader(jwt);
}