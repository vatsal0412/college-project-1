import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import '../App.css';

function QRScanner() {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);

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
				setData(decodedText);
				await scanner.clear();
				// send token to backend
				try {
					await fetch('https://college-project-1-xyx0.onrender.com/verify-qr', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							token: decodedText,
						}),
					});
				} catch (err) {
					console.error('Error verifying QR code:', err);
				}
			},
			error => {},
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
			{data && (
				<p>
					<strong>Scanned Data:</strong> {data}
				</p>
			)}
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</section>
	);
}

export default QRScanner;
