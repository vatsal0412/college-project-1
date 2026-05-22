import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import QRGenerator from './pages/QRGenerator';
import QRScanner from './pages/QRScanner';
import './App.css';

function App() {
	const location = useLocation();
	return (
		<>
			<nav className="nav-bar">
				<Link
					to="/generate"
					className={location.pathname === '/generate' ? 'active' : ''}
				>
					Generate QR
				</Link>
				<Link
					to="/scan"
					className={location.pathname === '/scan' ? 'active' : ''}
				>
					Scan QR
				</Link>
			</nav>

			<Routes>
				<Route path="/generate" element={<QRGenerator />} />
				<Route path="/scan" element={<QRScanner />} />
				<Route path="/" element={<Navigate to="/generate" replace />} />
			</Routes>

			<div className="ticks"></div>
		</>
	);
}

export default App;
