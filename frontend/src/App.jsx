
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Layout from "./layouts/Layout.jsx";
import "./App.css";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Chat from "./components/Chat.jsx";
import UserSettings from "./components/UserSettings.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="chat" element={<Chat />} />
          <Route path="settings" element={<UserSettings />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
