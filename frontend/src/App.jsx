
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Layout from "./layouts/Layout.jsx";
import "./App.css";
import Home from "./components/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Setting from "./pages/Setting.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AddContact from "./pages/AddContact.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="chat" element={<Dashboard />} />
            <Route path="setting" element={<Setting />} />
            <Route path="/AddContact" element={<AddContact />} />
            <Route path="/chat/:contactId" element={<Dashboard />} />
          </Route>

          {/* <Route path="*" element={<NotFound />} /> */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

