import { useState, useCallback } from 'react';

export const useToken = () => {
	const [token, setToken] = useState(
		() => localStorage.getItem('userToken') || null,
	);
	const [userId, setUserId] = useState(
		() => localStorage.getItem('userId') || null,
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const generateToken = useCallback(async (inputUserId = '') => {
		setLoading(true);
		setError(null);

		try {
			const finalUserId = inputUserId.trim() || `user-${Date.now()}`;
			const response = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/register-user`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: finalUserId }),
				},
			);

			if (!response.ok) throw new Error('Failed to generate token');

			const data = await response.json();
			localStorage.setItem('userToken', data.token);
			localStorage.setItem('userId', finalUserId);
			setToken(data.token);
			setUserId(finalUserId);
			return data.token;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const clearToken = useCallback(() => {
		setToken(null);
		setUserId(null);
		localStorage.removeItem('userToken');
		localStorage.removeItem('userId');
	}, []);

	return {
		token,
		userId,
		loading,
		error,
		generateToken,
		clearToken,
		hasToken: !!token,
	};
};
