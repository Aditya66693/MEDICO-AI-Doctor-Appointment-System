import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./auth.jsx";
import Auth from "./pages/Auth.jsx";
import Home from "./pages/Home.jsx";
import Doctors from "./pages/Doctors.jsx";
import Book from "./pages/Book.jsx";
import Ticket from "./pages/Ticket.jsx";
import MyAppointments from "./pages/MyAppointments.jsx";

function Protected({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: loc.pathname + loc.search }} replace />;
}

export default function App() {
  const { user, logout } = useAuth();
  return (
    <>
      <nav className="nav">
        <Link to="/" className="brand">🩺 Medico</Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/appointments">My appointments</Link>
              <span className="muted">Hi, {user.name.split(" ")[0]}</span>
              <button className="btn ghost" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn">Login / Register</Link>
          )}
        </div>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<Protected><Home /></Protected>} />
          <Route path="/doctors" element={<Protected><Doctors /></Protected>} />
          <Route path="/book/:doctorId" element={<Protected><Book /></Protected>} />
          <Route path="/ticket/:id" element={<Protected><Ticket /></Protected>} />
          <Route path="/appointments" element={<Protected><MyAppointments /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">Medico is a booking tool, not a medical service. In an emergency call 112.</footer>
    </>
  );
}
