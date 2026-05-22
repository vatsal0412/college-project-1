import jwt from "jsonwebtoken";
import QRCode from "qrcode";
import { startQRRotation } from "./qr.service.js";

const sendToken = (req, res) => {
	const { userId } = req.body;
	const token = jwt.sign({ userId }, process.env.JWT_TOKEN_SECRET, { expiresIn: "1h" });
	res.cookie("token", token, { httpOnly: true, signed: true }).json({ token });
}

const startSession = (req, res) => {
	const { io, body: { qrInterval = 10000, sessionTimeout = 60000 } } = req;
	const sessionId = `session-${Date.now()}`;
	startQRRotation(io, sessionId, qrInterval, sessionTimeout);
	res.json({ sessionId });
}

const verifyQR = (req, res) => {
	const { sessionToken, userToken } = req.body;
	try {
		const decodedUser = jwt.verify(userToken, process.env.JWT_TOKEN_SECRET);
		const decodedSession = jwt.verify(sessionToken, process.env.JWT_TOKEN_SECRET);
		console.log("Decoded User:", decodedUser);
		console.log("Decoded Session:", decodedSession);
		res.json({ valid: true, data: decodedUser });
	} catch (err) {
		res.json({ valid: false, error: err.message });
	}
};

export { verifyQR, startSession, sendToken };
