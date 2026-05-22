import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';

export function startQRRotation(io, sessionId, qrInterval, sessionTimeout) {
	let qrNumber = 0;

	const interval = setInterval(async () => {
		qrNumber++;
		const token = jwt.sign(
			{
				sid: sessionId,
				qid: qrNumber
			},
			process.env.JWT_TOKEN_SECRET,
			{
				expiresIn: '10s'
			}
		);

		const qrImage = await QRCode.toDataURL(token);

		io.to(sessionId).emit('qr-update', { qrImage });
	}, qrInterval);

	setTimeout(() => {
		clearInterval(interval);
		io.to(sessionId).emit('session-ended');
		console.log('Attendance stopped');
	}, sessionTimeout);
}