import axios, { type AxiosInstance } from 'axios';
import { get } from 'svelte/store';
import { auth, logout } from '$lib/code/auth';
import { baseUrl } from '$lib/code/routing';

function axiosClient(): AxiosInstance {

	const axiosClient = axios.create({
		baseURL: baseUrl,
		headers: { apiKey: get(auth)?.apiKey ?? '' }
	});

	axiosClient.interceptors.response.use(
		(response) => {
			return response;
		},
		(error) => {
			if (error.response.status == 401) {
				logout();
			} else {
				return Promise.reject(error);
			}
		}
	);

	return axiosClient;
}

export default axiosClient;