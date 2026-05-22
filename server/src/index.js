import e from "express";
import jwt from "jsonwebtoken";
import QRCode from "qrcode";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import { verifyQR, startSession, sendToken } from "./controller.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = e();
app.use(e.json());
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));

const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

io.on("connection", socket => {
    console.log("Client connected:", socket.id);

	setInterval(() => {
		socket.emit("ping", { time: new Date() });
	}, 2000);

    socket.on("join-session", (sessionId) => {
        socket.join(sessionId);
        console.log(`Joined ${sessionId}`);
    });

    socket.on("disconnect", () => {
        console.log("Disconnected");
    });
});

app.post("/register-user", sendToken);
app.post("/start-session", (req, res, next) => { req.io = io; next(); }, startSession);
app.post("/verify-qr", verifyQR);
httpServer.listen(3000, () => {
	console.log("Server is running on port 3000");
});