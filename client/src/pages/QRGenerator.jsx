import { useState } from 'react';
import '../App.css';

function QRGenerator() {
	const [image, setImage] = useState(null);

	const handleGenerateQR = async () => {
		try {
			const response = await fetch('http://localhost:3000/generate-qr');
			const data = await response.json();
			setImage(data.qrCode);
		} catch (error) {
			console.error('Error fetching QR code:', error);
		}
	};

	return (
		<section id="center">
			<div className="hero">
				<img
					src={image}
					className="base"
					width="170"
					height="179"
					alt="QR Code"
				/>
			</div>
			<div>
				<h1>Generate QR Code</h1>
				<p>Click the button below to generate a new QR code.</p>
			</div>
			<button
				type="button"
				className="counter"
				onClick={handleGenerateQR}
			>
				Generate QR
			</button>
		</section>
	);
}

export default QRGenerator;
