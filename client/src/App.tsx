import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pages/protected";
import Home from "./pages/home";
import Login from "./pages/login";
import { UserProvider } from "./context/user";
import { LandingPage } from "./pages/landing-page";
import ResetPassword from "./pages/reset-password";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/Landing" element={<LandingPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
