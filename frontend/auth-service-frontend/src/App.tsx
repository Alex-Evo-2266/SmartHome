import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

const { Header, Content } = Layout;

function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
      <Header>
        <Menu theme="dark" mode="horizontal">
          {user && (
            <>
              <Menu.Item key="1"><Link to="/users">Пользователи</Link></Menu.Item>
              <Menu.Item key="2"><Link to="/users/add">Добавить</Link></Menu.Item>
              <Menu.Item key="3" onClick={logout}>Выйти</Menu.Item>
            </>
          )}
        </Menu>
      </Header>
      <Content style={{ padding: "24px" }}>
        <Routes>
          {
            user?
            <>
              <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
              <Route path="/users/add" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
              <Route path="/*" element={<Navigate replace to="/users" />} />
            </>:
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/*" element={<Navigate replace to="/login" />} />
            </>
          }
        </Routes>
      </Content>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
