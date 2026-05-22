import e from "express";
import jwt from "jsonwebtoken";
import QRCode from "qrcode";
import cors from "cors";

const app = e();
app.use(e.json());
app.use(cors());

const secretKey = "your_secret_key";

app.get("/generate-qr", (req, res) => {
	const data = jwt.sign({ userId: 1 }, secretKey, { expiresIn: "1h" });
	QRCode.toDataURL("data", (err, url) => {
		if (err) {
			console.error(err);
			res.status(500).send("Error generating QR code");
		} else {
			res.json({ qrCode: url });
		}
	});
});

app.post("/verify-qr", (req, res) => {
	console.log("Received token:", req.body.token);
	const { token } = req.body;
	try {
		const decoded = jwt.verify(token, secretKey);
		res.json({ valid: true, data: decoded });
	} catch (err) {
		res.json({ valid: false, error: err.message });
	}
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});