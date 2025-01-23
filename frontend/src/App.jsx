import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Layout from "./layouts/Layout.jsx";
import "./App.css";
import Home from "./components/Home.jsx";
import Register from "./pages/Register.jsx";
import VerifyEmail from "./components/VerifyEmail.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ValidateResetToken from "./components/ValidateResetToken.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Setting from "./pages/Setting.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AddContact from "./pages/AddContact.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

/**
 * Main application component.
 * Wraps the routes and manages context providers for authentication and theme.
 * @returns {JSX.Element} The root component of the app.
 */
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        {/* Routes definition */}
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="/verify/:token" element={<VerifyEmail />} />
            <Route path="login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/validate-reset-password/:token"
              element={<ValidateResetToken />}
            />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Protected routes (requires authentication) */}
            <Route element={<ProtectedRoute />}>
              <Route path="chat" element={<Dashboard />} />
              <Route path="setting" element={<Setting />} />
              <Route path="/AddContact" element={<AddContact />} />
              <Route path="/chat/:contactId" element={<Dashboard />} />
            </Route>

            {/* Catch-all route for 404 page */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Route>
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
