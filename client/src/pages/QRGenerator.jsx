import { useState, useEffect, useRef } from 'react';
import '../App.css';
import { io } from 'socket.io-client';
import { useToken } from '../hooks/useToken';

function QRGenerator() {
	const [image, setImage] = useState(null);
	const [socket, setSocket] = useState(null);
	const [userIdInput, setUserIdInput] = useState('');
	const timeoutRef = useRef(null);
	const {
		token,
		userId,
		loading,
		error,
		generateToken,
		clearToken,
		hasToken,
	} = useToken();

	const handleGenerateToken = async e => {
		e.preventDefault();
		try {
			await generateToken(userIdInput);
			setUserIdInput('');
		} catch (err) {
			console.error('Error generating token:', err);
		}
	};

	const handleClick = async () => {
		if (!hasToken) {
			alert('Please generate a token first');
			return;
		}

		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		if (socket) socket.disconnect();

		const newSocket = io(import.meta.env.VITE_SERVER_URL);

		newSocket.on('connect', async () => {
			const { sessionId } = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/start-session`,
				{
					method: 'POST',
					headers: { Authorization: `Bearer ${token}` },
					body: {
						qrInterval: 10000,
						sessionTimeout: 60000,
						// sessionTimeout: 15000, // for testing
					}
				},
			).then(res => res.json());

			newSocket.emit('join-session', sessionId);
			newSocket.on('qr-update', ({ qrImage }) => setImage(qrImage));

			timeoutRef.current = setTimeout(() => {
				console.log('Disconnecting socket...');
				newSocket.disconnect();
			}, 60000);
		});

		newSocket.on('connect_error', error => {
			console.error('Connection error:', error);
		});

		setSocket(newSocket);
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			if (socket) socket.disconnect();
		};
	}, [socket]);

	return (
		<section id="center">
			{!hasToken ?
				<div
					style={{
						textAlign: 'center',
						width: '100%',
						maxWidth: '400px',
					}}
				>
					<h1>Generate User Token</h1>
					<form
						onSubmit={handleGenerateToken}
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '10px',
						}}
					>
						<input
							type="text"
							placeholder="Enter User ID (optional)"
							value={userIdInput}
							onChange={e => setUserIdInput(e.target.value)}
							disabled={loading}
							style={{
								padding: '8px',
								borderRadius: '4px',
								border: '1px solid var(--border)',
							}}
						/>
						<button
							type="submit"
							className="counter"
							disabled={loading}
						>
							{loading ? 'Generating...' : 'Generate Token'}
						</button>
					</form>
					{error && (
						<p style={{ color: 'red', marginTop: '10px' }}>
							{error}
						</p>
					)}
					<p
						style={{
							marginTop: '10px',
							fontSize: '0.85em',
							color: 'var(--text-secondary)',
						}}
					>
						If no User ID is provided, one will be auto-generated.
					</p>
				</div>
			:	<>
					<div style={{ textAlign: 'center', marginBottom: '20px' }}>
						<p style={{ fontSize: '0.9em' }}>
							✓ Logged in as: <strong>{userId}</strong>
						</p>
						<button
							type="button"
							className="counter"
							onClick={clearToken}
							style={{ fontSize: '0.85em', padding: '5px 10px' }}
						>
							Clear Token
						</button>
					</div>

					<div className="hero">
						{image && (
							<img
								src={image}
								className="base"
								width="170"
								height="179"
								alt="QR Code"
							/>
						)}
					</div>
					<div>
						<h1>Generate QR Code</h1>
						<p>Click the button below to generate a new QR code.</p>
					</div>
					<button
						type="button"
						className="counter"
						onClick={handleClick}
					>
						Start Session
					</button>
				</>
			}
		</section>
	);
}

export default QRGenerator;
