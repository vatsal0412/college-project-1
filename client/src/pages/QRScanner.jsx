import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import { useToken } from '../hooks/useToken';
import '../App.css';

function QRScanner() {
	const { token } = useToken();
	useEffect(() => {
		const scanner = new Html5QrcodeScanner(
			'reader',
			{
				fps: 10,
				qrbox: {
					width: 250,
					height: 250,
				},
			},
			false,
		);

		scanner.render(
			async decodedText => {
				console.log('QR CODE:', decodedText);
				await scanner.clear();
				// send token to backend
				try {
					const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/verify-qr`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							userToken: token,
							sessionToken: decodedText,
						}),
					});
					const result = await response.json();
					console.log('Verification result:', result);
				} catch (err) {
					console.error('Error verifying QR code:', err);
				}
			},
			() => {},
		);

		return () => {
			scanner.clear().catch(console.error);
		};
	}, []);

	return (
		<section id="center">
			<div>
				<h1>Scan QR Code</h1>
				<p>Position a QR code in front of your camera to scan it.</p>
			</div>
			<div id="reader"></div>
		</section>
	);
}

export default QRScanner;
