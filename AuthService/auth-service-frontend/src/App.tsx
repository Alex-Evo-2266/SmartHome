import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Roles from "./pages/Roles";
import Privileges from "./pages/Privileges";
import { ADD_USER, AUTH_SERVICE_PREFIX } from "./const";
import SessionPage from "./pages/Sessions";

const { Header, Content } = Layout;


function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
      <Header>
        <Menu theme="dark" mode="horizontal">
          {user && (
            <>
              <Menu.Item key="1"><Link to={`${AUTH_SERVICE_PREFIX}/users`}>Пользователи</Link></Menu.Item>
              <Menu.Item key="2"><Link to={`${AUTH_SERVICE_PREFIX}/roles`}>Роли</Link></Menu.Item>
              <Menu.Item key="3"><Link to={`${AUTH_SERVICE_PREFIX}/privileges`}>Права</Link></Menu.Item>
              <Menu.Item key="4"><Link to={`${AUTH_SERVICE_PREFIX}/sessions`}>Сессии</Link></Menu.Item>
              <Menu.Item key="10" onClick={logout}>Выйти</Menu.Item>
            </>
          )}
        </Menu>
      </Header>
      <Content style={{ padding: "24px" }}>
        <Routes>
          {
            user?
            <>
              <Route path={`${AUTH_SERVICE_PREFIX}/users`} element={<ProtectedRoute><Users /></ProtectedRoute>} />
              <Route path={`${AUTH_SERVICE_PREFIX}/roles`} element={<ProtectedRoute><Roles /></ProtectedRoute>} />
              <Route path={`${AUTH_SERVICE_PREFIX}/privileges`} element={<ProtectedRoute><Privileges /></ProtectedRoute>} />
              <Route path={`${AUTH_SERVICE_PREFIX}/sessions`} element={<ProtectedRoute><SessionPage /></ProtectedRoute>} />
              {
                <Route path={`${AUTH_SERVICE_PREFIX}/users/add`} element={<ProtectedRoute prev={ADD_USER}><AddUser /></ProtectedRoute>} />
              }
              <Route path={`${AUTH_SERVICE_PREFIX}/*`} element={<Navigate replace to={`${AUTH_SERVICE_PREFIX}/users`} />} />
              <Route path="/*" element={<Navigate replace to={`${AUTH_SERVICE_PREFIX}/users`} />} />
            </>:
            <>
              <Route path={`${AUTH_SERVICE_PREFIX}/login`} element={<LoginPage />} />
              <Route path={`${AUTH_SERVICE_PREFIX}/*`} element={<Navigate replace to={`${AUTH_SERVICE_PREFIX}/login`} />} />
              <Route path="/*" element={<Navigate replace to={`${AUTH_SERVICE_PREFIX}/login`} />} />
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
