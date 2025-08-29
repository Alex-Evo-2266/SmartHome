import { Form, Input, Button, message, Card } from "antd";
import { useUserAPI } from "../api/users";
import { useNavigate } from "react-router-dom";
import type { UserForm } from "../types";

export default function AddUser() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {addUser} = useUserAPI()

  const onFinish = async (values:UserForm) => {
    try {
      await addUser(values);
      message.success("Пользователь добавлен");
      navigate("/users");
    } catch {
      message.error("Ошибка добавления");
    }
  };

  return (
    <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
      <Card title="Добавить пользователя" style={{ maxWidth: 400, minWidth: 300 }}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="name" label="Имя" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Пароль" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit">Создать</Button>
        </Form>
      </Card>
    </div>
    
  );
}
