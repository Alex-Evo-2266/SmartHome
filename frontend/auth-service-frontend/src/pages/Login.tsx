import { Form, Input, Button, Card, message } from "antd";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AUTH_SERVICE_PREFIX } from "../const";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { name: string; password: string }) => {
    try {
      await login(values);
      message.success("Успешный вход");
      navigate(`${AUTH_SERVICE_PREFIX}/users`);
    } catch {
      message.error("Неверное имя или пароль");
    }
  };

  return (
    <Card title="Вход" style={{ maxWidth: 400, margin: "100px auto" }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Имя" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Пароль" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Войти
        </Button>
      </Form>
    </Card>
  );
}
