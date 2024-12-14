
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Layout from "./layouts/Layout.jsx";
import "./App.css";
import Home from "./components/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
<<<<<<< HEAD
import Chat from "./components/Chat.jsx";
import Setting from "./pages/Setting.jsx";
=======
import Chat from "./pages/Chat.jsx";
import Setting from "./pages/Setting.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
>>>>>>> 552e65c09ab056b73f42b572b9937e70b72187f9

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
<<<<<<< HEAD
          <Route path="chat" element={<Chat />} />
          <Route path="setting" element={<Setting />} />
=======

          <Route element={<ProtectedRoute />}>
            <Route path="chat" element={<Chat />} />
            <Route path="setting" element={<Setting />} />
          </Route>

>>>>>>> 552e65c09ab056b73f42b572b9937e70b72187f9
          {/* <Route path="*" element={<NotFound />} /> */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

